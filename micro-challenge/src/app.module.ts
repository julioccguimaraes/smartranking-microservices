import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeModule } from './challenge/challenge.module';
import { MatchModule } from './match/match.module';
import { ClientProxySmartRanking } from './proxyrmq/client-proxy';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }),
    ChallengeModule,
    MatchModule,
    ProxyRMQModule
  ],
  controllers: [],
  providers: [ClientProxySmartRanking]
})
export class AppModule {}
