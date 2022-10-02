import { Injectable } from '@nestjs/common';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';
import { AddCategoryDto } from './dto/add-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
	constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

	private clientAdminBackend =
		this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

	async addCategory(addCategoryDto: AddCategoryDto) {
		this.clientAdminBackend.emit('add-category', addCategoryDto);
	}

	async getCategories(_id: string): Promise<any> {
		return this.clientAdminBackend.send('get-categories', _id ? _id : '');
	}

	async updateCategory(updateCategoryDto: UpdateCategoryDto, _id: string) {
		this.clientAdminBackend.emit('update-category', {
			id: _id,
			category: updateCategoryDto,
		});
	}
}
