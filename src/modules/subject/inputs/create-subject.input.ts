import { IsNumber, IsString } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'
import { Subject } from '@core/generated/client'

@InputType()
export class CreateSubjectInput implements Partial<Subject> {
	@Field(() => String)
	@IsString()
	title: string

	@Field(() => Number)
	@IsNumber()
	price: number

    //@Field(()=>String,{nullable:true})
    //userId?: string | undefined
}
