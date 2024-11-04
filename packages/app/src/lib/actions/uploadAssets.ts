'use server'

import { getClient } from '../graphql/client'
import type { UploadDetailsQuery } from '../graphql/generated/graphql'
import { uploadDetailsQuery } from '../graphql/queries/uploadDetailsQuery'
import path from 'node:path'
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { failure, type Result, success } from '@chef-hat/ts-result'

type UploadAssetsProps = {
	audio: FileList
	image: FileList
}

const removeLeadingDot = (extension: string) => extension.replace('.', '')

const uploadFile = async (url: string, filename: string, file: File) => {
	const renamedFile = new File([file], filename, { type: file.type })
	return await fetch(url, {
		method: 'PUT',
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		body: renamedFile,
	})
}

const getUploadDetails = async (
	client: ApolloClient<NormalizedCacheObject>,
	audioFile: File,
	imageFile: File,
): Promise<UploadDetailsQuery> => {
	const audioExtension = removeLeadingDot(path.parse(audioFile.name).ext)
	const imageExtension = removeLeadingDot(path.parse(imageFile.name).ext)

	const { data } = await client.query<UploadDetailsQuery>({
		query: uploadDetailsQuery,
		variables: { input: { audioExtension, imageExtension } },
	})

	return data
}

type UploadAssetsResponse = {
	audioFilename: string
	imageFilename: string
}

export const uploadAssets = async ({
	audio,
	image,
}: UploadAssetsProps): Promise<Result<UploadAssetsResponse>> => {
	const audioFile = audio[0]
	const imageFile = image[0]

	const client = getClient()
	const { audioUploadUrl, audioFilename, imageUploadUrl, imageFilename } = (
		await getUploadDetails(client, audioFile, imageFile)
	).uploadDetails

	const uploadAudio = uploadFile(audioUploadUrl, audioFilename, audioFile)
	const uploadImage = uploadFile(imageUploadUrl, imageFilename, imageFile)
	const results = await Promise.all([uploadAudio, uploadImage])
	const uploadFailed = results.some((r) => !r.ok)

	if (uploadFailed) {
		return failure('Failed to upload assets.')
	}
	return success({ audioFilename, imageFilename })
}
