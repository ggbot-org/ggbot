import { getRandomValues, webcrypto } from "node:crypto"

import { warn } from "./logging.js"

const saltVectorLength = 16
const initializationVectorLength = 12

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const base64ToArrayBuffer = (base64Encoded: string) =>
	Uint8Array.from(atob(base64Encoded), (value) => value.charCodeAt(0))

const arrayBufferToBase64 = (arrayBuffer: ArrayBufferLike) =>
	btoa(
		new Uint8Array(arrayBuffer).reduce(
			(data, byte) => data + String.fromCharCode(byte),
			""
		)
	)

const deriveKey = (
	passwordBasedKey: CryptoKey,
	salt: BufferSource,
	keyUsage: Extract<KeyUsage, "encrypt" | "decrypt">
) =>
	webcrypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt,
			iterations: 250000,
			hash: "SHA-256"
		},
		passwordBasedKey,
		{ name: "AES-GCM", length: 256 },
		false,
		[keyUsage]
	)

const getPasswordBasedKey = (password: string) =>
	webcrypto.subtle.importKey(
		"raw",
		encoder.encode(password),
		"PBKDF2",
		false,
		["deriveKey"]
	)

export const decrypt = async (
	encryptedData: string,
	password: string
): Promise<string> => {
	try {
		const inputVector = base64ToArrayBuffer(encryptedData)
		const saltVector = inputVector.slice(0, saltVectorLength)
		const initializationVector = inputVector.slice(
			saltVectorLength,
			saltVectorLength + initializationVectorLength
		)
		const encryptedVector = inputVector.slice(
			saltVectorLength + initializationVectorLength
		)
		const passwordBasedKey = await getPasswordBasedKey(password)
		const aesKey = await deriveKey(passwordBasedKey, saltVector, "decrypt")
		const decryptedContent = await webcrypto.subtle.decrypt(
			{
				name: "AES-GCM",
				iv: initializationVector
			},
			aesKey,
			encryptedVector
		)
		return decoder.decode(decryptedContent)
	} catch (error) {
		if (error instanceof Error) warn(error.message)
		else warn(error)
		throw error
	}
}

export const encrypt = async (
	data: string,
	password: string
): Promise<string> => {
	try {
		const saltVector = getRandomValues(new Uint8Array(saltVectorLength))
		const initializationVector = getRandomValues(
			new Uint8Array(initializationVectorLength)
		)
		const passwordBasedKey = await getPasswordBasedKey(password)
		const aesKey = await deriveKey(passwordBasedKey, saltVector, "encrypt")
		const encryptedContentArrayBuffer = await webcrypto.subtle.encrypt(
			{
				name: "AES-GCM",
				iv: initializationVector
			},
			aesKey,
			encoder.encode(data)
		)
		const encryptedContentUint8Array = new Uint8Array(
			encryptedContentArrayBuffer
		)
		const arrayBuffer = new Uint8Array(
			saltVector.byteLength +
				initializationVector.byteLength +
				encryptedContentUint8Array.byteLength
		)
		arrayBuffer.set(saltVector, 0)
		arrayBuffer.set(initializationVector, saltVector.byteLength)
		arrayBuffer.set(
			encryptedContentUint8Array,
			saltVector.byteLength + initializationVector.byteLength
		)
		return arrayBufferToBase64(arrayBuffer)
	} catch (error) {
		if (error instanceof Error) warn(error.message)
		else warn(error)
		throw error
	}
}
