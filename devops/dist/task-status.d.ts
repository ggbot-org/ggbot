import { DataBucketStatus } from "./s3-dataBucket.js";
declare type TaskStatus = (options: {
    verbose?: boolean | undefined;
}) => Promise<{
    dataBucket: DataBucketStatus;
}>;
export declare const taskStatus: TaskStatus;
export {};
