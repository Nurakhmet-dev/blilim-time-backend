import { Query, Resolver } from '@nestjs/graphql'
import { Authorization, Authorized } from '@shared/decorators'

import { UserModel } from './models/user.model'
import { UserService } from './user.service'

@Resolver('User')
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Authorization()
	@Query(() => UserModel, { name: 'findById' })
	public findById(@Authorized('id') id: string) {
		return this.userService.findById(id)
	}

	@Query(() => [UserModel], { name: 'findAll' })
	public findAll() {
		return this.userService.findAll()
	}
}
