import { strict as assert } from "node:assert";
import rootPackageJson from "../package.json" assert { type: "json" };
import tsconfigBase from "../tsconfig/base.json" assert { type: "json" };
import designTsconfig from "../design/tsconfig.json" assert { type: "json" };

const workspacesNamespace = "ggbot2";
const npmScope = `@${workspacesNamespace}`;

const tsconfigPackageName = `${npmScope}/tsconfig`;
const eslintConfigPackageName = `eslint-config-${workspacesNamespace}`;

const noCodeWorkspaces = ["eslint-config", "tsconfig"];
const noBuildWorkspaces = [
  ...noCodeWorkspaces,
  "admin-webapp",
  "user-webapp",
  "website",
];

const webappWorkspaces = ["admin-webapp", "design", "user-webapp", "website"];

const npmScriptKey = {
  build: "build",
  cleanup: "cleanup",
  lint: "lint",
  test: "test",
  typeCheck: "tsc--noEmit",
};

const packageScript = {
  [npmScriptKey.build]: "tsc --build tsconfig.build.json",
  [npmScriptKey.cleanup]: "rm -rf dist/ test/",
  pretest: "tsc --build tsconfig.test.json",
  test: "node --test",
  [npmScriptKey.typeCheck]: "tsc --noEmit --project .",
};

/**
 * Checks that are in common to package.json workspace.
 */
function testPackageJson({ packageJson, workspace }) {
  const { name } = packageJson;

  if (workspace === undefined && name !== rootPackageJson.name)
    throw new TypeError("Missing workspace argument");

  [
    {
      key: "keywords",
      expected: undefined,
    },
    {
      key: "private",
      expected: true,
    },
    {
      key: "version",
      expected: rootPackageJson.version,
    },
  ].forEach(({ key, expected }) => {
    assert.equal(packageJson[key], expected, `package ${name} ${key}`);
  });

  const codeCheckNpmScripts = noCodeWorkspaces.includes(workspace)
    ? []
    : [npmScriptKey.lint, npmScriptKey.typeCheck];
  const buildNpmScripts = noBuildWorkspaces.includes(workspace)
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

  if (
    workspace !== eslintConfigPackageName.replace(`-${workspacesNamespace}`, "")
  ) {
    [{ key: "name", expected: `${npmScope}/${workspace}` }].forEach(
      ({ key, expected }) => {
        assert.equal(
          packageJson[key],
          expected,
          `workspace package.json ${key}`
        );
      }
    );
  }

  if (!isWebapp && isCodeWorkspace) {
    [{ key: "type", expected: "module" }].forEach(({ key, expected }) => {
      assert.equal(packageJson[key], expected, `workspace package.json ${key}`);
    });
  }

  /// Test packageJson and rootPackageJson scripts.
  // // // // // // // // // // // // // // // ///

  if (isCodeWorkspace) {
    [npmScriptKey.build, npmScriptKey.cleanup, npmScriptKey.lint].forEach(
      (key) => {
        if (typeof packageJson.scripts[key] === "string") {
          assert.equal(
            rootPackageJson.scripts[`${key}:${workspace}`],
            `npm run ${key} --workspace ${workspace}`,
            `script ${key} defined in ${workspace}/package.json is exposed via script ${key}:${workspace} defined in root package.json`
          );
        }
      }
    );
  }

  if (isCodeWorkspace) {
    [npmScriptKey.cleanup, npmScriptKey.lint, npmScriptKey.typeCheck].forEach(
      (key) => {
        assert.equal(
          typeof packageJson.scripts[key] === "string",
          true,
          `${workspace}/package.json has scripts["${key}"]`
        );
      }
    );
  }

  if (isCodeWorkspace) {
    [
      {
        key: npmScriptKey.typeCheck,
        expected: packageScript[npmScriptKey.typeCheck],
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
    [npmScriptKey.cleanup, npmScriptKey.lint, npmScriptKey.test]
      .map((key) => ({
        key: `${key}:${workspace}`,
        expected: `npm run ${key} --workspace ${workspace}`,
      }))
      .forEach(({ key, expected }) => {
        assert.equal(
          rootPackageJson.scripts[key],
          expected,
          `script ${key} is defined in root package.json`
        );
      });
  }

  if (isCodeWorkspace && !isWebapp) {
    assert.equal(
      packageJson.eslintConfig.extends.includes(workspacesNamespace),
      true,
      `${workspace}/package.json eslintConfig extends ${eslintConfigPackageName}`
    );
  }

  if (isWebapp) {
    [{ key: "next:build", expected: "next build" }].forEach(
      ({ key, expected }) => {
        assert.equal(
          packageJson.scripts[key],
          expected,
          `${workspace}/package.json scripts["${key}"]`
        );
      }
    );

    [
      {
        key: `devserver:${workspace}`,
        expected: `npm run dev --workspace ${workspace}`,
      },
      {
        key: `next:build:${workspace}`,
        expected: `npm run next:build --workspace ${workspace}`,
      },
    ].forEach(({ key, expected }) => {
      assert.equal(
        rootPackageJson.scripts[key],
        expected,
        `root package.json scripts["${key}"]`
      );
    });
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
        `${npmScope}/${dependency}`,
        `${dependencyKey} matches ${dependencyValue}`
      );

      if (!noBuildWorkspaces.includes(workspace)) {
        assert.equal(
          rootPackageJson.scripts[`prebuild:${workspace}`].includes(
            `build:${dependency}`
          ),
          true,
          `root package.json script prebuild:${workspace} dependency ${dependency}"]`
        );
      }

      assert.equal(
        dependencyKey,
        `${npmScope}/${dependency}`,
        `${dependencyKey} matches ${dependencyValue}`
      );

      if (!noBuildWorkspaces.includes(workspace)) {
        assert.equal(
          rootPackageJson.scripts[`prebuild:${workspace}`].includes(
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
  if (noCodeWorkspaces.includes(workspace)) return;

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

function testRootPackageJson() {
  const { workspaces } = rootPackageJson;

  for (const key of Object.keys(rootPackageJson.scripts))
    for (const task of ["build", "prebuild", "test"])
      if (key.startsWith(`${task}:`)) {
        const [_, target] = key.split(":");
        assert.equal(
          workspaces.includes(target),
          true,
          `${task}:${target} targets a workspace`
        );
      }

  for (const noBuildWorkspace of noBuildWorkspaces)
    assert.equal(
      workspaces.includes(noBuildWorkspace),
      true,
      `noBuildWorkspace ${noBuildWorkspace} is included in root package.json workspaces list`
    );

  for (const webappWorkspace of webappWorkspaces)
    assert.equal(
      workspaces.includes(webappWorkspace),
      true,
      `webappWorkspace ${webappWorkspace} is included in root package.json workspaces list`
    );
}

async function testWorkspace({ workspace }) {
  // package.json
  await testWorkspacePackageJson({ workspace });

  // tsconfig.json
  await testWorkspaceTsconfig({ workspace });

  // tsconfig.build.json
  if (
    !noBuildWorkspaces.includes(workspace) &&
    !webappWorkspaces.includes(workspace)
  ) {
    await testWorkspaceTsconfigBuild({ workspace });
  }
}

async function repoTests() {
  testRootPackageJson();

  const workspaces = rootPackageJson.workspaces.filter(
    (name) => name !== "repo"
  );

  for (const workspace of workspaces) await testWorkspace({ workspace });
}

repoTests();
