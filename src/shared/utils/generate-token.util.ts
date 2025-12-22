import { v4 as uuidv4 } from 'uuid'

import type { TokenType, User } from '@core/generated/client'
import type { PrismaService } from '@core/prisma/prisma.service'

import { ms } from './ms.ai.config'

export async function generateToken(
	prismaService: PrismaService,
	user: User,
	type: TokenType,
	isUUID: boolean = false
) {
	let token: string

	if (isUUID) {
		token = uuidv4()
	} else {
		token = Math.floor(
			Math.random() * (1000000 - 100000) + 100000
		).toString()
	}

	const expiresIn = new Date(new Date().getTime() + ms('5m')).toString()
	const existingToken = await prismaService.token.findFirst({
		where: {
			type,
			user: {
				id: user.id
			}
		}
	})

	if (existingToken)
		await prismaService.token.delete({
			where: {
				id: existingToken.id
			}
		})

	const newToken = await prismaService.token.create({
		data: {
			token,
			type,
			expiresIn,
			user: {
				connect: {
					id: user.id
				}
			}
		},
		include: {
			user: true
		}
	})
	return newToken
}
