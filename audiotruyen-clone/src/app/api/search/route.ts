import { NextRequest, NextResponse } from 'next/server';
import { searchStories } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ results: [] });
    }

    // In a real app, this might be a database call.
    // Here we use the mock data helper.
    const results = searchStories(query);

    // Limit to 5 results for the dropdown
    const limitedResults = results.slice(0, 5);

    return NextResponse.json({ results: limitedResults });
}
