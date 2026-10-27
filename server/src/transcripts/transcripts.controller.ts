
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { TranscriptsService } from './transcripts.service.js';

@Controller('transcripts')
export class TranscriptsController {
    constructor(
        private readonly transcriptsService: TranscriptsService,
    ) { }

    @Post()
    create(
        @Body()
        body: {
            title?: string;
            content: string;
            language?: string;
        },
    ) {
        return this.transcriptsService.create(body);
    }

    @Get()
    findAll() {
        return this.transcriptsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.transcriptsService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body()
        body: {
            title?: string;
            content?: string;
            language?: string;
        },
    ) {
        return this.transcriptsService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.transcriptsService.remove(id);
    }
}
