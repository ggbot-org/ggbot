import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { packageScriptKey } from "./package.js";
import {
  rootPackageJsonScripts,
  rootPackageJsonScriptWorkspaceTaskKey,
} from "./rootPackage.js";
import { workspaceNames } from "./workspaces.js";
import { importWorkspacePackageJson } from "./workspacePackage.js";

workspaceNames.forEach(async (workspace) => {
  const packageJson = await importWorkspacePackageJson(workspace);
  describe(`${workspace} package.json`, () => {
    it("is private", () => {
      assert.equal(packageJson.private, true);
    });

    describe("scripts", () => {
      const { scripts } = packageJson;

      if (!scripts) return;

      for (const task of [packageScriptKey.build]) {
        if (!scripts[task]) continue;

        const rootPackageScriptKey = rootPackageJsonScriptWorkspaceTaskKey({
          task,
          workspace,
        });
        it(`has ${task} script exposed by root package.json as ${rootPackageScriptKey}`, () => {
          assert.ok(
            typeof rootPackageJsonScripts[rootPackageScriptKey] === "string",
            `script ${task} in ${workspace}/package.json is not exposed by root package.json as ${rootPackageScriptKey}`
          );
        });
      }
    });
  });
});
