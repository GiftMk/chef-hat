import type { Resolvers } from '../generated/graphql'
import type { ServerContext } from '../serverContext'
import { createVideoResolver } from './createVideoResolver'
import { uploadDetailsResolver } from './uploadDetailsResolver'

export const resolvers: Resolvers<ServerContext> = {
	Query: {
		uploadDetails: uploadDetailsResolver,
	},
	Mutation: {
		createVideo: createVideoResolver,
	},
}
