import { NextResponse } from 'next/server'

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '8265bd1679663a7ea12ac168da84d2e8' // Free demo key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'popular'
  const query = searchParams.get('query') || ''

  try {
    let endpoint = ''
    
    if (query) {
      // Search for movies and TV shows
      endpoint = `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    } else if (type === 'popular') {
      // Get popular movies
      endpoint = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`
    } else if (type === 'tv') {
      // Get popular TV shows
      endpoint = `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}`
    }

    const response = await fetch(endpoint)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.status_message || 'Failed to fetch data')
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('TMDB API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}
