import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { MatchSchema } from './interfaces/match.schema';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Match', schema: MatchSchema }]),
    ProxyRMQModule,
  ],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
