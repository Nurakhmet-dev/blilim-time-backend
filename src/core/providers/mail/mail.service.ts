import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'
import { SessionMetadata } from '@shared/types/session-metadata.types'

import AccountDeactivated from './templates/account-deactivated.template'
import Deactivate from './templates/deactivate.template'
import PasswordRecovery from './templates/password-recovery.template'
import VerificationTemplate from './templates/verification.template'

@Injectable()
export class MailService {
	constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	public async sendAccountDeletion(email: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(AccountDeactivated({ domain }))

		return await this.sendMail(email, 'Аккаунт удалён', html)
	}

	public async sendVerificationToken(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(VerificationTemplate({ domain, token }))

		return await this.sendMail(email, 'Верификация аккаунта', html)
	}

	public async sendPasswordResetToken(
		email: string,
		token: string,
		metadata: SessionMetadata
	) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(PasswordRecovery({ domain, token, metadata }))

		return await this.sendMail(email, 'Сброс пароля', html)
	}

	public async sendDeactivateToken(
		email: string,
		token: string,
		metadata: SessionMetadata
	) {
		const html = await render(Deactivate({ token, metadata }))

		return await this.sendMail(email, 'Деактивация аккаунта', html)
	}

	private async sendMail(email: string, subject: string, html: string) {
		return await this.mailerService.sendMail({
			to: email,
			subject,
			html
		})
	}
}
