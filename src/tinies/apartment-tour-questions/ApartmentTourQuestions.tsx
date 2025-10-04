import { Button, Card, Checkbox } from '@moondreamsdev/dreamer-ui/components';
import { useMemo, useState } from 'react';
import { QUESTIONS } from './ApartmentTourQuestions.data';

export function ApartmentTourQuestions() {
  const [checkedQuestions, setCheckedQuestions] = useState<Set<string>>(
    new Set(),
  );

  const questionsByCategory = useMemo(
    () =>
      QUESTIONS.reduce(
        (acc, question) => {
          if (!acc[question.category]) {
            acc[question.category] = [];
          }
          acc[question.category].push(question);
          return acc;
        },
        {} as Record<string, typeof QUESTIONS>,
      ),
    [],
  );

  const categories = useMemo(
    () => Object.keys(questionsByCategory),
    [questionsByCategory],
  );

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
        <Card>
          <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
            <div className='text-center sm:text-left'>
              <div className='text-2xl font-bold'>
                {checkedCount} / {totalCount}
              </div>
              <div className='text-foreground/60 text-sm'>Questions Asked</div>
            </div>
            <Button
              onClick={clearAll}
              variant='outline'
              disabled={checkedCount === 0}
            >
              Clear All
            </Button>
          </div>
        </Card>

        {/* Questions by Category */}
        <div className='space-y-6'>
          {categories.map((category) => {
            const categoryQuestions = questionsByCategory[category] || [];
            const categoryChecked = categoryQuestions.filter((q) =>
              checkedQuestions.has(q.id),
            ).length;

            return (
              <Card key={category}>
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
                        className='hover:bg-muted/50 flex items-start gap-3 rounded-lg p-2 transition-colors'
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
        <div className='pt-4 pb-8 text-center'>
          <Button href='/' variant='outline'>
            ← Back to Gallery
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ApartmentTourQuestions;
