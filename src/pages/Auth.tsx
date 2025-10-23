import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth({ onAuth }: { onAuth?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function signUp() {
    try {
      setLoading(true);
      setMessage('Creating your account...');
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setMessage('❌ Signup error: ' + error.message);
        setLoading(false);
        return;
      }

      const user = data.user ?? (await supabase.auth.getUser()).data.user;
      if (!user) {
        setMessage('✅ Signup successful. Please check your email to confirm.');
        setLoading(false);
        return;
      }

      const profile = {
        id: user.id,
        email: user.email,
        created_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase.from('profiles').insert([profile]);

      if (insertError) {
        console.error('Profile insert failed:', insertError);
        setMessage('⚠️ Signup succeeded, but saving profile failed: ' + insertError.message);
      } else {
        setMessage('✅ Signup and profile created successfully!');
        onAuth?.();
      }
    } catch (err: any) {
      console.error(err);
      setMessage('❌ Unexpected error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Sign In / Sign Up</h1>
      <input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem' }}
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem' }}
      />
      <button onClick={signUp} disabled={loading}>
        {loading ? 'Please wait...' : 'Sign Up'}
      </button>
      <p>{message}</p>
    </div>
  );
}
