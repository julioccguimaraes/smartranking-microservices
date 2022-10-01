import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './category/category.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }),
    CategoryModule,
    PlayerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
