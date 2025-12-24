import { IsNotEmpty, IsString, MinLength, Validate } from 'class-validator'

import { IsPasswordisMatchingConstraint } from '@core/decorators/is-password-matching-constraint.decorator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdatePasswordInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	public oldPassword: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	public newPassword: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@Validate(IsPasswordisMatchingConstraint)
	public newPasswordRepeat: string
}
