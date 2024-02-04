// App.js

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { useUser } from './UserContext';
import Login from './Login';
import Registration from './Registration';

function App() {
  const {
    enteredUsername,
    setEnteredUsername,
    posts,
    setPosts,
    search,
    setSearch,
    searchResults,
    setSearchResults,
    loading,
    setLoading,
    fetchPosts,
    handleSubmit,
    handleComment,
    handleSearch,
  } = useUser();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/posts/`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch posts for the logged-in user upon login
    if (enteredUsername) {
      fetchUserPosts();
    }
  }, [enteredUsername, setPosts, setLoading]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout');
      setEnteredUsername('');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    const message = e.target.elements.message.value;
    if (message.trim() !== '') {
      handleSubmit(message);
      e.target.elements.message.value = '';
    }
  };

  const handleCommentSubmit = (postId, e) => {
    e.preventDefault();
    const message = e.target.elements.comment.value;
    if (message.trim() !== '') {
      handleComment(postId, { userName: enteredUsername, message });
      e.target.elements.comment.value = '';
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/login"
            element={enteredUsername ? <Navigate to="/posts" /> : <Login setEnteredUsername={setEnteredUsername} />}
          />
          <Route
            path="/register"
            element={enteredUsername ? <Navigate to="/posts" /> : <Registration setEnteredUsername={setEnteredUsername} />}
          />
          <Route
            path="/posts"
            element={
              enteredUsername ? (
                <div className="post-feed-container">
                  <div className="header">
                    <h1>POSTFEED</h1>
                    <button className="logout-button" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                  <div className="post-section">
                    <form onSubmit={handlePostSubmit}>
                      <textarea placeholder="Your message" name="message" />
                      <button type="submit">Post</button>
                    </form>
                  </div>
                  <h2>Search:</h2>
                  <form onSubmit={handleSearchSubmit}>
                    <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <button type="submit">Search</button>
                  </form>
                  {loading && <p>Loading...</p>}
                  {searchResults.length > 0 ? (
                    <ul>
                      {searchResults.map((result) => (
                        <li key={result._id} className="post">
                          <h3>{result.userName}</h3>
                          <p>{result.message}</p>
                          
                          <form onSubmit={(e) => handleCommentSubmit(result._id, e)}>
                            <input type="text" placeholder="Your comment" name="comment" />
                            <button type="submit">Comment</button>
                          </form>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{search !== '' ? 'No results found.' : ''}</p>
                  )}
                  <div className="posts">
                    <h2>All Posts:</h2>
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      <>
                        {posts.length > 0 ? (
                          <ul>
                            {posts.map((post) => (
                              <li key={post._id} className="post">
                                <h3>{post.userName}</h3>
                                <p>{post.message}</p>
                                <h4>Comments:</h4>
                                <ul>
                                  {post.comments.map((comment) => (
                                    <li key={comment._id}>
                                      <p>
                                        {comment.userName}: {comment.message}
                                      </p>
                                    </li>
                                  ))}
                                </ul>
                                {enteredUsername && (
                                  <form onSubmit={(e) => handleCommentSubmit(post._id, e)}>
                                    <input type="text" placeholder="Your comment" name="comment" />
                                    <button type="submit">Comment</button>
                                  </form>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No posts available. Start by creating a post!</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route index element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;