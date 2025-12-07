// Конфигурация констант
const TIME_UNITS = {
	year: 1000 * 60 * 60 * 24 * 365.25,
	week: 1000 * 60 * 60 * 24 * 7,
	day: 1000 * 60 * 60 * 24,
	hour: 1000 * 60 * 60,
	minute: 1000 * 60,
	second: 1000,
	millisecond: 1
} as const

// Более строгая типизация
type TimeUnit = keyof typeof TIME_UNITS

type UnitVariant =
	| 'years'
	| 'year'
	| 'yrs'
	| 'yr'
	| 'y'
	| 'weeks'
	| 'week'
	| 'w'
	| 'days'
	| 'day'
	| 'd'
	| 'hours'
	| 'hour'
	| 'hrs'
	| 'hr'
	| 'h'
	| 'minutes'
	| 'minute'
	| 'mins'
	| 'min'
	| 'm'
	| 'seconds'
	| 'second'
	| 'secs'
	| 'sec'
	| 's'
	| 'milliseconds'
	| 'millisecond'
	| 'msecs'
	| 'msec'
	| 'ms'

// Исправлено: убрано Lowercase<UnitVariant> так как UnitVariant уже в lowercase
type UnitAnyCase = UnitVariant | Uppercase<UnitVariant>

export type StringValue =
	| `${number}`
	| `${number}${UnitAnyCase}`
	| `${number} ${UnitAnyCase}`

// Валидация входных данных
const validateInput = (str: unknown): str is string => {
	if (typeof str !== 'string') {
		throw new TypeError('Value provided to ms() must be a string')
	}

	if (str.length === 0 || str.length > 100) {
		throw new Error('String length must be between 1 and 100 characters')
	}

	return true
}

// Нормализация единиц измерения
const normalizeUnit = (unit: string): TimeUnit => {
	/**
	 * // Years
	 * years: 'year',
	 * year: 'year',
	 * yrs: 'year',
	 * yr: 'year',
	 * y: 'year',
	 */
	const unitMap: Record<string, TimeUnit> = {
		// Years
		years: 'year',
		year: 'year',
		yrs: 'year',
		yr: 'year',
		y: 'year',

		// Weeks
		weeks: 'week',
		week: 'week',
		w: 'week',

		// Days
		days: 'day',
		day: 'day',
		d: 'day',

		// Hours
		hours: 'hour',
		hour: 'hour',
		hrs: 'hour',
		hr: 'hour',
		h: 'hour',

		// Minutes
		minutes: 'minute',
		minute: 'minute',
		mins: 'minute',
		min: 'minute',
		m: 'minute',

		// Seconds
		seconds: 'second',
		second: 'second',
		secs: 'second',
		sec: 'second',
		s: 'second',

		// Milliseconds
		milliseconds: 'millisecond',
		millisecond: 'millisecond',
		msecs: 'millisecond',
		msec: 'millisecond',
		ms: 'millisecond'
	}

	const normalized = unitMap[unit.toLowerCase()]
	if (!normalized) {
		throw new Error(
			`Unsupported time unit: "${unit}". Supported units: ${Object.keys(unitMap).join(', ')}`
		)
	}

	return normalized
}

// Парсинг значения
const parseValue = (valueStr: string): number => {
	const value = parseFloat(valueStr)

	if (!Number.isFinite(value)) {
		throw new Error(`Invalid number: "${valueStr}"`)
	}

	return value
}

// Основная функция
export const ms = (str: StringValue): number => {
	validateInput(str)

	// Исправленное регулярное выражение - убраны лишние группы и улучшена обработка пробелов
	const match = /^(?<value>-?(?:\d+)?\.?\d+)\s*(?<type>[a-zA-Z]*)$/.exec(
		str.trim()
	)

	if (!match?.groups) {
		throw new Error(
			`Invalid time string format: "${str}". Expected format: "number[unit]"`
		)
	}

	const { value: valueStr, type: typeStr } = match.groups
	const actualType = typeStr || 'ms' // Если тип не указан, используем миллисекунды

	try {
		const value = parseValue(valueStr)
		const normalizedType = normalizeUnit(actualType)

		return value * TIME_UNITS[normalizedType]
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(
				`Failed to parse time string "${str}": ${error.message}`
			)
		}
		throw error
	}
}

// Дополнительные утилиты
export const msToHumanReadable = (msValue: number): string => {
	if (msValue === 0) return '0 ms'

	const absMs = Math.abs(msValue)
	const units: Array<[TimeUnit, number]> = [
		['year', TIME_UNITS.year],
		['week', TIME_UNITS.week],
		['day', TIME_UNITS.day],
		['hour', TIME_UNITS.hour],
		['minute', TIME_UNITS.minute],
		['second', TIME_UNITS.second],
		['millisecond', 1]
	]

	for (const [unit, unitMs] of units) {
		if (absMs >= unitMs || unit === 'millisecond') {
			const value = msValue / unitMs
			return `${Number(value.toFixed(2))} ${unit}${Math.abs(value) !== 1 ? 's' : ''}`
		}
	}

	return `${msValue} ms`
}

// Тестовые примеры
export const MS_TEST_CASES = [
	{ input: '100', expected: 100 },
	{ input: '1s', expected: 1000 },
	{ input: '1m', expected: 60000 },
	{ input: '1.5h', expected: 5400000 },
	{ input: '1 day', expected: 86400000 },
	{ input: '1 week', expected: 604800000 }
] as const
