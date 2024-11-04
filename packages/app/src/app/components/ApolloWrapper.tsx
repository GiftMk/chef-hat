'use client'

import {
	ApolloClient,
	ApolloNextAppProvider,
	InMemoryCache,
} from '@apollo/experimental-nextjs-app-support'
import { HttpLink } from '@apollo/client'
import { apiUrl } from '@/lib/graphql/constants'

const makeClient = () => {
	const httpLink = new HttpLink({
		uri: apiUrl,
	})
	return new ApolloClient({
		cache: new InMemoryCache(),
		link: httpLink,
	})
}

export const ApolloWrapper = ({ children }: React.PropsWithChildren) => {
	return (
		<ApolloNextAppProvider makeClient={makeClient}>
			{children}
		</ApolloNextAppProvider>
	)
}
