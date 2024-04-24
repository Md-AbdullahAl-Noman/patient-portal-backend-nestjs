
import * as dotenv from 'dotenv';
dotenv.config()
import * as session from 'express-session';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';



async function bootstrap() {

  const server = express();
  server.use('/uploads', express.static('uploads'));
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));


  app.use(session({
    secret: 'noman-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 120000 }, // For 2min
    
  }));



  await app.listen(3000);
}
bootstrap();
