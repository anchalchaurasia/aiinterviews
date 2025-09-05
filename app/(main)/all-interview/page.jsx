"use client"
import React from 'react'
import { Button } from '@/components/ui/button';
import { supabase } from'@/public/services/supabaseClient';
import { Video } from 'lucide-react';
import  { useEffect,useState } from 'react'
// In AllInterview (page.jsx)
import LatestInterviewsList from '../dashboard/_components/LatestInterviewsList'

import { useUser } from '@/app/auth/provider';

function AllInterview() {
   const [interviewList, setInterviewList] = useState([]);
      const {user}=useUser();
  
      useEffect(() => {
          user && GetInterviewList();
      }, [user])
  
      const GetInterviewList= async ()=>{
          let { data: interviews, error } = await supabase
         .from('interviews')
         .select('*')
         .eq('userEmail',user?.email)
         .order('id',{ascending:false});
  
         console.log(interviews);
         setInterviewList(interviews);
      }
  
     
      return (
          <div className='my-5'>
              <h2 className='font-bold text-2xl'>All Previously Created Interviews</h2>
  
              {interviewList?.length == 0 &&
                  <div className='p-5 flex flex-col gap-3 items-center mt-5 '>
                      <Video className='h-10 w-10 text-primary' />  {/* ✅ working now */}
                      <h2>You don't have any interview created!</h2>
                      <Button>+ Create New Interview</Button>
                  </div>}
                  {interviewList &&
                  <div className='grid grid-cols-2 mt-5 xl:grid-cols-3 gap-5'>
                      {interviewList.map((interview,index) => (
                          <LatestInterviewsList interview={interview} key={index} />
                      ))}
                  </div>
                  }
          </div>
      )
  
  } 
export default AllInterview
