import { CreateUserInput } from '@modules/user/inputs/create-user.input'
import { UserModel } from '@modules/user/models/user.model'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import type { GqlContext } from '@shared/types'

import { AuthService } from './auth.service'
import { LoginInput } from './inputs/login.input'

@Resolver('Auth')
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation(() => UserModel, { name: 'register' })
	public register(@Args('data') createUserInput: CreateUserInput) {
		return this.authService.register(createUserInput)
	}

	@Mutation(() => UserModel, { name: 'login' })
	public async login(
		@Context() { req }: GqlContext,
		@Args('data') loginInput: LoginInput
	) {
		return await this.authService.login(req, loginInput)
	}

	@Mutation(() => Boolean, { name: 'logout' })
	public async logout(@Context() { req }: GqlContext) {
		return await this.authService.logout(req)
	}
}
