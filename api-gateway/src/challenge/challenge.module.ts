import { Module } from '@nestjs/common';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { ChallengeController } from './challenge.controller';

@Module({
	imports: [ProxyRMQModule],
	controllers: [ChallengeController],
})
export class ChallengeModule {}
