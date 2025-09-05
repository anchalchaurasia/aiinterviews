// FormContainer.jsx
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InterviewType } from '@/public/services/Constants';

const FormContainer = ({ formData, onHandleInputChange, GoToNext }) => {
  const [interviewType, setInterviewType] = useState([]);

  useEffect(() => {
    onHandleInputChange('type', interviewType);
  }, [interviewType]);

  const handleTypeClick = (typeTitle) => {
    setInterviewType((prev) =>
      prev.includes(typeTitle)
        ? prev.filter((t) => t !== typeTitle)
        : [...prev, typeTitle]
    );
  };

  return (
    <div className='p-5 bg-white rounded-xl'>
      <div>
        <h2 className='text-sm font-medium'>Job Position</h2>
        <Input
          placeholder='e.g. Full Stack Developer'
          className='mt-2'
          value={formData.jobPosition || ''}
          onChange={(e) =>
            onHandleInputChange('jobPosition', e.target.value)
          }
        />
      </div>

      <div className='mt-5'>
        <h2 className='text-sm font-medium'>Job Description</h2>
        <Textarea
          placeholder='Enter detailed job description'
          className='h-[200px] mt-2'
          value={formData.jobDescription || ''} // ✅ uses proper casing
          onChange={(e) =>
            onHandleInputChange('jobDescription', e.target.value)
          }
        />
      </div>

      <div className='mt-5'>
        <h2 className='text-sm font-medium'>Interview Duration</h2>
        <Select
          onValueChange={(value) =>
            onHandleInputChange('duration', value)
          }
        >
          <SelectTrigger className='w-full mt-2'>
            <SelectValue placeholder='Select Duration' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='5 Min'>5 Min</SelectItem>
            <SelectItem value='15 Min'>15 Min</SelectItem>
            <SelectItem value='30 Min'>30 Min</SelectItem>
            <SelectItem value='45 Min'>45 Min</SelectItem>
            <SelectItem value='60 Min'>60 Min</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='mt-5'>
        <h2 className='text-sm font-medium'>Interview Type</h2>
        <div className='flex gap-3 flex-wrap mt-2'>
          {InterviewType.map((type, index) => (
            <div
              key={index}
              className={`flex items-center cursor-pointer gap-2 p-1 px-4 border rounded-2xl ${
                interviewType.includes(type.title)
                  ? 'bg-blue-100 border-blue-400'
                  : 'bg-white border-gray-300'
              }`}
              onClick={() => handleTypeClick(type.title)}
            >
              <type.icon className='h-4 w-4' />
              <span>{type.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-7 flex justify-end'>
        <Button onClick={GoToNext}>
          Generate Question <ArrowRight className='ml-2 h-4 w-4' />
        </Button>
      </div>
    </div>
  );
};

export default FormContainer;
