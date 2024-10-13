import Dexie from 'dexie';

const db = new Dexie('BlogDatabase');
db.version(1).stores({
  posts: '++id, title, content, date',
  suggestions: '++id, postId, content'
});

export default db;