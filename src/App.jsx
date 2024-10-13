import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import BlogPost from './components/BlogPost';
import AdminPage from './components/AdminPage';
import logo from './assets/logo.svg';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav>
          <div className="nav-content">
            <div className="nav-brand">
              <img src={logo} alt="Blog Logo" className="nav-logo" />
              <span className="nav-title">blogAI</span>
            </div>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/admin">Admin</Link></li>
            </ul>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>

        <footer>
          <div className="footer-content">
            <p>&copy; Built with love by Srinivas Gogula.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;