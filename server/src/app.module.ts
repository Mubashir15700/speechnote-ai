import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { TranscriptsModule } from './transcripts/transcripts.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, TranscriptsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
