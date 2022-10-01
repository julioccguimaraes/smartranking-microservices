import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { PlayerModule } from './player/player.module';
import { ClientProxySmartRanking } from './proxyrmq/client-proxy';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { AwsModule } from './aws/aws.module';
import { ChallengeModule } from './challenge/challenge.module';

@Module({
  imports: [
    CategoryModule,
    PlayerModule,
    ChallengeModule,
    ProxyRMQModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AwsModule
  ],
  controllers: [],
  providers: [ClientProxySmartRanking],
})
export class AppModule { }
