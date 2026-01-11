import { Storage } from '@google-cloud/storage';

// Initialize GCS
const storage = new Storage();

const BUCKET_NAME = process.env.GCS_BUCKET_NAME || 'gs://bread-vs-croissant-results';
const FILE_NAME = 'games.json';

export async function getGamesData() {
    try {
        const bucket = storage.bucket(BUCKET_NAME);
        const file = bucket.file(FILE_NAME);

        // Check if file exists
        const [exists] = await file.exists();
        if (!exists) {
            return '[]'; // Return empty JSON array if no file
        }

        const [content] = await file.download();
        return content.toString();
    } catch (error) {
        console.error('Error reading from GCS:', error);
        // Return mock data if credentials setup fails in dev
        if (process.env.NODE_ENV === 'development') {
            console.warn('Returning mock JSON data for development');
            return JSON.stringify([
                { date: '2026-01-08', breadScore: 7, croissantScore: 10 },
                { date: '2026-01-15', breadScore: 4, croissantScore: 14 },
                { date: '2026-01-22', breadScore: 8, croissantScore: 12 },
                { date: '2026-01-29', breadScore: 13, croissantScore: 13 },
                { date: '2026-02-05', breadScore: 9, croissantScore: 7 },
                { date: '2026-02-12', breadScore: 14, croissantScore: 8 }
            ]);
        }
        throw error;
    }
}

export async function saveGamesData(jsonContent) {
    try {
        const bucket = storage.bucket(BUCKET_NAME);
        const file = bucket.file(FILE_NAME);
        await file.save(jsonContent, {
            contentType: 'application/json',
            resumable: false
        });
    } catch (error) {
        console.error('Error writing to GCS:', error);
        throw error;
    }
}
