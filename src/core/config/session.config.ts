import { RedisStore } from 'connect-redis'
import { CookieOptions, SessionOptions } from 'express-session'
import { ms, StringValue } from 'src/shared/utils/ms.ai.config'
import { parseBoolean } from 'src/shared/utils/parse-boolean.util'

import { ConfigService } from '@nestjs/config'

import { RedisService } from '../redis/redis.service'

export const getSessionConfig = (
	config: ConfigService,
	redis: RedisService
): SessionOptions => ({
	secret: config.getOrThrow<string>('SESSION_SECRET'),
	name: config.getOrThrow<string>('SESSION_NAME'),
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
		domain: config.getOrThrow<string>('SESSION_DOMAIN'),
		maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
		httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
		sameSite: 'lax'
	} as CookieOptions,
	store: new RedisStore({
		client: redis,
		prefix: config.getOrThrow<string>('SESSION_FOLDER'),
		ttl: 36000
	})
})
