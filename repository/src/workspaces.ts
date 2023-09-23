import { join } from "path"

import { Repository } from "./Repository.js"
import { Workspace } from "./Workspace.js"

export const webappWorkspace = new Workspace(
	join(Repository.pathname, "webapp")
)
