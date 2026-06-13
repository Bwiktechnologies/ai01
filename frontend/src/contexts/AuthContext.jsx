import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 8-second safety timeout for loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError('Loading took too long. Please refresh the page.');
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const profileData = { uid: user.uid, ...docSnap.data() };
            setUserProfile(profileData);
            setIsAdmin(profileData.role === 'admin');
          } else {
            // User exists in Auth but not in Firestore -> not allowed
            await signOut(auth);
            setUserProfile(null);
            setIsAdmin(false);
            setError('Access denied: Profile not found.');
          }
        } else {
          setUserProfile(null);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Auth state error:', err);
        setError('Error loading user profile.');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // --- SILENT ACTIVITY TRACKER ---
  useEffect(() => {
    // Only track if a user is logged in
    if (!userProfile || !auth.currentUser) return;
    
    const trackActivity = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await fetch('http://localhost:5000/api/student/activity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Silently update userProfile so charts reflect it, without forcing a massive app reload
          setUserProfile(prev => ({
            ...prev,
            dailyActivity: data.dailyActivity
          }));
        }
      } catch (err) {
        // Silently fail if tracker errors out (e.g. offline)
      }
    };

    // Ping every 60 seconds
    const intervalId = setInterval(trackActivity, 60000);
    
    // Also ping immediately once on mount/login (optional, maybe skip to avoid double counting if they just log in)
    // trackActivity();

    return () => clearInterval(intervalId);
  }, [userProfile?.uid]); // only re-run if UID changes

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const docRef = doc(db, 'users', userCredential.user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const profileData = { uid: userCredential.user.uid, ...docSnap.data() };
        setUserProfile(profileData);
        setIsAdmin(profileData.role === 'admin');
        return profileData;
      } else {
        await signOut(auth);
        throw new Error('Access denied: Profile not found.');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      const docRef = doc(db, 'users', userCredential.user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const profileData = { uid: userCredential.user.uid, ...docSnap.data() };
        setUserProfile(profileData);
        setIsAdmin(profileData.role === 'admin');
        return profileData;
      } else {
        await signOut(auth);
        throw new Error('Access denied: You are not registered for this platform.');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUserProfile(null);
      setIsAdmin(false);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    userProfile,
    isAdmin,
    loading,
    error,
    login,
    googleLogin,
    logout,
    setUserProfile // Allow manual updates to profile in context
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
