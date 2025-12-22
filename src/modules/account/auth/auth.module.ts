import { SessionModule } from '@modules/account/session/session.module'
import { UserModule } from '@modules/account/user/user.module'
import { VerificationModule } from '@modules/account/verification/verification.module'
import { Module } from '@nestjs/common'

import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'

@Module({
	imports: [UserModule, SessionModule, VerificationModule],
	providers: [AuthResolver, AuthService]
})
export class AuthModule {}
