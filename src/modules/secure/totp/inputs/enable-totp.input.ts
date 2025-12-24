import { IsNotEmpty, IsString, Length } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class EnableTotpInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	secret: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@Length(6, 6)
	pin: string
}
