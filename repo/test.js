import { strict as assert } from "node:assert";
// TODO use describe and split into files
import tsconfigBase from "../tsconfig/tsconfig.json" assert { type: "json" };
import designTsconfig from "../design/tsconfig.json" assert { type: "json" };
import {
  eslintConfigPackageName,
  tsconfigPackageName,
  workspacePackageName,
} from "./packages.js";
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

const npmScriptKey = {
  build: "build",
  cleanup: "cleanup",
  lint: "lint",
  test: "test",
  checkTypes: "check_types",
};

const packageScript = {
  [npmScriptKey.build]: "tsc --build tsconfig.build.json",
  [npmScriptKey.cleanup]: "rm -rf dist/ test/",
  pretest: "tsc --build tsconfig.test.json",
  test: "node --test",
  [npmScriptKey.checkTypes]: "tsc --noEmit --project .",
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
    : [npmScriptKey.lint, npmScriptKey.checkTypes];
  const buildNpmScripts = noTscBuildWorkspaces.includes(workspace)
    ? []
    : [npmScriptKey.build, npmScriptKey.cleanup];

  [...codeCheckNpmScripts, ...buildNpmScripts].forEach((key) => {
    assert.equal(
      typeof packageJson.scripts[key] === "string",
      true,
      `package ${name} has scripts["${key}"]`
    );
  });
}

async function testWorkspacePackageJson({ workspace }) {
  const { default: packageJson } = await import(
    `../${workspace}/package.json`,
    {
      assert: { type: "json" },
    }
  );

  testPackageJson({ packageJson, workspace });

  const isWebapp = webappWorkspaces.includes(workspace);
  const isCodeWorkspace = !noCodeWorkspaces.includes(workspace);
  const packageJsonHasScripts = Array.isArray(packageJson.scripts);
  const packageJsonHasScriptTest =
    packageJsonHasScripts &&
    typeof packageJson.scripts[npmScriptKey.test] === "string";

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

  if (isCodeWorkspace) {
    [npmScriptKey.build].forEach((key) => {
      if (typeof packageJson.scripts[key] === "string") {
        assert.equal(
          rootPackageJsonScripts[`${key}:${workspace}`],
          `npm run ${key} --workspace ${workspace}`,
          `script ${key} defined in ${workspace}/package.json is exposed via script ${key}:${workspace} defined in root package.json`
        );
      }
    });
  }

  if (isCodeWorkspace && workspace !== "repo") {
    [npmScriptKey.cleanup, npmScriptKey.lint, npmScriptKey.checkTypes].forEach(
      (key) => {
        assert.equal(
          typeof packageJson.scripts[key] === "string",
          true,
          `${workspace}/package.json has scripts["${key}"]`
        );
      }
    );
  }

  if (isCodeWorkspace && workspace !== "repo") {
    [
      {
        key: npmScriptKey.checkTypes,
        expected: packageScript[npmScriptKey.checkTypes],
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
    if (packageJson.scripts[npmScriptKey.test]) scripts.push(npmScriptKey.test);

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
    const key = `${npmScriptKey.test}:${workspace}`;
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

      if (!noTscBuildWorkspaces.includes(workspace)) {
        assert.equal(
          rootPackageJsonScripts[`prebuild:${workspace}`].includes(
            `build:${dependency}`
          ),
          true,
          `root package.json script prebuild:${workspace} dependency ${dependency}"]`
        );
      }

      assert.equal(
        dependencyKey,
        workspacePackageName(dependency),
        `${dependencyKey} matches ${dependencyValue}`
      );

      if (!noTscBuildWorkspaces.includes(workspace)) {
        assert.equal(
          rootPackageJsonScripts[`prebuild:${workspace}`].includes(
            `build:${dependency}`
          ),
          true,
          `root package.json script prebuild:${workspace} handles dependency ${dependency}"]`
        );
      }
    }
  }
}

async function testWorkspaceTsconfig({ workspace }) {
  if (noCodeWorkspaces.includes(workspace) || workspace === "repo") return;

  const { default: tsconfig } = await import(`../${workspace}/tsconfig.json`, {
    assert: { type: "json" },
  });

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
  const { default: tsconfig } = await import(
    `../${workspace}/tsconfig.build.json`,
    {
      assert: { type: "json" },
    }
  );

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
