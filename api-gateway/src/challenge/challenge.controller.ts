import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { AddChallengeDto } from './dto/add-challenge.dto';
import { ChallengeToMatchDto } from './dto/challenge-to-match.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';

@Controller('api/v1/challenge')
export class ChallengeController {
	constructor(private challengeService: ChallengeService) {}

	@Post()
	@UsePipes(ValidationPipe)
	async addChallenge(@Body() addChallengeDto: AddChallengeDto) {
		await this.challengeService.addChallenge(addChallengeDto);
	}

	@Get()
	async getChallenges(@Query('idPlayer') idPlayer: string) {
		return await this.challengeService.getChallenges(idPlayer);
	}

	@Put('/:challenge')
	async updateChallenge(
		@Body(ChallengeStatusValidationPipe)
		updateChallengeDto: UpdateChallengeDto,
		@Param('challenge') _id: string
	) {
		await this.challengeService.updateChallenge(updateChallengeDto, _id);
	}

	@Post('/:challenge/match/')
	async setChallengeToMatch(
		@Body(ValidationPipe) challengeToMatchDto: ChallengeToMatchDto,
		@Param('challenge') _id: string
	) {
		await this.challengeService.setChallengeToMatch(
			challengeToMatchDto,
			_id
		);
	}

	@Delete('/:_id')
	async deleteChallenge(@Param('_id') _id: string) {
		await this.challengeService.deleteChallenge(_id);
	}
}
