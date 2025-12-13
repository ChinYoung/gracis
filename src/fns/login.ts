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
  if (token && tokenLifetime && dayjs(tokenLifetime).isAfter(dayjs())) {
    console.log('return token from closure')
    return token
  }
  const { KV: kv, NEXTJS_ENV, STRAPI_URL, CF_CLIENT_ID, CF_CLIENT_SECRET, } = getCloudflareContext().env
  console.log("🚀 ~ login ~ CF_CLIENT_SECRET:", CF_CLIENT_SECRET)
  console.log("🚀 ~ login ~ CF_CLIENT_ID:", CF_CLIENT_ID)
  console.log("🚀 ~ login ~ STRAPI_URL:", STRAPI_URL)
  console.log("🚀 ~ login ~ NEXTJS_ENV:", NEXTJS_ENV)
  if (NEXTJS_ENV === 'development') {
    return ''
  }
  const { value, metadata } = await kv.getWithMetadata<{ expiration: string }>(
    CF_TOKEN,
  )

  if (value && metadata) {
    token = value
    tokenLifetime = metadata.expiration
    return value
  } else {
    await kv.delete(CF_TOKEN)
  }

  console.log('****************No valid token; re-login****************')

  const res = await fetch(STRAPI_URL, {
    headers: {
      'CF-Access-Client-Id': CF_CLIENT_ID,
      'CF-Access-Client-Secret': CF_CLIENT_SECRET,
    },
  })
  const setCookieStr = res.headers.get('set-cookie')
  const tokenRes = getCookieValue(setCookieStr, 'CF_Authorization')
  if (tokenRes) {
    token = tokenRes
    const ttl = dayjs().add(1, 'day').subtract(5, 'minute').unix()
    kv.put(CF_TOKEN, token, {
      // 5 minutes before expiration, to avoid inconsistency of KV
      expiration: ttl,
      metadata: { expiration: dayjs(ttl).format() },
    })
  }
  return token
}
