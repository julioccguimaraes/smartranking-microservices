import { IsEmail, IsString, Matches } from 'class-validator';

export class AuthUserConfirmPasswordDto {
	@IsEmail()
	email: string;

	@IsString()
	code: string;

	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
		message: 'Invalid password',
	})
	newPassword: string;
}
