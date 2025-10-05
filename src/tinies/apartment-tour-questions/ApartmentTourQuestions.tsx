import { Button, Card, Textarea } from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { Trash } from '@moondreamsdev/dreamer-ui/symbols';
import { useMemo, useState } from 'react';
import {
  AddQuestionForm,
  ApartmentSelector,
} from './ApartmentTourQuestions.components';
import { useApartmentTourData } from './ApartmentTourQuestions.hooks';

export function ApartmentTourQuestions() {
  const {
    allQuestions,
    apartments,
    selectedApartment,
    addCustomQuestion,
    deleteCustomQuestion,
    addApartment,
    deleteApartment,
    updateAnswer,
    getAnswer,
    setSelectedApartment,
  } = useApartmentTourData();

  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set(),
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

  const toggleExpanded = (questionId: string) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const answeredCount = useMemo(() => {
    if (!selectedApartment) return 0;
    return allQuestions.filter((q) => getAnswer(q.id, selectedApartment) !== '')
      .length;
  }, [allQuestions, selectedApartment, getAnswer]);

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
            Track questions and answers for different apartments. Add your own
            custom questions and compare answers across multiple properties.
          </p>
        </div>

        {/* Apartment Management */}
        <ApartmentSelector
          apartments={apartments}
          selectedApartment={selectedApartment}
          onSelectApartment={setSelectedApartment}
          onAddApartment={addApartment}
          onDeleteApartment={deleteApartment}
        />

        {/* Progress Card */}
        {selectedApartment && (
          <Card>
            <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
              <div className='text-center sm:text-left'>
                <div className='text-2xl font-bold'>
                  {answeredCount} / {totalCount}
                </div>
                <div className='text-foreground/60 text-sm'>
                  Questions Answered for{' '}
                  {apartments.find((a) => a.id === selectedApartment)?.name}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Add Custom Question */}
        <AddQuestionForm categories={categories} onAdd={addCustomQuestion} />

        {/* Questions by Category */}
        {selectedApartment ? (
          <div className='space-y-6'>
            {categories.map((category) => {
              const categoryQuestions = questionsByCategory[category] || [];
              const categoryAnswered = categoryQuestions.filter(
                (q) => getAnswer(q.id, selectedApartment) !== '',
              ).length;

              return (
                <Card key={category}>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <h2 className='text-lg font-semibold'>{category}</h2>
                      <span className='text-foreground/60 text-sm'>
                        {categoryAnswered} / {categoryQuestions.length}
                      </span>
                    </div>
                    <div className='space-y-3'>
                      {categoryQuestions.map((question) => {
                        const isExpanded = expandedQuestions.has(question.id);
                        const hasAnswer =
                          getAnswer(question.id, selectedApartment) !== '';

                        return (
                          <div
                            key={question.id}
                            className='hover:bg-muted/50 border-border rounded-lg border p-3 transition-colors'
                          >
                            <div className='flex items-start justify-between gap-2'>
                              <button
                                onClick={() => toggleExpanded(question.id)}
                                className='flex-1 text-left'
                              >
                                <div
                                  className={join(
                                    'text-sm leading-relaxed',
                                    hasAnswer && 'text-primary font-medium'
                                  )}
                                >
                                  {question.question}
                                </div>
                              </button>
                              {question.isCustom && (
                                <Button
                                  onClick={() =>
                                    deleteCustomQuestion(question.id)
                                  }
                                  variant='destructive'
                                  size='sm'
                                >
                                  <Trash className='h-4 w-4' />
                                </Button>
                              )}
                            </div>
                            {isExpanded && (
                              <div className='border-border mt-3 border-t pt-3'>
                                <Textarea
                                  placeholder='Enter answer...'
                                  rows={2}
                                  className='text-sm'
                                  value={getAnswer(
                                    question.id,
                                    selectedApartment,
                                  )}
                                  onChange={({ target: { value } }) =>
                                    updateAnswer(
                                      question.id,
                                      selectedApartment,
                                      value,
                                    )
                                  }
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <div className='text-foreground/60 text-center'>
              <p>
                Add an apartment to get started tracking your questions and
                answers.
              </p>
            </div>
          </Card>
        )}

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
