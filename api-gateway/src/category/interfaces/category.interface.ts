export interface Category {
	readonly _id: string;
	readonly category: string;
	description: string;
	events: Array<Events>;
}

interface Events {
	name: string;
	operation: string;
	value: number;
}
