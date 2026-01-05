import { CoreModule } from '@core/core.module'
import { AuthModule } from '@modules/auth/auth.module'
import { CronModule } from '@modules/cron/cron.module'
import { DeactivateModule } from '@modules/deactivate/deactivate.module'
import { SessionModule } from '@modules/session/session.module'
import { TotpModule } from '@modules/totp/totp.module'
import { UserModule } from '@modules/user/user.module'
import { VerificationModule } from '@modules/verification/verification.module'
import { Module } from '@nestjs/common'

import { SubjectModule } from './modules/subject/subject.module'

@Module({
	imports: [
		CoreModule,

		AuthModule,
		UserModule,

		DeactivateModule,
		SessionModule,
		SubjectModule,
		TotpModule,

		CronModule,
		VerificationModule,
		SubjectModule
	]
})
export class AppModule {}
