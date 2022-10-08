import { Injectable } from '@nestjs/common';
import {
	CognitoUserPool,
	CognitoUserAttribute,
	CognitoUser,
	AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { AuthUserLoginDto } from 'src/auth/dto/auth-user-login.dto';
import { AuthUserRegisterDto } from 'src/auth/dto/auth-user-register.dto';
import { AwsCognitoConfig } from './aws-cognito.config';

@Injectable()
export class AwsCognitoService {
	private userPool: CognitoUserPool;

	constructor(awsCognitoConfig: AwsCognitoConfig) {
		this.userPool = new CognitoUserPool({
			UserPoolId: awsCognitoConfig.userPoolId,
			ClientId: awsCognitoConfig.clientId,
		});
	}

	async userRegister(authUserRegisterDto: AuthUserRegisterDto) {
		const { name, email, password, phoneNumber } = authUserRegisterDto;

		return new Promise((resolve, reject) => {
			this.userPool.signUp(
				email,
				password,
				[
					new CognitoUserAttribute({
						Name: 'phone_number',
						Value: phoneNumber,
					}),
					new CognitoUserAttribute({ Name: 'name', Value: name }),
				],
				null,
				(err, result) => {
					if (!result) {
						reject(err);
					} else {
						resolve(result.user);
					}
				}
			);
		});
	}

	async userLogin(authUserLoginDto: AuthUserLoginDto) {
		const { email, password } = authUserLoginDto;

		const userData = {
			Username: email,
			Pool: this.userPool,
		};

		const authenticationDetails = new AuthenticationDetails({
			Username: email,
			Password: password,
		});

		const userCognito = new CognitoUser(userData);

		return new Promise((resolve, reject) => {
			userCognito.authenticateUser(authenticationDetails, {
				onSuccess: (result) => {
					resolve(result);
				},
				onFailure: (err) => {
					reject(err);
				},
			});
		});
	}
}
