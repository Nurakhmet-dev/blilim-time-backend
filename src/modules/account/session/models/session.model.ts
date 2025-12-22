import { Field, ID, ObjectType } from '@nestjs/graphql'
import { DeviceInfo, LocationInfo, SessionMetadata } from '@shared/types'

@ObjectType()
export class LocationModel implements LocationInfo {
	@Field(() => String)
	country: string

	@Field(() => String)
	city: string

	@Field(() => Number)
	latidute: number

	@Field(() => Number)
	longitude: number
}

@ObjectType()
export class DeviceModel implements DeviceInfo {
	@Field(() => String)
	browser: string

	@Field(() => String)
	os: string

	@Field(() => String)
	type: string
}

@ObjectType()
export class SessionMetadataModel implements SessionMetadata {
	@Field(() => DeviceModel)
	device: DeviceModel

	@Field(() => LocationModel)
	location: LocationModel

	@Field(() => String)
	ip: string
}

@ObjectType()
export class SessionModel {
	@Field(() => ID)
	id: string

	@Field(() => String)
	userId: string

	@Field(() => String)
	createdAt: string

	@Field(() => SessionMetadataModel)
	sessionMetadata: SessionMetadataModel
}
