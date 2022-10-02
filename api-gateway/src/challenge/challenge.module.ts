import { Module } from '@nestjs/common';
import { ProxyRMQModule } from 'src/proxyrmq/proxyrmq.module';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';

@Module({
	imports: [ProxyRMQModule],
	controllers: [ChallengeController],
	providers: [ChallengeService],
})
export class ChallengeModule {}
