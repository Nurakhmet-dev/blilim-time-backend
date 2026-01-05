import { type FileUpload, GraphQLUpload } from 'graphql-upload-ts'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UploadFileInput {
	@Field(() => GraphQLUpload)
	file: FileUpload
}
