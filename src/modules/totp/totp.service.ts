import { randomBytes } from 'crypto'
import { encode } from 'hi-base32'
import { TOTP } from 'otpauth'
import { toDataURL } from 'qrcode'

import { User } from '@core/generated/client'
import { PrismaService } from '@core/providers/prisma/prisma.service'
import { BadRequestException, Injectable } from '@nestjs/common'

import { EnableTotpInput } from './inputs'

@Injectable()
export class TotpService {
	public constructor(private readonly prismaService: PrismaService) {}

	public generate(user: User) {
		const secret = encode(
			randomBytes(15).toString().replace('=', '').substring(0, 24)
		)

		const totp = new TOTP({
			issuer: 'BilimTime',
			label: `${user.email}`,
			algorithm: 'SHA1',
			digits: 6,
			secret
		})

		const otpauthUrl = totp.toString()
		const qrcodeUrl = toDataURL(otpauthUrl)

		return { qrcodeUrl, secret }
	}

	public async enable(user: User, input: EnableTotpInput) {
		const { secret, pin } = input

		const totp = new TOTP({
			issuer: 'BilimTime',
			label: `${user.email}`,
			algorithm: 'SHA1',
			digits: 6,
			secret
		})

		const delta = totp.validate({ token: pin })
		if (delta === null) throw new BadRequestException('Неверный код')

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				isTotpEnable: true,
				totpSecret: secret
			}
		})

		return true
	}

	public async disable(user: User) {
		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				isTotpEnable: false,
				totpSecret: null
			}
		})

		return true
	}
}
