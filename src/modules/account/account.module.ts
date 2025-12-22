import { AuthModule } from '@modules/account/auth/auth.module'
import { SessionModule } from '@modules/account/session/session.module'
import { UserModule } from '@modules/account/user/user.module'
import { MailModule } from '@modules/libs/mail/mail.module'
import { Module } from '@nestjs/common'

import { DeactivateModule } from './deactivate/deactivate.module'
import { PasswordRecoveryModule } from './password-recovery/password-recovery.module'
import { TotpModule } from './totp/totp.module'
import { VerificationModule } from './verification/verification.module'

@Module({
	imports: [
		UserModule,
		MailModule,
		SessionModule,
		AuthModule,
		VerificationModule,
		PasswordRecoveryModule,
		TotpModule,
		DeactivateModule
	],
	exports: [UserModule]
})
export class AccountModule {}
