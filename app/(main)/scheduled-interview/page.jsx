"use client"
import { useUser } from '@/app/auth/provider';
import { Button } from '@/components/ui/button';
import { supabase } from '@/public/services/supabaseClient';
import { Video } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import InterviewCard from '../dashboard/_components/InterviewCard';

function ScheduledInterview() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      console.log("Current user:", user?.email);
      GetInterview();
    }
  }, [user]);

  const GetInterview = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Interview")
      .select("jobPosition, duration, interview_id, created_at, userEmail") // ✅ fixed select
      .eq("userEmail", user?.email) // ✅ make sure column name matches your table
      .order("interview_id", { ascending: false }); // ✅ order by correct column

    if (error) {
      console.log("Supabase error:", error);
    } else {
      console.log("Fetched interviews:", data);
      setInterviewList(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="mt-5">
      <h2 className="font-bold text-2xl">
        Interview List with Candidate Feedback
      </h2>

      {loading ? (
        <p className="mt-5">Loading...</p>
      ) : interviewList.length === 0 ? (
        <div className="p-5 flex flex-col gap-3 items-center mt-5">
          <Video className="h-10 w-10 text-primary" />
          <h2>You don't have any interview created!</h2>
          <Button>+ Create New Interview</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 mt-5 xl:grid-cols-3 gap-5">
          {interviewList.map((interview, index) => (
            <InterviewCard
              key={interview.interview_id || index}
              interview={interview}
              viewDetail={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ScheduledInterview;
