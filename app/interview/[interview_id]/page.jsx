"use client"
import React, { useEffect, useState, useContext } from 'react'
import InterviewHeader from './_components/InterviewHeader'
import { InterviewDataContext } from "@/context/InterviewDataContext"
import Image from 'next/image'
import { Clock, Info, Loader2Icon, Video } from 'lucide-react'
import { Input } from "@/components/ui/input"; 

import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/public/services/supabaseClient'
import { toast } from 'sonner'

function Interview() {

  const { interview_id } = useParams();
  console.log(interview_id)
  const [interviewData, setInterviewData] = useState();
  const [userName, setUserName] = useState();
  const [UserEmail,setUserEmail]=useState();
  const [loading, setLoading] = useState(false);
  const { setInterviewInfo } = useContext(InterviewDataContext);
  const router = useRouter();

  useEffect(() => {
    if (interview_id) {
      GetInterviewDetails();
    }
  }, [interview_id]);

 const GetInterviewDetails = async () => {
  setLoading(true);
  let { data: interviews, error } = await supabase
    .from('interviews')
    .select("jobPosition,jobDescription,duration,type")
    .eq('interview_id', interview_id);

  if (error || !interviews || interviews.length === 0) {
    toast('Incorrect Interview Link');
    setLoading(false);
    return;
  }

  setInterviewData(interviews[0]);
  setLoading(false);
};
const onJoinInterview = async () => {
  setLoading(true);
  let { data: interviews, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('interview_id', interview_id);

  if (error || !interviews?.length) { 
    toast('Incorrect Interview Link');
    setLoading(false);
    return;
  }

  const info = {
    userName: userName,
    userEmail: UserEmail,
    interviewData: interviews[0]
  };

  setInterviewInfo(info);

  // Save to localStorage so StartInterview can read
  localStorage.setItem("interviewInfo", JSON.stringify(info));

  router.push('/interview/' + interview_id + '/start');
  setLoading(false);
};


  return (
    <div className='px-10 md:px-28 lg:px-48 xl:px-80 mt-7'>
      <div className='flex flex-col items-center 
        justify-center border rounded-lg bg-white
        p-7 lg:px-33 xl:px-52 mb-20'>
        <Image src={'/logo.png'} alt='logo' width={200} height={100}
          className='w-[140px]'
        />
        <h2 className='mt-3'>AI-Powered Interview Platform</h2>

        <Image src={'/interview.png'} alt='interview'
          width={500}
          height={500}
          className='w-[280px] my-6'
        />

        <h2 className='font-bold text-xl'>{interviewData?.jobPosition}</h2>
        <h2 className='flex gap-2 items-center text-gray-500 mt-3'>
          <Clock className='h-4 w-4' /> {interviewData?.duration}</h2>

        <div className='w-full'>
          <h2>Enter your full name </h2>
          <Input placeholder='e.g. John Smith' onChange={(event) => setUserName(event.target.value)} />
        </div>
          <div className='w-full'>
          <h2>Enter your Email </h2>
          <Input placeholder='e.g. john@gmail.com' onChange={(event) => setUserEmail(event.target.value)} />
        </div>

        <div className='p-3 bg-blue-100 flex gap-4 rounded-lg mt-6'>
          <Info className='text-primary' />
          <div>
            <h2>Before you begin</h2>
            <ul className=''>
              <li className='text-sm text-primary'>- Ensure you have a stable internet connection </li>
              <li className='text-sm text-primary'>- Test your camera and microphone </li>
              <li className='text-sm text-primary'>- Find a quiet place for the interview </li>
            </ul>
          </div>
        </div>

        <Button className={'mt-5 w-full font-bold'}
          disabled={loading || !userName}
          onClick={() => onJoinInterview()}
        >
          <Video /> {loading && <Loader2Icon className="animate-spin ml-2" />} Join Interview
        </Button>
      </div>
    </div>
  )
}

export default Interview
