import { IsNotEmpty } from 'class-validator';
import { Player } from 'src/player/interfaces/player.interface';
import { Result } from '../interfaces/match.interface';

export class ChallengeToMatchDto {
    @IsNotEmpty()
    challenger: Player

    @IsNotEmpty()
    result: Array<Result>
}
