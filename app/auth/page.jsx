'use client';
import { Button } from '@/components/ui/button';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import React from 'react';

// ✅ Correct Supabase Initialization
const supabase = createClient(
  'https://czmszbbkfeiegoycrdlg.supabase.co', // ✅ your Supabase project URL
  'your-anon-key-here'                         // ✅ your Supabase anon public key
);

function Login() {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        
      },
    });

    if (error) {
      console.error('Google login error:', error.message);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-4'>
      <div className='flex flex-col items-center border rounded-2xl p-8 w-full max-w-md bg-white shadow-lg'>
        
        {/* Logo */}
        <Image
          src='/logo.png'
          alt='Logo'
          width={180}
          height={60}
          className='mb-4'
        />

        {/* Login Illustration */}
        <Image
          src='/login.png'
          alt='Login illustration'
          width={300}
          height={200}
          className='rounded-2xl mb-5'
        />

        {/* Headings */}
        <h2 className='text-2xl font-bold text-center'>Welcome to AiCruiter</h2>
        <p className='text-gray-500 text-center mb-6'>
          Sign In With Google Authentication
        </p>

        {/* Google Login Button */}
        <Button className='w-full' onClick={signInWithGoogle}>
          Login With Google
        </Button>
      </div>
    </div>
  );
}

export default Login;







