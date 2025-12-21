import { Role } from 'src/core/generated/enums'

import type { User } from '@core/generated/client'
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

registerEnumType(Role, {
	name: 'Role',
	description: 'The role of the user'
})

@ObjectType()
export class UserModel implements User {
	@Field(() => String)
	id: string

	@Field(() => String)
	name: string

	@Field(() => String, {
		name: 'avatar',
		description: 'Url to image avatar',
		nullable: true
	})
	avatarUrl: string

	@Field(() => String, {
		name: 'phone'
	})
	phone: string

	@Field(() => String)
	email: string

	@Field(() => String)
	password: string

	@Field(() => Role)
	role: Role

	@Field(() => String, { nullable: true })
	groupId: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
