import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { packageScriptKey } from "./package.js";
import {
  rootPackageJson,
  rootPackageJsonScriptWorkspaceTaskKey,
} from "./rootPackage.js";

const { scripts, workspaces } = rootPackageJson;

describe("root package.json", () => {
  it("is private", () => {
    assert.equal(rootPackageJson.private, true);
  });

  describe("scripts", () => {
    it("is sorted by key", () => {
      const keys = Object.keys(scripts);
      const sorted = keys.slice(0).sort();
      assert.equal(
        keys.join(),
        sorted.join(),
        "root package.json scripts are not sorted by key"
      );
    });

    it("has workspace tasks properly defined", () => {
      Object.keys(scripts).forEach((scriptKey) => {
        for (const task of [
          packageScriptKey.build,
          packageScriptKey.test,
          packageScriptKey.checkTypes,
        ]) {
          if (
            scriptKey.startsWith(
              rootPackageJsonScriptWorkspaceTaskKey({ task, workspace: "" })
            )
          ) {
            assert.ok(
              workspaces
                .map((workspace) =>
                  rootPackageJsonScriptWorkspaceTaskKey({ task, workspace })
                )
                .includes(scriptKey),
              `script ${scriptKey} does not target a workspace`
            );
          }
        }
      });

      for (const task of [packageScriptKey.build, packageScriptKey.test]) {
        for (const workspace of workspaces) {
          const key = rootPackageJsonScriptWorkspaceTaskKey({
            task,
            workspace,
          });
          const value = `npm run ${task} --workspace ${workspace}`;
          if (scripts[key]) {
            assert.equal(
              scripts[key],
              value,
              `script ${key} has not a proper value`
            );
          }
        }
      }
    });
  });

  describe("workspaces", () => {
    it("is sorted", () => {
      const sorted = workspaces.slice(0).sort();
      assert.equal(
        workspaces.join(),
        sorted.join(),
        "root package.json workspaces are not sorted"
      );
    });
  });
});
