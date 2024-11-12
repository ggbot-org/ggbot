import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const workspaceDir = resolve(dirname(dirname(fileURLToPath(import.meta.url))))

export const iamDir = join(workspaceDir, 'iam')
