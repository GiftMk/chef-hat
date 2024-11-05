import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
	schema: 'http://localhost:4000/graphql',
	documents: ['src/lib/graphql/**/*.ts'],
	generates: {
		'./src/lib/graphql/generated/': {
			preset: 'client',
			config: {
				useTypeImports: true,
			},
		},
	},
}
export default config