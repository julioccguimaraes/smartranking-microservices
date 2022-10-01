import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RankingSchema } from './interfaces/ranking.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Ranking', schema: RankingSchema }
  ])],
  providers: [RankingService],
  controllers: [RankingController]
})
export class RankingModule {}
