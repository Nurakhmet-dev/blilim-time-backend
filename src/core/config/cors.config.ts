import { ConfigService } from '@nestjs/config'

export const getCorsConfig = (config: ConfigService) => ({
	origin: config.getOrThrow<string>('ALLOWED_ORIGIN'), // ALLOWED_ORIGIN="localhost:4000/graphql"
	credentials: true,
	exposedHeaders: ['set-cookie']
})
