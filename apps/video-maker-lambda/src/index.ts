import { makeVideo } from '@chef-hat/video-maker'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import type { Context, S3Event } from 'aws-lambda'
import { getZipStream } from './getZipStream'
import { Maybe, MaybeAsync, Result } from 'typescript-functional-extensions'
import { unzipStream } from './unzipStream'
import { uploadVideo } from './uploadVideo'

//TODO: move the region to an environment variable
const s3 = new S3Client({ region: 'ap-southeast-2' })

export const handler = async (event: S3Event): Promise<void> => {
	Maybe.from(event.Records[0]).tap(async (record) => {
		const bucketName = record.s3.bucket.name
		const key = record.s3.object.key
		const zipStream = await getZipStream({ s3, bucketName, key })
		//TODO: create a shared constant for the output directory
		const outputPath = 'output/video.mp4'

		zipStream
			.bind((stream) => unzipStream(stream))
			.map(async ({ audioPath, imagePath }) => {
				const { errors } = await makeVideo({
					audioPath,
					imagePath,
					outputPath,
				})

				if (errors.length) {
					return Result.failure(
						`Failed to make video. The following error(s) occurred: ${errors.join(', ')}`,
					)
				}

				return Result.success()
			})
			.tap(async () => await uploadVideo(s3, outputPath))
			.tapFailure(console.error)
	})
}
