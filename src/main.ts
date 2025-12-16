import cookieParser from 'cookie-parser'
import session from 'express-session'

import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { getCorsConfig } from './core/config/cors.config'
import { getSessionConfig } from './core/config/session.config'
import { CoreModule } from './core/core.module'
import { RedisService } from './core/redis/redis.service'

async function start(): Promise<void> {
	try {
		const app = await NestFactory.create(CoreModule)
		const config = app.get(ConfigService)
		const redis = app.get(RedisService)
		const port = config.getOrThrow<number>('APP_PORT') ?? 4000

		// App configs
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
