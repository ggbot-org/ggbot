import { strict as assert } from "node:assert";
import rootPackageJson from "../package.json" assert { type: "json" };
import tsconfigCommon from "../tsconfig.common.json" assert { type: "json" };
import uiComponentsTsconfig from "../ui-components/tsconfig.json" assert { type: "json" };

const npmScope = "@ggbot2";

const noBuildWorkspaces = ["admin-webapp", "end-to-end-tests", "website"];

const webappWorkspaces = [
  "admin-webapp",
  "ui-components",
  "user-webapp",
  "website",
];

const typeChecksNpmScriptKey = "tsc--noEmit";

const packageScript = {
  build: "tsc --build tsconfig.build.json",
  cleanup: "rm -rf dist/ test/",
  pretest: "tsc --build tsconfig.test.json",
  test: "node --test",
  "tsc--noEmit": "tsc --noEmit --project .",
};

/**
 * Checks that are in common to package.json workspace.
 */
function testPackageJson({ packageJson, workspace }) {
  const { name } = packageJson;

  if (typeof workspace === "undefined" && name !== rootPackageJson.name)
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

  const requiredNpmScripts = ["test", typeChecksNpmScriptKey];
  const buildNpmScripts = noBuildWorkspaces.includes(workspace)
    ? []
    : ["build", "cleanup"];

  [...requiredNpmScripts, ...buildNpmScripts].forEach((key) => {
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

  [{ key: "name", expected: `${npmScope}/${workspace}` }].forEach(
    ({ key, expected }) => {
      assert.equal(packageJson[key], expected, `workspace package.json ${key}`);
    }
  );

  if (!isWebapp) {
    [{ key: "type", expected: "module" }].forEach(({ key, expected }) => {
      assert.equal(packageJson[key], expected, `workspace package.json ${key}`);
    });
  }

  /// Test packageJson and rootPackageJson scripts.
  // // // // // // // // // // // // // // // ///

  ["build", "cleanup"].forEach((key) => {
    if (typeof packageJson.scripts[key] === "string") {
      assert.equal(
        rootPackageJson.scripts[`${key}:${workspace}`],
        `npm run ${key} --workspace ${workspace}`,
        `script ${key} defined in ${workspace}/package.json is exposed via script ${key}:${workspace} defined in root package.json`
      );
    }
  });

  [
    {
      key: typeChecksNpmScriptKey,
      expected: packageScript[typeChecksNpmScriptKey],
    },
  ].forEach(({ key, expected }) => {
    assert.equal(
      packageJson.scripts[key],
      expected,
      `${workspace}/package.json scripts["${key}"]`
    );
  });

  assert.equal(
    rootPackageJson.scripts[`test:${workspace}`],
    `npm run test --workspace ${workspace}`,
    `script test:${workspace} is defined in root package.json`
  );

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
  // // // // // // // // // // // // // // // ///

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
            `npm run build:${dependency}`
          ),
          true,
          `root package.json script prebuild:${workspace} handles dependency ${dependency}"]`
        );
      }
    }
  }
}

async function testWorkspaceTsconfig({ workspace }) {
  const { default: tsconfig } = await import(`../${workspace}/tsconfig.json`, {
    assert: { type: "json" },
  });

  const { compilerOptions } = tsconfig;

  for (const compilerOption of Object.keys(tsconfigCommon.compilerOptions)) {
    assert.equal(
      typeof compilerOptions[compilerOption] === "undefined",
      true,
      `${workspace}/tsconfig.json does not override common compiler option ${compilerOption}`
    );
  }

  if (webappWorkspaces.includes(workspace)) {
    assert.equal(
      compilerOptions.target,
      uiComponentsTsconfig.compilerOptions.target,
      `${workspace}/tsconfig.json has same compilerOptions.target as ui-components/tsconfig.json`
    );
  }

  assert.equal(
    tsconfig.extends,
    "../tsconfig.common.json",
    `${workspace}/tsconfig.json extends tsconfig.common.json`
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
    { key: "declaration", expected: true },
    { key: "outDir", expected: "./dist" },
    { key: "removeComments", expected: true },
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
  if (!noBuildWorkspaces.includes(workspace)) {
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
