import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import {
  FormatjsIntlMessageIdsContent,
  FormatjsIntlMessageIdsFilename,
} from "@ggbot2/i18n";

import translation from "../../translations/en.json" assert { type: "json" };

const pathname = join("src", "i18n", FormatjsIntlMessageIdsFilename);

const translationKeys = Object.keys(translation);

const content = FormatjsIntlMessageIdsContent(translationKeys);

await writeFile(pathname, content, { encoding: "utf8" });
