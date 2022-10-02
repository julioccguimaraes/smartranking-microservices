import { Controller, Get, Query } from '@nestjs/common';
import { RankingService } from './ranking.service';

@Controller('api/v1/ranking')
export class RankingController {
	constructor(private rankingService: RankingService) {}

	@Get()
	async consultarRankings(
		@Query('idCategory') idCategory: string,
		@Query('dataChallenger') dataChallenger: string
	) {
		return await this.rankingService.consultarRankings(
			idCategory,
			dataChallenger
		);
	}
}
