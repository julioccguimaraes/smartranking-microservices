import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as momentTimezone from 'moment-timezone';

const configService = new ConfigService();

async function bootstrap() {
	const app = await NestFactory.createMicroservice(AppModule, {
		transport: Transport.RMQ,
		options: {
			urls: [configService.get('RMQ_URL')],
			noAck: false,
			queue: 'notification',
		},
	});

	Date.prototype.toJSON = function (): any {
		return momentTimezone(this)
			.tz('America/Sao_Paulo')
			.format('YYYY-MM-DD HH:mm:ss.SSS');
	};

	await app.listen();
}
bootstrap();
