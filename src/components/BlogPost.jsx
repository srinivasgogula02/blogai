import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { marked } from 'marked';
import db from '../db';

function BlogPost() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  const post = useLiveQuery(() => db.posts.get(parseInt(id)));
  const suggestions = useLiveQuery(() => db.suggestions.where('postId').equals(parseInt(id)).toArray());

  const handleEdit = async (e) => {
    e.preventDefault();
    await db.posts.update(parseInt(id), {
      title: e.target.title.value,
      content: e.target.content.value,
    });
    setIsEditing(false);
  };

  const handleSuggest = async (e) => {
    e.preventDefault();
    await db.suggestions.add({
      postId: parseInt(id),
      content: suggestion
    });
    setSuggestion('');
    alert('Suggestion submitted!');
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="blog-post-container">
      {isEditing ? (
        <form onSubmit={handleEdit} className="edit-form">
          <input name="title" defaultValue={post.title} className="edit-title" />
          <textarea name="content" defaultValue={post.content} className="edit-content" />
          <button type="submit" className="btn">Save</button>
        </form>
      ) : (
        <>
          <div className="edit-suggest">
            <button onClick={() => setIsEditing(true)} className="btn">Edit</button>
            <button onClick={() => document.getElementById('suggestion-form').style.display = 'block'} className="btn">Suggest</button>
          </div>
          <h1 className="blog-title">{post.title}</h1>
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: marked.parse(post.content) }} />
          <small className="blog-date">{new Date(post.date).toLocaleDateString()}</small>
        </>
      )}
      <form id="suggestion-form" style={{display: 'none'}} onSubmit={handleSuggest} className="suggestion-form">
        <textarea 
          value={suggestion} 
          onChange={(e) => setSuggestion(e.target.value)}
          placeholder="Enter your suggestion"
          className="suggestion-input"
        />
        <button type="submit" className="btn">Submit Suggestion</button>
      </form>
      
      <div className="suggestions-container">
        <h2>Suggestions</h2>
        {suggestions?.map(suggestion => (
          <div key={suggestion.id} className="suggestion">
            <p>{suggestion.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogPost;