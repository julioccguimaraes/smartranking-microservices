import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RankingSchema } from './interfaces/ranking.schema';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Ranking', schema: RankingSchema }]),
		ProxyRMQModule,
	],
	providers: [RankingService],
	controllers: [RankingController],
})
export class RankingModule {}
