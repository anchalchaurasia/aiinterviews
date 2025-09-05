"use client";

import React, { useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { UserDetailsContext } from "@/context/UserDetailContext";

// ✅ Initialize Supabase client
const supabase = createClient(
 'https://czmszbbkfeiegoycrdlg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6bXN6YmJrZmVpZWdveWNyZGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMDE5MjUsImV4cCI6MjA2Njc3NzkyNX0.mIBd7qSnuN0S47nJgB_MlsqwzbJcmcnmfJWtO0maHMM'
);

function Provider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    CreateNewUser();
  }, []);

  const CreateNewUser = async () => {
    const { data: { user: supaUser }, error: userError } = await supabase.auth.getUser();

    if (!supaUser) {
      console.warn("No user found from Supabase auth.");
      return;
    }

    const { data: Users, error: fetchError } = await supabase
      .from("Users")
      .select("*")
      .eq("email", supaUser.email);

    if (Users?.length === 0) {
      const { data: insertedData, error: insertError } = await supabase
        .from("Users")
        .insert([
          {
            name: supaUser.user_metadata?.name,
            email: supaUser.email,
           picture: supaUser.user_metadata?.picture || supaUser.user_metadata?.avatar_url,

          },
        ])
        .select();

      if (insertError) {
        console.error("Insert error:", insertError);
        return;
      }

      setUser(insertedData[0]);
    } else {
      setUser(Users[0]);
    }
  };

  return (
    <UserDetailsContext.Provider value={{ user, setUser }}>
      <div>{children}</div>
    </UserDetailsContext.Provider>
  );
}

export default Provider;

// ✅ Fixed useUser Hook
export const useUser = () => {
  return useContext(UserDetailsContext);
};
