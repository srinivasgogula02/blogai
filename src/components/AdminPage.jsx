import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../db';

function AdminPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const suggestions = useLiveQuery(() => db.suggestions.toArray());

  const handleSubmit = async (e) => {
    e.preventDefault();
    await db.posts.add({
      title,
      content,
      date: new Date()
    });
    setTitle('');
    setContent('');
    alert('Blog post added!');
  };

  return (
    <div className="admin-container">
      <h1 className="page-title">Admin Dashboard</h1>
      <div className="admin-section">
        <h2>Create New Blog Post</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Blog Title" 
            required 
          />
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="Blog Content" 
            required 
          />
          <button type="submit" className="btn">Add Blog Post</button>
        </form>
      </div>

      <div className="admin-section">
        <h2>Suggestions</h2>
        {suggestions?.map(suggestion => (
          <div key={suggestion.id} className="suggestion">
            <p><strong>For Post ID:</strong> {suggestion.postId}</p>
            <p>{suggestion.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;