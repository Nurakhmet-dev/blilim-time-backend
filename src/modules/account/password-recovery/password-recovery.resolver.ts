import { ResetPasswordInput } from '@modules/account/password-recovery/inputs/reset-password.input'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import type { GqlContext } from '@shared/types'

import { NewPasswordInput } from './inputs/new-password.input'
import { PasswordRecoveryService } from './password-recovery.service'

@Resolver('PasswordRecovery')
export class PasswordRecoveryResolver {
	constructor(
		private readonly passwordRecoveryService: PasswordRecoveryService
	) {}
	@Mutation(() => Boolean, { name: 'resetPassword' })
	public async resetPassword(
		@Context() { req }: GqlContext,
		@Args('data') resetPasswordInput: ResetPasswordInput
	) {
		return this.passwordRecoveryService.reset(req, resetPasswordInput)
	}

	@Mutation(() => Boolean, { name: 'newPassword' })
	public async newPassword(@Args('data') newPasswordInput: NewPasswordInput) {
		return this.passwordRecoveryService.newPassword(newPasswordInput)
	}
}
