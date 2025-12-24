import { PrismaService } from '@core/providers/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import {
	CanActivate,
	ExecutionContext,
	UnauthorizedException
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class GqlAuthGuard implements CanActivate {
	constructor(private readonly prismaService: PrismaService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const request = ctx.getContext().req

		// Check if the session contains userId
		if (!request.session.userId) {
			throw new UnauthorizedException('Пользватель не авторизован')
		}

		// Fetch the user from DB using the userId in session
		const user = await this.prismaService.user.findUnique({
			where: {
				id: request.session.userId
			}
		})

		if (!user) {
			throw new UnauthorizedException('Пользватель не найден')
		}

		// Attach user to request object for later use in resolvers
		request.user = user

		return true
	}
}
