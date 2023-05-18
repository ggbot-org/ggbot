import { writeFile } from "node:fs/promises";
import { join } from "node:path";

type GenerageHtmlPageArgs = {
  dirname: string;
  filename: string;
  htmlContent: string;
};

export const generateHtmlPage = async ({
  dirname,
  filename,
  htmlContent,
}: GenerageHtmlPageArgs) => {
  const pathname = join(dirname, filename);
  await writeFile(pathname, htmlContent, { encoding: "utf8" });
};
