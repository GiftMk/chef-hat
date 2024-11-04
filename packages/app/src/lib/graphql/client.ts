import { HttpLink, InMemoryCache, ApolloClient } from '@apollo/client'
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support'
import { apiUrl } from './constants'

export const { getClient } = registerApolloClient(() => {
	return new ApolloClient({
		cache: new InMemoryCache(),
		link: new HttpLink({
			uri: apiUrl,
		}),
	})
})
