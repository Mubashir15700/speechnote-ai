
const API_URL = 'http://localhost:3000';

export async function checkApiHealth() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error('Failed to connect to the backend');
    }

    return response.json() as Promise<{
        message: string;
        status: string;
    }>;
}

export async function getGeminiToken(): Promise<string> {
    const response = await fetch(`${API_URL}/gemini/token`);

    if (!response.ok) {
        throw new Error('Failed to get Gemini token');
    }

    const data: { token: string } = await response.json();
    return data.token;
}

export type Transcript = {
    id: number;
    title: string;
    content: string;
    language: string;
    createdAt: string;
    updatedAt: string;
};

export type CreateTranscriptInput = {
    title?: string;
    content: string;
    language?: string;
};

export type UpdateTranscriptInput = {
    title?: string;
    content?: string;
    language?: string;
};

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        throw new Error(`API request failed (${response.status})`);
    }

    return response.json() as Promise<T>;
}

export async function saveTranscript(
    data: CreateTranscriptInput,
): Promise<Transcript> {
    const response = await fetch(`${API_URL}/transcripts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    return handleResponse<Transcript>(response);
}

export async function getTranscripts(): Promise<Transcript[]> {
    const response = await fetch(`${API_URL}/transcripts`);
    return handleResponse<Transcript[]>(response);
}

export async function getTranscript(id: number): Promise<Transcript> {
    const response = await fetch(`${API_URL}/transcripts/${id}`);
    return handleResponse<Transcript>(response);
}

export async function updateTranscript(
    id: number,
    data: UpdateTranscriptInput,
): Promise<Transcript> {
    const response = await fetch(`${API_URL}/transcripts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    return handleResponse<Transcript>(response);
}

export async function deleteTranscript(id: number): Promise<Transcript> {
    const response = await fetch(`${API_URL}/transcripts/${id}`, {
        method: 'DELETE',
    });

    return handleResponse<Transcript>(response);
}
