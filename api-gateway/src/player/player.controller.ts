import {
	Controller,
	Logger,
	Post,
	UsePipes,
	ValidationPipe,
	Body,
	Put,
	Param,
	BadRequestException,
	Delete,
	Get,
	Query,
	UseInterceptors,
	UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { AwsService } from 'src/aws/aws.service';
import { Category } from 'src/category/interfaces/category.interface';
import { ValidationParamPipe } from 'src/common/pipes/validation-param.pipe';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { AddPlayerDto } from './dto/add-player.dto';
import { UpdatePlayerDto } from './dto/update-player-dto';

@Controller('api/v1/player')
export class PlayerController {
	private logger = new Logger(PlayerController.name);

	constructor(
		private clientProxySmartRanking: ClientProxySmartRanking,
		private awsService: AwsService
	) {}

	private clientAdminBackend =
		this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

	@Post()
	@UsePipes(ValidationPipe)
	async addPlayer(@Body() addPlayerDto: AddPlayerDto) {
		this.logger.log(`addPlayerDto: ${JSON.stringify(addPlayerDto)}`);

		const category: Category = await this.clientAdminBackend
			.send('get-categories', addPlayerDto.category)
			.toPromise();

		if (category) {
			this.clientAdminBackend.emit('add-player', addPlayerDto);
		} else {
			throw new BadRequestException(`Categoria não cadastrada!`);
		}
	}

	@Get()
	getPlayers(@Query('idPlayer') _id: string): Observable<any> {
		return this.clientAdminBackend.send('get-players', _id ? _id : '');
	}

	@Put('/:_id')
	@UsePipes(ValidationPipe)
	async updatePlayer(
		@Body() updatePlayerDto: UpdatePlayerDto,
		@Param('_id', ValidationParamPipe) _id: string
	) {
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

	@Delete('/:_id')
	async deletePlayer(@Param('_id', ValidationParamPipe) _id: string) {
		this.clientAdminBackend.emit('delete-player', { _id });
	}

	@Post('/:_id/upload')
	@UseInterceptors(FileInterceptor('file'))
	async fileUpload(@UploadedFile() file, @Param('_id') _id: string) {
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

		return this.clientAdminBackend.send('get-players', _id);
	}
}
