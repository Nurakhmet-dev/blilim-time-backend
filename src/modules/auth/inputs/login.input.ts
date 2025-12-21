import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class LoginInput {
	@Field(() => String)
	@IsOptional()
	@IsEmail({}, { message: 'Неверный формат email' })
	public email: string

	@Field(() => String)
	@IsString({ message: 'Пароль должен быть строкой' })
	@MinLength(8, { message: 'Минимальная длина пароля — 8 символов' })
	@IsNotEmpty({ message: 'Заполните поле "Пароль"' })
	public password: string
}
