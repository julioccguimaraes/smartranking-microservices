import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from './interfaces/player.interface'
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PlayerService {

    constructor(
        @InjectModel('Player') private readonly playerModel: Model<Player>
    ) { }

    private readonly logger = new Logger(PlayerService.name)

    async addPlayer(player: Player): Promise<void> {

        try {
            const playerCriado = new this.playerModel(player)
            await playerCriado.save()
        }
        catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async getPlayers(): Promise<Player[]> {
        try {
            return await this.playerModel.find().exec()
        }
        catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async getPlayerById(_id: string): Promise<Player> {

        try {
            return await this.playerModel.findOne({ _id }).exec();
        } catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async updatePlayer(_id: string, player: Player): Promise<void> {

        try {
            await this.playerModel.findOneAndUpdate({ _id },
                { $set: player }).exec()
        }
        catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

    async deletePlayer(_id): Promise<void> {

        try {
            await this.playerModel.deleteOne({ _id }).exec();
        }
        catch (error) {
            this.logger.error(`error: ${JSON.stringify(error.message)}`)
            throw new RpcException(error.message)
        }
    }

}