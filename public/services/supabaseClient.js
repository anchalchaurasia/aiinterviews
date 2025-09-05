import { createClient } from '@supabase/supabase-js'
import { noSSR } from 'next/dynamic'
import 'dotenv/config'

// Create a single supabase client for interacting with your database
const supabaseUrl='https://czmszbbkfeiegoycrdlg.supabase.co';
const supabaseAnonKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6bXN6YmJrZmVpZWdveWNyZGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDE5MjUsImV4cCI6MjA2Njc3NzkyNX0.mIBd7qSnuN0S47nJgB_MlsqwzbJcmcnmfJWtO0maHMM';
export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
)    

//ye supabase nam ka folder hai kya kha se import kiya createClient ab bas import karliya 

// bass import kar liya hai 
