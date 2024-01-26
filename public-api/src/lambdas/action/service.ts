import {
	isPublicApiInput as isInput,
	PublicApiActionType
} from "@workspace/api"
import { PublicDataProvider } from "@workspace/database"
import { ENV } from "@workspace/env"
import { BadRequestError } from "@workspace/http"
import { ApiService } from "@workspace/models"
import {
	getS3DataBucketName,
	S3DataBucketProvider
} from "@workspace/s3-data-bucket"

class Service implements ApiService<PublicApiActionType> {
	dataProvider: PublicDataProvider

	constructor(dataProvider: PublicDataProvider) {
		this.dataProvider = dataProvider
	}

	ReadStrategy(arg: unknown) {
		if (!isInput.ReadStrategy(arg)) throw new BadRequestError()
		return this.dataProvider.readStrategy(arg)
	}

	ReadStrategyFlow(arg: unknown) {
		if (!isInput.ReadStrategyFlow(arg)) throw new BadRequestError()
		return this.dataProvider.readStrategyFlow(arg)
	}
}

const awsDataRegion = ENV.AWS_DATA_REGION()

const documentProvider = new S3DataBucketProvider(
	awsDataRegion,
	getS3DataBucketName(ENV.DEPLOY_STAGE(), ENV.DNS_DOMAIN(), awsDataRegion)
)

const dataProvider = new PublicDataProvider(documentProvider)

export const service = new Service(dataProvider)
