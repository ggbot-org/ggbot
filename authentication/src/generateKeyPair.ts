import { AuthenticationKeyPair } from "./keyPair.js";

const crypto = await import("node:crypto");

export const generateKeyPair = (): Promise<AuthenticationKeyPair> =>
  new Promise((resolve, reject) => {
    crypto.generateKeyPair(
      "rsa",
      {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
          cipher: "aes-256-cbc",
          passphrase: "top secret",
        },
      },
      (error, publicKey, privateKey) => {
        if (error) reject(error);
        resolve({ publicKey, privateKey });
      }
    );
  });
