import { hash, verify } from 'argon2'

import type { User } from '@core/generated/client'
import { PrismaService } from '@core/providers/prisma/prisma.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import type { CreateUserInput } from './inputs/create-user.input'
import type { UpdateEmailInput } from './inputs/update-email.input'
import type { UpdatePasswordInput } from './inputs/update-password.input'

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	/**
	 * CRUD
	 * C - Create
	 * R - Read
	 * U - Update
	 * D - Delete
	 */

	async create(input: CreateUserInput) {
		const { password, ...rest } = input

		const user: User = await this.prismaService.user.create({
			data: {
				password: await hash(password),
				...rest
			}
		})

		return user
	}

	public async findById(id: string) {
		return await this.prismaService.user.findUnique({ where: { id } })
	}
	// Updates
	public async updateEmail(user: User, input: UpdateEmailInput) {
		const { email } = input

		await this.prismaService.user.update({
			where: { id: user.id },
			data: {
				email
				//isEmailVerified: false
			}
		})

		return true
	}

	private validateOldPassword(user: User, oldPassword: string) {
		const isValidPassword = verify(user.password, oldPassword)
		if (!isValidPassword)
			throw new UnauthorizedException('Неверный старый пароль')
		return true
	}

	public updatePassword(user: User, input: UpdatePasswordInput) {
		const { oldPassword, newPassword } = input
		this.validateOldPassword(user, oldPassword)

		this.prismaService.user.update({
			where: { id: user.id },
			data: { password: hash(newPassword).toString() }
		})

		return true
	}

	public remove(id: number) {
		return `This action removes a #${id} user`
	}
}
