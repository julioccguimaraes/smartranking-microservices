import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ranking } from './interfaces/ranking.schema'
import { RpcException } from '@nestjs/microservices';
import * as momentTimezone from 'moment-timezone'
import * as _ from 'lodash'
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { RankingResponse, History } from './interfaces/ranking-response.interface';
import { Match } from './interfaces/match.interface';
import { Category } from './interfaces/category.interface';
import { EventName } from './event-name.enum';
import { Challenge } from './interfaces/challenge.interface';

@Injectable()
export class RankingService {

    constructor(
        @InjectModel('Ranking') private readonly rankingModel: Model<Ranking>,
        private clientProxySmartRanking: ClientProxySmartRanking
    ) { }

    private readonly logger = new Logger(RankingService.name)

    private clientAdminBackend =
        this.clientProxySmartRanking.getClientProxyAdminBackendInstance()

    private clientChallenge =
        this.clientProxySmartRanking.getClientProxyChallengeInstance()

    async processMatch(idMatch: string, match: Match): Promise<void> {
        try {
            const category: Category = await this.clientAdminBackend.send('get-categories', match.category).toPromise()

            await Promise.all(match.players.map(async player => {
                const ranking = new this.rankingModel()

                ranking.category = match.category
                ranking.challenge = match.challenge
                ranking.match = idMatch
                ranking.player = player

                if (player == match.challenger) {
                    const eventFilter = category.events.filter(
                        event => event.name == EventName.VICTORY
                    )

                    ranking.event = EventName.VICTORY
                    ranking.operation = eventFilter[0].operation
                    ranking.points = eventFilter[0].value
                } else {
                    const eventFilter = category.events.filter(
                        event => event.name == EventName.DEFEAT
                    )

                    ranking.event = EventName.DEFEAT
                    ranking.operation = eventFilter[0].operation
                    ranking.points = eventFilter[0].value
                }

                this.logger.log(`ranking: ${JSON.stringify(ranking)}`)

                await ranking.save()
            }))
        } catch (error) {
            this.logger.error(`error: ${error}`)
            throw new RpcException(error.message)
        }
    }

    async getRankings(idCategory: any, dataChallenger: string): Promise<RankingResponse[] | RankingResponse> {
        try {
            this.logger.log(`idCategory: ${idCategory} dataChallenger: ${dataChallenger}`)

            if (!dataChallenger) {
                dataChallenger = momentTimezone().tz("America/Sao_Paulo").format('YYYY-MM-DD')
                
                this.logger.log(`dataChallenger: ${dataChallenger}`)
            }

            /*
                Recuperou os registros de matchs processadas, filtrando a category recebida
                na requisição.
            */
            const rankingRegisters = await this.rankingModel.find()
                .where('category')
                .equals(idCategory)
                .exec()

            /*
                Agora vamos recuperar todos os challenges com data menor
                ou igual à data que recebemos na requisição.
                Somente iremos recuperar challenges que estiverem com o status igual 
                a 'REALIZADO' e filtrando a category.
            */

            const challenges: Challenge[] = await this.clientChallenge.send('get-challenges-completed',
                { idCategory: idCategory, dataChallenger: dataChallenger }).toPromise()

            /*
                Realizaremos um loop nos registros que recuperamos do ranking (matchs processadas)
                e descartaremos os registros (com base no id do challenge) que não retornaram no
                objeto challenges
            */

            _.remove(rankingRegisters, function (item) {
                return challenges.filter(challenge => challenge._id == item.challenge).length == 0
            })

            this.logger.log(`rankingRegisters: ${JSON.stringify(rankingRegisters)}`)

            //Agrupar por player

            const resultado =
                _(rankingRegisters)
                    .groupBy('player')
                    .map((items, key) => ({
                        'player': key,
                        'history': _.countBy(items, 'event'),
                        'points': _.sumBy(items, 'points')
                    }))
                    .value()

            const resultadoOrdenado = _.orderBy(resultado, 'points', 'desc')

            this.logger.log(`resultadoOrdenado: ${JSON.stringify(resultadoOrdenado)}`)

            const rankingResponseList: RankingResponse[] = []

            resultadoOrdenado.map(function (item, index) {

                const rankingResponse: RankingResponse = {}

                rankingResponse.player = item.player
                rankingResponse.position = index + 1
                rankingResponse.points = item.points

                const history: History = {}

                history.victories = item.history.VITORIA ? item.history.VITORIA : 0
                history.defeats = item.history.DERROTA ? item.history.DERROTA : 0
                rankingResponse.matchHistory = history

                rankingResponseList.push(rankingResponse)
            })

            return rankingResponseList

        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            
            throw new RpcException(error.message)
        }
    }
}