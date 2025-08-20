import { getCloudflareContext } from '@opennextjs/cloudflare'
import type { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ item: string }> },
) {
  try {
    const { item: key } = await params
    console.log('🚀 ~ ~ ~ ~ ~ ~ ~ ~ ~ GET ~ item:', key)

    const r2 = getCloudflareContext().env.gracias
    console.log('🚀 ~ GET ~ key:', key)
    const object = await r2.get(key)
    if (object === null) {
      return new Response('Object Not Found', { status: 404 })
    }

    const headers = new Headers()
    console.log('🚀 ~ GET ~ object.httpMetadata:', object.httpMetadata)
    if (object.httpMetadata) {
      Object.entries(object.httpMetadata).forEach(([key, value]) => {
        headers.set(key, value)
      })
    }
    headers.set('etag', object.httpEtag)
    // object.writeHttpMetadata(headers)

    // When no body is present, preconditions have failed
    return new Response('body' in object ? object.body : undefined, {
      status: 'body' in object ? 200 : 412,
      headers,
    })
  } catch (error) {
    console.error('🚀 ~ GET ~ error:', error)
    return new Response('error', { status: 500 })
  }
}
