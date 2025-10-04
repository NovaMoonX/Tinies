import {
  Button,
  Card,
  Checkbox,
} from '@moondreamsdev/dreamer-ui/components';
import { useState } from 'react';

interface Question {
  id: string;
  category: string;
  question: string;
}

const QUESTIONS: Question[] = [
  // Building & Location
  {
    id: 'q1',
    category: 'Building & Location',
    question: 'What is the rent amount and what does it include (utilities, parking, etc.)?',
  },
  {
    id: 'q2',
    category: 'Building & Location',
    question: 'What is the security deposit amount and is it refundable?',
  },
  {
    id: 'q3',
    category: 'Building & Location',
    question: 'When is rent due each month and what payment methods are accepted?',
  },
  {
    id: 'q4',
    category: 'Building & Location',
    question: 'Are there any additional fees (pet fees, amenity fees, parking fees)?',
  },
  {
    id: 'q5',
    category: 'Building & Location',
    question: 'What is the lease term and are there options for renewal?',
  },
  {
    id: 'q6',
    category: 'Building & Location',
    question: 'Is there a penalty for breaking the lease early?',
  },
  {
    id: 'q7',
    category: 'Building & Location',
    question: 'What are the quiet hours and noise policies?',
  },
  {
    id: 'q8',
    category: 'Building & Location',
    question: 'Is the neighborhood safe? Are there recent crime statistics?',
  },
  {
    id: 'q9',
    category: 'Building & Location',
    question: 'How close is public transportation, grocery stores, and other amenities?',
  },
  
  // Apartment Condition
  {
    id: 'q10',
    category: 'Apartment Condition',
    question: 'Are there any current maintenance issues that need to be addressed?',
  },
  {
    id: 'q11',
    category: 'Apartment Condition',
    question: 'When was the apartment last renovated or updated?',
  },
  {
    id: 'q12',
    category: 'Apartment Condition',
    question: 'Do all appliances work properly (stove, refrigerator, dishwasher, etc.)?',
  },
  {
    id: 'q13',
    category: 'Apartment Condition',
    question: 'Is there adequate water pressure in the shower and sinks?',
  },
  {
    id: 'q14',
    category: 'Apartment Condition',
    question: 'Are there any signs of pests, mold, or water damage?',
  },
  {
    id: 'q15',
    category: 'Apartment Condition',
    question: 'Do all windows and doors close and lock properly?',
  },
  {
    id: 'q16',
    category: 'Apartment Condition',
    question: 'Is there sufficient storage space (closets, cabinets)?',
  },
  
  // Utilities & Services
  {
    id: 'q17',
    category: 'Utilities & Services',
    question: 'What utilities am I responsible for paying?',
  },
  {
    id: 'q18',
    category: 'Utilities & Services',
    question: 'What is the average monthly cost for utilities?',
  },
  {
    id: 'q19',
    category: 'Utilities & Services',
    question: 'Is internet/cable included or available? What providers service the building?',
  },
  {
    id: 'q20',
    category: 'Utilities & Services',
    question: 'Is there air conditioning and heating? What type and who controls it?',
  },
  {
    id: 'q21',
    category: 'Utilities & Services',
    question: 'Is laundry available? Is it in-unit, in the building, or off-site?',
  },
  {
    id: 'q22',
    category: 'Utilities & Services',
    question: 'Are trash and recycling services provided? Where are the bins located?',
  },
  
  // Policies & Rules
  {
    id: 'q23',
    category: 'Policies & Rules',
    question: 'What is the pet policy (allowed pets, size/breed restrictions, fees)?',
  },
  {
    id: 'q24',
    category: 'Policies & Rules',
    question: 'Are guests allowed to stay overnight? Are there visitor parking spots?',
  },
  {
    id: 'q25',
    category: 'Policies & Rules',
    question: 'Can I make modifications (paint walls, install shelves, etc.)?',
  },
  {
    id: 'q26',
    category: 'Policies & Rules',
    question: 'Is subletting allowed if I need to move before the lease ends?',
  },
  {
    id: 'q27',
    category: 'Policies & Rules',
    question: 'What is the smoking policy for the building and unit?',
  },
  
  // Building Amenities
  {
    id: 'q28',
    category: 'Building Amenities',
    question: 'What amenities are available (gym, pool, rooftop, etc.)?',
  },
  {
    id: 'q29',
    category: 'Building Amenities',
    question: 'Is parking available? Is it included in rent or an additional cost?',
  },
  {
    id: 'q30',
    category: 'Building Amenities',
    question: 'Is there secure package delivery or a mailroom?',
  },
  {
    id: 'q31',
    category: 'Building Amenities',
    question: 'What security features are in place (cameras, security staff, key fob access)?',
  },
  {
    id: 'q32',
    category: 'Building Amenities',
    question: 'Is there bike storage available?',
  },
  
  // Management & Maintenance
  {
    id: 'q33',
    category: 'Management & Maintenance',
    question: 'How quickly does maintenance respond to repair requests?',
  },
  {
    id: 'q34',
    category: 'Management & Maintenance',
    question: 'Is there 24/7 emergency maintenance available?',
  },
  {
    id: 'q35',
    category: 'Management & Maintenance',
    question: 'Who do I contact for maintenance issues or emergencies?',
  },
  {
    id: 'q36',
    category: 'Management & Maintenance',
    question: 'How often does the landlord or management conduct inspections?',
  },
  {
    id: 'q37',
    category: 'Management & Maintenance',
    question: 'Are there any planned renovations or construction that might cause disruption?',
  },
];

