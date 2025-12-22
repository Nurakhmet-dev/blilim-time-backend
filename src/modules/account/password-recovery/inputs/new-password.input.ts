import {
	IsNotEmpty,
	IsString,
	IsUUID,
	MinLength,
	Validate
} from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'
import { IsPasswordisMatchingConstraint } from '@shared/decorators/is-password-matching-constraint.decorator'

@InputType()
export class NewPasswordInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	public password: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@Validate(IsPasswordisMatchingConstraint)
	public passwordRepeat: string

	@Field(() => String)
	@IsUUID('4')
	@IsNotEmpty({ message: 'Токен не можеть быть пустим' })
	token: string
}
