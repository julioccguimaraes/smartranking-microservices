import {
	IsNotEmpty,
	IsArray,
	ArrayMinSize,
	ArrayMaxSize,
	IsDateString,
} from 'class-validator';
import { Player } from 'src/player/interfaces/player.interface';

export class AddChallengeDto {
	@IsNotEmpty()
	@IsDateString()
	dateHourChallenge: Date;

	@IsNotEmpty()
	requester: string;

	@IsNotEmpty()
	category: string;

	@IsArray()
	@ArrayMinSize(2)
	@ArrayMaxSize(2)
	players: Player[];
}
