import { Request } from 'express'
import * as geo from 'geoip-lite'
import * as useragent from 'user-agent'

import type {
	DeviceInfo,
	SessionMetadata
} from '@shared/types/session-metadata.types'

import { IS_DEV_NODE } from './is-dev.utils'

const extractOS = (userAgent: string): string => {
	const osPatterns = [
		{ regex: /Windows NT (\d+\.\d+)/, name: 'Windows' },
		{ regex: /Mac OS X (\d+_\d+)/, name: 'Mac OS' },
		{ regex: /Android (\d+\.\d+)/, name: 'Android' },
		{ regex: /iPhone OS (\d+_\d+)/, name: 'iOS' },
		{ regex: /Linux/, name: 'Linux' }
	]

	for (const pattern of osPatterns) {
		const match = userAgent.match(pattern.regex)
		if (match) {
			return `${pattern.name} ${match[1] || ''}`.trim()
		}
	}

	return 'Unknown OS' // Если не удалось распарсить ОС, возвращаем "Неизвестная ОС"
}

const detectDeviceType = (userAgent: string): string => {
	const mobileDevices = /Mobile|Android|iPhone|iPad|Windows Phone/
	const tabletDevices = /iPad|Tablet|Playbook|Kindle/
	const desktopDevices = /Windows|Mac|Linux|X11/

	if (mobileDevices.test(userAgent)) {
		return 'Phone' // Определяем как телефон
	}
	if (tabletDevices.test(userAgent)) {
		return 'Tablet' // Определяем как планшет
	}
	if (desktopDevices.test(userAgent)) {
		return 'Desktop' // Определяем как ПК
	}

	return 'Unknown Device' // Если не удалось определить, возвращаем "Неизвестное устройство"
}

export const getSessionMetadata = (
	req: Request
	// userAgent: string
): SessionMetadata => {
	const ip = IS_DEV_NODE ? '207.97.227.239' : req.ip
	const location = geo.lookup(ip)

	console.log('log from getSessionMetadata\n', 'location:', location)

	if (!ip)
		console.error('log from getSessionMetadata\n', 'error: ip not found')

	const userAgent = useragent.parse(req.headers['user-agent'])

	console.log('log from getSessionMetadata\n', 'User agent:', userAgent)

	const os = userAgent.os || extractOS(userAgent.full)
	const deviceType = detectDeviceType(userAgent.full)

	const metadata = {
		location: {
			country: location.country || 'Unknown - country',
			city: location.city || 'Unknown - city',
			latidute: location.ll[0] || 0,
			longitude: location.ll[1] || 0
		},
		device: {
			browser: userAgent.name || 'Unknown - browser',
			os: os,
			type: deviceType
		},
		ip: ip
	} as SessionMetadata

	return metadata
}
