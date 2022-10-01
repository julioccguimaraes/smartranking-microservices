import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { MailerModule } from '@nestjs-modules/mailer';

const configService = new ConfigService();

@Module({
	imports: [
		MailerModule.forRoot({
			transport: {
				host: configService.get('AWS_SES_HOST'),
				port: configService.get('AWS_SES_PORT'),
				secure: false,
				tls: {
					ciphers: 'SSLv3',
				},
				auth: {
					user: configService.get('AWS_SES_USER'),
					pass: configService.get('AWS_SES_PASS'),
				},
			},
		}),
		ConfigModule.forRoot({ isGlobal: true }),
		ProxyRMQModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
