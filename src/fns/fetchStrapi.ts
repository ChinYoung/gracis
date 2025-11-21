import { login } from '@/fns/login'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { message } from 'antd'

export async function fetchStrapi(...args: Parameters<typeof fetch>) {
  const env = getCloudflareContext().env
  const cf_token = await login()
  const res = await fetch(`${env.STRAPI_URL}/api/${args[0]}`, {
    ...args[1],
    headers: {
      ...(args[1]?.headers || {}),
      Authorization: `Bearer ${env.STRAPI_TOKEN}`,
      'cf-access-token': cf_token,
    },
  })
  if (res.ok) {
    return res
  }
  throw new Error(res.statusText)
}
