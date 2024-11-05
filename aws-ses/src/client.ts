import { SESClient } from "@aws-sdk/client-ses"

export function sesClient (region: string) {
	return new SESClient({ apiVersion: "2010-12-01", region })
}
