import type {
	QueryUploadDetailsArgs,
	UploadDetails,
} from '../generated/graphql'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand, type S3Client } from '@aws-sdk/client-s3'
import type { ServerContext } from '../server'
import { v4 as uuidv4 } from 'uuid'

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
		expiresIn: 60,
	})
}

export const uploadDetailsResolver = async (
	_: unknown,
	args: QueryUploadDetailsArgs,
	contextValue: ServerContext,
): Promise<UploadDetails> => {
	const uploadKey = uuidv4()
	const audioFilename = `${uploadKey}/audio.${args.input.audioExtension}`
	const audioUploadUrl = await getUploadUrl(
		contextValue.s3Client,
		contextValue.uploadBucket,
		audioFilename,
	)
	const imageFilename = `${uploadKey}/image.${args.input.imageExtension}`
	const imageUploadUrl = await getUploadUrl(
		contextValue.s3Client,
		contextValue.uploadBucket,
		imageFilename,
	)

	return {
		audioUploadUrl,
		imageUploadUrl,
		uploadKey,
		audioFilename,
		imageFilename,
	}
}
