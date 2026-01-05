import { Authorization } from '@core/decorators/auth.decorator'
import { Authorized } from '@core/decorators/authorized.decorator'
import type { User } from '@core/generated/client'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { UpdateEmailInput } from './inputs/update-email.input'
import { UpdatePasswordInput } from './inputs/update-password.input'
import { UploadFileInput } from './inputs/upload-file.input'
import { UserService } from './user.service'

@Resolver('User')
export class UserResolver {
	public constructor(private readonly userService: UserService) {}

	@Authorization()
	@Mutation(() => Boolean, { name: 'updateEmail' })
	public async updateEmail(
		@Authorized() user: User,
		@Args('data') input: UpdateEmailInput
	) {
		return this.userService.updateEmail(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'updatePassword' })
	public async updatePassword(
		@Authorized() user: User,
		@Args('data') input: UpdatePasswordInput
	) {
		return this.userService.updatePassword(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'updateAvatar' })
	public async updateAvatar(
		@Authorized() user: User,
		@Args('data') input: UploadFileInput
	) {
		return this.userService.updateAvatar(user, input)
	}
}
