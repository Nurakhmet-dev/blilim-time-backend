import { hash, verify } from 'argon2'
import type { Request } from 'express'
import { TOTP } from 'otpauth'

import { TokenType } from '@core/generated/enums'
import { MailService } from '@core/providers/mail/mail.service'
import { PrismaService } from '@core/providers/prisma/prisma.service'
import { SessionService } from '@modules/secure/session/session.service'
import { CreateUserInput } from '@modules/user/inputs/create-user.input'
import { UserService } from '@modules/user/user.service'
import { VerificationService } from '@modules/verification/verification.service'
import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotAcceptableException,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { LoginInput } from './inputs/login.input'
import { NewPasswordInput } from './inputs/new-password.input'
import { ResetPasswordInput } from './inputs/reset-password.input'
import { getMetadata } from '@shared/utils/session-metadata.util'
import { generateToken } from '@shared/utils/generate-token.util'

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UserService,
		private readonly sessionService: SessionService,
		private readonly verificationService: VerificationService,
		private readonly mailService: MailService
	) {}

	// authentification
	public async register(input: CreateUserInput) {
		const isUserPhoneExists = await this.prismaService.user.findUnique({
			where: { phone: input.phone }
		})
		if (isUserPhoneExists)
			throw new ConflictException('Этот номер уже зарегистрирован')

		const isUserEmailExists = await this.prismaService.user.findUnique({
			where: { email: input.email }
		})
		if (isUserEmailExists)
			throw new ConflictException('Этот почта зарегистрирован')

		const user = await this.userService.create(input)

		await this.verificationService.sendVerificationToken(user)

		return true
	}

	// authorization
	public async login(req: Request, input: LoginInput) {
		const { email, password, pin } = input

		const user = await this.prismaService.user.findFirst({
			where: {
				OR: [{ name: { equals: email } }, { email: { equals: email } }]
			}
		})
		if (!user) throw new NotFoundException('Пользватель не найден')

		const isValidPassword = await verify(user.password, password)
		if (!isValidPassword)
			throw new UnauthorizedException('Неверный почта или пароль')

		if (!user.isEmailVerified) {
			await this.verificationService.sendVerificationToken(user)
			throw new BadRequestException(
				'Аккаунт не верифицирован. Пожалуйста, проверьте свою почту для подтверждения'
			)
		}

		if (user.isTotpEnable) {
			if (!pin) {
				return {
					message: 'Необхадим код для завершения авторизации'
				}
			}

			const totp = new TOTP({
				issuer: 'BilimTime',
				label: `${user.email}`,
				algorithm: 'SHA1',
				digits: 6,
				secret: `${user.totpSecret}`
			})

			const delta = totp.validate({ token: pin })
			if (delta === null) throw new BadRequestException('Неверный код')
		}

		await this.sessionService.save(req, user)

		return { user }
	}

	public async logout(req: Request, configService: ConfigService) {
		return await this.sessionService.destroy(req, configService)
	}

	public async resetPassword(req: Request, input: ResetPasswordInput) {
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
