import { Role } from 'src/core/generated/enums'

import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

registerEnumType(Role, {
	name: 'Role',
	description: 'The role of the user'
})

@ObjectType()
export class UserModel {
	@Field(() => ID)
	id: string

	@Field(() => String, { nullable: true })
	avatarUrl: string

	@Field(() => String)
	name: string

	@Field(() => String)
	phone: string

	@Field(() => String, { nullable: true })
	email: string

	@Field(() => String)
	password: string

	@Field(() => Role)
	role: Role

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
