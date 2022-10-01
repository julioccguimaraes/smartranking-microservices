import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatus } from './challenge-status.enum';

@Injectable()
export class ChallengeService {
    constructor(@InjectModel('Challenge') private readonly challengeModel: Model<Challenge>) { }

    private readonly logger = new Logger(ChallengeService.name)

    async addChallenge(challenge: Challenge): Promise<Challenge> {
        try {
            const addedChallenge = new this.challengeModel(challenge)
            addedChallenge.dateHourRequest = new Date()
            /*
                Quando um challenge for criado, definimos o status 
                challenge como pendente
            */
            addedChallenge.status = ChallengeStatus.PENDENTE

            this.logger.log(`addedChallenge: ${JSON.stringify(addedChallenge)}`)

            return await addedChallenge.save()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async getChallenges(): Promise<Challenge[]> {
        try {
            return await this.challengeModel.find().exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async getPlayerChallenges(_id: any): Promise<Challenge[] | Challenge> {
        try {
            return await this.challengeModel.find()
                .where('players')
                .in(_id)
                .exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)

            throw new RpcException(error.message)
        }
    }

    async getChallengeById(_id: any): Promise<Challenge> {
        try {
            return await this.challengeModel.findOne({ _id }).exec();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)

            throw new RpcException(error.message)
        }
    }

    async updateChallenge(_id: string, challenge: Challenge): Promise<void> {
        try {
            /*
                Atualizaremos a data da resposta quando o status do challenge 
                vier preenchido 
            */
            challenge.dateHourResponse = new Date()

            await this.challengeModel.findOneAndUpdate({ _id }, { $set: challenge }).exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)

            throw new RpcException(error.message)
        }
    }

    async updateMatchChallenge(idMatch: string, challenge: Challenge): Promise<void> {
        try {
            /*
                Quando uma partida for registrada por um usuário, mudaremos o 
                status do challenge para realizado
            */
            challenge.status = ChallengeStatus.REALIZADO
            challenge.match = idMatch

            await this.challengeModel.findOneAndUpdate({ _id: challenge._id }, { $set: challenge }).exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)

            throw new RpcException(error.message)
        }
    }

    async deleteChallenge(challenge: Challenge): Promise<void> {
        try {
            const { _id } = challenge
            /*
                Realizaremos a deleção lógica do challenge, modificando seu status para
                CANCELADO
            */
            challenge.status = ChallengeStatus.CANCELADO

            this.logger.log(`challenge: ${JSON.stringify(challenge)}`)

            await this.challengeModel.findOneAndUpdate({ _id }, { $set: challenge }).exec()
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)

            throw new RpcException(error.message)
        }
    }
}