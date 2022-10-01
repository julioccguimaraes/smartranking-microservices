import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Player } from 'src/player/interfaces/player.interface';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { ChallengeStatus } from './challenge.status.enum';
import { AddChallengeDto } from './dto/add-challenge.dto';
import { ChallengeToMatchDto } from './dto/challenge-to-match.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { Match } from './interfaces/match.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';

@Controller('api/v1/challenge')
export class ChallengeController {
  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private readonly logger = new Logger(ChallengeController.name);

  /*
        Criamos um proxy específico para lidar com o microservice
        desafios
    */
  private clientChallenge =
    this.clientProxySmartRanking.getClientProxyChallengeInstance();

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async addChallenge(@Body() addChallengeDto: AddChallengeDto) {
    this.logger.log(`addChallengeDto: ${JSON.stringify(addChallengeDto)}`);

    /*
            Validações relacionadas ao array de jogadores que participam
            do desafio
        */
    const jogadores: Player[] = await this.clientAdminBackend
      .send('get-players', '')
      .toPromise();

    addChallengeDto.players.map((playerDto) => {
      const playerFilter: Player[] = jogadores.filter(
        (jogador) => jogador._id == playerDto._id,
      );

      this.logger.log(`playerFilter: ${JSON.stringify(playerFilter)}`);

      /*
                Verificamos se os jogadores do desafio estão cadastrados
            */
      if (playerFilter.length == 0) {
        throw new BadRequestException(
          `O id ${playerDto._id} não é um jogador!`,
        );
      }

      /*
                Verificar se os jogadores fazem parte da categoria informada no
                desafio 
            */
      if (playerFilter[0].category != addChallengeDto.category) {
        throw new BadRequestException(
          `O jogador ${playerFilter[0]._id} não faz parte da categoria informada!`,
        );
      }
    });

    /*
            Verificamos se o solicitante é um jogador da partida
        */
    const requesterIsPlayerOfTheMatch: Player[] =
      addChallengeDto.players.filter(
        (player) => player._id == addChallengeDto.requester,
      );

    this.logger.log(
      `requesterIsPlayerOfTheMatch: ${JSON.stringify(
        requesterIsPlayerOfTheMatch,
      )}`,
    );

    if (requesterIsPlayerOfTheMatch.length == 0) {
      throw new BadRequestException(
        `O solicitante deve ser um jogador da partida!`,
      );
    }

    /*
            Verificamos se a categoria está cadastrada
        */
    const category = await this.clientAdminBackend
      .send('get-categories', addChallengeDto.category)
      .toPromise();

    this.logger.log(`category: ${JSON.stringify(category)}`);

    if (!category) {
      throw new BadRequestException(`Categoria informada não existe!`);
    }

    this.clientChallenge.emit('add-challenge', addChallengeDto);
  }

  @Get()
  async getChallenges(@Query('idPlayer') idPlayer: string): Promise<any> {
    /*
            Verificamos se o jogador informado está cadastrado
        */
    if (idPlayer) {
      const player: Player = await this.clientAdminBackend
        .send('get-players', idPlayer)
        .toPromise();

      this.logger.log(`player: ${JSON.stringify(player)}`);

      if (!player) {
        throw new BadRequestException(`Jogador não cadastrado!`);
      }
    }
    /*
            No microservice desafios, o método responsável por consultar os desafios
            espera a estrutura abaixo, onde:
            - Se preenchermos o idPlayer a consulta de desafios será pelo id do 
            jogador informado
            - Se preenchermos o campo _id a consulta será pelo id do desafio
            - Se não preenchermos nenhum dos dois campos a consulta irá retornar
            todos os desafios cadastrados
        */
    return this.clientChallenge
      .send('get-challenges', { idPlayer: idPlayer, _id: '' })
      .toPromise();
  }

  @Put('/:challenge')
  async updateChallenge(
    @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
    @Param('challenge') _id: string,
  ) {
    /*
            Validações em relação ao desafio
        */
    const challenge: Challenge = await this.clientChallenge
      .send('get-challenges', { idPlayer: '', _id: _id })
      .toPromise();

    this.logger.log(`challenge: ${JSON.stringify(challenge)}`);

    /*
            Verificamos se o desafio está cadastrado
        */
    if (!challenge) {
      throw new BadRequestException(`Desafio não cadastrado!`);
    }

    /*
            Somente podem ser atualizados desafios com status PENDENTE
        */
    if (challenge.status != ChallengeStatus.PENDENTE) {
      throw new BadRequestException(
        'Somente desafios com status PENDENTE podem ser atualizados!',
      );
    }

    this.clientChallenge.emit('update-challenge', {
      id: _id,
      challenge: updateChallengeDto,
    });
  }

  @Post('/:challenge/match/')
  async setChallengeToMatch(
    @Body(ValidationPipe) challengeToMatchDto: ChallengeToMatchDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    const challenge: Challenge = await this.clientChallenge
      .send('get-challenges', { idPlayer: '', _id: _id })
      .toPromise();

    this.logger.log(`challenge: ${JSON.stringify(challenge)}`);

    /*
            Verificamos se o desafio está cadastrado
        */
    if (!challenge) {
      throw new BadRequestException(`Desafio não cadastrado!`);
    }

    /*
            Verificamos se o desafio já foi realizado
        */
    if (challenge.status == ChallengeStatus.REALIZADO) {
      throw new BadRequestException(`Desafio já realizado!`);
    }

    /*
            Somente deve ser possível lançar uma partida para um desafio
            com status ACEITO
        */
    if (challenge.status != ChallengeStatus.ACEITO) {
      throw new BadRequestException(
        `Partidas somente podem ser lançadas em desafios aceitos pelos adversários!`,
      );
    }

    /*
            Verificamos se o jogador informado faz parte do desafio
        */
    if (!challenge.players.includes(challengeToMatchDto.challenger)) {
      throw new BadRequestException(
        `O jogador vencedor da partida deve fazer parte do desafio!`,
      );
    }

    /*
            Criamos nosso objeto partida, que é formado pelas
            informações presentes no Dto que recebemos e por informações
            presentes no objeto desafio que recuperamos 
        */
    const match: Match = {};
    match.category = challenge.category;
    match.challenger = challengeToMatchDto.challenger;
    match.challenge = _id;
    match.players = challenge.players;
    match.result = challengeToMatchDto.result;

    /*
            Enviamos a partida para o tópico 'criar-partida'
            Este tópico é responsável por persitir a partida na 
            collection Partidas
        */
    this.clientChallenge.emit('add-match', match);
  }

  @Delete('/:_id')
  async deleteChallenge(@Param('_id') _id: string): Promise<void> {
    const challenge: Challenge = await this.clientChallenge
      .send('get-challenges', { idPlayer: '', _id: _id })
      .toPromise();

    this.logger.log(`challenge: ${JSON.stringify(challenge)}`);

    /*
            Verificamos se o desafio está cadastrado
        */
    if (!challenge) {
      throw new BadRequestException(`Desafio não cadastrado!`);
    }

    this.clientChallenge.emit('delete-challenge', challenge);
  }
}
