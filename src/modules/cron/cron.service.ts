import { PrismaService } from '@core/prisma/prisma.service'
import { MailService } from '@modules/libs/mail/mail.service'
import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

@Injectable()
export class CronService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	@Cron('0 0 * * * ') // every day at midnight
	public async deleteDeactivatedAccounts() {
		const sevenDaysAgo = new Date()
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

		const deactivatedUsers = await this.prismaService.user.findMany({
			where: {
				isDeactivated: true,
				deactivateAt: {
					lte: sevenDaysAgo
				}
			}
		})

		for (const user of deactivatedUsers) {
			await this.mailService.sendAccountDeletion(user.email)
		}

		await this.prismaService.user.deleteMany({
			where: {
				isDeactivated: true,
				deactivateAt: {
					lte: sevenDaysAgo
				}
			}
		})
	}
}
