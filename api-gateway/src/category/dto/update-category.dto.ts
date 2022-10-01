import { ArrayMinSize, IsArray, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
    @IsString()
    @IsOptional()
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