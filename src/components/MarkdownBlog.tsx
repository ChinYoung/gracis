'use client'
import { FC, use } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import 'github-markdown-css/github-markdown.css'
import dayjs from 'dayjs'
import { ConfigProvider, theme, Typography } from 'antd'
import { useIsDarkTheme } from '@/hooks/useIsDarkTheme'

export const MarkdownBlog: FC<{
  content: string
  title: string
  updatedAt: string
}> = ({ content, title, updatedAt }) => {
  const { Title, Text } = Typography
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className='pb-10  prose prose-stone lg:prose-lg dark:prose-invert'>

        <Title>{title}</Title>
        <Text>
        Updated at: {dayjs(updatedAt).format('MMMM D, YYYY')}
        </Text>
        {/* className='mt-4 text-sm opacity-50'> */}
        {/* </div> */}
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </div>
    </ConfigProvider>
  )
}
