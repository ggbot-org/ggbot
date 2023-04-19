import { strict as assert } from "node:assert";
// TODO use describe and split into files, remove this file
import tsconfigBase from "../../tsconfig/tsconfig.json" assert { type: "json" };
import designTsconfig from "../../design/tsconfig.json" assert { type: "json" };
import { eslintConfigPackageName } from "./eslint.js";
import { packageScriptKey } from "./package.js";
import {
  importWorkspaceTsconfigJson,
  importWorkspaceTsconfigBuildJson,
  tsconfigPackageName,
} from "./tsconfig.js";
import {
  importWorkspacePackageJson,
  workspacePackageName,
} from "./workspacePackage.js";
import { workspaceNames } from "./workspaces.js";
import { rootPackageJsonScripts } from "./rootPackage.js";

const noCodeWorkspaces = ["eslint-config", "tsconfig"];
const noTscBuildWorkspaces = [
  ...noCodeWorkspaces,
  "aws-lambda-user-api",
  "admin-webapp",
  "repo",
  "user-webapp",
  "website",
];

const webappWorkspaces = ["admin-webapp", "design", "user-webapp", "website"];

const packageScript = {
  [packageScriptKey.build]: "tsc --build tsconfig.build.json",
  [packageScriptKey.cleanup]: "rm -rf dist/ test/",
  pretest: "tsc --build tsconfig.test.json",
  test: "node --test",
  [packageScriptKey.checkTypes]: "tsc --noEmit --project .",
};

/**
 * Checks that are in common to package.json workspace.
 */
function testPackageJson({ packageJson, workspace }) {
  const { name } = packageJson;

  [
    {
      key: "keywords",
      expected: undefined,
    },
    {
      key: "private",
      expected: true,
    },
  ].forEach(({ key, expected }) => {
    assert.equal(packageJson[key], expected, `package ${name} ${key}`);
  });

  const codeCheckNpmScripts = noTscBuildWorkspaces.includes(workspace)
    ? []
    : [packageScriptKey.lint, packageScriptKey.checkTypes];
  const buildNpmScripts = noTscBuildWorkspaces.includes(workspace)
    ? []
    : [packageScriptKey.build, packageScriptKey.cleanup];

  [...codeCheckNpmScripts, ...buildNpmScripts].forEach((key) => {
    assert.equal(
      typeof packageJson.scripts[key] === "string",
      true,
      `package ${name} has scripts["${key}"]`
    );
  });
}

