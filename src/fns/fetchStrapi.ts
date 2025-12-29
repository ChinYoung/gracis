import { login } from "@/fns/login";

export async function fetchStrapi(...args: Parameters<typeof fetch>) {
  const env = process.env;
  console.log("🚀 ~ fetchStrapi ~ env.STRAPI_URL:", env.STRAPI_URL)
  const cf_token = await login();
  const res = await fetch(`${env.STRAPI_URL}/api/${args[0]}`, {
    ...args[1],
    headers: {
      ...(args[1]?.headers || {}),
      Authorization: `Bearer ${env.STRAPI_TOKEN}`,
      "cf-access-token": cf_token,
    },
  });
  if (res.ok) {
    console.log("🚀 ~ fetchStrapi ~ res:", res)
    return res;
  }
  if (res.status === 404) {
    throw new NotFoundError(res.statusText);
  }
  throw new Error(res.statusText);
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
