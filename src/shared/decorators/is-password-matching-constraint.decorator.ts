import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator'

import { NewPasswordInput } from '@modules/account/password-recovery/inputs/new-password.input'

@ValidatorConstraint({ name: 'IsPasswordisMatching', async: false })
export class IsPasswordisMatchingConstraint implements ValidatorConstraintInterface {
	public validate(
		passwordRepeat: string,
		validationArguments: ValidationArguments
	): Promise<boolean> | boolean {
		const object = validationArguments.object as NewPasswordInput

		return object.password === passwordRepeat
	}
	public defaultMessage(validationArguments?: ValidationArguments): string {
		return 'Пароли не совпадают'
	}
}
