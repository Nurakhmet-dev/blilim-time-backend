import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Authorization, Authorized } from '@shared/decorators'

import { AccountService } from './account.service'
import { CreateUserInput } from './inputs/create-user.input'
import { UserModel } from './models/user.model'

@Resolver('Account')
export class AccountResolver {
	constructor(private readonly accountService: AccountService) {}

	@Authorization()
	@Query(() => UserModel, { name: 'findProfile' })
	public async me(@Authorized('id') id: string) {
		return this.accountService.me(id)
	}

	@Mutation(() => Boolean, { name: 'createUser' })
	public create(@Args('data') input: CreateUserInput) {
		return this.accountService.create(input)
	}
}
