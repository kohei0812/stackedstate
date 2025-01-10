// app/api/locations/route.js

import { NextResponse } from 'next/server';

export async function GET() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations`);
  if (response.ok) {
    const locations = await response.json();
    return NextResponse.json(locations);
  } else {
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}
