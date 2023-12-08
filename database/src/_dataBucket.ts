import { S3IOClient } from "@workspace/aws-s3"
import { ENV } from "@workspace/env"
import { logging } from "@workspace/logging"
import { deletedNow, SerializableData, updatedNow } from "@workspace/models"

import { getDataBucketName } from "./S3DataProvider.js"

const { info } = logging("database")

const Bucket = getDataBucketName()
const s3 = new S3IOClient(ENV.AWS_DATA_REGION(), Bucket)

type AsyncFunction = (...arguments_: any[]) => Promise<unknown>

// TODO non serve fare READ e READ_ARRAY
// non serve che ReadStrategy sia definita come Promise, potrebbe non esserlo
// serve che ReadStrategy sia definita come
//
// ReadStrategy = Operation<Input extends SerializableData, Output extends null | SerializableObject> = {
// }
//
// dove Input e Output sono serializable, come JsonValue di type-fest ma da copiare dentro models, con i type-guard tipo dflow
// cosi tolgo dflow come dipendenza da models
// ed ho tutte le Operation
//
// poi posso definire ad esempio PublicApiServer come type
// e su public-api lambda, ho un file api.ts con class Api implements PublicApiServer
//
// in questo modo posso mockare tutto dopo averlo definito in maniera astratta
//
// type PublicApiServer = {
//   ReadStrategy: (input: unknown}): ReadStrategy.output
// }

export const READ = async <Operation extends AsyncFunction>(
	Key: string
): Promise<Awaited<ReturnType<Operation>> | null> => {
	try {
		const json = await s3.getObject(Key)
		if (!json) {
			info("READ", Key, json)
			return null
		}
		const data: unknown = JSON.parse(json)
		info(
			"READ",
			Key,
			json.length > 170 ? "" : JSON.stringify(data, null, 2)
		)
		return data as Awaited<ReturnType<Operation>>
	} catch (error) {
		if (error instanceof SyntaxError) return null
		throw error
	}
}

export const READ_ARRAY = async <Operation extends AsyncFunction>(
	Key: string
): Promise<Awaited<ReturnType<Operation>>> => {
	try {
		const json = await s3.getObject(Key)
		if (!json) {
			info("READ_ARRAY", Key, json)
			return [] as Awaited<ReturnType<Operation>>
		}
		// TODO should be parseSerializedString imported from models
		const data: unknown = JSON.parse(json)
		info(
			"READ_ARRAY",
			Key,
			json.length > 170 ? "" : JSON.stringify(data, null, 2)
		)
		return data as Awaited<ReturnType<Operation>>
	} catch (error) {
		if (error instanceof SyntaxError)
			return [] as Awaited<ReturnType<Operation>>
		throw error
	}
}

export const DELETE = async (Key: string) => {
	info("DELETE", Key)
	await s3.deleteObject(Key)
	return deletedNow()
}

export const LIST = async ({ Prefix }: { Prefix: string }) =>
	s3.listObjects({ Prefix })

export const UPDATE = async (Key: string, data: SerializableData) => {
	await WRITE(Key, data)
	return updatedNow()
}

export const WRITE = async (Key: string, data: SerializableData) => {
	info("WRITE", Key, JSON.stringify(data, null, 2))
	const json = JSON.stringify(data)
	await s3.putObject(Key, json)
}
