import { BadRequestException, Injectable } from '@nestjs/common';
import { Category } from 'aws-sdk/clients/cloudformation';
import { AwsService } from 'src/aws/aws.service';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { AddPlayerDto } from './dto/add-player.dto';
import { UpdatePlayerDto } from './dto/update-player-dto';

@Injectable()
export class PlayerService {
	constructor(
		private clientProxySmartRanking: ClientProxySmartRanking,
		private awsService: AwsService
	) {}

	private clientAdminBackend =
		this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

	async addPlayer(addPlayerDto: AddPlayerDto) {
		const category: Category = await this.clientAdminBackend
			.send('get-categories', addPlayerDto.category)
			.toPromise();

		if (category) {
			this.clientAdminBackend.emit('add-player', addPlayerDto);
		} else {
			throw new BadRequestException(`Categoria não cadastrada!`);
		}
	}

	async getPlayers(_id: string): Promise<any> {
		return await this.clientAdminBackend
			.send('get-players', _id ? _id : '')
			.toPromise();
	}

	async updatePlayer(updatePlayerDto: UpdatePlayerDto, _id: string) {
		const category: Category = await this.clientAdminBackend
			.send('get-categories', updatePlayerDto.category)
			.toPromise();

		if (category) {
			this.clientAdminBackend.emit('update-player', {
				id: _id,
				player: updatePlayerDto,
			});
		} else {
			throw new BadRequestException(`Categoria não cadastrada!`);
		}
	}

	async deletePlayer(_id: string) {
		this.clientAdminBackend.emit('delete-player', { _id });
	}

	async fileUpload(file: any, _id: string): Promise<any> {
		const player = await this.clientAdminBackend
			.send('get-players', _id)
			.toPromise();

		if (!player) {
			throw new BadRequestException('Jogador não encontrado.');
		}

		const photoUrl = await this.awsService.fileUpload(file, _id);

		const updatePlayerDto: UpdatePlayerDto = {};

		updatePlayerDto.photoUrl = photoUrl.url;

		this.clientAdminBackend.emit('update-player', {
			id: _id,
			player: updatePlayerDto,
		});

		return await this.clientAdminBackend
			.send('get-players', _id)
			.toPromise();
	}
}
