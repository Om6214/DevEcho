import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // const logger = new Logger('NestDebug');
  // console.log('Starting Nest Debug Mode...');

  // // ✅ Add this to log which provider fails
  // process.on('uncaughtException', (err) => {
  //   logger.error('❌ Uncaught Exception: ' + err.stack);
  // });

  // process.on('unhandledRejection', (reason: any) => {
  //   logger.error('❌ Unhandled Rejection: ' + JSON.stringify(reason, null, 2));
  // });

  // const originalInstantiateClass = (app as any).container.injector.instantiateClass;
  // (app as any).container.injector.instantiateClass = async function (...args) {
  //   try {
  //     return await originalInstantiateClass.apply(this, args);
  //   } catch (e) {
  //     const metatype = args?.[0]?.metatype;
  //     const name = metatype?.name || JSON.stringify(metatype);
  //     console.error(`❌ Error instantiating provider: ${name}`, e.message);
  //     throw e;
  //   }
  // };

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
