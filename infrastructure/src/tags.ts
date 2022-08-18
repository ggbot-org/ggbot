import type { Tag } from "@aws-sdk/client-iam";

export const projectTag: Tag = { Key: "Project", Value: "ggbot2" };

export const tagsIncludesProjectTag = (tags: Tag[]) =>
  tags.findIndex(
    ({ Key, Value }) => Key === projectTag.Key && Value === projectTag.Value
  ) > -1;
