import { verify } from 'argon2'
import { Request } from 'express'

import { PrismaService } from '@core/prisma/prisma.service'
import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { LoginInput } from './inputs/login.input'

@Injectable()
export class SessionService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly config: ConfigService
	) {}

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

		return new Promise((resolve, regect) => {
			req.session.createdAt = new Date()
			req.session.userId = user.id

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
}
