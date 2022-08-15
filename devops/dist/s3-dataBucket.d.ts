export { dataBucketName } from "@ggbot2/infrastructure";
export declare const dataBucketExists: () => Promise<boolean>;
export declare type DataBucketStatus = {
    exists: boolean;
};
export declare const getDataBucketStatus: () => Promise<{
    exists: boolean;
}>;
