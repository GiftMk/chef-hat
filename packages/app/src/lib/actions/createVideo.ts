'use server'

import { getClient } from '../graphql/client'
import type { CreateVideoMutation } from '../graphql/generated/graphql'
import { createVideoMutation } from '../graphql/mutations/createVideoMutation'
import { failure, success, type Result } from '@chef-hat/ts-result'

type CreateVideoResponse = {
	trackingId: string
	downloadUrl: string
}

type CreateVideoProps = {
	audioFilename: string
	imageFilename: string
}

export const createVideo = async ({
	audioFilename,
	imageFilename,
}: CreateVideoProps): Promise<Result<CreateVideoResponse>> => {
	const client = getClient()
	const { data } = await client.mutate<CreateVideoMutation>({
		mutation: createVideoMutation,
		variables: { input: { audioFilename, imageFilename } },
	})
	const response = data?.createVideo

	if (!response) {
		return failure('Failed to initiate video creation')
	}

	return success({
		trackingId: response.trackingId,
		downloadUrl: response.downloadUrl,
	})
}
