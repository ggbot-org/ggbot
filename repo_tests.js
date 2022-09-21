import { strict as assert } from "node:assert";
import rootPackageJson from "./package.json" assert { type: "json" };
import tsconfigCommon from "./tsconfig.common.json" assert { type: "json" };
import uiComponentsTsconfig from "./ui-components/tsconfig.json" assert { type: "json" };

const npmScope = "@ggbot2";

const noBuildWorkspaces = ["admin-webapp", "end-to-end-tests", "website"];

const webappWorkspaces = [
  "admin-webapp",
  "ui-components",
  "user-webapp",
  "website",
];

const typeChecksNpmScriptKey = "tsc--noEmit";

function testPackageJson({ packageJson }) {
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
    {
      key: "version",
      expected: rootPackageJson.version,
    },
  ].forEach(({ key, expected }) => {
    assert.equal(packageJson[key], expected, `package ${name} ${key}`);
  });

  const requiredNpmScripts = ["test", typeChecksNpmScriptKey];
  requiredNpmScripts.forEach((key) => {
    assert.equal(
      typeof packageJson.scripts[key] === "string",
      true,
      `package ${name} has scripts["${key}"]`
    );
  });
}

async function testWorkspacePackageJson({ workspace }) {
  const { default: packageJson } = await import(`./${workspace}/package.json`, {
    assert: { type: "json" },
  });

  testPackageJson({ packageJson });

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

  if (typeof packageJson.scripts.build === "string") {
    assert.equal(
      rootPackageJson.scripts[`build:${workspace}`],
      `npm run build --workspace ${workspace}`,
      `script build defined in ${workspace}/package.json is exposed via script build:${workspace} defined in root package.json`
    );
  }

  [
    { key: typeChecksNpmScriptKey, expected: "tsc --noEmit --project ." },
  ].forEach(({ key, expected }) => {
    assert.equal(
      packageJson.scripts[key],
      expected,
      `${workspace}/package.json scripts["${key}"]`
    );
  });

  assert.equal(
    packageJson.scripts.test.includes(`npm run ${typeChecksNpmScriptKey}`),
    true,
    `${workspace}/package.json scripts.test run TypeScript type checks`
  );

  assert.equal(
    rootPackageJson.scripts[`test:${workspace}`],
    `npm run test --workspace ${workspace}`,
    `script test:${workspace} is defined in root package.json`
  );

  if (isWebapp) {
    [
      {
        key: `devserver:${workspace}`,
        expected: `npm run dev --workspace ${workspace}`,
      },
    ].forEach(({ key, expected }) => {
      assert.equal(
        rootPackageJson.scripts[key],
        expected,
        `${workspace}/package.json scripts["${key}"]`
      );
    });
  }
}

async function testWorkspaceTsconfig({ workspace }) {
  const { default: tsconfig } = await import(`./${workspace}/tsconfig.json`, {
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
    `./${workspace}/tsconfig.build.json`,
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

  testPackageJson({ packageJson: rootPackageJson });

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

  for (const workspace of rootPackageJson.workspaces)
    await testWorkspace({ workspace });
}

repoTests();
