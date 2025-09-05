import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import QuestionListContainer from './QuestionListContainer';
import { supabase } from '@/public/services/supabaseClient';
import { useUser } from '@/app/auth/provider';
import { v4 as uuidv4 } from 'uuid';
function QuestioListList({ formData,onCreateLink}) {

  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState([]);
  const { user } = useUser();
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (formData) {
      GenerateQuestionList();
    }
  }, [formData]);

  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post('/api/ai-model', {
        ...formData,
      });

      const content = result.data.content;
      const cleaned = content.replace('```json', '').replace('```', '');
      const parsed = JSON.parse(cleaned);

      setQuestionList(parsed?.interviewQuestions || []);
    } catch (e) {
      toast('Server Error, Try Again!');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async () => {
    if (!questionList || questionList.length === 0) {
      toast('Question list is empty. Cannot save.');
      return;
    }

    setSaveLoading(true);

    const interview_id = uuidv4();

    const { data, error } = await supabase
      .from('interviews')
      .insert([
        {
          jobPosition: formData.jobPosition,
          jobDescription: formData.jobDescription, // ✅ corrected field
          duration: formData.duration,
          type: JSON.stringify(formData.type),
          userEmail: user?.email,
          interview_id,
          questionList: JSON.stringify(questionList), // ✅ make sure to stringify
        },
      ])
      .select();
      //Update User Credits 
      
       const userUpdate= await supabase
          .from('Users')
          .update({ credits: Number(user?.credits)-1})
          .eq('email', 'user?.email')
          .select();
       console.log(userUpdate)  
    if (error) {
      toast('Failed to save interview!');
      console.error(error);
    } else {
      toast('Interview saved!');
      console.log(data);
    }

    setSaveLoading(false);

    onCreateLink(interview_id,)
  };

  return (
    <div>
      {loading && (
        <div className='p-5 bg-blue-50 rounded-xl border border-primary flex gap-5 items-center'>
          <Loader2 className='animate-spin' />
          <div>
            <h2 className='font-medium'>Generating Interview Questions</h2>
            <p className='text-primary'>
              Our AI is creating personalized questions based on your job
            </p>
          </div>
        </div>
      )}

      {questionList?.length > 0 && (
        <div>
          <QuestionListContainer questionList={questionList} />
        </div>
      )}

      <div className='flex justify-end mt-10'>
        <Button onClick={onFinish} disabled={saveLoading}>
          {saveLoading && <Loader2 className='animate-spin mr-2' />}
          Create Interview Link & Finish
        </Button>
      </div>
    </div>
  );
}

export default QuestioListList;
