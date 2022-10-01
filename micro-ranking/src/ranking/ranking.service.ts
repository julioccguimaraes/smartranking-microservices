import { Injectable, Logger } from '@nestjs/common';
import { Match } from './interfaces/match.interface';

@Injectable()
export class RankingService {
    private readonly logger = new Logger(RankingService.name)

    async processMatch(idMatch: string, match: Match): Promise<void> {
        this.logger.log('idMatch ' + idMatch + ' partida: ' + JSON.stringify(match))
    }
}
