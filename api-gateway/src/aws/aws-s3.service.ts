import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AwsS3Config } from './aws-s3.config';

@Injectable()
export class AwsS3Service {
	constructor(private awsS3Config: AwsS3Config) { }

	private logger = new Logger(AwsS3Service.name);

	public async fileUpload(file: any, id: string) {
		try {
			const s3 = new AWS.S3({
				region: this.awsS3Config.region,
				accessKeyId: this.awsS3Config.accessKeyId,
				secretAccessKey: this.awsS3Config.secretAccessKey
			});

			const fileExtension = file.originalname.split('.')[1];
			const urlKey = id + '.' + fileExtension;

			const params = {
				Body: file.buffer,
				Bucket: 'smartranking-julio',
				Key: urlKey,
			};

			await s3.putObject(params).promise();
			
			return { url: this.awsS3Config.url + urlKey };
		} catch (error) {
			this.logger.error(error.message);
			throw error.message;
		}
	}
}
