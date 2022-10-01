import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';

@Controller('api/v1/ranking')
export class RankingController {
	constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

	private clientRankingBackend =
		this.clientProxySmartRanking.getClientProxyRankingInstance();

	@Get()
	consultarRankings(
		@Query('idCategory') idCategory: string,
		@Query('dataChallenger') dataChallenger: string
	): Observable<any> {
		if (!idCategory) {
			throw new BadRequestException('O id da categoria é obrigatório!');
		}

		return this.clientRankingBackend.send('get-rankings', {
			idCategory: idCategory,
			dataChallenger: dataChallenger ? dataChallenger : '',
		});
	}
}
