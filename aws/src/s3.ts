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
import type { DataValue } from "@ggbot2/models";
import { isAwsError } from "./error.js";
import { region } from "./region.js";
import { domainName } from "./route53.js";

export type { BucketName } from "aws-sdk/clients/s3";

type DeleteObjectArgs = Pick<DeleteObjectRequest, "Bucket" | "Key">;

type GetObjectArgs = Pick<GetObjectRequest, "Bucket" | "Key">;

type ListObjectsOutput = Pick<
  ListObjectsV2Output,
  "Contents" | "CommonPrefixes"
>;

type ListObjectsArgs = Pick<
  ListObjectsV2Request,
  | "Bucket"
  | "ContinuationToken"
  | "Delimiter"
  | "MaxKeys"
  | "Prefix"
  | "StartAfter"
> &
  ListObjectsOutput & {
    withLastModified?: boolean;
    withETag?: boolean;
  };

type PutObjectArgs = Pick<PutObjectRequest, "Bucket" | "Key"> & {
  data: DataValue;
};

const s3 = new AWS.S3({ apiVersion: "2006-03-01", region });

export function dataBucketName(): BucketName {
  const deployStage = getDeployStage();
  return `${deployStage}-data.${domainName}`;
}

export function deleteObject({ Bucket, Key }: DeleteObjectArgs) {
  return new Promise((resolve, reject) => {
    s3.deleteObject({ Bucket, Key }, (error, data) =>
      error ? reject(error) : resolve(data)
    );
  });
}

export function getObject<Data>({
  Bucket,
  Key,
}: GetObjectArgs): Promise<Data | undefined> {
  return new Promise((resolve, reject) => {
    try {
      s3.getObject({ Bucket, Key }, (_error, output) => {
        const body = output?.Body;

        if (typeof body === "undefined") {
          resolve(body);
        } else {
          const json = body.toString("utf-8");
          const data = JSON.parse(json) as Data;
          resolve(data);
        }
      });
    } catch (error) {
      if (isAwsError(error)) {
        const { statusCode } = error;
        console.error(`Bucket=${Bucket} Key=${Key} code=${statusCode}`);
        if (statusCode === 404) return resolve(undefined);
      }
      reject(error);
    }
  });
}

export function listObjects({
  Bucket,
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
                Bucket,
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
          } else {
            resolve({
              Contents: Contents?.map(({ Key, LastModified, ETag }) => ({
                Key,
                ...(withLastModified ? { LastModified } : {}),
                ...(withETag ? { ETag } : {}),
              })),
              CommonPrefixes,
            });
          }
        }
      );
    } catch (error) {
      if (isAwsError(error)) {
        const { statusCode } = error;
        console.error(`Bucket=${Bucket} code=${statusCode}`);
      }

      reject(error);
    }
  });
}

export function putObject({ Bucket, Key, data }: PutObjectArgs) {
  return new Promise((resolve, reject) => {
    const json = JSON.stringify(data);
    const Body = Buffer.from(json);

    s3.putObject({ Body, Bucket, Key }, (error, data) =>
      error ? reject(error) : resolve(data)
    );
  });
}
