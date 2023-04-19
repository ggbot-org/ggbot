import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  rootPackageJson,
  rootPackageJsonScriptWorkspaceTaskKey,
  rootPackageJsonScriptWorkspaceTasks,
  rootPackageJsonScripts,
} from "./rootPackage.js";
import { workspaceNames } from "./workspaces.js";

describe("root package.json", () => {
  it("is private", () => {
    assert.equal(rootPackageJson.private, true);
  });

  it("is has scripts sorted by key", () => {
    const keys = Object.keys(rootPackageJsonScripts);
    const sortedKeys = keys.slice(0).sort();
    assert.equal(keys.join(), sortedKeys.join(), "script keys are not sorted");
  });

  it("has scripts to run workspace tasks properly defined", () => {
    Object.keys(rootPackageJsonScripts).forEach((scriptKey) => {
      for (const task of rootPackageJsonScriptWorkspaceTasks) {
        if (
          scriptKey.startsWith(
            rootPackageJsonScriptWorkspaceTaskKey({ task, workspace: "" })
          )
        ) {
          assert.ok(
            workspaceNames
              .map((workspace) =>
                rootPackageJsonScriptWorkspaceTaskKey({ task, workspace })
              )
              .includes(scriptKey),
            `script ${scriptKey} does not target a workspace`
          );
        }
      }
    });

    for (const task of rootPackageJsonScriptWorkspaceTasks) {
      if (!task.startsWith("pre")) {
        for (const workspace of workspaceNames) {
          const key = rootPackageJsonScriptWorkspaceTaskKey({
            task,
            workspace,
          });
          const value = `npm run ${task} --workspace ${workspace}`;
          if (rootPackageJsonScripts[key]) {
            assert.equal(
              rootPackageJsonScripts[key],
              value,
              `script ${key} has not a proper value`
            );
          }
        }
      }
    }
  });
});
