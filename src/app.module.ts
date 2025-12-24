import { CoreModule } from '@core/core.module'
import { AuthModule } from '@modules/auth/auth.module'
import { CronModule } from '@modules/cron/cron.module'
import { SecureModule } from '@modules/secure/secure.module'
import { UserModule } from '@modules/user/user.module'
import { VerificationModule } from '@modules/verification/verification.module'
import { Module } from '@nestjs/common'

@Module({
	imports: [
		CoreModule,

		AuthModule,
		UserModule,
		SecureModule,

		CronModule,
		VerificationModule
	]
})
export class AppModule {}
