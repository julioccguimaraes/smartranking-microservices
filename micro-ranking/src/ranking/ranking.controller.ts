import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Match } from './interfaces/match.interface';
import { RankingService } from './ranking.service';

const ackErrors: string[] = ['E11000']

@Controller()
export class RankingController {

    constructor(private readonly rankingService: RankingService) { }
    private readonly logger = new Logger(RankingController.name)

    @EventPattern('process-match')
    async processMatch(@Payload() data: any, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()

        try {
            this.logger.log('data ' + JSON.stringify(data))

            const idMatch: string = data.idMatch
            const match: Match = data.match

            await this.rankingService.processMatch(idMatch, match)

            await channel.ack(originalMsg)
        } catch (error) {
            const filterAckError = ackErrors.filter(ackError => error.message.includes(ackError))

            if (filterAckError.length > 0) {
                await channel.ack(originalMsg)
            }
        }
    }
}
