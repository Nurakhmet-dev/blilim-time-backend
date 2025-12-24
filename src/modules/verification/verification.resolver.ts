import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import type { GqlContext } from '@shared/types/graphql-context.types'

import { VerificationInput } from './inputs/verivication.input'
import { VerificationService } from './verification.service'

@Resolver('Verification')
export class VerificationResolver {
	constructor(private readonly verificationService: VerificationService) {}

	@Mutation(() => Boolean, { name: 'verifyAccount' })
	public async verify(
		@Context() { req }: GqlContext,
		@Args('data') input: VerificationInput
	) {
		return this.verificationService.verify(req, input)
	}
}
