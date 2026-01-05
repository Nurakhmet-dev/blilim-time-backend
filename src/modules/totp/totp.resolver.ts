import { Authorization } from '@core/decorators/auth.decorator'
import { Authorized } from '@core/decorators/authorized.decorator'
import type { User } from '@core/generated/client'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { EnableTotpInput } from './inputs'
import { TotpModel } from './models'
import { TotpService } from './totp.service'

@Resolver('Totp')
export class TotpResolver {
	constructor(private readonly totpService: TotpService) {}

	@Authorization()
	@Query(() => TotpModel, { name: 'generateTotpSecret' })
	public async generate(@Authorized() user: User) {
		return this.totpService.generate(user)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'enableTotp' })
	public async enable(
		@Authorized() user: User,
		@Args('data') input: EnableTotpInput
	) {
		return await this.totpService.enable(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'disableTotp' })
	public async disable(@Authorized() user: User) {
		return await this.totpService.disable(user)
	}
}
