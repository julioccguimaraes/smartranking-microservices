import { Controller, Logger } from '@nestjs/common';
import { PlayerService } from './player.service';
import {
	EventPattern,
	Payload,
	Ctx,
	RmqContext,
	MessagePattern,
} from '@nestjs/microservices';
import { Player } from './interfaces/player.interface';

const ackErrors: string[] = ['E11000'];

@Controller()
export class PlayerController {
	logger = new Logger(PlayerController.name);
	constructor(private readonly playerService: PlayerService) {}

	@EventPattern('add-player')
	async addPlayer(@Payload() player: Player, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef();
		const originalMsg = context.getMessage();

		try {
			this.logger.log(`player: ${JSON.stringify(player)}`);

			await this.playerService.addPlayer(player);
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

	@MessagePattern('get-players')
	async getPlayers(@Payload() _id: string, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef();
		const originalMsg = context.getMessage();

		try {
			if (_id) {
				return await this.playerService.getPlayerById(_id);
			} else {
				return await this.playerService.getPlayers();
			}
		} finally {
			await channel.ack(originalMsg);
		}
	}

	@EventPattern('update-player')
	async updatePlayer(@Payload() data: any, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef();
		const originalMsg = context.getMessage();

		try {
			console.log(`data: ${JSON.stringify(data)}`);

			const _id: string = data.id;
			const player: Player = data.player;

			await this.playerService.updatePlayer(_id, player);
			await channel.ack(originalMsg);
		} catch (error) {
			const filterAckError = ackErrors.filter((ackError) =>
				error.message.includes(ackError)
			);

			if (filterAckError.length > 0) {
				await channel.ack(originalMsg);
			}
		}
	}

	@EventPattern('delete-player')
	async deletarPlayer(@Payload() _id: string, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef();
		const originalMsg = context.getMessage();

		try {
			await this.playerService.deletePlayer(_id);
			await channel.ack(originalMsg);
		} catch (error) {
			const filterAckError = ackErrors.filter((ackError) =>
				error.message.includes(ackError)
			);

			if (filterAckError.length > 0) {
				await channel.ack(originalMsg);
			}
		}
	}
}
