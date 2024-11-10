import type {
	QueryUploadDetailsArgs,
	UploadDetails,
} from '../generated/graphql'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand, type S3Client } from '@aws-sdk/client-s3'
import type { ServerContext } from '../serverContext'
import { randomUUID } from 'node:crypto'

const getUploadUrl = async (
	s3Client: S3Client,
	bucket: string,
	key: string,
) => {
	const command = new PutObjectCommand({
		Bucket: bucket,
		Key: key,
	})
	return await getSignedUrl(s3Client, command, {
		expiresIn: 60 * 15,
	})
}

export const uploadDetailsResolver = async (
	_: unknown,
	args: QueryUploadDetailsArgs,
	contextValue: ServerContext,
): Promise<UploadDetails> => {
	const audioFilename = `${randomUUID()}.${args.input.audioExtension}`
	const audioUploadUrl = await getUploadUrl(
		contextValue.s3.client,
		contextValue.s3.uploadBucket,
		audioFilename,
	)
	const imageFilename = `${randomUUID()}.${args.input.imageExtension}`
	const imageUploadUrl = await getUploadUrl(
		contextValue.s3.client,
		contextValue.s3.uploadBucket,
		imageFilename,
	)

	return {
		audioUploadUrl,
		imageUploadUrl,
		audioFilename,
		imageFilename,
	}
}
