import { MarkdownBlog } from "@/components/MarkdownBlog";
import { fetchStrapi } from "@/fns/fetchStrapi";
import { TStrapiBlogDetail, TStrapiRes } from "@/types/strapi.type";
import { FC } from "react";

const BlogDetail: FC<{ params: Promise<{ docId: string }> }> = async ({
  params,
}) => {
  const { docId } = await params;
  const blog = await fetchStrapi(`blogs/${docId}`);
  const jsonData = await blog.json<TStrapiRes<TStrapiBlogDetail>>();
  return (
    <div className="m-auto">
      <MarkdownBlog
        updatedAt={jsonData.data.updatedAt}
        title={jsonData.data.title}
        content={jsonData.data.md_content}
      />
    </div>
  );
};

export default BlogDetail;
