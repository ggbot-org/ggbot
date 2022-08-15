import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  HeadBucketCommand,
  HeadBucketCommandOutput,
  ListObjectsV2Command,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import type {
  DeleteObjectCommandInput,
  GetObjectCommandInput,
  HeadBucketCommandInput,
  ListObjectsV2CommandInput,
  ListObjectsV2CommandOutput,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { awsRegion } from "@ggbot2/infrastructure";
import type { JsonValue } from "type-fest";

export { S3ServiceException } from "@aws-sdk/client-s3";

export const s3ServiceExceptionName = {
  NotFound: "NotFound",
};

const client = new S3Client({ apiVersion: "2006-03-01", region: awsRegion });

export type GetObjectArgs = Pick<GetObjectCommandInput, "Bucket" | "Key">;

export const getObject = async ({
  Bucket,
  Key,
}: GetObjectArgs): Promise<JsonValue | undefined> => {
  const command = new GetObjectCommand({ Bucket, Key });
  const output = await client.send(command);
  const body = output?.Body;
  if (typeof body === "undefined") return;
  const json = body.toString();
  const data = JSON.parse(json);
  return data;
};

export type HeadBucketArgs = Pick<HeadBucketCommandInput, "Bucket">;

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

export type ListObjectsArgs = Pick<
  ListObjectsV2CommandInput,
  | "Bucket"
  | "ContinuationToken"
  | "Delimiter"
  | "MaxKeys"
  | "Prefix"
  | "StartAfter"
> &
  ListObjectsOutput;

export const listObjects = async ({
  Bucket,
  ContinuationToken,
  Contents: PreviousContents = [],
  CommonPrefixes: PreviousCommonPrefixes = [],
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

  const CommonPrefixes = PreviousCommonPrefixes.concat(CurrentCommonPrefixes);
  const Contents = PreviousContents.concat(CurrentContents);

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

export type PutObjectArgs = Pick<PutObjectCommandInput, "Bucket" | "Key"> & {
  data: JsonValue;
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

export type DeleteObjectArgs = Pick<DeleteObjectCommandInput, "Bucket" | "Key">;

export const deleteObject = async ({
  Bucket,
  Key,
}: DeleteObjectArgs): Promise<DeleteObjectCommandOutput> => {
  const command = new DeleteObjectCommand({ Bucket, Key });
  return await client.send(command);
};
