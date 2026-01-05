import { Subject } from '@core/generated/client'
import { UserModel } from '@modules/user/models/user.model'
import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SubjectModel implements Subject {
	@Field(() => ID)
	id: string

	@Field(() => Number)
	price: number

	@Field(() => String)
	title: string

	@Field(() => String)
	userId: string

	@Field(() => UserModel)
	user: UserModel
}
