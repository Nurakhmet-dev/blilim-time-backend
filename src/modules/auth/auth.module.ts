import { SessionModule } from '@modules/session/session.module'
import { UserModule } from '@modules/user/user.module'
import { VerificationModule } from '@modules/verification/verification.module'
import { Module } from '@nestjs/common'

import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'

@Module({
	imports: [UserModule, SessionModule, VerificationModule],
	providers: [AuthResolver, AuthService]
})
export class AuthModule {}
