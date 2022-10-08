import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { AwsCognitoConfig } from 'src/aws/aws-cognito.config'
import { passportJwtSecret } from 'jwks-rsa'

export class JwtStrategy extends PassportStrategy(Strategy) {
    private logger = new Logger(JwtStrategy.name);

    constructor(private awsCognitoConfig: AwsCognitoConfig) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false.valueOf, // delega ao passport a expiração
            audience: awsCognitoConfig.clientId,
            issuer: awsCognitoConfig.url, // passa o emissor do token
            algorithms: ['RS256'],
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: awsCognitoConfig.url + '.well-known/jkws.json'
            })
        })
    }

    public async validate(payload: any) {
        this.logger.log('payload ' + payload);

        return { userId: payload.sub, email: payload.email }
    }
}