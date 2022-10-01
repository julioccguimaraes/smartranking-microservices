import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './category/category.module';
import { PlayerModule } from './player/player.module';

const configService = new ConfigService();

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		MongooseModule.forRoot(configService.get('MONGODB_URL'), {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}),
		CategoryModule,
		PlayerModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
