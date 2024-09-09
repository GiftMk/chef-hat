import { makeVideo } from '@chef-hat/video-maker'
import { S3Client } from '@aws-sdk/client-s3'
import type { S3Event } from 'aws-lambda'
import { getZipStream } from './getZipStream'
import { Maybe, Result } from 'typescript-functional-extensions'
import { unzipStream } from './unzipStream'
import { uploadVideo } from './uploadVideo'
import { v4 as uuidv4 } from 'uuid'

const s3 = new S3Client({ region: 'ap-southeast-2' })

export const handler = async (event: S3Event): Promise<void> => {
	Maybe.from(event.Records[0]).tap(async (record) => {
		const bucketName = record.s3.bucket.name
		const key = record.s3.object.key
		const zipStream = await getZipStream({ s3, bucketName, key })
		const videoPath = `${uuidv4()}.mp4`

		zipStream
			.bindAsync((stream) => unzipStream(stream))
			.map(async ({ audioPath, imagePath }) => {
				const { errors } = await makeVideo({
					audioPath,
					imagePath,
					outputPath: videoPath,
				})

				if (errors.length) {
					return Result.failure(
						`Failed to make video. The following error(s) occurred: ${errors.join(', ')}`,
					)
				}

				return Result.success()
			})
			.tap(async () => await uploadVideo({ s3, bucketName, videoPath }))
			.tapFailure(console.error)
	})
}
