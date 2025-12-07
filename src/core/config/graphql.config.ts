import { join } from 'path'
import { isDev } from 'src/shared/utils/is-dev.utils'

import type { ApolloDriverConfig } from '@nestjs/apollo'
import type { ConfigService } from '@nestjs/config'

export const getGraphQLConfig = (
	config: ConfigService
): ApolloDriverConfig => ({
	playground: isDev(config),
	path: config.getOrThrow<string>('GRAPHQL_PREFIX'),
	autoSchemaFile: join(process.cwd(), 'src/core/graphql/scheme.gql'),
	sortSchema: true,
	context: ({ req, res }: { req: Request; res: Response }) => ({ req, res })
})
