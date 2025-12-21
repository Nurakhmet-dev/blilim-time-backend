import { Module } from '@nestjs/common'

import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { UserModule } from '@modules/user/user.module'
import { SessionModule } from '@modules/session/session.module'

@Module({
    imports:[UserModule,SessionModule],
	providers: [AuthResolver, AuthService]
})
export class AuthModule {}
