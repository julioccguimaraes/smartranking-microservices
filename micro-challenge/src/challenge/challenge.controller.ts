import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext, MessagePattern } from '@nestjs/microservices';
import { ChallengeService } from './challenge.service';
import { Challenge } from './interfaces/challenge.interface';

const ackErrors: string[] = ['E11000']

@Controller()
export class ChallengeController {
    constructor(private readonly challengeService: ChallengeService) { }

    private readonly logger = new Logger(ChallengeController.name)

    @EventPattern('add-challenge')
    async addChallenge(@Payload() challenge: Challenge, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()

        try {
            this.logger.log(`challenge: ${JSON.stringify(challenge)}`)

            await this.challengeService.addChallenge(challenge)
            await channel.ack(originalMsg)
        } catch (error) {
            this.logger.log(`error: ${JSON.stringify(error.message)}`)
            const filterAckError = ackErrors.filter(ackError => error.message.includes(ackError))

            if (filterAckError.length > 0) {
                await channel.ack(originalMsg)
            }
        }
    }

    @MessagePattern('get-challenges')
    async getChallenges(@Payload() data: any, @Ctx() context: RmqContext): Promise<Challenge[] | Challenge> {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()

        try {
            const { idPlayer, _id } = data
            this.logger.log(`data: ${JSON.stringify(data)}`)

            if (idPlayer) {
                return await this.challengeService.getPlayerChallenges(idPlayer);
            } else if (_id) {
                return await this.challengeService.getChallengeById(_id)
            } else {
                return await this.challengeService.getChallenges();
            }
        } finally {
            await channel.ack(originalMsg)
        }
    }

    @MessagePattern('get-challenges-completed')
    async getChallengesCompleted(@Payload() payload: any, @Ctx() context: RmqContext): Promise<Challenge[] | Challenge> {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()

        try {
            const { idCategory, dataChallenger } = payload
            this.logger.log(`data: ${JSON.stringify(payload)}`)

            if (dataChallenger) {
                return await this.challengeService.getChallengesCompletedByDate(idCategory, dataChallenger);
            } else {
                return await this.challengeService.getChallengesCompleted(idCategory);
            }
        } finally {
            await channel.ack(originalMsg)
        }
    }

    @EventPattern('update-challenge')
    async updateChallenge(@Payload() data: any, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()

        try {
            this.logger.log(`data: ${JSON.stringify(data)}`)

            const _id: string = data.id
            const challenge: Challenge = data.challenge

            await this.challengeService.updateChallenge(_id, challenge)
            await channel.ack(originalMsg)
        } catch (error) {
            const filterAckError = ackErrors.filter(ackError => error.message.includes(ackError))

            if (filterAckError.length > 0) {
                await channel.ack(originalMsg)
            }
        }
    }

    @EventPattern('update-match-challenge')
    async updateMatchChallenge(@Payload() data: any, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()

        try {
            this.logger.log(`idMatch: ${data}`)

            const idMatch: string = data.idMatch
            const challenge: Challenge = data.challenge

            await this.challengeService.updateMatchChallenge(idMatch, challenge)
            await channel.ack(originalMsg)
        } catch (error) {
            const filterAckError = ackErrors.filter(ackError => error.message.includes(ackError))

            if (filterAckError.length > 0) {
                await channel.ack(originalMsg)
            }
        }
    }

    @EventPattern('delete-challenge')
    async deleteChallenge(@Payload() challenge: Challenge, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()

        try {
            await this.challengeService.deleteChallenge(challenge)
            await channel.ack(originalMsg)
        } catch (error) {
            this.logger.log(`error: ${JSON.stringify(error.message)}`)

            const filterAckError = ackErrors.filter(ackError => error.message.includes(ackError))

            if (filterAckError.length > 0) {
                await channel.ack(originalMsg)
            }
        }
    }
}