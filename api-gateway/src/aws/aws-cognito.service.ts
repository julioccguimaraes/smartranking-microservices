import { Injectable } from '@nestjs/common';
import {
	CognitoUserPool,
	CognitoUserAttribute,
	CognitoUser,
	AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { AuthUserConfirmPasswordDto } from 'src/auth/dto/auth-user-confirm-password.dto';
import { AuthUserEditPasswordDto } from 'src/auth/dto/auth-user-edit-password.dto';
import { AuthUserLoginDto } from 'src/auth/dto/auth-user-login.dto';
import { AuthUserRecoverPasswordDto } from 'src/auth/dto/auth-user-recover-password.dto';
import { AuthUserRegisterDto } from 'src/auth/dto/auth-user-register.dto';
import { AwsCognitoConfig } from './aws-cognito.config';
import * as AWS from 'aws-sdk';
import { AwsS3Config } from './aws-s3.config';

@Injectable()
export class AwsCognitoService {
	private userPool: CognitoUserPool;

	constructor(
		private awsCognitoConfig: AwsCognitoConfig,
		private awsS3Config: AwsS3Config
	) {
		this.userPool = new CognitoUserPool({
			UserPoolId: this.awsCognitoConfig.userPoolId,
			ClientId: this.awsCognitoConfig.clientId,
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

	async editPassword(authUserEditPasswordDto: AuthUserEditPasswordDto) {
		const { email, currentPassword, newPassword } = authUserEditPasswordDto;

		const userData = {
			Username: email,
			Pool: this.userPool,
		};

		const authenticationDetails = new AuthenticationDetails({
			Username: email,
			Password: currentPassword,
		});

		const userCognito = new CognitoUser(userData);

		return new Promise((resolve, reject) => {
			userCognito.authenticateUser(authenticationDetails, {
				onSuccess: () => {
					userCognito.changePassword(
						currentPassword,
						newPassword,
						(err, result) => {
							if (err) {
								reject(err);
							}

							resolve(result);
						}
					);
				},
				onFailure: (err) => {
					reject(err);
				},
			});
		});
	}

	async recoverPassword(
		authUserRecoverPasswordDto: AuthUserRecoverPasswordDto
	) {
		const { email } = authUserRecoverPasswordDto;

		const userData = {
			Username: email,
			Pool: this.userPool,
		};

		const userCognito = new CognitoUser(userData);

		return new Promise((resolve, reject) => {
			userCognito.forgotPassword({
				onSuccess: (result) => {
					resolve(result);
				},
				onFailure: (err) => {
					reject(err);
				},
			});
		});
	}

	async confirmPassword(
		authUserConfirmPasswordDto: AuthUserConfirmPasswordDto
	) {
		const { email, newPassword, code } = authUserConfirmPasswordDto;

		const userData = {
			Username: email,
			Pool: this.userPool,
		};

		const userCognito = new CognitoUser(userData);

		return new Promise((resolve, reject) => {
			userCognito.confirmPassword(code, newPassword, {
				onSuccess: () => {
					resolve({
						status: 'Success',
					});
				},
				onFailure: (err) => {
					reject(err);
				},
			});
		});
	}

	async getUsers(email: string): Promise<any> {
		const params = {
			UserPoolId: this.awsCognitoConfig.userPoolId,
			Filter: `email = '${email}'`,
		};

		return new Promise((resolve, reject) => {
			AWS.config.update({
				region: this.awsCognitoConfig.region,
				accessKeyId: this.awsS3Config.accessKeyId,
				secretAccessKey: this.awsS3Config.secretAccessKey,
			});

			const cognitoIdentityServiceProvider =
				new AWS.CognitoIdentityServiceProvider();

			cognitoIdentityServiceProvider.listUsers(params, (err, data) => {
				if (err) {
					reject(err);
				} else {
					console.log('data: ' + data);
					resolve(data);
				}
			});
		});
	}
}
