import { prismaConnectUrl } from 'prisma.config'
import { PrismaClient } from 'src/core/generated/client'

import { Injectable } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'

@Injectable()
export class PrismaService extends PrismaClient {
	constructor() {
		const adapter = new PrismaPg({
			connectionString: prismaConnectUrl
		})
		super({ adapter })
	}
}
