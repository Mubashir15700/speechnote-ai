
import { Module } from '@nestjs/common';
import { TranscriptsController } from './transcripts.controller.js';
import { TranscriptsService } from './transcripts.service.js';

@Module({
    controllers: [TranscriptsController],
    providers: [TranscriptsService],
})
export class TranscriptsModule { }
