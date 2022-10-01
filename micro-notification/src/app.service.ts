import { Injectable, Logger } from '@nestjs/common';
import { ClientProxySmartRanking } from './proxyrmq/client-proxy';
import { MailerService } from '@nestjs-modules/mailer';
import { Challenge } from './interfaces/challenge.interface';
import { Player } from './interfaces/player.interface';
import HTML_NOTIFICACAO_ADVERSARIO from './static/html-opponent-notification';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

@Injectable()
export class AppService {
	constructor(
		private clientProxySmartRanking: ClientProxySmartRanking,
		private readonly mailService: MailerService
	) {}

	private readonly logger = new Logger(AppService.name);

	private clientAdminBackend =
		this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

	async sendEmailToOpponent(challenge: Challenge): Promise<void> {
		try {
			/*
        Identificar o ID do opponent
      */

			let idChallenger = '';

			challenge.players.map((player) => {
				if (player != challenge.requester) {
					idChallenger = player;
				}
			});

			//Consultar as informações adicionais dos playeres

			const opponent: Player = await this.clientAdminBackend
				.send('get-players', idChallenger)
				.toPromise();

			const requester: Player = await this.clientAdminBackend
				.send('get-playeres', challenge.requester)
				.toPromise();

			let markup = '';

			markup = HTML_NOTIFICACAO_ADVERSARIO;
			markup = markup.replace(/#NOME_ADVERSARIO/g, opponent.name);
			markup = markup.replace(/#NOME_SOLICITANTE/g, requester.name);

			this.mailService
				.sendMail({
					to: opponent.email,
					from: `"SMART RANKING" <${configService.get(
						'AWS_SES_FROM'
					)}>`,
					subject: 'Notificação de Desafio',
					html: markup,
				})
				.then((success) => {
					this.logger.log(success);
				})
				.catch((err) => {
					this.logger.error(err);
				});
		} catch (error) {
			this.logger.error(`error: ${JSON.stringify(error.message)}`);
			throw new RpcException(error.message);
		}
	}
}
