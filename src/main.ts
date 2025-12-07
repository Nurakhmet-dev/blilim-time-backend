import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { CoreModule } from './core/core.module'

async function bootstrap() {
	const app = await NestFactory.create(CoreModule)
	const config = app.get(ConfigService)
	const port = config.getOrThrow<number>('APP_PORT') ?? 4000
	await app.listen(port)
}
void bootstrap()
