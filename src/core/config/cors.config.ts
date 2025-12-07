import { ConfigService } from '@nestjs/config'

export const getCorsConfig = (config: ConfigService) => ({
	origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
	credentials: true,
	exposedHeaders: ['set-cookie']
})
