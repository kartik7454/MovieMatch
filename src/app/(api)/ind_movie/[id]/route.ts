import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'No movie id provided' }, { status: 400 });
  }

  try {
    const apiRes = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?append_to_response=recommendations%2Cwatch%2Fproviders%2Cvideos`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN}`,
          accept: 'application/json',
        },
        // No cache: always get fresh data
        cache: 'no-store',
      }
    );
    const data = await apiRes.json();

    if (!apiRes.ok || data.success === false) {
      return NextResponse.json(
        { error: data.status_message || 'Failed to fetch movie details' },
        { status: apiRes.status || 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Unknown error' },
      { status: 500 }
    );
  }
}