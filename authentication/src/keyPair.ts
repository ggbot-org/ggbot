import { Buffer } from "node:buffer";

export type AuthenticationKey = string;

export type AuthenticationKeyPair = {
  privateKey: string;
  publicKey: string;
};

export const authenticationKeyEncodeBase64 = (key: AuthenticationKey) =>
  Buffer.from(key, "ascii").toString("base64");

export const authenticationKeyDecodeBase64 = (key: AuthenticationKey) =>
  Buffer.from(key, "base64").toString("ascii");
