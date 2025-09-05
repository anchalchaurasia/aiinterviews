"use client"
import React from 'react'
import InterviewHeader from './[interview_id]/_components/InterviewHeader'
import { InterviewDataContext } from '@/context/InterviewDataContext'
import {useState} from 'react'

function InterviewLayout({children}) {
    const [interviewInfo,setInterviewInfo]=useState();
  return (
    <InterviewDataContext.Provider value={{interviewInfo,setInterviewInfo}}>
    <div className='bg-secondary'>
        <InterviewHeader />
        {children}
    </div>
    </InterviewDataContext.Provider>
  )
}

export default InterviewLayout

