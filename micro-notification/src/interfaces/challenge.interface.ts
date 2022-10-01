import { ChallengeStatus } from 'src/challenge-status.enum';

export interface Challenge {
	dateHourChallenge: Date;
	status: ChallengeStatus;
	dateHourRequest: Date;
	dateHourResponse?: Date;
	requester: string;
	category: string;
	match?: string;
	players: string[];
}
