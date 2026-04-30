export const fetchUserProfile = async (signal) => {  
  const res = await fetch('/api/profile', { signal });  
  if (!res.ok) throw new Error('Network response was not ok');  
  return res.json();  
};  
  
export const updateUserProfile = async (profile) => {  
  const res = await fetch('/api/profile', {  
    method: 'PUT',  
    headers: { 'Content-Type': 'application/json' },  
    body: JSON.stringify(profile),  
  });  
  if (!res.ok) throw new Error('Network response was not ok');  
};  