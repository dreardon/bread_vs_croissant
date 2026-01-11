import { NextResponse } from 'next/server';
import { getGamesData, saveGamesData } from '@/lib/gcs';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const jsonData = await getGamesData();
        let history = [];

        try {
            history = JSON.parse(jsonData);
            if (!Array.isArray(history)) history = [];
        } catch (e) {
            history = [];
        }

        let breadWins = 0;
        let croissantWins = 0;

        // Process records
        history.forEach(game => {
            if (game.breadScore > game.croissantScore) breadWins++;
            if (game.croissantScore > game.breadScore) croissantWins++;
        });

        return NextResponse.json({
            breadWins,
            croissantWins,
            totalGames: history.length,
            history
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.email !== "danreardon@gmail.com") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { breadScore, croissantScore, date } = body;

        let jsonData = await getGamesData();
        let history = [];
        try {
            history = JSON.parse(jsonData);
            if (!Array.isArray(history)) history = [];
        } catch (e) {
            history = [];
        }

        const newGame = { date, breadScore, croissantScore };
        history.push(newGame);

        await saveGamesData(JSON.stringify(history, null, 2));

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to save data: ' + error.message }, { status: 500 });
    }
}
