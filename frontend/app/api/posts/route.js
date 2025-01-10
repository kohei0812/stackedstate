// app/api/posts/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
  const formData = await request.formData();
  
  const data = {
    date: formData.get('date'),
    title: formData.get('title'),
    content: formData.get('content'),
    location_id: formData.get('location_id'),
  };

  // チラシ画像がある場合はファイルを送信
  if (formData.has('flyer_image')) {
    const flyerImage = formData.get('flyer_image');
    data.flyer_image = flyerImage;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const post = await response.json();
    return NextResponse.json(post, { status: 201 });
  } else {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
