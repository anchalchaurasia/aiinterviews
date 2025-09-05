"use client"
import { useUser } from '@/app/auth/provider';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';  
import React, { useState, useEffect } from 'react'
import InterviewCard from './LatestInterviewsList';
import { supabase } from '@/public/services/supabaseClient';

function LatestInterviewsList() {
    const [interviewList, setInterviewList] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            GetInterviewList();
        }
    }, [user]);

    const GetInterviewList = async () => {
        let { data: interviews, error } = await supabase
            .from('Interview')  // ✅ use correct table name
            .select('id, jobPosition, duration, interview_id, created_at, interview-feedback(id)')
            .eq('userEmail', user?.email)
            .order('id', { ascending: false })
            .limit(6);

        if (error) {
            console.error("Error fetching interviews:", error.message);
            return;
        }

        console.log("Fetched interviews:", interviews);
        setInterviewList(interviews || []);
    }

    return (
        <div className='my-5'>
            <h2 className='font-bold text-2xl'>Previously Created Interviews</h2>

            {interviewList?.length === 0 &&
                <div className='p-5 flex flex-col gap-3 items-center mt-5 '>
                    <Video className='h-10 w-10 text-primary' />
                    <h2>You don't have any interview created!</h2>
                    <Button>+ Create New Interview</Button>
                </div>
            }

            {interviewList?.length > 0 &&
                <div className='grid grid-cols-2 mt-5 xl:grid-cols-3 gap-5'>
                    {interviewList.map((interview, index) => (
                        <InterviewCard 
                            interview={interview} 
                            key={interview.id || index} 
                        />
                    ))}
                </div>
            }
        </div>
    )
}

export default LatestInterviewsList;
