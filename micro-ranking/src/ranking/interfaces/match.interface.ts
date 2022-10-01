export interface Match {
	category: string;
	challenge: string;
	players: string[];
	challenger: string;
	result: Array<Result>;
}

export interface Result {
	set: string;
}
