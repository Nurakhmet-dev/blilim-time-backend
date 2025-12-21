import { verify } from 'argon2'
import { Request } from 'express'

import { User } from '@core/generated/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { SessionService } from '@modules/session/session.service'
import { CreateUserInput } from '@modules/user/inputs/create-user.input'
import { UserService } from '@modules/user/user.service'
import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'

import { LoginInput } from './inputs/login.input'

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UserService,
		private readonly sessionService: SessionService
	) {}

	private async checkUserExistence(
		createUserInput: CreateUserInput
	): Promise<void> {
		const isUserPhoneExists = await this.prismaService.user.findUnique({
			where: { phone: createUserInput.phone }
		})
		if (isUserPhoneExists)
			throw new ConflictException('Этот номер уже зарегистрирован')

		const isUserEmailExists = await this.prismaService.user.findUnique({
			where: { email: createUserInput.email }
		})
		if (isUserEmailExists)
			throw new ConflictException('Этот почта зарегистрирован')
	}

	public async register(createUserInput: CreateUserInput) {
		this.checkUserExistence(createUserInput)
		this.userService.create(createUserInput)
	}

	private async validateLoginInput(loginInput: LoginInput): Promise<User> {
		const user = await this.prismaService.user.findFirst({
			where: {
				OR: [
					{ name: { equals: loginInput.email } },
					{ email: { equals: loginInput.email } }
				]
			}
		})
		if (!user) throw new NotFoundException('Пользватель не найден')

		const isValidPassword = await verify(user.password, loginInput.password)
		if (!isValidPassword)
			throw new UnauthorizedException('Неверный почта или пароль')

		return user
	}

	public async login(req: Request, loginInput: LoginInput) {
		const user: User = await this.validateLoginInput(loginInput)
		return await this.sessionService.save(req, user)
	}

	public async logout(req: Request) {
		return await this.sessionService.destroy(req)
	}
}
