import { getClient } from '../graphql/client'
import type { CreateVideoMutation } from '../graphql/generated/graphql'
import { createVideoMutation } from '../graphql/mutations/createVideoMutation'
import type { ServerActionResult } from './ServerActionResult'

type CreateVideoResult = ServerActionResult<{
	trackingId: string
	downloadUrl: string
}>

type CreateVideoProps = {
	audioFilename: string
	imageFilename: string
}

export const createVideo = async ({
	audioFilename,
	imageFilename,
}: CreateVideoProps): Promise<CreateVideoResult> => {
	const client = getClient()
	const { data } = await client.mutate<CreateVideoMutation>({
		mutation: createVideoMutation,
		variables: { input: { audioFilename, imageFilename } },
	})
	const response = data?.createVideo

	if (!response) {
		return { success: false, message: 'Failed to initiate video creation' }
	}

	return {
		success: true,
		trackingId: response.trackingId,
		downloadUrl: response.downloadUrl,
	}
}
