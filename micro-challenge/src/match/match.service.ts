import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge } from 'src/challenge/interfaces/challenge.interface';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { Match } from './interfaces/match.interface';

@Injectable()
export class MatchService {

    constructor(
        @InjectModel('Match') private readonly matchModel: Model<Match>,
        private clientProxySmartRanking: ClientProxySmartRanking
    ) { }

    private readonly logger = new Logger(MatchService.name)

    private clientChallenge =
        this.clientProxySmartRanking.getClientProxyChallengeInstance()

    private clientRanking =
        this.clientProxySmartRanking.getClientProxyRankingInstance()

    async addMatch(match: Match): Promise<Match> {
        try {
            /*
                Iremos persistir a match e logo em seguida atualizaremos o
                challenge. O challenge irá receber o ID da match e seu status
                será modificado para REALIZADO.
            */
            const addedMatch = new this.matchModel(match)

            this.logger.log(`addedMatch: ${JSON.stringify(addedMatch)}`)
            
            /*
                Recuperamos o ID da match
            */
            const result = await addedMatch.save()

            this.logger.log(`result: ${JSON.stringify(result)}`)

            const idMatch = result._id
            
            /*
                Com o ID do challenge que recebemos na requisição, recuperamos o 
                challenge.
            */
            const challenge: Challenge = await this.clientChallenge.send('get-challenges', { idPlayer: '', _id: match.challenge }).toPromise()
            
            /*
                Acionamos o tópico 'atualizar-challenge-match' que será
                responsável por atualizar o challenge.
            */
            await this.clientChallenge.emit('update-match-challenge', { idMatch: idMatch, challenge: challenge }).toPromise()

            /*
                Enviamos a match para o microservice rankings,
                indicando a necessidade de processamento desta match
            */
            return await this.clientRanking.emit('process-match', { idMatch: idMatch, match: match }).toPromise()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            
            throw new RpcException(error.message)
        }

    }

}
