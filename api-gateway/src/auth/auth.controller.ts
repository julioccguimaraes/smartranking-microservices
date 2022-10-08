import {
	Body,
	Controller,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AwsCognitoService } from 'src/aws/aws-cognito.service';
import { AuthUserLoginDto } from './dto/auth-user-login.dto';
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
}
