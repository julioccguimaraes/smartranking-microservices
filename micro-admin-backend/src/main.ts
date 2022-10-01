import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as momentTimezone from 'moment-timezone';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('RMQ_URL')],
      /*
        Permite enviar de volta ao rabbitmq que uma mensagem foi recebida e processada
        Se o consumer não confirmar para o rabbitmq que a mensagem foi entregue e processada,
        o rabbitmq vai entender que a mensagem precisa ser novamente enfileirada.
        Então a gente vai contar ao rabbitmq quando ele pode considerar que a mensagem foi entregue
        Só assim o rabbitmq vai retirar a mensagem da fila
      */
      noAck: false,
      queue: 'admin-backend',
    },
  });

  /*
    Sobrescrevemos a função toJSON do Date passando um objeto moment. Deste modo 
    quando o objeto for serializado, ele utilizará o formato de data definido por nós.
    Todos os objetos Date serão afetados com esta implementação 
  */

  Date.prototype.toJSON = function (): any {
    return momentTimezone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };

  //await app.listen(3000);
  await app.listen();
}
bootstrap();
