import { Upload } from '@aws-sdk/lib-storage'
import type { S3Client } from '@aws-sdk/client-s3'
import type { Readable } from 'node:stream'
import { emptySuccess, failure, type Result } from '@chef-hat/ts-result'

type UploadToS3Props = {
	s3Client: S3Client
	bucket: string
	key: string
	body: Readable
}

export const uploadToS3 = async ({
	s3Client,
	bucket,
	key,
	body,
}: UploadToS3Props): Promise<Result> => {
	try {
		const uploadToS3 = new Upload({
			client: s3Client,
			params: {
				Bucket: bucket,
				Key: key,
				Body: body,
			},
		})

		uploadToS3.on('httpUploadProgress', (progress) =>
			console.log(
				`Uploading ${key} to S3 bucket ${bucket}, current progress: ${progress.total}`,
			),
		)

		await uploadToS3.done()
		return emptySuccess()
	} catch (e) {
		if (e instanceof Error) {
			return failure(
				`Failed to upload ${key} to S3 bucket ${bucket}, the following error occurred ${e.message}`,
			)
		}
		return failure(
			'Failed to ${key} to S3 bucket ${bucket}, an unknown error occurred',
		)
	}
}
