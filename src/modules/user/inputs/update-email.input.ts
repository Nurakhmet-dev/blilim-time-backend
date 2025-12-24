import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateEmailInput {
	@Field(() => String)
	@IsString({ message: 'Email должен быть строкой' })
	@IsNotEmpty({ message: 'Введите email' })
	@IsEmail({}, { message: 'Неверный формат email' })
	public email: string
}
