/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import Redis, { RedisOptions } from 'ioredis'

import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RedisService extends Redis {
	constructor(private readonly configService: ConfigService) {
		const redisOptions: RedisOptions = {
			port: configService.getOrThrow<number>('REDIS_PORT'),
			host: configService.getOrThrow<string>('REDIS_HOST'),
			password: configService.getOrThrow<string>('REDIS_PASSWORD')
		}

		if (!redisOptions.port || !redisOptions.host || !redisOptions.password)
			throw new Error('Missing required Redis configuration')

		super(redisOptions)
		this.on('error', err => {
			throw new Error(`Redis connect Error: ${err}`)
		})
	}

	private isExpirationObject(
		obj: any
	): obj is { expiration: { type: string; value: number } } {
		return (
			obj &&
			typeof obj === 'object' &&
			obj.expiration &&
			typeof obj.expiration.type === 'string' &&
			typeof obj.expiration.value === 'number'
		)
	}

	public set(...args: any[]): Promise<any> {
		const [key, value, options] = args

		// Проверка и преобразование объекта опций TTL от connect-redis
		if (this.isExpirationObject(options)) {
			const { type, value: expirationValue } = options.expiration

			// Формируем плоский массив аргументов для ioredis
			const newArgs = [key, value, type, expirationValue]

			// Используем .apply() для передачи динамического массива аргументов
			return super.set.apply(this, newArgs)
		}

		// Если это не объект опций TTL, вызываем оригинальный метод как есть
		// Используем .apply() для безопасной передачи ...args
		return super.set.apply(this, args)
	}
}
