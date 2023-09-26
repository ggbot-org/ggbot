import { Tag } from "@workspace/aws"

const projectTag: Tag = { Key: "Project", Value: "ggbot2" }

export const tagsIncludesProjectTag = (tags: Tag[]) =>
	tags.findIndex(
		({ Key, Value }) => Key === projectTag.Key && Value === projectTag.Value
	) > -1
