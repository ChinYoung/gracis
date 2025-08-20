import { getCloudflareContext } from '@opennextjs/cloudflare'
import Image from 'next/image'

export default async function Item({
  params,
}: {
  params: Promise<{ item: string }>
}) {
  const env = getCloudflareContext().env
  const { item } = await params
  return (
    <div>
      {item}
      <Image
        src={`${env.API_HOST}/api/detail/${item}`}
        alt={item}
        width={800}
        height={600}
      />
    </div>
  )
}
