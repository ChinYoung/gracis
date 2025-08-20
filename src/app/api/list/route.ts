import { getCloudflareContext } from '@opennextjs/cloudflare'

export async function GET(_request: Request) {
  try {
    const r2 = getCloudflareContext().env.gracias
    const res = await r2.list()
    if (res.objects.length) {
      return Response.json({
        data: res.objects.map((item) => item.key),
      })
    }
    return Response.json({
      data: [],
    })
  } catch (error) {
    console.error('🚀 ~ GET ~ error:', error)
  }
  return new Response('success')
}
