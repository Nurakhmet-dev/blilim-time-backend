import { verify } from 'argon2'
import type { Request } from 'express'
import { TOTP } from 'otpauth'

import { PrismaService } from '@core/prisma/prisma.service'
import { SessionService } from '@modules/account/session/session.service'
import { CreateUserInput } from '@modules/account/user/inputs/create-user.input'
import { UserService } from '@modules/account/user/user.service'
import { VerificationService } from '@modules/account/verification/verification.service'
import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { LoginInput } from './inputs/login.input'

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UserService,
		private readonly sessionService: SessionService,
		private readonly verificationService: VerificationService
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
}
