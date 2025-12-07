import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import type { GqlContext } from '@shared/types/graphql-context.types'

import { UserModel } from '../account/models/user.model'

import { LoginInput } from './inputs/login.input'
import { SessionService } from './session.service'

@Resolver('Session')
export class SessionResolver {
	public constructor(private readonly sessionService: SessionService) {}

	@Mutation(() => UserModel, { name: 'login' })
	public login(
		@Context() { req }: GqlContext,
		@Args('data') input: LoginInput
	) {
		return this.sessionService.login(req, input)
	}

	@Mutation(() => Boolean, { name: 'logout' })
	public logout(@Context() { req }: GqlContext) {
		return this.sessionService.logout(req)
	}
}
