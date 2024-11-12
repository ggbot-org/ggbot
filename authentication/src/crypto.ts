import { getRandomValues, webcrypto } from 'node:crypto'

const saltVectorLength = 16
const initializationVectorLength = 12

const encoder = new TextEncoder()
const decoder = new TextDecoder()

async function deriveKey(
	passwordBasedKey: CryptoKey,
	salt: BufferSource,
	keyUsage: Extract<KeyUsage, 'encrypt' | 'decrypt'>
) {
	return webcrypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt,
			iterations: 250000,
			hash: 'SHA-256'
		},
		passwordBasedKey,
		{ name: 'AES-GCM', length: 256 },
		false,
		[keyUsage]
	)
}

async function getPasswordBasedKey(password: string) {
	return webcrypto.subtle.importKey(
		'raw',
		encoder.encode(password),
		'PBKDF2',
		false,
		['deriveKey']
	)
}

/** Decrypt data, assumes input is a base64 encoded string. */
export async function decrypt(
	encryptedData: string,
	password: string
): Promise<string> {
	// Convert base64 string to Uint8Array.
	const inputVector = Uint8Array.from(atob(encryptedData), (value) => value.charCodeAt(0)
	)
	const saltVector = inputVector.slice(0, saltVectorLength)
	const initializationVector = inputVector.slice(
		saltVectorLength,
		saltVectorLength + initializationVectorLength
	)
	const encryptedVector = inputVector.slice(
		saltVectorLength + initializationVectorLength
	)
	const passwordBasedKey = await getPasswordBasedKey(password)
	const aesKey = await deriveKey(passwordBasedKey, saltVector, 'decrypt')
	const decryptedContent = await webcrypto.subtle.decrypt(
		{
			name: 'AES-GCM',
			iv: initializationVector
		},
		aesKey,
		encryptedVector
	)
	return decoder.decode(decryptedContent)
}

/** Encrypt data, outputs a base64 encoded string. */
export async function encrypt(data: string, password: string): Promise<string> {
	const saltVector = getRandomValues(new Uint8Array(saltVectorLength))
	const initializationVector = getRandomValues(
		new Uint8Array(initializationVectorLength)
	)
	const passwordBasedKey = await getPasswordBasedKey(password)
	const aesKey = await deriveKey(passwordBasedKey, saltVector, 'encrypt')
	const encryptedDataVector = await webcrypto.subtle.encrypt(
		{
			name: 'AES-GCM',
			iv: initializationVector
		},
		aesKey,
		encoder.encode(data)
	)
	const encryptedDataUint8Array = new Uint8Array(encryptedDataVector)
	const outputVector = new Uint8Array(
		saltVector.byteLength +
			initializationVector.byteLength +
			encryptedDataUint8Array.byteLength
	)
	outputVector.set(saltVector, 0)
	outputVector.set(initializationVector, saltVector.byteLength)
	outputVector.set(
		encryptedDataUint8Array,
		saltVector.byteLength + initializationVector.byteLength
	)
	// Convert Uint8Array to base64 encoded string.
	return btoa(
		outputVector.reduce(
			(data, byte) => data + String.fromCharCode(byte),
			''
		)
	)
}
