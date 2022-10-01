import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RankingModule } from './ranking/ranking.module';

const configService = new ConfigService()

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(configService.get('MONGODB_URL'), { useNewUrlParser: true, useUnifiedTopology: true }),
    RankingModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
