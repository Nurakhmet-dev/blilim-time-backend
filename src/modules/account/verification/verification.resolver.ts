import { UserModel } from '@modules/account/user/models/user.model'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import type { GqlContext } from '@shared/types'

import { VerificationInput } from './inputs/verivication.input'
import { VerificationService } from './verification.service'

@Resolver('Verification')
export class VerificationResolver {
	constructor(private readonly verificationService: VerificationService) {}

	@Mutation(() => Boolean, { name: 'verifyAccount' })
	public async verify(
		@Context() { req }: GqlContext,
		@Args('data') verificationInput: VerificationInput
	) {
		return this.verificationService.verify(req, verificationInput)
	}
}
