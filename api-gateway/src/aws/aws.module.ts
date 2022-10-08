import { Module } from '@nestjs/common';
import { AwsCognitoConfig } from './aws-cognito.config';
import { AwsCognitoService } from './aws-cognito.service';
import { AwsService } from './aws.service';

@Module({
	providers: [AwsService, AwsCognitoConfig, AwsCognitoService],
	exports: [AwsService, AwsCognitoConfig, AwsCognitoService],
})
export class AwsModule {}
