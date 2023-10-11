import { exec } from "node:child_process"

import { ErrorCannotGetOwnEc2InstanceId } from "./errors.js"

/**
 * Get `instance-id` from EC2 metadata.
 *
 * It is assumed this function run on an Amazon Linux instance.
 *
 * @example
 *
 * ```ts
 * const InstanceId = await getOwnEc2InstanceId
 * ```
 *
 * @see {@link https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html}
 */
export const getOwnEc2InstanceId = new Promise<string>((resolve, reject) => {
	exec("ec2-metadata --instance-id", (_error, stdout) => {
		// Expected output for command
		//     ec2-metadata --instance-id
		//
		// is something like
		//     instance-id: i-087a42553011030b0
		//
		// Get string after colon, remove new line and spaces.
		const instanceId = stdout.split(":").pop()?.replace(/\n/, "").trim()
		if (typeof instanceId === "string") resolve(instanceId)
		reject(new ErrorCannotGetOwnEc2InstanceId())
	})
})
