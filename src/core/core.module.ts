import { IS_DEV_NODE } from 'src/shared/utils/is-dev.utils'

import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { getGraphQLConfig } from './config/graphql.config'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'
import { AccountModule } from 'src/modules/auth/account/account.module'

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
