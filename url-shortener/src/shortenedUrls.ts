import { DeployStage, ENV } from "@workspace/env"
import { FQDN, WebappBaseURL } from "@workspace/locators"

const dnsDomain = ENV.DNS_DOMAIN()
const deployStage: DeployStage = "main"
const fqdn = new FQDN(deployStage, dnsDomain)

type ShortenedUrl = {
	pathname: string
	target: URL
}

export const shortenedUrls = new Map<
	ShortenedUrl["pathname"],
	ShortenedUrl["target"]
>().set("index.html", new WebappBaseURL(fqdn))
