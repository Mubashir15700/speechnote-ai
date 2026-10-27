
import { GoogleGenAI, Modality } from '@google/genai';
import { getGeminiToken } from './api';
import { startMicrophone } from './audio';

export async function connectToGeminiLive(
    onTranscript: (text: string) => void,
    onStatus: (status: string) => void,
) {
    onStatus('Getting secure token...');

    const token = await getGeminiToken();
    const ai = new GoogleGenAI({ apiKey: token });

    let microphone: { stop: () => void } | undefined;

    const session = await ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
            responseModalities: [Modality.AUDIO],
            inputAudioTranscription: {},
        },
        callbacks: {
            onopen: () => {
                onStatus('Connected — requesting microphone...');
                void startMicrophone((base64Audio) => {
                    session.sendRealtimeInput({
                        audio: {
                            data: base64Audio,
                            mimeType: 'audio/pcm;rate=16000',
                        },
                    });
                })
                    .then((mic) => {
                        microphone = mic;
                        onStatus('Recording — speak now');
                    })
                    .catch((error: unknown) => {
                        onStatus(
                            error instanceof Error
                                ? `Microphone error: ${error.message}`
                                : 'Could not access microphone',
                        );
                    });
            },
            onmessage: (message) => {
                const text = message.serverContent?.inputTranscription?.text;
                if (text) onTranscript(text);
            },
            onerror: (error) => {
                onStatus(`Gemini error: ${error.message}`);
            },
            onclose: () => {
                microphone?.stop();
                onStatus('Disconnected');
            },
        },
    });

    return {
        stop: () => {
            microphone?.stop();
            session.sendRealtimeInput({ audioStreamEnd: true });
            session.close();
        },
    };
}
