import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	Matches,
	MinLength
} from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateUserInput {
	@Field(() => String)
	@IsNotEmpty({ message: 'Заполните поле "Имя"' })
	@IsString({ message: 'Имя должно быть строкой' })
	@Length(2, 25, { message: 'Длина имени должна быть от 2 до 25 символов' })
	@Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
	public name: string

	@Field(() => String)
	@IsOptional()
	@IsEmail({}, { message: 'Неверный формат email' })
	public email: string

	@Field(() => String)
	@IsString({ message: 'Телефон должен быть строкой' })
	@IsNotEmpty({ message: 'Заполните поле "Телефон"' })
	@Matches(/^[+0-9\s()-]*$/, {
		message: 'Неверный формат номера телефона'
	})
	public phone: string

	@Field(() => String)
	@IsString({ message: 'Пароль должен быть строкой' })
	@MinLength(8, { message: 'Минимальная длина пароля — 8 символов' })
	@IsNotEmpty({ message: 'Заполните поле "Пароль"' })
	public password: string
}
