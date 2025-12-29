import Image from 'next/image'

export default async function Item({
  params,
}: {
  params: Promise<{ item: string }>
  }) {
  const { item } = await params
  return (
    <div>
      {item}
      <Image
        src={`${process.env.API_HOST}/api/detail/${item}`}
        alt={item}
        width={800}
        height={600}
      />
    </div>
  )
}
