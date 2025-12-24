import { Authorization } from '@core/decorators/auth.decorator'
import { Authorized } from '@core/decorators/authorized.decorator'
import type { User } from '@core/generated/client'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import type { GqlContext } from '@shared/types/graphql-context.types'

import { AuthModel } from '../../auth/models/auth.model'

import { DeactivateService } from './deactivate.service'
import { DeactivateAccountInput } from './inputs/deactivate-account.input'

@Resolver('Deactivate')
export class DeactivateResolver {
	public constructor(private readonly deactivateService: DeactivateService) {}

	@Authorization()
	@Mutation(() => AuthModel, { name: 'deactivateAccount' })
	public async deactivate(
		@Authorized() user: User,
		@Context() { req }: GqlContext,
		@Args('data') input: DeactivateAccountInput
	) {
		return await this.deactivateService.deactivate(req, user, input)
	}
}
