import { Document } from "mongoose";

export interface Category extends Document {
    readonly category: string
    description: string
    events: Array<Event>
}

export interface Event {
    name: String
    operation: String
    value: Number
}