import * as stream from "node:stream";

import {
  CreateBucketCommand,
  CreateBucketCommandInput,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadBucketCommandOutput,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  ListObjectsV2CommandOutput,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { awsRegion } from "@ggbot2/infrastructure";
import {
  deletedNow,
  DeleteOperationOutput,
  ReadOperationOutput,
  updatedNow,
  UpdateOperationOutput,
} from "@ggbot2/models";
import { DflowData } from "dflow";

import { ErrorInvalidData } from "./errors.js";

export { S3ServiceException } from "@aws-sdk/client-s3";

export const s3ServiceExceptionName = {
  NotFound: "NotFound",
  NoSuchKey: "NoSuchKey",
};

const client = new S3Client({ apiVersion: "2006-03-01", region: awsRegion });

// Bucket and Key types are defined by @aws-sdk/client-s3 as string | undefined
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

export const getObject =
  (Bucket: S3Path["Bucket"]) =>
  async <Data extends DflowData>(
    isData: (arg: unknown) => arg is Data,
    Key: S3Path["Key"]
  ): Promise<ReadOperationOutput<Data>> => {
    try {
      const command = new GetObjectCommand({ Bucket, Key });
      const output = await client.send(command);
      const body = output?.Body;
      if (!(body instanceof stream.Readable)) return null;
      const json = await streamToString(body);
      const data = JSON.parse(json);
      if (isData(data)) return data;
      throw new ErrorInvalidData();
    } catch (error) {
      if (error instanceof S3ServiceException) {
        if (error.name === s3ServiceExceptionName.NoSuchKey) return null;
      }
      throw error;
    }
  };

export const headBucket = async (
  Bucket: S3Path["Bucket"]
): Promise<HeadBucketCommandOutput> => {
  const command = new HeadBucketCommand({ Bucket });
  return await client.send(command);
};

type ListObjectsOutput = Pick<
  ListObjectsV2CommandOutput,
  "Contents" | "CommonPrefixes"
>;

export const listObjects =
  (Bucket: S3Path["Bucket"]) =>
  async ({
    ContinuationToken,
    Contents: previousContents = [],
    CommonPrefixes: previousCommonPrefixes = [],
    ...params
  }: Pick<
    ListObjectsV2CommandInput,
    "ContinuationToken" | "Delimiter" | "MaxKeys" | "Prefix" | "StartAfter"
  > &
    ListObjectsOutput): Promise<ListObjectsOutput> => {
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
      await listObjects(Bucket)({
        CommonPrefixes,
        Contents,
        ContinuationToken: NextContinuationToken,
      });
    return { Contents: nextContents, CommonPrefixes: nextCommonPrefixes };
  };

export const putObject =
  (Bucket: S3Path["Bucket"]) =>
  async (
    Key: S3Path["Key"],
    data: DflowData
  ): Promise<PutObjectCommandOutput> => {
    const json = JSON.stringify(data);
    const Body = Buffer.from(json);
    const command = new PutObjectCommand({ Body, Bucket, Key });
    return await client.send(command);
  };

export const updateObject =
  (Bucket: S3Path["Bucket"]) =>
  async (
    Key: S3Path["Key"],
    data: DflowData
  ): Promise<UpdateOperationOutput> => {
    await putObject(Bucket)(Key, data);
    return updatedNow();
  };

export const deleteObject =
  (Bucket: S3Path["Bucket"]) =>
  async (Key: S3Path["Key"]): Promise<DeleteOperationOutput> => {
    const command = new DeleteObjectCommand({ Bucket, Key });
    await client.send(command);
    return deletedNow();
  };
