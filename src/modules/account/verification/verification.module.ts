import { SessionModule } from '@modules/account/session/session.module'
import { Module } from '@nestjs/common'

import { VerificationResolver } from './verification.resolver'
import { VerificationService } from './verification.service'

@Module({
	imports: [SessionModule],
	providers: [VerificationResolver, VerificationService],
	exports: [VerificationService]
})
export class VerificationModule {}
