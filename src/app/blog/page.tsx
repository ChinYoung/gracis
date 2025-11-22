import { fetchStrapi } from "@/fns/fetchStrapi";
import { TStrapiBlogs, TStrapiRes } from "@/types/strapi.type";
import Link from "next/link";

const Blog = async () => {
  const blogs = await fetchStrapi("blogs");
  const jsonData = await blogs.json<TStrapiRes<TStrapiBlogs[]>>();
  return (
    <div>
      {jsonData.data.map((blog) => (
        <div key={blog.id}>
          <Link href={`/blog/${blog.documentId}`}>
            <h2>{blog.title}</h2>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Blog;
