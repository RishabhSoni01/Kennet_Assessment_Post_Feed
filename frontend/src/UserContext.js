import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [enteredUsername, setEnteredUsername] = useState(localStorage.getItem('enteredUsername') || '');
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('enteredUsername', enteredUsername);
  }, [enteredUsername]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/posts');
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (message) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/posts', { userName: enteredUsername, message });
      setPosts([response.data, ...posts]);
      setLoading(false);
    } catch (error) {
      console.error('Error creating post:', error);
      setLoading(false);
    }
  };

  const handleComment = async (id, comment) => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/posts/${id}/comments`, comment);
      const updatedPosts = posts.map((post) => (post._id === id ? { ...post, comments: [...post.comments, response.data] } : post));
      setPosts(updatedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error adding comment:', error);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/search', { search });
      setSearchResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error searching posts:', error);
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ enteredUsername, setEnteredUsername, posts, setPosts, search, setSearch, searchResults, setSearchResults, loading, setLoading, fetchPosts, handleSubmit, handleComment, handleSearch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};