import * as AWS from "aws-sdk";
import type {
  BucketName,
  DeleteObjectRequest,
  GetObjectRequest,
  ListObjectsV2Request,
  ListObjectsV2Output,
  PutObjectRequest,
} from "aws-sdk/clients/s3";
import { getDeployStage } from "@ggbot2/env";
import type { JsonValue } from "type-fest";
import { isAwsError } from "./error.js";
import { region } from "./region.js";
import { domainName } from "./route53.js";

const s3 = new AWS.S3({ apiVersion: "2006-03-01", region });

function dataBucketName(): BucketName {
  const deployStage = getDeployStage();
  return `${deployStage}-data.${domainName}`;
}

const Bucket = dataBucketName();

type GetObjectArgs = Pick<GetObjectRequest, "Key">;

export function getObject({
  Key,
}: GetObjectArgs): Promise<JsonValue | undefined> {
  return new Promise((resolve, reject) => {
    try {
      s3.getObject({ Bucket, Key }, (_error, output) => {
        const body = output?.Body;
        if (typeof body === "undefined") resolve(body);
        const json = body.toString("utf-8");
        const data = JSON.parse(json);
        resolve(data);
      });
    } catch (error) {
      if (isAwsError(error)) {
        const { statusCode } = error;
        console.error(`Key=${Key} code=${statusCode}`);
        if (statusCode === 404) return resolve(undefined);
      }
      reject(error);
    }
  });
}

type ListObjectsOutput = Pick<
  ListObjectsV2Output,
  "Contents" | "CommonPrefixes"
>;

type ListObjectsArgs = Pick<
  ListObjectsV2Request,
  "ContinuationToken" | "Delimiter" | "MaxKeys" | "Prefix" | "StartAfter"
> &
  ListObjectsOutput & {
    withLastModified?: boolean;
    withETag?: boolean;
  };

export function listObjects({
  ContinuationToken,
  Contents: PreviousContents = [],
  CommonPrefixes: PreviousCommonPrefixes = [],
  withETag,
  withLastModified,
  ...params
}: ListObjectsArgs): Promise<ListObjectsOutput> {
  return new Promise((resolve, reject) => {
    try {
      s3.listObjectsV2(
        { Bucket, ContinuationToken, ...params },
        (_error, output) => {
          const {
            CommonPrefixes: CurrentCommonPrefixes = [],
            Contents: CurrentContents = [],
            IsTruncated,
            NextContinuationToken,
          } = output;
          const CommonPrefixes = PreviousCommonPrefixes.concat(
            CurrentCommonPrefixes
          );
          const Contents = PreviousContents.concat(CurrentContents);
          if (IsTruncated) {
            resolve(
              listObjects({
                ...params,
                CommonPrefixes,
                Contents,
                ContinuationToken: NextContinuationToken,
                withETag,
                withLastModified,
              }).then(({ Contents, CommonPrefixes }) =>
                Promise.resolve({
                  Contents: Contents?.map(({ Key, LastModified, ETag }) => ({
                    Key,
                    ...(withLastModified ? { LastModified } : {}),
                    ...(withETag ? { ETag } : {}),
                  })),
                  CommonPrefixes,
                })
              )
            );
          }
          resolve({
            Contents: Contents?.map(({ Key, LastModified, ETag }) => ({
              Key,
              ...(withLastModified ? { LastModified } : {}),
              ...(withETag ? { ETag } : {}),
            })),
            CommonPrefixes,
          });
        }
      );
    } catch (error) {
      if (isAwsError(error)) {
        const { statusCode } = error;
        console.error(`code=${statusCode}`);
      }
      reject(error);
    }
  });
}

type PutObjectArgs = Pick<PutObjectRequest, "Key"> & {
  data: JsonValue;
};

export function putObject({ Key, data }: PutObjectArgs) {
  return new Promise((resolve, reject) => {
    const json = JSON.stringify(data);
    const Body = Buffer.from(json);
    s3.putObject({ Body, Bucket, Key }, (error, data) =>
      error ? reject(error) : resolve(data)
    );
  });
}

type DeleteObjectArgs = Pick<DeleteObjectRequest, "Key">;

export function deleteObject({ Key }: DeleteObjectArgs) {
  return new Promise((resolve, reject) => {
    s3.deleteObject({ Bucket, Key }, (error, data) =>
      error ? reject(error) : resolve(data)
    );
  });
}
