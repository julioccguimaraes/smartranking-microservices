import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { Category } from './interfaces/category.interface';

// E11000: erro ao adicionar categoria 2 vezes (chave duplicada)
const ackErrors: string[] = ['E11000']

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  logger = new Logger(CategoryController.name)

  @EventPattern('add-category')
  // async addCategory(@Payload() category: Category) {
  async addCategory(@Payload() category: Category, @Ctx() context: RmqContext) {

    // para informar que a mensagem pode ser apagada no rmq
    const channel = context.getChannelRef()
    const originalMessage = context.getMessage()

    this.logger.log('categoria: ' + JSON.stringify(category))

    try {
      await this.categoryService.addCategory(category)
      // diz ao rabbitmq que pode deletar a mensagem
      await channel.ack(originalMessage)
    } catch (error) {
      this.logger.error('Error: ' + JSON.stringify(error.message))

      const filterAckError = ackErrors.filter(ackError => error.message.includes(ackError))

      // se a mensagem de erro é E11000, então avisa ao rabbitmq que pode deletar, senão vai ficar enfileirando-a
      if (filterAckError.length > 0) {
        await channel.ack(originalMessage)
      }
    }
  }

  @MessagePattern('get-categories')
  async getCategories(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMessage = context.getMessage()

    try {
      if (_id) {
        return await this.categoryService.getCategoryById(_id)
      } else {
        return await this.categoryService.getCategories()
      }
    } finally {
      await channel.ack(originalMessage)
    }
  }

  @EventPattern('update-category')
  async updateCategory(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()

    this.logger.log(`data: ${JSON.stringify(data)}`)

    try {
      const _id: string = data.id
      const category: Category = data.category

      await this.categoryService.updateCategory(_id, category)
      await channel.ack(originalMsg)
    } catch (error) {
      const filterAckError = ackErrors.filter(ackError => error.message.includes(ackError))

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg)
      }
    }
  }
}
