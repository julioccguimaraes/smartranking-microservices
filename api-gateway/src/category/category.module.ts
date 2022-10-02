import { Module } from '@nestjs/common';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
	imports: [ProxyRMQModule],
	controllers: [CategoryController],
	providers: [CategoryService],
})
export class CategoryModule {}
