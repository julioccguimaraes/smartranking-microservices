import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk'

@Injectable()
export class AwsService {
    constructor(private configService: ConfigService) {}
    
    public async fileUpload(file: any, id: string) {
        const s3 = new AWS.S3(
            {
                region: this.configService.get<string>('AWS_S3_REGION'),
                accessKeyId: this.configService.get<string>('AWS_S3_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get<string>('AWS_S3_SECRETACCESSKEY')
            }
        );

        const fileExtension = file.originalname.split('.')[1]
        const urlKey = id + '.' + fileExtension;

        const params = {
            Body: file.buffer,
            Bucket: 'smartranking-julio',
            Key: urlKey
        }

        const data = s3
            .putObject(params)
            .promise()
            .then(
                data => {
                    return {
                        url: this.configService.get<string>('AWS_S3_URL') + urlKey
                    }
                },
                err => {
                    Logger.error(err);
                    return err
                }
            );

        return data;
    }
}
