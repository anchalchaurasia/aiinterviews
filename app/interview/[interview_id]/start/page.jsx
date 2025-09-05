"use client";

import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import Image from "next/image";
import { Mic, Phone, Timer as TimerIcon, Loader2Icon } from "lucide-react";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import axios from "axios";
import { supabase } from "@/public/services/supabaseClient";

function StartInterview() {
  const { interviewInfo: contextInfo } = useContext(InterviewDataContext);
const [interviewInfo, setInterviewInfo] = useState(contextInfo || null);

  const vapiRef = useRef(null);
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState([]);
  const { interview_id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  // Load interviewInfo from localStorage if context missing
  useEffect(() => {
    if (!interviewInfo) {
      const stored = localStorage.getItem("interviewInfo");
      if (stored) {
        setInterviewInfo(JSON.parse(stored));
      } else {
        toast("Interview information missing. Redirecting...");
        router.replace(`/interview/${interview_id}`);
      }
    }
  }, [interviewInfo, interview_id, router]);

  // Initialize Vapi
  useEffect(() => {
    if (!vapiRef.current) {
      vapiRef.current = new Vapi("f5fe2adf-7c12-482d-bc78-34cf37b8c228");

      vapiRef.current.on("call-start", () => toast("Call Connected..."));
      vapiRef.current.on("speech-start", () => setActiveUser(false));
      vapiRef.current.on("speech-end", () => setActiveUser(true));
      vapiRef.current.on("call-end", () => {
        toast("Interview Ended");
        stopTimer();
        GenerateFeedback();
      });
      vapiRef.current.on("message", (message) => {
        if (message?.conversation) {
          setConversation((prev) => [...prev, message.conversation]);
        }
      });
    }
  }, []);

  // Timer
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (loading) {
      timerRef.current = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [loading]);

  const startCall = () => {
    if (!interviewInfo) {
      toast("Interview information is missing.");
      return;
    }

    const interviewData = interviewInfo.interviewData
      ? typeof interviewInfo.interviewData === "string"
        ? JSON.parse(interviewInfo.interviewData)
        : interviewInfo.interviewData
      : null;

    if (!interviewData) {
      toast("Interview data is missing.");
      return;
    }

    const jobPosition = interviewData.jobPosition || interviewData.jobDescription || "your role";

    let questionList = [];
    try {
      questionList =
        typeof interviewData.questionList === "string"
          ? JSON.parse(interviewData.questionList)
          : interviewData.questionList || [];
    } catch {
      questionList = [];
    }

    const questionText = questionList.map((q) => q.question).join(",");

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${interviewInfo.userName}, ready for your interview on ${jobPosition}?`,
      transcriber: { provider: "deepgram", model: "nova-2", language: "en-US" },
      voice: { provider: "playht", voiceId: "jennifer" },
      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an AI Voice assistant conducting interviews.
            Ask one question at a time from this list:
            ${questionText}
            After 5–7 questions, summarize performance and end politely.`,
          },
        ],
      },
    };

    vapiRef.current.start(assistantOptions);
    setLoading(true);
  };

  const stopInterview = () => {
    vapiRef.current?.stop();
    stopTimer();
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setLoading(false);
  };

  const GenerateFeedback = async () => {
    if (!conversation.length) return;
    try {
      const result = await axios.post("/api/ai-feedback", { conversation });
      let Content = result?.data?.content || "{}";
      Content = Content.replace("```json", "").replace("```", "");
      const parsed = JSON.parse(Content);

      await supabase.from("interview-feedback").insert([
        {
          userName: interviewInfo.userName,
          userEmail: interviewInfo.userEmail,
          interview_id,
          feedback: parsed,
          recommended: false,
        },
      ]);

      router.replace(`/interview/${interview_id}/completed`);
    } catch (err) {
      console.error("Feedback generation failed:", err);
      toast("Failed to generate feedback");
    }
  };

  if (!interviewInfo)
    return <p className="p-20 text-center">Loading interview information...</p>;

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="p-10 lg:px-48 xl:px-56">
      <h2 className="font-bold text-xl flex justify-between">
        AI Interview Session
        <span className="flex gap-2 items-center">
          <TimerIcon />
          {formatTime(timer)}
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
        {/* AI Recruiter */}
        <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
          <div className="relative">
            {!activeUser && (
              <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />
            )}
            <Image
              src={"/ai.png"}
              alt="ai"
              width={100}
              height={100}
              className="w-[60px] h-[60px] rounded-full object-cover"
            />
            <h2>AI Recruiter</h2>
          </div>
        </div>

        {/* Candidate */}
        <div className="bg-white h-[400px] rounded-lg border flex items-center justify-center gap-3">
          <div className="relative">
            {!activeUser && (
              <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />
            )}
            <h2 className="text-2xl bg-primary text-white p-3 rounded-full px-5">
              {interviewInfo.userName[0]}
            </h2>
          </div>
          <h2>{interviewInfo.userName}</h2>
        </div>
      </div>

      <div className="flex items-center gap-5 justify-center mt-7">
        {!loading ? (
          <button
            className="h-12 w-32 bg-green-500 text-white rounded-full"
            onClick={startCall}
          >
            Start Interview
          </button>
        ) : (
          <Loader2Icon className="h-12 w-12 animate-spin text-blue-500" />
        )}
        <Phone
          className="h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer"
          onClick={stopInterview}
        />
      </div>

      <h2 className="text-sm text-gray-400 text-center mt-5">
        Interview in Progress...
      </h2>
    </div>
  );
}

export default StartInterview;
