
import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, Modality } from '@google/genai';

@Controller()
export class AppController {
  constructor(private configService: ConfigService) { }

  @Get()
  getHello() {
    return {
      message: 'SpeechNote AI API is running!',
      status: 'ok',
    };
  }

  @Get('gemini/token')
  async createGeminiToken() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException(
        'GEMINI_API_KEY is not configured',
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        newSessionExpireTime: new Date(
          Date.now() + 60 * 1000,
        ).toISOString(),
        liveConnectConstraints: {
          model: 'gemini-2.5-flash-native-audio-preview-12-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            inputAudioTranscription: {},
          },
        },
      },
    });

    return { token: token.name };
  }
}
