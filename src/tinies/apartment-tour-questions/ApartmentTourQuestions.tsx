import {
  Badge,
  Button,
  Checkbox,
  Disclosure,
  Textarea,
} from '@moondreamsdev/dreamer-ui/components';
import { Trash } from '@moondreamsdev/dreamer-ui/symbols';
import { useMemo } from 'react';
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
          <div className='bg-muted/30 rounded-2xl p-6'>
            <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
              <div className='text-center sm:text-left'>
                <div className='mb-1 text-3xl font-bold'>
                  {answeredCount} / {totalCount}
                </div>
                <div className='text-foreground/60 text-sm'>
                  Questions answered for{' '}
                  <span className='text-foreground/80 font-medium'>
                    {apartments.find((a) => a.id === selectedApartment)?.name}
                  </span>
                </div>
              </div>
              <div className='bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium'>
                {Math.round((answeredCount / totalCount) * 100)}% Complete
              </div>
            </div>
          </div>
        )}

        {/* Add Custom Question */}
        <AddQuestionForm categories={categories} onAdd={addCustomQuestion} />

        {/* Questions by Category */}
        {selectedApartment ? (
          <div className='space-y-8'>
            {categories.map((category) => {
              const categoryQuestions = questionsByCategory[category] || [];
              const categoryAnswered = categoryQuestions.filter(
                (q) => getAnswer(q.id, selectedApartment) !== '',
              ).length;
              const allQuestionsAnswered =
                categoryAnswered === categoryQuestions.length;

              return (
                <div key={category}>
                  <div className='flex items-center justify-between pb-1'>
                    <h2 className='text-foreground/90 text-xl font-semibold'>
                      {category}
                    </h2>
                    <Badge
                      variant={allQuestionsAnswered ? 'success' : 'muted'}
                      size='sm'
                    >
                      {categoryAnswered} / {categoryQuestions.length}
                    </Badge>
                  </div>
                  <div className='space-y-1'>
                    {categoryQuestions.map((question) => {
                      const hasAnswer =
                        getAnswer(question.id, selectedApartment) !== '';

                      return (
                        <div
                          key={question.id}
                          className='group rounded-xl px-3 py-2 transition-all duration-200'
                        >
                          <div className='flex items-start justify-between gap-3'>
                            <div className='flex flex-1 items-start gap-3'>
                              <Checkbox
                                checked={hasAnswer}
                                className='mt-1.5'
                                size={16}
                                inert
                              />
                              <Disclosure
                                label={
                                  <span className='text-foreground/90 group-hover:text-foreground text-sm leading-relaxed font-medium transition-colors'>
                                    {question.question}
                                  </span>
                                }
                                className='flex-1'
                                buttonClassName='!p-0 hover:bg-inherit! hover:underline hover:underline-offset-2'
                              >
                                <Textarea
                                  placeholder='Enter your answer...'
                                  rows={2}
                                  variant='solid'
                                  className='mt-3 text-sm'
                                  rounded='md'
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
                              </Disclosure>
                            </div>
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
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className='bg-muted/30 rounded-2xl p-12 text-center'>
            <div className='text-foreground/60 space-y-2'>
              <p className='text-lg font-medium'>
                Ready to start your apartment search?
              </p>
              <p className='text-sm'>
                Add an apartment above to begin tracking your questions and
                answers.
              </p>
            </div>
          </div>
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
