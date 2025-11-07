import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { text, fid, signerUuid } = await request.json()

    const apiKey = process.env.NEYNAR_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Neynar API key not configured' },
        { status: 500 }
      )
    }

    if (!text || !fid || !signerUuid) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Post cast using Neynar API
    const response = await fetch('https://api.neynar.com/v2/farcaster/cast', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'api_key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        signer_uuid: signerUuid,
        text: text,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Neynar API error:', error)
      return NextResponse.json(
        { error: 'Failed to post cast' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({ success: true, cast: data })
  } catch (error) {
    console.error('Error posting cast:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
