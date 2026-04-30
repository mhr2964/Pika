import React, { useState, useEffect } from 'react';  
import { fetchUserProfile, updateUserProfile } from '../lib/apiClient';  
  
export function ProfileEdit() {  
  const [profile, setProfile] = useState({ name: '', email: '' });  
  const [isLoading, setIsLoading] = useState(true);  
  const [error, setError] = useState('');  
  
  useEffect(() => {  
    const controller = new AbortController();  
    const signal = controller.signal;  
  
    const getUserProfile = async () => {  
      try {  
        const userProfile = await fetchUserProfile(signal);  
        setProfile(userProfile);  
      } catch (err) {  
        if (err.name !== 'AbortError') {  
          setError('Failed to load profile data');  
        }  
      } finally {  
        setIsLoading(false);  
      }  
    };  
  
    getUserProfile();  
    return () => controller.abort();  
  }, []);  
  
  const handleChange = (e) => {  
    const { name, value } = e.target;  
    setProfile(prevProfile => ({ ...prevProfile, [name]: value }));  
  };  
  
  const handleSubmit = async (e) => {  
    e.preventDefault();  
    try {  
      await updateUserProfile(profile);  
      alert('Profile updated successfully!');  
    } catch (err) {  
      setError('Failed to update profile');  
    }  
  };  
  
  if (isLoading) return <div>Loading...</div>;  
  if (error) return <div>{error}</div>;  
  
  return (  
    <form onSubmit={handleSubmit}>  
      <div>  
        <label htmlFor="name">Name:</label>  
        <input type="text" name="name" value={profile.name} onChange={handleChange} required />  
      </div>  
      <div>  
        <label htmlFor="email">Email:</label>  
        <input type="email" name="email" value={profile.email} onChange={handleChange} required />  
      </div>  
      <button type="submit">Save Changes</button>  
    </form>  
  );  
}  