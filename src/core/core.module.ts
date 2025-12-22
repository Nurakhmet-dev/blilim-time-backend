import { getGraphQLConfig } from '@core/config/graphql.config'
import { PrismaModule } from '@core/prisma/prisma.module'

import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { IS_DEV_NODE } from '@utils/is-dev.utils'

import { RedisModule } from './redis/redis.module'
import { AccountModule } from '@modules/account/account.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_NODE,
			isGlobal: true
		}),

		GraphQLModule.forRootAsync({
			imports: [ConfigModule],
			driver: ApolloDriver,
			useFactory: getGraphQLConfig,
			inject: [ConfigService]
		}),

		PrismaModule,
		RedisModule,
		AccountModule
	]
})
export class CoreModule {}
