import { Module } from '@nestjs/common'
import { DeactivateModule } from './deactivate/deactivate.module';
import { SessionModule } from './session/session.module';
import { TotpModule } from './totp/totp.module';

@Module({
    imports: [
        DeactivateModule,
        SessionModule,
        TotpModule,
    ]
})
export class SecureModule {}
