import React from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { marked } from 'marked';
import db from '../db';

function Home() {
  const posts = useLiveQuery(() => db.posts.toArray());

  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
  };

  return (
    <div className="home-container">
      <h1 className="page-title">Latest Blog Posts</h1>
      {posts?.map(post => {
        const plainTextContent = stripHtml(marked.parse(post.content));
        const truncatedContent = truncateText(plainTextContent, 150);

        return (
          <div key={post.id} className="blog-post">
            <h2><Link to={`/blog/${post.id}`}>{post.title}</Link></h2>
            <p>{truncatedContent}</p>
            <div className="post-meta">
              <small>{new Date(post.date).toLocaleDateString()}</small>
              <Link to={`/blog/${post.id}`} className="read-more">Read More</Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;