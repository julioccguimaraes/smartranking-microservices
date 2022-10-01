import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RankingModule } from './ranking/ranking.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }),
    RankingModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
