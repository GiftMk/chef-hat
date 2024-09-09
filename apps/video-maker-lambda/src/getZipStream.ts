import { Readable } from 'node:stream'
import { type S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { Result } from 'typescript-functional-extensions'

type GetZipStreamRequest = {
	s3: S3Client
	bucketName: string
	key: string
}

export const getZipStream = async ({
	s3,
	bucketName,
	key,
}: GetZipStreamRequest): Promise<Result<Readable>> => {
	const response = await s3.send(
		new GetObjectCommand({ Bucket: bucketName, Key: key }),
	)
	const stream = response.Body
	return stream instanceof Readable
		? Result.success(stream)
		: Result.failure('S3 response body is not a readable stream.')
}
