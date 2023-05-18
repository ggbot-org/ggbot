import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { packageRootDir } from "./dirnames.js";
import { filename } from "./filenames.js";

describe("packageRootDir", () => {
  it("returns package root dir", () => {
    assert.equal(
      packageRootDir("file:///repo/my-package/src/package.js"),
      "/repo/my-package"
    );
  });

  it(`throws if called from a script which filename is not ${filename.packageJs}`, () => {
    assert.throws(() => {
      packageRootDir(import.meta.url);
    });
  });
});
