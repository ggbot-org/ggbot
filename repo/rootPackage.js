import pkg from "../package.json" assert { type: "json" };

export const rootPackageJson = pkg;

export const rootPackageJsonScripts = rootPackageJson.scripts;

export const rootPackageJsonScriptWorkspaceTaskKey = ({ task, workspace }) =>
  `${task}:${workspace}`;

export const rootPackageJsonScriptWorkspaceTasks = [
  "build",
  "prebuild",
  "test",
];
