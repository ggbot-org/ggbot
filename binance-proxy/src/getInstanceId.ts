import { exec } from "node:child_process"

import { ErrorCannotGetInstanceId } from "./errors.js"

/**
 * Get instanceId from EC2 metadata.
 *
 * It is assumed this function run on an Amazon Linux instance.
 *
 * @example
 *
 * ```ts
 * const instanceId = await getInstanceId
 * ```
 *
 * @see {@link https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html}
 */
export const getInstanceId = new Promise((resolve, reject) => {
	exec("ec2-metadata --instance-id", (error, stdout) => {
		if (error) reject(new ErrorCannotGetInstanceId())
		// Expected output for command
		//     ec2-metadata --instance-id
		//
		// is something like
		//     instance-id: i-087a42553011030b0
		//
		// Get string after colon, remove new line and spaces.
		resolve(stdout.split(":").pop()?.replace(/\n/, "").trim())
	})
})
