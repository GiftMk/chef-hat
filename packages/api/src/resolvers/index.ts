import type { Resolvers } from '../generated/graphql'
import type { ServerContext } from '../server'
import { uploadDetailsResolver } from './uploadDetails'

export const resolvers: Resolvers<ServerContext> = {
	Query: {
		uploadDetails: uploadDetailsResolver,
	},
}
