
export async function startMicrophone(
    onAudioData: (base64Audio: string) => void,
): Promise<{
    stop: () => void;
}> {
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
        },
    });

    const audioContext = new AudioContext({ sampleRate: 16000 });
    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    processor.onaudioprocess = (event) => {
        const input = event.inputBuffer.getChannelData(0);
        const pcm = new Int16Array(input.length);

        for (let i = 0; i < input.length; i++) {
            const sample = Math.max(-1, Math.min(1, input[i]));
            pcm[i] = sample < 0 ? sample * 32768 : sample * 32767;
        }

        const bytes = new Uint8Array(pcm.buffer);
        let binary = '';

        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }

        onAudioData(btoa(binary));
    };

    source.connect(processor);
    processor.connect(audioContext.destination);

    return {
        stop: () => {
            processor.disconnect();
            source.disconnect();
            stream.getTracks().forEach((track) => track.stop());
            void audioContext.close();
        },
    };
}
