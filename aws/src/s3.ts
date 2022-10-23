import {
  CreateBucketCommand,
  CreateBucketCommandInput,
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  HeadBucketCommand,
  HeadBucketCommandOutput,
  ListObjectsV2Command,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import type {
  ListObjectsV2CommandInput,
  ListObjectsV2CommandOutput,
} from "@aws-sdk/client-s3";
import { awsRegion } from "@ggbot2/infrastructure";
import type { DflowData } from "dflow";
import stream from "stream";

export { S3ServiceException } from "@aws-sdk/client-s3";

export const s3ServiceExceptionName = {
  NotFound: "NotFound",
  NoSuchKey: "NoSuchKey",
};

const client = new S3Client({ apiVersion: "2006-03-01", region: awsRegion });

// Bucket and Key types are defined by @aws-sdk/client-s3 as string | undefined
// See for example GetObjectCommandInput
// Redefine them here, in our use case an undefined Bucket or Key does not make sense.
type S3Path = {
  Bucket: string;
  Key: string;
};

export type CreateBucketArgs = Pick<S3Path, "Bucket"> &
  Pick<CreateBucketCommandInput, "ACL">;

export const createBucket = async ({
  ACL,
  Bucket,
}: CreateBucketArgs): Promise<void> => {
  const command = new CreateBucketCommand({
    ACL,
    Bucket,
  });
  await client.send(command);
};

const streamToString = (stream: NodeJS.ReadableStream): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

export type GetObjectArgs = S3Path;

export const getObject = async <Data>({
  Bucket,
  Key,
}: GetObjectArgs): Promise<Data | null> => {
  try {
    const command = new GetObjectCommand({ Bucket, Key });
    const output = await client.send(command);
    const body = output?.Body;
    if (!(body instanceof stream.Readable)) return null;
    const json = await streamToString(body);
    const data = JSON.parse(json);
    return data;
  } catch (error) {
    if (error instanceof S3ServiceException) {
      if (error.name === s3ServiceExceptionName.NoSuchKey) return null;
    }
    throw error;
  }
};

export type HeadBucketArgs = Pick<S3Path, "Bucket">;

export const headBucket = async ({
  Bucket,
}: HeadBucketArgs): Promise<HeadBucketCommandOutput> => {
  const command = new HeadBucketCommand({ Bucket });
  return await client.send(command);
};

type ListObjectsOutput = Pick<
  ListObjectsV2CommandOutput,
  "Contents" | "CommonPrefixes"
>;

export type ListObjectsArgs = Pick<S3Path, "Bucket"> &
  Pick<
    ListObjectsV2CommandInput,
    "ContinuationToken" | "Delimiter" | "MaxKeys" | "Prefix" | "StartAfter"
  > &
  ListObjectsOutput;

export const listObjects = async ({
  Bucket,
  ContinuationToken,
  Contents: previousContents = [],
  CommonPrefixes: previousCommonPrefixes = [],
  ...params
}: ListObjectsArgs): Promise<ListObjectsOutput> => {
  const command = new ListObjectsV2Command({
    Bucket,
    ContinuationToken,
    ...params,
  });
  const {
    CommonPrefixes: CurrentCommonPrefixes = [],
    Contents: CurrentContents = [],
    IsTruncated,
    NextContinuationToken,
  } = await client.send(command);

  const CommonPrefixes = previousCommonPrefixes.concat(CurrentCommonPrefixes);
  const Contents = previousContents.concat(CurrentContents);

  if (!IsTruncated) return { Contents, CommonPrefixes };

  const { Contents: nextContents, CommonPrefixes: nextCommonPrefixes } =
    await listObjects({
      Bucket,
      CommonPrefixes,
      Contents,
      ContinuationToken: NextContinuationToken,
    });
  return { Contents: nextContents, CommonPrefixes: nextCommonPrefixes };
};

export type PutObjectArgs = S3Path & {
  data: DflowData;
};

export const putObject = async ({
  Bucket,
  Key,
  data,
}: PutObjectArgs): Promise<PutObjectCommandOutput> => {
  const json = JSON.stringify(data);
  const Body = Buffer.from(json);
  const command = new PutObjectCommand({ Body, Bucket, Key });
  return await client.send(command);
};

export type DeleteObjectArgs = S3Path;

export const deleteObject = async ({
  Bucket,
  Key,
}: DeleteObjectArgs): Promise<DeleteObjectCommandOutput> => {
  const command = new DeleteObjectCommand({ Bucket, Key });
  return await client.send(command);
};
