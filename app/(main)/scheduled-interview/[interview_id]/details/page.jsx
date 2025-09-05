"use client"
import{ supabase } from '@/service/supabaseClient';
import { useParams } from 'next/navigation'
import React from 'react'
import { useEffect } from 'react'
import InterviewDeatilsContainer from'./_components/InterviewDetailContainer';

function InterviewDetail() {
    const {interview_id}=useParams();
    const { user } =useUser();
    const [interviewDetails,setInterviewDetails]=useState();

    useEffect (()=>{
        user &&GetInterviewDetails();
    },[user])

    const GetInterviewDetails=async()=>{
         const result=await supabase.from('Interview')
                .select(`jobPosition,jobDescription,type,questionList,duration,interview_id,created_at,
                    interview-feedback(userEmail,userName,feedback,created_at)`)
                .eq('userEmail',user?.email)
                .eq('interview_id,interview_id')

                setInterviewDetails(reesult?.data[0])
            console.log(result);
    }
  return (
    <div className='mt-5'>
        <h2 className='font-bold text-2xl'>Interview Detail</h2>
        <InterviewDetailContainer interviewDetail={interviewDetail} />
        <CandidatList candidateList={interviewDetail?.['interview-feedback']} />
    </div>
  )
}


export default InterviewDetail
