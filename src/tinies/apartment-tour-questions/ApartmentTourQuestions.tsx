import { Button, Card, Checkbox, Input, Select } from '@moondreamsdev/dreamer-ui/components';
import { useEffect, useMemo, useState } from 'react';
import { QUESTIONS } from './ApartmentTourQuestions.data';
import { Question } from './ApartmentTourQuestions.types';

export function ApartmentTourQuestions() {
  const [checkedQuestions, setCheckedQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState('');

  // Load custom questions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('apartment-tour-custom-questions');
    if (stored) {
      try {
        setCustomQuestions(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load custom questions', e);
      }
    }
  }, []);

  // Save custom questions to localStorage whenever they change
  useEffect(() => {
    if (customQuestions.length > 0 || localStorage.getItem('apartment-tour-custom-questions')) {
      localStorage.setItem('apartment-tour-custom-questions', JSON.stringify(customQuestions));
    }
  }, [customQuestions]);

  // Combine predefined and custom questions
  const allQuestions = useMemo(
    () => [...QUESTIONS, ...customQuestions],
    [customQuestions]
  );

  const questionsByCategory = useMemo(
    () =>
      allQuestions.reduce(
        (acc, question) => {
          if (!acc[question.category]) {
            acc[question.category] = [];
          }
          acc[question.category].push(question);
          return acc;
        },
        {} as Record<string, typeof allQuestions>,
      ),
    [allQuestions],
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

  const addCustomQuestion = () => {
    if (newQuestion.trim() && newQuestionCategory.trim()) {
      const customQuestion: Question = {
        id: `custom-${Date.now()}`,
        category: newQuestionCategory,
        question: newQuestion.trim(),
        isCustom: true,
      };
      setCustomQuestions((prev) => [...prev, customQuestion]);
      setNewQuestion('');
      setNewQuestionCategory('');
    }
  };

  const deleteCustomQuestion = (questionId: string) => {
    setCustomQuestions((prev) => prev.filter((q) => q.id !== questionId));
    setCheckedQuestions((prev) => {
      const next = new Set(prev);
      next.delete(questionId);
      return next;
    });
  };

  const checkedCount = checkedQuestions.size;
  const totalCount = allQuestions.length;

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

        {/* Add Custom Question */}
        <Card>
          <div className='space-y-4'>
            <h2 className='text-lg font-semibold'>Add Your Own Question</h2>
            <div className='flex flex-col gap-3 sm:flex-row'>
              <div className='flex-1'>
                <Input
                  type='text'
                  placeholder='Enter your question...'
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addCustomQuestion();
                    }
                  }}
                />
              </div>
              <div className='w-full sm:w-64'>
                <Select
                  value={newQuestionCategory}
                  onChange={(value) => setNewQuestionCategory(value)}
                  placeholder='Select category...'
                  options={categories.map((cat) => ({ value: cat, text: cat }))}
                />
              </div>
              <Button
                onClick={addCustomQuestion}
                disabled={!newQuestion.trim() || !newQuestionCategory.trim()}
              >
                Add Question
              </Button>
            </div>
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
                        {question.isCustom && (
                          <Button
                            variant='tertiary'
                            onClick={() => deleteCustomQuestion(question.id)}
                            className='text-xs'
                          >
                            Delete
                          </Button>
                        )}
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
