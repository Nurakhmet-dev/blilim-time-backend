import Redis, { RedisOptions } from 'ioredis'

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RedisService extends Redis {
	constructor(private readonly configService: ConfigService) {
		const redisOptions: RedisOptions = {
			port: configService.getOrThrow<number>('REDIS_PORT'),
			host: configService.getOrThrow<string>('REDIS_HOST'),
			username: configService.getOrThrow<string>('REDIS_USERNAME'),
			password: configService.getOrThrow<string>('REDIS_PASSWORD')
		}

		if (
			!redisOptions.port ||
			!redisOptions.host ||
			!redisOptions.password
		) {
			throw new Error('Missing required Redis configuration')
		}
		super(redisOptions)
		this.on('error', err => {
			throw new Error(`Redis connect Error: ${err}`)
		})
	}
	private isExpirationObject(
		obj: any
	): obj is { expiration: { type: string; value: number } } {
		// eslint-disable-next-line
		return (
			obj &&
			typeof obj === 'object' &&
			// eslint-disable-next-line
			obj.expiration &&
			// eslint-disable-next-line
			typeof obj.expiration.type === 'string' &&
			// eslint-disable-next-line
			typeof obj.expiration.value === 'number'
		)
	}

	public set(...args: any[]): Promise<any> {
		// eslint-disable-next-line
		const [key, value, options] = args

		// Проверка и преобразование объекта опций TTL от connect-redis
		if (this.isExpirationObject(options)) {
			const { type, value: expirationValue } = options.expiration

			// Формируем плоский массив аргументов для ioredis
			const newArgs = [key, value, type, expirationValue]

			// Используем .apply() для передачи динамического массива аргументов
			// eslint-disable-next-line
			return super.set.apply(this, newArgs)
		}

		// Если это не объект опций TTL, вызываем оригинальный метод как есть
		// Используем .apply() для безопасной передачи ...args
		// eslint-disable-next-line
		return super.set.apply(this, args)
	}
}
