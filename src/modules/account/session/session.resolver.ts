import { ConfigService } from '@nestjs/config'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Authorization } from '@shared/decorators'
import type { GqlContext } from '@shared/types/graphql-context.types'

import { SessionModel } from './models/session.model'
import { SessionService } from './session.service'

@Resolver('Session')
export class SessionResolver {
	public constructor(
		private readonly sessionService: SessionService,
		private readonly configService: ConfigService
	) {}

	@Authorization()
	@Query(() => [SessionModel], { name: 'findSessionsByUser' })
	public findByUser(@Context() { req }: GqlContext) {
		return this.sessionService.findByUser(req)
	}

	@Authorization()
	@Query(() => SessionModel, { name: 'findCurrentSession' })
	public findCurrent(@Context() { req }: GqlContext) {
		return this.sessionService.findCurrent(req, this.configService)
	}

	@Mutation(() => Boolean, { name: 'clearSession' })
	public clearSession(@Context() { req }: GqlContext) {
		return this.sessionService.clearSession(req, this.configService)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeSession' })
	public removeSession(
		@Context() { req }: GqlContext,
		@Args('id') id: string
	) {
		return this.sessionService.removeSession(req, id, this.configService)
	}
}
