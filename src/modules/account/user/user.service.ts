import { hash } from 'argon2'

import { User } from '@core/generated/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

import { CreateUserInput } from './inputs/create-user.input'

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(input: CreateUserInput) {
		const { password, ...rest } = input

		const user = await this.prismaService.user.create({
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

	public async findAll(): Promise<User[]> {
		const users = await this.prismaService.user.findMany()
		return users
	}

	//  update(id: number, input: UpdateUserInput) {
	//    return `This action updates a #${id} user`;
	//  }

	//  remove(id: number) {
	//    return `This action removes a #${id} user`;
	//  }
}
