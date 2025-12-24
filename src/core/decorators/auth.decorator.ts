import { applyDecorators, UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '@core/guards'

export function Authorization() {
	return applyDecorators(UseGuards(GqlAuthGuard))
}
