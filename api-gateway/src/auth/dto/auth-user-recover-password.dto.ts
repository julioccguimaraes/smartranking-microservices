import { IsEmail } from 'class-validator';

export class AuthUserRecoverPasswordDto {
	@IsEmail()
	email: string;
}
