import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import {
  rootPackageJson,
  rootPackageJsonWorkspaceScriptKey,
} from "./rootPackage.js";
import { workspaceExposedScriptKeys } from "./workspacePackage.js";
import { workspaceNames } from "./workspaces.js";

const { scripts } = rootPackageJson;

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
        for (const workspaceScriptKey of workspaceExposedScriptKeys) {
          if (
            !scriptKey.startsWith(
              rootPackageJsonWorkspaceScriptKey(workspaceScriptKey, "")
            )
          )
            return;
          assert.ok(
            workspaceNames
              .map((workspace) =>
                rootPackageJsonWorkspaceScriptKey(workspaceScriptKey, workspace)
              )
              .includes(scriptKey),
            `script ${scriptKey} does not target a workspace`
          );
        }
      });

      for (const workspaceScriptKey of workspaceExposedScriptKeys) {
        for (const workspace of workspaceNames) {
          const scriptKey = rootPackageJsonWorkspaceScriptKey(
            workspaceScriptKey,
            workspace
          );
          if (!scripts[scriptKey]) return;
          const value = `npm run ${workspaceScriptKey} --workspace ${workspace}`;
          assert.equal(
            scripts[scriptKey],
            value,
            `script ${scriptKey} has no proper value`
          );
        }
      }
    });
  });

  describe("workspaces", () => {
    it("is sorted", () => {
      const sorted = workspaceNames.slice(0).sort();
      assert.equal(
        workspaceNames.join(),
        sorted.join(),
        "root package.json workspaces are not sorted"
      );
    });
  });
});
