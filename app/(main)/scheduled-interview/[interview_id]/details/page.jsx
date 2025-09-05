"use client"
import React, { useEffect, useState } from "react";
import { supabase } from "@/public/services/supabaseClient"; // ✅ don't keep JS inside /public
import { useParams } from "next/navigation";
import { useUser } from "@/app/auth/provider"; // ✅ assuming you're using Clerk
import InterviewDetailsContainer from "../_components/InterviewDetailsContainer";
import CandidatList from "../_components/CandidatList";

function InterviewDetail() {
  const { interview_id } = useParams();
  const { user } = useUser();
  const [interviewDetail, setInterviewDetail] = useState(null);

  useEffect(() => {
    if (user) {
      getInterviewDetails();
    }
  }, [user]);

  const getInterviewDetails = async () => {
    const { data, error } = await supabase
      .from("Interview")
      .select(
        `jobPosition,
         jobDescription,
         type,
         questionList,
         duration,
         interview_id,
         created_at,
         interview-feedback(userEmail,userName,feedback,created_at)`
      )
      .eq("userEmail", user?.email)
      .eq("interview_id", interview_id) // ✅ fixed this line

    if (error) {
      console.error("Error fetching interview details:", error.message);
      return;
    }

    if (data && data.length > 0) {
      setInterviewDetail(data[0]);
    }
  };

  return (
    <div className="mt-5">
      <h2 className="font-bold text-2xl">Interview Detail</h2>

      {/* ✅ Pass state properly */}
      {interviewDetail && (
        <>
          <InterviewDetailsContainer interviewDetail={interviewDetail} />
          <CandidatList
            candidateList={interviewDetail?.["interview-feedback"]}
          />
        </>
      )}
    </div>
  );
}

export default InterviewDetail;
