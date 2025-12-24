import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	MinLength
} from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class LoginInput {
	@Field(() => String)
	@IsNotEmpty({ message: 'Введите email' })
	@IsEmail({}, { message: 'Неверный формат email' })
	public email: string

	@Field(() => String)
	@IsString({ message: 'Пароль должен быть строкой' })
	@IsNotEmpty({ message: 'Заполните поле "Пароль"' })
	@MinLength(8, { message: 'Минимальная длина пароля — 8 символов' })
	public password: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString({ message: 'Пин-код должен быть строкой' })
	@Length(6, 6, { message: 'Пин-код должен содержать 6 символов' })
	public pin?: string | null
}
