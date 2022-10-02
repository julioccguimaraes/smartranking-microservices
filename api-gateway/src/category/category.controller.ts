import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AddCategoryDto } from './dto/add-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('api/v1/category')
export class CategoryController {
	constructor(private categoryService: CategoryService) {}

	@Post()
	@UsePipes(ValidationPipe)
	async addCategory(@Body() addCategoryDto: AddCategoryDto) {
		await this.categoryService.addCategory(addCategoryDto);
	}

	@Get()
	async getCategories(@Query('idCategory') _id: string) {
		return await this.categoryService.getCategories(_id);
	}

	@Put('/:_id')
	@UsePipes(ValidationPipe)
	async updateCategory(
		@Body() updateCategoryDto: UpdateCategoryDto,
		@Param('_id') _id: string
	) {
		await this.categoryService.updateCategory(updateCategoryDto, _id);
	}
}
