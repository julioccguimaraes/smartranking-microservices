import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Match } from './interfaces/match.interface';
import { MatchService } from './match.service';

const ackErrors: string[] = ['E11000'];

@Controller('match')
export class MatchController {
	constructor(private readonly matchService: MatchService) {}

	private readonly logger = new Logger(MatchController.name);

	@EventPattern('add-match')
	async addMatch(@Payload() match: Match, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef();
		const originalMsg = context.getMessage();

		try {
			this.logger.log(`match: ${JSON.stringify(match)}`);

			await this.matchService.addMatch(match);
			await channel.ack(originalMsg);
		} catch (error) {
			this.logger.log(`error: ${JSON.stringify(error.message)}`);

			const filterAckError = ackErrors.filter((ackError) =>
				error.message.includes(ackError)
			);

			if (filterAckError.length > 0) {
				await channel.ack(originalMsg);
			}
		}
	}
}
