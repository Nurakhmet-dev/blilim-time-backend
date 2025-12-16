import { applyDecorators, UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '@shared/guards'

export function Authorization() {
	return applyDecorators(UseGuards(GqlAuthGuard))
}
