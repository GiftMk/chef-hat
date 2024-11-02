import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { resolvers } from './resolvers'
import { readFileSync } from 'node:fs'
import { getServerContext, type ServerContext } from './serverContext'

const typeDefs = readFileSync('./schema.graphql', 'utf8')

const server = new ApolloServer<ServerContext>({
	typeDefs,
	resolvers,
})

export const startServer = async (port: number) => {
	const { url } = await startStandaloneServer(server, {
		listen: { port },
		context: getServerContext,
	})

	console.log(`🚀  Server ready at: ${url}`)
}
