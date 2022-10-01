import {
	ClientProxy,
	ClientProxyFactory,
	Transport,
} from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientProxySmartRanking {
	constructor(private configService: ConfigService) {}

	getClientProxyAdminBackendInstance(): ClientProxy {
		return ClientProxyFactory.create({
			transport: Transport.RMQ,
			options: {
				urls: [this.configService.get<string>('RMQ_URL')],
				queue: 'admin-backend',
			},
		});
	}

	getClientProxyChallengeInstance(): ClientProxy {
		return ClientProxyFactory.create({
			transport: Transport.RMQ,
			options: {
				urls: [this.configService.get<string>('RMQ_URL')],
				queue: 'challenge',
			},
		});
	}

	getClientProxyRankingInstance(): ClientProxy {
		return ClientProxyFactory.create({
			transport: Transport.RMQ,
			options: {
				urls: [this.configService.get<string>('RMQ_URL')],
				queue: 'ranking',
			},
		});
	}
}
