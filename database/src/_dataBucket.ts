import { deleteObject, getObject, listObjects, putObject } from "@workspace/aws"
import { getDataBucketName } from "@workspace/infrastructure"
import { logging } from "@workspace/logging"
import { deletedNow, updatedNow } from "@workspace/models"
import { DflowArray, DflowObject } from "dflow"

import { ErrorInvalidData } from "./errors.js"

const { info } = logging("database")

const Bucket = getDataBucketName()

type AsyncFunction = (...arguments_: any[]) => Promise<unknown>

export const READ = async <Operation extends AsyncFunction>(
	isData: (
		arg: unknown
	) => arg is Exclude<Awaited<ReturnType<Operation>>, null>,
	Key: string
): Promise<Awaited<ReturnType<Operation>> | null> => {
	try {
		const json = await getObject(Bucket)(Key)
		if (!json) {
			info("READ", Key, json)
			return null
		}
		const data = JSON.parse(json)
		info(
			"READ",
			Key,
			`isData=${isData(data)}`,
			json.length > 170 ? "" : JSON.stringify(data, null, 2)
		)
		if (isData(data)) return data
		throw new ErrorInvalidData()
	} catch (error) {
		if (error instanceof SyntaxError) return null
		throw error
	}
}

export const READ_ARRAY = async <Operation extends AsyncFunction>(
	isData: (arg: unknown) => arg is Awaited<ReturnType<Operation>>,
	Key: string
): Promise<Awaited<ReturnType<Operation>>> => {
	try {
		const json = await getObject(Bucket)(Key)
		if (!json) {
			info("READ_ARRAY", Key, json)
			return [] as Awaited<ReturnType<Operation>>
		}
		const data = JSON.parse(json)
		info(
			"READ_ARRAY",
			Key,
			`isData=${isData(data)}`,
			JSON.stringify(data, null, 2)
		)
		if (isData(data)) return data
		throw new ErrorInvalidData()
	} catch (error) {
		if (error instanceof SyntaxError)
			return [] as Awaited<ReturnType<Operation>>
		throw error
	}
}

export const DELETE = async (Key: string) => {
	info("DELETE", Key)
	await deleteObject(Bucket)(Key)
	return deletedNow()
}

export const LIST = listObjects(Bucket)

export const UPDATE = async (Key: string, data: DflowArray | DflowObject) => {
	await WRITE(Key, data)
	return updatedNow()
}

export const WRITE = async (Key: string, data: DflowArray | DflowObject) => {
	info("WRITE", Key, JSON.stringify(data, null, 2))
	const json = JSON.stringify(data)
	await putObject(Bucket)(Key, json)
}
