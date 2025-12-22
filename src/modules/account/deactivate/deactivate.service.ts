import { verify } from 'argon2'
import type { Request } from 'express'

import type { User } from '@core/generated/client'
import { TokenType } from '@core/generated/enums'
import { PrismaService } from '@core/prisma/prisma.service'
import { MailService } from '@modules/libs/mail/mail.service'
import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { generateToken } from '@shared/utils/generate-token.util'
import { getMetadata } from '@shared/utils/session-metadata.util'

import { SessionService } from '../session/session.service'

import { DeactivateAccountInput } from './inputs/deactivate-account.input'

@Injectable()
export class DeactivateService {
	public constructor(
		private readonly mailService: MailService,
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService,
		private readonly sessionService: SessionService
	) {}

	public async deavtivate(
		req: Request,
		user: User,
		input: DeactivateAccountInput
	) {
		const { email, password, pin } = input

		const isValidPassword = verify(user.password, password)

		if (user.email !== email || !isValidPassword)
			throw new BadRequestException('Неверная почта или пароль')

		if (user.isTotpEnable) {
			if (!pin) {
				await this.sendDeactivateToken(req, user)

				return { message: 'Требуется код подверждения' }
			}
			await this.validateDeactivateToken(req, pin)
		}

		return { user }
	}

	private async validateDeactivateToken(req: Request, token: string) {
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.DEACTIVATE
			}
		})

		if (!existingToken) throw new NotFoundException('Токен не найден')

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) throw new BadRequestException('Токен истёк')

		await this.prismaService.user.update({
			where: {
				id: existingToken.userId
			},
			data: {
				isDeactivated: true,
				deactivateAt: new Date()
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.DEACTIVATE
			}
		})

		await this.sessionService.destroy(req, this.configService)

		return true
	}

	public async sendDeactivateToken(req: Request, user: User) {
		const verificationToken = await generateToken(
			this.prismaService,
			user,
			TokenType.EMAIL_VERIFY
		)

		const metadata = getMetadata(req)

		await this.mailService.sendDeactivateToken(
			user.email,
			verificationToken.token,
			metadata
		)

		return true
	}
}
