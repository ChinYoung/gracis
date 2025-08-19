import { getCloudflareContext } from '@opennextjs/cloudflare'

export async function GET(_request: Request) {
  try {
    const res = await getCloudflareContext().env.gracias?.list()
    console.log('🚀 ~ GET ~ res:', res)
  } catch (error) {
    console.error('🚀 ~ GET ~ error:', error)
  }
  return new Response('success')
}
