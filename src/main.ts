import cookieParser from 'cookie-parser'
import session from 'express-session'
import { GraphQLUpload, graphqlUploadExpress } from 'graphql-upload-ts'

import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { getCorsConfig } from './core/config/cors.config'
import { getSessionConfig } from './core/config/session.config'
import { RedisService } from './core/providers/redis/redis.service'

async function start(): Promise<void> {
	try {
		const app = await NestFactory.create(AppModule)
		const config = app.get(ConfigService)
		const redis = app.get(RedisService)
		const port = config.getOrThrow<number>('APP_PORT') ?? 4000

		// App configs
		app.use('/graphql', graphqlUploadExpress())
		app.use(cookieParser(config.getOrThrow<string>('COOKIE_SECRET')))
		app.use(session(getSessionConfig(config, redis)))
		app.useGlobalPipes(new ValidationPipe({ transform: true }))
		app.enableCors(getCorsConfig(config))

		await app.listen(port)
	} catch (error) {
		console.error(error)
	}
}

void start()
