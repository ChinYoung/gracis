import { fetchStrapi } from '@/fns/fetchStrapi'
import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetchStrapi(`${process.env.STRAPI_URL}/api/tags`)
  return new NextResponse(res.body, {
    headers: { 'Content-Type': 'application/json' },
  })
}
