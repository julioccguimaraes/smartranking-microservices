export interface Player {
	readonly _id: string;
	readonly phoneNumber: string;
	readonly email: string;
	name: string;
	category: string;
	ranking: string;
	rankingPosition: number;
	photoUrl: string;
}
