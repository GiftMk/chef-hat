import type { Resolvers } from '../generated/graphql'
import type { ServerContext } from '../serverContext'
import { createVideoResolver } from './createVideoResolver'
import { uploadDetailsResolver } from './uploadDetailsResolver'
import { videoStatusResolver } from './videoStatusResolver'

export const resolvers: Resolvers<ServerContext> = {
	Query: {
		uploadDetails: uploadDetailsResolver,
		videoStatus: videoStatusResolver,
	},
	Mutation: {
		createVideo: createVideoResolver,
	},
}
