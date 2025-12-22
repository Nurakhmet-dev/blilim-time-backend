import type { Request } from 'express'

import { User } from '@core/generated/client'
import { RedisService } from '@core/redis/redis.service'
import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { getMetadata } from '@shared/utils/session-metadata.util'

import { SessionModel } from './models/session.model'

@Injectable()
export class SessionService {
	constructor(private readonly redisService: RedisService) {}

	public async findByUser(req: Request) {
		const userId = req.session.userId
		if (!userId)
			throw new NotFoundException('Пользватель не обнаружен в сессии')

		const keys = (await this.redisService.keys('*')) || []

		const userSessions: SessionModel[] = []

		for (const key of keys) {
			const sessionData = await this.redisService.get(key)
			if (sessionData) {
				const session = JSON.parse(sessionData)
				if (session.userId === userId) {
					// Corrected push logic in session.service.ts
					userSessions.push({
						...session,
						id: key.split(':')[1],
						sessionMetadata: session.metadata // Correctly map 'metadata' from Redis to 'sessionMetadata' in SessionModel
					})
					// userSessions.push({ ...session, id: key.split(':')[1] })
				}
			}
		}
		userSessions.sort((a, b) => {
			if (
				typeof b.createdAt === 'number' &&
				typeof a.createdAt === 'number'
			) {
				return b.createdAt - a.createdAt
			}
			return 0 // Если createdAt не число, не изменяем порядок
		})
		return userSessions.filter(session => session.id !== req.session.id)
	}

	public async findCurrent(req: Request, configService: ConfigService) {
		const sessionId = req.session.id

		const sessionData = await this.redisService.get(
			`${configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`
		)

		if (!sessionData) {
			throw new NotFoundException('Сессия не найдена')
		}
		const session = JSON.parse(sessionData)

		return {
			id: sessionId,
			userId: session.userId,
			createdAt: session.createdAt,
			sessionMetadata: session.metadata
		}
	}

	public async save(req: Request, user: User): Promise<User> {
		const metadata = getMetadata(req)

		return new Promise((resolve, regect) => {
			req.session.createdAt = new Date()
			req.session.userId = user.id
			req.session.metadata = metadata

			req.session.save(error => {
				if (error)
					return regect(
						new InternalServerErrorException(
							'Не удалось сохранить сессию'
						)
					)
				resolve(user)
			})
		})
	}

	public async destroy(req: Request, configService: ConfigService) {
		return new Promise((resolve, reject) => {
			req.session.destroy(error => {
				if (error)
					return reject(
						new InternalServerErrorException(
							'Не удалось завершить сессию'
						)
					)
				req.res?.clearCookie(
					configService.getOrThrow<string>('SESSION_NAME')
				)
				resolve(true)
			})
		})
	}

	public async clearSession(req: Request, configService: ConfigService) {
		req.res?.clearCookie(configService.getOrThrow<string>('SESSION_NAME'))
		return true
	}

	public async removeSession(
		req: Request,
		id: string,
		configService: ConfigService
	) {
		if (req.session.id === id)
			throw new ConflictException('Текущую сессию удалить нельзя')

		await this.redisService.del(
			`${configService.getOrThrow<string>('SESSION_FOLDER')}${id}`
		)
		return true
	}
}
