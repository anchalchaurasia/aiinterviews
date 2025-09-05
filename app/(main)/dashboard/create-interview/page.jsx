"use client";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import FormContainer from "./_components/FormContainer.jsx";
import QuestioListList from './_components/QuestionList';
import { toast } from 'sonner';
import InterviewLink from '@/app/(main)/dashboard/create-interview/_components/InterviewLink.jsx';
import { useUser } from '@/app/auth/provider.jsx';

function CreateInterview() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [interviewId, setInterviewId] = useState();
  const  {user}=useUser();

  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    console.log("FormData", formData);
  };

  const onGoToNext = () => {
    if (user?.credits <= 0) {
      toast('Please add credits');
      return;
    }
    if (!formData?.jobPosition || !formData?.jobDescription) {
      toast('Please enter all details!');
      return;
    }
    setStep(step + 1);
  };

  const onClickLink = (interview_id) => {
    setInterviewId(interview_id);
    setStep(step + 1);
  };

  return (
    <div className="mt-10 px-10 md:px-24 lg:px-44 xl:px-56">
      <div className="flex gap-5 items-center">
        <ArrowLeft onClick={() => router.back()} className="cursor-pointer" />
        <h2 className="font-bold text-2xl">Create New Interview</h2>
      </div>
      <Progress value={step * 33.33} className="my-5" />

      {step === 1 && (
        <FormContainer
          formData={formData}
          onHandleInputChange={onHandleInputChange}
          GoToNext={onGoToNext}
        />
      )}

      {step === 2 ? (
        <QuestioListList
          formData={formData}
          onCreateLink={(interview_id) => onClickLink(interview_id)}
        />
      ) : step === 3 ? (
        <InterviewLink interview_id={interviewId} formData={formData} />
      ) : null}
    </div>
  );
}

export default CreateInterview;
