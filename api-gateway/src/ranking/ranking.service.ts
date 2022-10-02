import { BadRequestException, Injectable } from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';

@Injectable()
export class RankingService {
	constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

	private clientRankingBackend =
		this.clientProxySmartRanking.getClientProxyRankingInstance();

	async consultarRankings(
		idCategory: string,
		dataChallenger: string
	): Promise<any> {
		if (!idCategory) {
			throw new BadRequestException('O id da categoria é obrigatório!');
		}

		return await this.clientRankingBackend
			.send('get-rankings', {
				idCategory: idCategory,
				dataChallenger: dataChallenger ? dataChallenger : '',
			})
			.toPromise();
	}
}
