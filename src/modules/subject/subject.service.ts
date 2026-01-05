import { PrismaService } from '@core/providers/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

import { CreateSubjectInput } from './inputs'

@Injectable()
export class SubjectService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async getAll() {
		return this.prismaService.subject.findMany()
	}

	public async create(input: CreateSubjectInput) {
		const { price, title } = input
		await this.prismaService.subject.create({
			data: {
				title,
				price
				//userId
				//questions,
				//lessons,
				//topics,
			}
		})
		return true
	}
}
