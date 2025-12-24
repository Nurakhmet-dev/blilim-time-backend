import { IsNotEmpty, IsUUID } from 'class-validator'

import { Token } from '@core/generated/client'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class VerificationInput implements Pick<Token, 'token'> {
	@Field(() => String)
	@IsUUID('4')
	@IsNotEmpty({ message: 'Токен не можеть быть пустим' })
	token: string
}
