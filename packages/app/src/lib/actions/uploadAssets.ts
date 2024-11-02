'use server'

import { getClient } from '../graphql/client'
import type { UploadDetailsQuery } from '../graphql/generated/graphql'
import { uploadDetailsQuery } from '../graphql/queries/uploadDetailsQuery'
import path from 'node:path'
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'

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

type UploadAssetsResult = {
	success: boolean
	message?: string
}

export const uploadAssets = async ({
	audio,
	image,
}: UploadAssetsProps): Promise<UploadAssetsResult> => {
	const audioFile = audio[0]
	const imageFile = image[0]

	const client = getClient()
	const { audioUploadUrl, audioFilename, imageUploadUrl, imageFilename } = (
		await getUploadDetails(client, audioFile, imageFile)
	).uploadDetails

	const audioUpload = await uploadFile(audioUploadUrl, audioFilename, audioFile)

	if (!audioUpload.ok) {
		return { success: false, message: 'Failed to upload audio' }
	}

	const imageUpload = await uploadFile(imageUploadUrl, imageFilename, imageFile)

	if (!imageUpload.ok) {
		return { success: false, message: 'Failed to upload image' }
	}

	return { success: true }
}
