import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { resolvers } from './resolvers'
import { readFileSync } from 'node:fs'
import { S3Client } from '@aws-sdk/client-s3'

const typeDefs = readFileSync('./schema.graphql', 'utf8')

export type ServerContext = {
	s3Client: S3Client
	uploadBucket: string
}

const server = new ApolloServer<ServerContext>({
	typeDefs,
	resolvers,
})

export const startServer = async (port: number) => {
	const { url } = await startStandaloneServer(server, {
		listen: { port },
		context: async () => ({
			s3Client: new S3Client({ region: 'ap-southeast-2' }),
			uploadBucket: 'cheff-hat-video-maker-inputs',
		}),
	})

	console.log(`🚀  Server ready at: ${url}`)
}
