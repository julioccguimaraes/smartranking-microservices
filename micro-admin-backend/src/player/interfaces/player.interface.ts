import { Document } from 'mongoose';
import { Category } from 'src/category/interfaces/category.interface';

export interface Player extends Document {
	readonly phoneNumber: string;
	readonly email: string;
	name: string;
	category: Category;
	ranking: string;
	rankingPosition: number;
	photoUrl: string;
}
