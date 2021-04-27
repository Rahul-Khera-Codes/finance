export function matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
	return (group: any): {
		[key: string]: any
	} => {
		let password = group.controls[passwordKey];
		let confirmPassword = group.controls[confirmPasswordKey];

		if (password.value !== confirmPassword.value) {
			return {
				mismatchedPasswords: true
			};
		}
	}
}
