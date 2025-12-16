import { verify } from 'argon2'
import { Request } from 'express'

import { PrismaService } from '@core/prisma/prisma.service'
import { RedisService } from '@core/redis/redis.service'
import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { getSessionMetadata } from '@shared/utils/session-metadata.util'

import { LoginInput } from './inputs/login.input'
import { SessionModel } from './models/session.model'

@Injectable()
export class SessionService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly config: ConfigService,
		private readonly redis: RedisService
	) {}

	public async findByUser(req: Request) {
		const userId = req.session.userId
		if (!userId)
			throw new NotFoundException('Пользватель не обнаружен в сессии')

		const keys = (await this.redis.keys('*')) || []

		const userSessions: SessionModel[] = []

		for (const key of keys) {
			const sessionData = await this.redis.get(key)
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

	public async findCurrent(req: Request) {
		const sessionId = req.session.id

		const sessionData = await this.redis.get(
			`${this.config.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`
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

	public async login(req: Request, input: LoginInput) {
		const { email, password } = input

		const user = await this.prisma.user.findFirst({
			where: {
				OR: [{ name: { equals: email } }, { email: { equals: email } }]
			}
		})
		if (!user) throw new NotFoundException('Пользватель не найден')

		const isValidPassword = await verify(user.password, password)
		if (!isValidPassword)
			throw new UnauthorizedException('Неверный почта или пароль')

		const metadata = getSessionMetadata(req)

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
	public async logout(req: Request) {
		return new Promise((resolve, regect) => {
			req.session.destroy(error => {
				if (error)
					return regect(
						new InternalServerErrorException(
							'Не удалось завершить сессию'
						)
					)
				req.res?.clearCookie(
					this.config.getOrThrow<string>('SESSION_NAME')
				)
				resolve(true)
			})
		})
	}

	public async clearSession(req: Request) {
		req.res?.clearCookie(this.config.getOrThrow<string>('SESSION_NAME'))
		return true
	}
	public async removeSession(req: Request, id: string) {
		if (req.session.id === id)
			throw new ConflictException('Текущую сессию удалить нельзя')

		await this.redis.del(
			`${this.config.getOrThrow<string>('SESSION_FOLDER')}${id}`
		)
		return true
	}
}