export function ApartmentTourQuestions() {
  const [checkedQuestions, setCheckedQuestions] = useState<Set<string>>(new Set());

  const categories = Array.from(new Set(QUESTIONS.map((q) => q.category)));

  const toggleQuestion = (questionId: string) => {
    setCheckedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const clearAll = () => {
    setCheckedQuestions(new Set());
  };

  const checkedCount = checkedQuestions.size;
  const totalCount = QUESTIONS.length;

  return (
    <div className='page min-h-screen w-full p-4 pt-16 md:p-8 md:pt-24'>
      <div className='mx-auto max-w-4xl space-y-6'>
        {/* Header */}
        <div className='space-y-2 text-center'>
          <h1 className='text-3xl font-bold md:text-4xl'>
            Apartment Tour Questions
          </h1>
          <p className='text-foreground/70 mx-auto max-w-2xl text-sm md:text-base'>
            Use this comprehensive checklist to ensure you ask all the important
            questions during your apartment tour. Check off questions as you get
            answers.
          </p>
        </div>

        {/* Progress Card */}
        <Card padding={16}>
          <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
            <div className='text-center sm:text-left'>
              <div className='text-2xl font-bold'>
                {checkedCount} / {totalCount}
              </div>
              <div className='text-foreground/60 text-sm'>Questions Asked</div>
            </div>
            <Button onClick={clearAll} variant='outline' disabled={checkedCount === 0}>
              Clear All
            </Button>
          </div>
        </Card>

        {/* Questions by Category */}
        <div className='space-y-6'>
          {categories.map((category) => {
            const categoryQuestions = QUESTIONS.filter(
              (q) => q.category === category,
            );
            const categoryChecked = categoryQuestions.filter((q) =>
              checkedQuestions.has(q.id),
            ).length;

            return (
              <Card key={category} padding={16}>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <h2 className='text-lg font-semibold'>{category}</h2>
                    <span className='text-foreground/60 text-sm'>
                      {categoryChecked} / {categoryQuestions.length}
                    </span>
                  </div>
                  <div className='space-y-3'>
                    {categoryQuestions.map((question) => (
                      <div
                        key={question.id}
                        className='flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50'
                      >
                        <Checkbox
                          checked={checkedQuestions.has(question.id)}
                          onCheckedChange={() => toggleQuestion(question.id)}
                          size={20}
                        />
                        <label
                          className='flex-1 cursor-pointer text-sm leading-relaxed'
                          onClick={() => toggleQuestion(question.id)}
                        >
                          {question.question}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className='pb-8 pt-4 text-center'>
          <Button href='/' variant='outline'>
            ← Back to Gallery
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ApartmentTourQuestions;
