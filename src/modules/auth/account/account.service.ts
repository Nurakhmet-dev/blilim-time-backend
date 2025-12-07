import { hash } from 'argon2'
import { PrismaService } from 'src/core/prisma/prisma.service'

import { ConflictException, Injectable } from '@nestjs/common'

import { CreateUserInput } from './inputs/create-user.input'

@Injectable()
export class AccountService {
	constructor(private readonly prisma: PrismaService) {}

	public async findAll() {
		const users = await this.prisma.user.findMany()
		return users
	}

	async create(input: CreateUserInput) {
		const { name, password: password, email, phone } = input

		const isUserPhoneExists = await this.prisma.user.findUnique({
			where: { phone }
		})
		if (isUserPhoneExists)
			throw new ConflictException('Этот номер уже зарегистрирован')

		const isUserEmailExists = await this.prisma.user.findUnique({
			where: { email }
		})
		if (isUserEmailExists)
			throw new ConflictException('Этот почта зарегистрирован')

		await this.prisma.user.create({
			data: {
				name: name,
				password: await hash(password),
				email: email,
				phone: phone
			}
		})

		return true
	}
}
