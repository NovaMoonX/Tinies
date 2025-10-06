import {
  Badge,
  Button,
  Checkbox,
  Disclosure,
  Tabs,
  TabsContent,
  Textarea,
} from '@moondreamsdev/dreamer-ui/components';
import { Trash } from '@moondreamsdev/dreamer-ui/symbols';
import { useMemo } from 'react';
import {
  AddQuestionForm,
  ApartmentDetailsSection,
  ApartmentSelector,
  FollowUpSection,
  NoteSection,
  PricingSection,
  QuestionAssociationButton,
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
    updateNote,
    getNote,
    addFollowUp,
    toggleFollowUp,
    deleteFollowUp,
    getFollowUps,
    updateQuestionAssociations,
    updateApartmentDetails,
    addCustomLink,
    deleteCustomLink,
    getApartment,
    getCosts,
    updateCost,
    addCustomCost,
    deleteCustomCost,
    addUnit,
    deleteUnit,
    getUnits,
    renameUnit,
    updateUnitRentPrice,
  } = useApartmentTourData();

  const questionsByCategory = useMemo(() => {
    if (!selectedApartment) {
      return allQuestions.reduce(
        (acc, question) => {
          if (!acc[question.category]) {
            acc[question.category] = [];
          }
          acc[question.category].push(question);
          return acc;
        },
        {} as Record<string, typeof allQuestions>,
      );
    }

    // Filter questions based on apartment associations
    const filteredQuestions = allQuestions.filter((question) => {
      // Show default questions (no associatedApartments) for all apartments
      if (!question.associatedApartments) {
        return true;
      }
      // Show custom questions only if they're associated with the selected apartment
      return question.associatedApartments.includes(selectedApartment);
    });

    return filteredQuestions.reduce(
      (acc, question) => {
        if (!acc[question.category]) {
          acc[question.category] = [];
        }
        acc[question.category].push(question);
        return acc;
      },
      {} as Record<string, typeof allQuestions>,
    );
  }, [allQuestions, selectedApartment]);

  const categories = useMemo(
    () => Object.keys(questionsByCategory),
    [questionsByCategory],
  );

  const answeredCount = useMemo(() => {
    if (!selectedApartment) return 0;

    // Only count questions that are relevant for this apartment
    const relevantQuestions = allQuestions.filter((question) => {
      if (!question.associatedApartments) {
        return true; // Default questions show for all apartments
      }
      return question.associatedApartments.includes(selectedApartment);
    });

    return relevantQuestions.filter(
      (q) => getAnswer(q.id, selectedApartment) !== '',
    ).length;
  }, [allQuestions, selectedApartment, getAnswer]);

  const totalCount = useMemo(() => {
    if (!selectedApartment) return allQuestions.length;

    // Only count questions that are relevant for this apartment
    return allQuestions.filter((question) => {
      if (!question.associatedApartments) {
        return true; // Default questions show for all apartments
      }
      return question.associatedApartments.includes(selectedApartment);
    }).length;
  }, [allQuestions, selectedApartment]);

  return (
    <div className='tiny-page'>
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
        <AddQuestionForm
          categories={categories}
          apartments={apartments}
          onAdd={addCustomQuestion}
        />

        {/* Questions by Category */}
        {selectedApartment ? (
          <Tabs
            defaultValue='details'
            variant='underline'
            tabsList={[
              { value: 'details', label: '🏠 Details' },
              { value: 'pricing', label: '💰 Pricing' },
              { value: 'questions', label: '❓ Questions' },
              { value: 'notes', label: '📝 Notes' },
              { value: 'followups', label: '📋 Follow-ups' },
            ]}
          >
            <TabsContent value='details'>
              <div className='pt-6'>
                {getApartment(selectedApartment) && (
                  <ApartmentDetailsSection
                    apartment={getApartment(selectedApartment)!}
                    onUpdateDetails={(updates) =>
                      updateApartmentDetails(selectedApartment, updates)
                    }
                    onAddCustomLink={(label, url) =>
                      addCustomLink(selectedApartment, label, url)
                    }
                    onDeleteCustomLink={(linkId) =>
                      deleteCustomLink(selectedApartment, linkId)
                    }
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value='pricing'>
              <div className='pt-6'>
                <PricingSection
                  apartmentName={
                    apartments.find((a) => a.id === selectedApartment)?.name ||
                    ''
                  }
                  units={getUnits(selectedApartment)}
                  getCosts={(unitId) => getCosts(selectedApartment, unitId)}
                  onUpdateCost={(costId, amount) =>
                    updateCost(selectedApartment, costId, amount)
                  }
                  onAddCustomCost={(label, unitId) =>
                    addCustomCost(selectedApartment, label, unitId)
                  }
                  onDeleteCustomCost={(costId) =>
                    deleteCustomCost(selectedApartment, costId)
                  }
                  onAddUnit={(name) => {
                    addUnit(selectedApartment, name);
                  }}
                  onDeleteUnit={(unitId) =>
                    deleteUnit(selectedApartment, unitId)
                  }
                  onRenameUnit={(unitId, newName) =>
                    renameUnit(unitId, newName)
                  }
                  onUpdateUnitRentPrice={(unitId, rentPrice) =>
                    updateUnitRentPrice(unitId, rentPrice)
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value='questions'>
              <div className='space-y-8 pt-6'>
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
                          const hasAssociatedApartments =
                            question.associatedApartments &&
                            question.associatedApartments.length > 0;

                          return (
                            <div
                              key={question.id}
                              className='group rounded-xl px-3 py-2 transition-all duration-200'
                            >
                              <div className='flex items-start justify-between gap-3'>
                                <div className='flex flex-1 items-start gap-3'>
                                  <Checkbox
                                    checked={hasAnswer}
                                    className='mt-1'
                                    size={16}
                                    inert
                                  />
                                  <Disclosure
                                    label={
                                      <div className='flex items-center gap-1'>
                                        {hasAssociatedApartments && (
                                          <Badge
                                            variant='secondary'
                                            size='sm'
                                            aspect='square'
                                            className='border border-accent'
                                          />
                                        )}
                                        <span className='text-foreground/90 group-hover:text-foreground text-sm leading-relaxed font-medium transition-colors'>
                                          {question.question}
                                        </span>
                                      </div>
                                    }
                                    className='flex-1'
                                    buttonClassName='!p-0 hover:bg-inherit! hover:underline hover:underline-offset-2'
                                  >
                                    <>
                                      {hasAssociatedApartments && (
                                        <div className='flex flex-wrap gap-1 mt-1'>
                                          {question.associatedApartments!.map(
                                            (aptId) => {
                                              const apartment = apartments.find(
                                                (a) => a.id === aptId,
                                              );
                                              return apartment ? (
                                                <Badge
                                                  key={aptId}
                                                  variant='secondary'
                                                  size='xs'
                                                  className='text-xs'
                                                >
                                                  {apartment.name}
                                                </Badge>
                                              ) : null;
                                            },
                                          )}
                                        </div>
                                      )}
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
                                    </>
                                  </Disclosure>
                                </div>
                                {question.isCustom && (
                                  <div className='flex gap-1'>
                                    <QuestionAssociationButton
                                      question={question}
                                      apartments={apartments}
                                      onUpdateAssociations={
                                        updateQuestionAssociations
                                      }
                                    />
                                    <Button
                                      onClick={() =>
                                        deleteCustomQuestion(question.id)
                                      }
                                      variant='destructive'
                                      size='sm'
                                    >
                                      <Trash className='h-4 w-4' />
                                    </Button>
                                  </div>
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
            </TabsContent>

            <TabsContent value='notes'>
              <div className='pt-6'>
                <NoteSection
                  apartmentName={
                    apartments.find((a) => a.id === selectedApartment)?.name ||
                    ''
                  }
                  note={getNote(selectedApartment)}
                  onUpdateNote={(note) => updateNote(selectedApartment, note)}
                />
              </div>
            </TabsContent>

            <TabsContent value='followups'>
              <div className='pt-6'>
                <FollowUpSection
                  apartmentName={
                    apartments.find((a) => a.id === selectedApartment)?.name ||
                    ''
                  }
                  followUps={getFollowUps(selectedApartment)}
                  onAddFollowUp={(text) => addFollowUp(selectedApartment, text)}
                  onToggleFollowUp={toggleFollowUp}
                  onDeleteFollowUp={deleteFollowUp}
                />
              </div>
            </TabsContent>
          </Tabs>
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
