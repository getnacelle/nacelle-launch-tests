import React from 'react';
import { useRouter } from 'next/router';
import $nacelle from 'services/nacelle.js';

const Blog = ({ articles }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return <pre>{JSON.stringify(articles)}</pre>;
};

export default Blog;

export async function getStaticPaths() {
  try {
    const allContent = await $nacelle.data.allContent();
    const blogs = allContent.filter((entry) => entry.type === 'blog');
    return {
      paths: blogs.flatMap((blog) =>
        blog.articleLists[0].handles.map((handle) => {
          return { params: { blogHandle: blog.handle, handle } };
        })
      ),
      fallback: true
    };
  } catch (err) {
    console.error(`Error fetching blogs & articles:\n${err}`);
  }
}

export async function getStaticProps({ params }) {
  try {
    const articles = await $nacelle.data.blogPage({
      handle: params.blogHandle,
      paginate: true,
      itemsPerPage: 6
    });

    return {
      props: { articles } // will be passed to the page component as props
    };
  } catch (err) {
    throw new Error(err);
  }
}
