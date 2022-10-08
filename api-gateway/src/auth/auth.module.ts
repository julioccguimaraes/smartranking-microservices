import { Module } from '@nestjs/common';
import { AwsModule } from 'src/aws/aws.module';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [AwsModule, PassportModule.register({ defaultStrategy: 'jwt' })],
	controllers: [AuthController],
	providers: [JwtStrategy],
})
export class AuthModule {}
