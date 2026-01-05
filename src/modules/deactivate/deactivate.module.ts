import { SessionModule } from '@modules/session/session.module'
import { Module } from '@nestjs/common'

import { DeactivateResolver } from './deactivate.resolver'
import { DeactivateService } from './deactivate.service'

@Module({
	imports: [SessionModule],
	providers: [DeactivateResolver, DeactivateService]
})
export class DeactivateModule {}
