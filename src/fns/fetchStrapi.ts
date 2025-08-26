import { login } from '@/fns/login'
import { getCloudflareContext } from '@opennextjs/cloudflare'

export async function fetchStrapi(...args: Parameters<typeof fetch>) {
  console.log('🚀 ~ fetchStrapi ~ args:', args)
  const env = getCloudflareContext().env
  const cf_token = await login()
  return fetch(`${env.STRAPI_URL}/api/${args[0]}`, {
    ...args[1],
    headers: {
      ...(args[1]?.headers || {}),
      Authorization: `Bearer ${env.STRAPI_TOKEN}`,
      'cf-access-token': cf_token,
    },
  })
}
