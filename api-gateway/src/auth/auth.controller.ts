import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Post,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AwsCognitoService } from 'src/aws/aws-cognito.service';
import { AuthUserConfirmPasswordDto } from './dto/auth-user-confirm-password.dto';
import { AuthUserEditPasswordDto } from './dto/auth-user-edit-password.dto';
import { AuthUserLoginDto } from './dto/auth-user-login.dto';
import { AuthUserRecoverPasswordDto } from './dto/auth-user-recover-password.dto';
import { AuthUserRegisterDto } from './dto/auth-user-register.dto';

@Controller('api/v1/auth')
export class AuthController {
	constructor(private awsCognitoService: AwsCognitoService) {}

	@Post('/register')
	@UsePipes(ValidationPipe)
	async register(@Body() authUserRegisterDto: AuthUserRegisterDto) {
		return await this.awsCognitoService.userRegister(authUserRegisterDto);
	}

	@Post('/login')
	@UsePipes(ValidationPipe)
	async login(@Body() authUserLoginDto: AuthUserLoginDto) {
		return await this.awsCognitoService.userLogin(authUserLoginDto);
	}

	@Post('/edit_password')
	@UsePipes(ValidationPipe)
	async editPassword(
		@Body() authUserEditPasswordDto: AuthUserEditPasswordDto
	) {
		const result = await this.awsCognitoService.editPassword(
			authUserEditPasswordDto
		);

		if (result == 'SUCCESS') {
			return {
				status: 'Success',
			};
		}
	}

	@Post('/recover_password')
	@UsePipes(ValidationPipe)
	async recoverPassword(
		@Body() authUserRecoverPasswordDto: AuthUserRecoverPasswordDto
	) {
		return await this.awsCognitoService.recoverPassword(
			authUserRecoverPasswordDto
		);
	}

	@Post('/confirm_password')
	@UsePipes(ValidationPipe)
	async confirmPassword(
		@Body() authUserConfirmPasswordDto: AuthUserConfirmPasswordDto
	) {
		return await this.awsCognitoService.confirmPassword(
			authUserConfirmPasswordDto
		);
	}

	@Get('users')
	async getUsers(@Query('email') email: string) {
		if (!email) {
			throw new BadRequestException('Missing user parameter');
		}

		return await this.awsCognitoService.getUsers(email);
	}
}
