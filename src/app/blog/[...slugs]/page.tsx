import { MarkdownBlog } from "@/components/MarkdownBlog";
import { fetchStrapi } from "@/fns/fetchStrapi";
import { TStrapiBlogDetail, TStrapiRes } from "@/types/strapi.type";
import { FC } from "react";

interface Props {
  params: {
    slugs: string[];
  };
  searchParams: Promise<{ id: string }>;
}

const BlogDetail: FC<Props> = async ({ params, searchParams }) => {
  const { slugs } = await params;
  const { id } = await searchParams;
  if (!slugs.includes("article")) {
    return <div>404</div>;
  }
  const blog = await fetchStrapi(`blogs/${id}`);
  const jsonData = await blog.json<TStrapiRes<TStrapiBlogDetail>>();
  return (
    <div className="m-auto max-w-7xl debug">
      <MarkdownBlog
        updatedAt={jsonData.data.updatedAt}
        title={jsonData.data.title}
        content={jsonData.data.md_content}
      />
    </div>
  );
};

export default BlogDetail;