async function testWorkspacePackageJson({ workspace }) {
  const packageJson = await importWorkspacePackageJson(workspace);

  testPackageJson({ packageJson, workspace });

  const isWebapp = webappWorkspaces.includes(workspace);
  const isCodeWorkspace = !noCodeWorkspaces.includes(workspace);
  const packageJsonHasScripts = Array.isArray(packageJson.scripts);
  const packageJsonHasScriptTest =
    packageJsonHasScripts &&
    typeof packageJson.scripts[packageScriptKey.test] === "string";

  [{ key: "name", expected: workspacePackageName(workspace) }].forEach(
    ({ key, expected }) => {
      assert.equal(packageJson[key], expected, `workspace package.json ${key}`);
    }
  );

  if (!isWebapp && isCodeWorkspace) {
    [{ key: "type", expected: "module" }].forEach(({ key, expected }) => {
      assert.equal(packageJson[key], expected, `workspace package.json ${key}`);
    });
  }

  /// Test packageJson and rootPackageJson scripts.
  // // // // // // // // // // // // // // // ///

  if (isCodeWorkspace && workspace !== "repo") {
    [
      packageScriptKey.cleanup,
      packageScriptKey.lint,
      packageScriptKey.checkTypes,
    ].forEach((key) => {
      assert.equal(
        typeof packageJson.scripts[key] === "string",
        true,
        `${workspace}/package.json has scripts["${key}"]`
      );
    });
  }

  if (isCodeWorkspace && workspace !== "repo") {
    [
      {
        key: packageScriptKey.checkTypes,
        expected: packageScript[packageScriptKey.checkTypes],
      },
    ].forEach(({ key, expected }) => {
      assert.equal(
        packageJson.scripts[key],
        expected,
        `${workspace}/package.json scripts["${key}"] has expected value`
      );
    });
  }

  if (isCodeWorkspace) {
    const scripts = [];

    // Script "test" is optional,
    // check it in rootPackageJson only if it is defined in packageJson.
    if (packageJson.scripts[packageScriptKey.test])
      scripts.push(packageScriptKey.test);

    // Check scripts in rootPackageJson.
    scripts
      .map((key) => ({
        key: `${key}:${workspace}`,
        expected: `npm run ${key} --workspace ${workspace}`,
      }))
      .forEach(({ key, expected }) => {
        assert.equal(
          rootPackageJsonScripts[key],
          expected,
          `script ${key} is defined in root package.json`
        );
      });
  }

  if (packageJsonHasScriptTest) {
    const key = `${packageScriptKey.test}:${workspace}`;
    assert.equal(
      rootPackageJsonScripts[key],
      undefined,
      `script ${key} is defined in root package.json but not in ${workspace} package.json`
    );
  }

  if (isCodeWorkspace) {
    assert.equal(
      packageJson.eslintConfig.extends.some((item) =>
        item.startsWith(eslintConfigPackageName)
      ),
      true,
      `${workspace}/package.json eslintConfig extends ${eslintConfigPackageName}`
    );
  }

  /// Test packageJson dependencies.
  // // // // // // // // // // ///

  for (const [dependencyKey, dependencyValue] of Object.entries(
    packageJson.dependencies ?? {}
  )) {
    const filePrefix = "file:";

    if (dependencyValue.startsWith(filePrefix)) {
      const dependency = dependencyValue.substring(
        filePrefix.length,
        dependencyValue.length
      );

      assert.equal(
        dependencyKey,
        workspacePackageName(dependency),
        `${dependencyKey} matches ${dependencyValue}`
      );

      // if (!noTscBuildWorkspaces.includes(workspace)) {
      //   assert.equal(
      //     rootPackageJsonScripts[`prebuild:${workspace}`].includes(
      //       `build:${dependency}`
      //     ),
      //     true,
      //     `root package.json script prebuild:${workspace} dependency ${dependency}"]`
      //   );
      // }

      assert.equal(
        dependencyKey,
        workspacePackageName(dependency),
        `${dependencyKey} matches ${dependencyValue}`
      );

      // if (!noTscBuildWorkspaces.includes(workspace)) {
      //   assert.equal(
      //     rootPackageJsonScripts[`prebuild:${workspace}`].includes(
      //       `build:${dependency}`
      //     ),
      //     true,
      //     `root package.json script prebuild:${workspace} handles dependency ${dependency}"]`
      //   );
      // }
    }
  }
}

async function testWorkspaceTsconfig({ workspace }) {
  if (noCodeWorkspaces.includes(workspace) || workspace === "repo") return;

  const tsconfig = await importWorkspaceTsconfigJson(workspace);

  const { compilerOptions } = tsconfig;

  for (const compilerOption of Object.keys(tsconfigBase.compilerOptions)) {
    assert.equal(
      compilerOptions[compilerOption] === undefined,
      true,
      `${workspace}/tsconfig.json does not override common compiler option ${compilerOption}`
    );
  }

  if (webappWorkspaces.includes(workspace)) {
    assert.equal(
      compilerOptions.target,
      designTsconfig.compilerOptions.target,
      `${workspace}/tsconfig.json has same compilerOptions.target as design/tsconfig.json`
    );
  }

  assert.equal(
    tsconfig.extends,
    tsconfigPackageName,
    `${workspace}/tsconfig.json extends ${tsconfigPackageName}`
  );
}

async function testWorkspaceTsconfigBuild({ workspace }) {
  const tsconfig = await importWorkspaceTsconfigBuildJson(workspace);

  [
    { key: "composite", expected: true },
    { key: "declarationMap", expected: true },
    { key: "outDir", expected: "./dist" },
    { key: "tsBuildInfoFile", expected: "temp/tsconfig.build.tsbuildinfo" },
    { key: "stripInternal", expected: true },
  ].forEach(({ key, expected }) => {
    assert.equal(
      tsconfig.compilerOptions[key],
      expected,
      `${workspace}/tsconfig.build.json compilerOptions.${key}`
    );
  });
}

async function testWorkspace({ workspace }) {
  // package.json
  await testWorkspacePackageJson({ workspace });

  // tsconfig.json
  await testWorkspaceTsconfig({ workspace });

  // tsconfig.build.json
  if (
    !noTscBuildWorkspaces.includes(workspace) &&
    !webappWorkspaces.includes(workspace)
  ) {
    await testWorkspaceTsconfigBuild({ workspace });
  }
}

async function repoTests() {
  for (const workspace of [...noTscBuildWorkspaces, ...webappWorkspaces])
    assert.equal(
      workspaceNames.includes(workspace),
      true,
      `workspace ${workspace} is included in root package.json workspaces list`
    );

  for (const workspace of workspaceNames) await testWorkspace({ workspace });
}

repoTests();
