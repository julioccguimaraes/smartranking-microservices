import { Document } from 'mongoose';

export interface Match extends Document {
	category: string;
	challenge: string;
	players: string[];
	challenger: string;
	result: Array<Result>;
}

export interface Result {
	set: string;
}
