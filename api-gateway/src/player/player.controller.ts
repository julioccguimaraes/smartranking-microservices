import {
	Controller,
	Post,
	UsePipes,
	ValidationPipe,
	Body,
	Put,
	Param,
	Delete,
	Get,
	Query,
	UseInterceptors,
	UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidationParamPipe } from 'src/common/pipes/validation-param.pipe';
import { AddPlayerDto } from './dto/add-player.dto';
import { UpdatePlayerDto } from './dto/update-player-dto';
import { PlayerService } from './player.service';

@Controller('api/v1/player')
export class PlayerController {
	constructor(private playerService: PlayerService) {}

	@Post()
	@UsePipes(ValidationPipe)
	async addPlayer(@Body() addPlayerDto: AddPlayerDto) {
		await this.playerService.addPlayer(addPlayerDto);
	}

	@Get()
	async getPlayers(@Query('idPlayer') _id: string) {
		return this.playerService.getPlayers(_id);
	}

	@Put('/:_id')
	@UsePipes(ValidationPipe)
	async updatePlayer(
		@Body() updatePlayerDto: UpdatePlayerDto,
		@Param('_id', ValidationParamPipe) _id: string
	) {
		await this.playerService.updatePlayer(updatePlayerDto, _id);
	}

	@Delete('/:_id')
	async deletePlayer(@Param('_id', ValidationParamPipe) _id: string) {
		await this.playerService.deletePlayer(_id);
	}

	@Post('/:_id/upload')
	@UseInterceptors(FileInterceptor('file'))
	async fileUpload(@UploadedFile() file, @Param('_id') _id: string) {
		return await this.playerService.fileUpload(file, _id);
	}
}
