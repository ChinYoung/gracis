// src/worker/index.ts
interface Env {
  gracias: R2Bucket
}

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext,
  ): Promise<Response> {
    console.log('🚀 ~ fetch ~ request.url:', request.url)
    const url = new URL(request.url)
    console.log('🚀 ~ fetch ~ url:', url)
    // 路由到不同功能
    if (request.url.startsWith('/storage')) {
      return handleStorage(request, env)
    } else if (request.url.startsWith('/data')) {
      return handleData(request, env)
    }

    return new Response('Not found', { status: 404 })
  },
}

async function handleStorage(_request: Request, _env: Env) {
  return new Response('Success')
}

async function handleData(_request: Request, _env: Env) {
  return new Response('Success')
}
