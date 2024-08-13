import { ExecutorDatabase } from "@workspace/database"
import { logging } from "@workspace/logging"
import { documentProvider } from "@workspace/s3-data-bucket"

const executorDatabase = new ExecutorDatabase(documentProvider)

const data = await executorDatabase.ListAccountKeys({ token: undefined })
console.info(data)
