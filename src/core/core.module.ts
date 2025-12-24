import { getGraphQLConfig } from '@core/config/graphql.config'
import { MailModule } from '@core/providers/mail/mail.module'
import { PrismaModule } from '@core/providers/prisma/prisma.module'
import { RedisModule } from '@core/providers/redis/redis.module'
import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { IS_DEV_NODE } from '@utils/is-dev.utils'

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
		MailModule
	]
})
export class CoreModule {}
