import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>
  ) { }

  private readonly logger = new Logger(CategoryService.name)

  async addCategory(category: Category): Promise<void> {

    try {
      const createdCategory = new this.categoryModel(category)
      await createdCategory.save() //removido o return
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      return await this.categoryModel.find().exec()
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

  async getCategoryById(_id: string): Promise<Category> {
    try {
      return await this.categoryModel.findOne({ _id }).exec()
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }

  async updateCategory(_id: string, category: Category): Promise<void> {
    try {
      await this.categoryModel.findOneAndUpdate({ _id }, { $set: category }).exec()
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`)
      throw new RpcException(error.message)
    }
  }
}
