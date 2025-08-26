import dayjs from 'dayjs'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { CF_TOKEN } from '@/consts/keys'

let token = ''
let tokenLifetime = '1977-01-01T00:00:00Z'

function getCookieValue(
  cookieStr: string | null,
  key: string,
): string | undefined {
  if (!cookieStr) return undefined
  const match = cookieStr.match(new RegExp(`${key}=([^;]+)`))
  return match ? match[1] : undefined
}

export async function login() {
  console.log('🚀 ~ login ~ token:', token)
  console.log('🚀 ~ login ~ tokenLifetime:', tokenLifetime)

  if (token && tokenLifetime && dayjs(tokenLifetime).isAfter(dayjs())) {
    console.log('return token from closure')
    return token
  }
  const env = getCloudflareContext().env
  const kv = env.KV
  const { value, metadata } = await kv.getWithMetadata<{ expiration: string }>(
    CF_TOKEN,
  )

  console.log('🚀 ~ login ~ metadata:', metadata)
  console.log('🚀 ~ login ~ value:', value)

  if (value && metadata) {
    token = value
    tokenLifetime = metadata.expiration
    return value
  } else {
    await kv.delete(CF_TOKEN)
  }

  console.log('****************No valid token; re-login****************')

  const res = await fetch(env.STRAPI_URL, {
    headers: {
      'CF-Access-Client-Id': env.CF_CLIENT_ID,
      'CF-Access-Client-Secret': env.CF_CLIENT_SECRET,
    },
  })
  const setCookieStr = res.headers.get('set-cookie')
  console.log('🚀 ~ login ~ setCookieStr:', setCookieStr)
  const tokenRes = getCookieValue(setCookieStr, 'CF_Authorization')
  console.log('🚀 ~ login ~ tokenRes:', tokenRes)
  if (tokenRes) {
    token = tokenRes
    const ttl = dayjs().add(1, 'day').subtract(5, 'minute').unix()
    console.log('🚀 ~ login ~ ttl:', ttl)
    kv.put(CF_TOKEN, token, {
      // 5 minutes before expiration, to avoid inconsistency of KV
      expiration: ttl,
      metadata: { expiration: dayjs(ttl).format() },
    })
  }
  return token
}
