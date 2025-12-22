import { hash } from 'argon2'
import type { Request } from 'express'

import { TokenType } from '@core/generated/enums'
import { PrismaService } from '@core/prisma/prisma.service'
import { ResetPasswordInput } from '@modules/account/password-recovery/inputs/reset-password.input'
import { MailService } from '@modules/libs/mail/mail.service'
import {
	BadRequestException,
	Injectable,
	NotAcceptableException,
	NotFoundException
} from '@nestjs/common'
import { generateToken } from '@shared/utils/generate-token.util'
import { getMetadata } from '@shared/utils/session-metadata.util'

import { NewPasswordInput } from './inputs/new-password.input'

@Injectable()
export class PasswordRecoveryService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	public async reset(req: Request, input: ResetPasswordInput) {
		const { email } = input

		const user = await this.prismaService.user.findFirst({
			where: {
				email
			}
		})

		if (!user) throw new NotAcceptableException('Пользователь не найден')
		const resetToken = await generateToken(
			this.prismaService,
			user,
			TokenType.PASSWORD_RESET,
			true
		)

		const metadata = getMetadata(req)

		await this.mailService.sendPasswordResetToken(
			user.email,
			resetToken.token,
			metadata
		)

		return true
	}

	public async newPassword(input: NewPasswordInput) {
		const { password, token } = input
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.PASSWORD_RESET
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
				password: await hash(password)
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.PASSWORD_RESET
			}
		})

		return true
	}
}
