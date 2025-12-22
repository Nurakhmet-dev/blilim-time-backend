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
export class DeactivateAccountInput {
	@Field(() => String)
	@IsOptional()
	@IsEmail({}, { message: 'Неверный формат email' })
	public email: string

	@Field(() => String)
	@IsString({ message: 'Пароль должен быть строкой' })
	@MinLength(8, { message: 'Минимальная длина пароля — 8 символов' })
	@IsNotEmpty({ message: 'Заполните поле "Пароль"' })
	public password: string

    @Field(() => String, { nullable: true })
	@IsOptional()
	@IsString({ message: 'Пин-код должен быть строкой' })
	@Length(6, 6, { message: 'Пин-код должен содержать 6 символов' })
	public pin?: string | null
}
