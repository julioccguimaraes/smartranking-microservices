import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from "class-validator";

export class AddCategoryDto {
    @IsString()
    @IsNotEmpty()
    readonly category: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsArray()
    @ArrayMinSize(1)
    events: Array<Event>
}

interface Event {
    name: String
    operation: String
    value: Number
}