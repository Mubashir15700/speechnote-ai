
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TranscriptsService {
    constructor(private readonly prisma: PrismaService) { }

    create(data: {
        title?: string;
        content: string;
        language?: string;
    }) {
        return this.prisma.transcript.create({
            data: {
                title: data.title,
                content: data.content,
                language: data.language,
            },
        });
    }

    findAll() {
        return this.prisma.transcript.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: number) {
        const transcript = await this.prisma.transcript.findUnique({
            where: { id },
        });

        if (!transcript) {
            throw new NotFoundException(`Transcript ${id} not found`);
        }

        return transcript;
    }

    async update(
        id: number,
        data: {
            title?: string;
            content?: string;
            language?: string;
        },
    ) {
        await this.findOne(id);

        return this.prisma.transcript.update({
            where: { id },
            data,
        });
    }

    async remove(id: number) {
        await this.findOne(id);

        return this.prisma.transcript.delete({
            where: { id },
        });
    }
}
