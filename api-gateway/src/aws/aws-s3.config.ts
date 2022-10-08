import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3Config {
	constructor(private configService: ConfigService) {}

	public region: string = this.configService.get<string>('AWS_S3_REGION');
	public accessKeyId: string = this.configService.get<string>(
		'AWS_S3_ACCESS_KEY_ID'
	);
	public secretAccessKey: string = this.configService.get<string>(
		'AWS_S3_SECRETACCESSKEY'
	);
	public url: string = this.configService.get<string>('AWS_S3_URL');
}
