import { CreateUserInput } from '@modules/account/user/inputs/create-user.input'
import { ConfigService } from '@nestjs/config'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import type { GqlContext } from '@shared/types/graphql-context.types'

import { AuthService } from './auth.service'
import { LoginInput } from './inputs/login.input'
import { AuthModel } from './models/auth.model'

@Resolver('Auth')
export class AuthResolver {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService
	) {}

	@Mutation(() => Boolean, { name: 'register' })
	public register(@Args('data') input: CreateUserInput) {
		return this.authService.register(input)
	}

	@Mutation(() => AuthModel, { name: 'login' })
	public async login(
		@Context() { req }: GqlContext,
		@Args('data') input: LoginInput
	) {
		return await this.authService.login(req, input)
	}

	@Mutation(() => Boolean, { name: 'logout' })
	public async logout(@Context() { req }: GqlContext) {
		return await this.authService.logout(req, this.configService)
	}
}
