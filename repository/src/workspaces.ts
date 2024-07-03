import { join } from "path"

import { Repository } from "./Repository.js"
import { Workspace } from "./Workspace.js"

export const databaseWorkspace = new Workspace(
	join(Repository.pathname, "database")
)

export const webappWorkspace = new Workspace(
	join(Repository.pathname, "webapp")
)
