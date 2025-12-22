import type { Request } from 'express'

import { User } from '@core/generated/client'
import { TokenType } from '@core/generated/enums'
import { PrismaService } from '@core/prisma/prisma.service'
import { SessionService } from '@modules/account/session/session.service'
import { MailService } from '@modules/libs/mail/mail.service'
import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { generateToken } from '@shared/utils/generate-token.util'

import { VerificationInput } from './inputs/verivication.input'

@Injectable()
export class VerificationService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly sessionService: SessionService
	) {}

	public async verify(req: Request, input: VerificationInput) {
		const { token } = input
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.EMAIL_VERIFY
			}
		})

		if (!existingToken) throw new NotFoundException('Токен не найден')

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) throw new BadRequestException('Токен истёк')

		const user = await this.prismaService.user.update({
			where: {
				id: existingToken.userId
			},
			data: {
				isEmailVerified: true
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.EMAIL_VERIFY
			}
		})

		await this.sessionService.save(req, user)
		return true
	}

	public async sendVerificationToken(user: User) {
		const verificationToken = await generateToken(
			this.prismaService,
			user,
			TokenType.EMAIL_VERIFY,
			true
		)

		await this.mailService.sendVerificationToken(
			user.email,
			verificationToken.token
		)

		return true
	}
}
