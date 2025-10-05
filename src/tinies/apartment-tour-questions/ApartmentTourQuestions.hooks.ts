import { useState } from 'react';
import { useActionModal } from '@moondreamsdev/dreamer-ui/hooks';
import { Question, Apartment, Answer } from './ApartmentTourQuestions.types';
import { QUESTIONS } from './ApartmentTourQuestions.data';

export function useApartmentTourData() {
  const actionModal = useActionModal();

  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const allQuestions = [...QUESTIONS, ...customQuestions];

  const addCustomQuestion = (question: string, category: string) => {
    const newQuestion: Question = {
      id: `custom-${Date.now()}`,
      category,
      question,
      isCustom: true,
    };
    setCustomQuestions(prev => [...prev, newQuestion]);
  };

  const deleteCustomQuestion = async (questionId: string) => {
    const question = customQuestions.find(q => q.id === questionId);
    if (!question) return;

    const confirmed = await actionModal.confirm({
      title: 'Delete Custom Question',
      message: `Are you sure you want to delete "${question.question}"? This will also remove all answers to this question.`,
    });

    if (confirmed) {
      setCustomQuestions(prev => prev.filter(q => q.id !== questionId));
      // Also remove any answers for this question
      setAnswers(prev => prev.filter(a => a.questionId !== questionId));
    }
  };

  const addApartment = (name: string, address?: string) => {
    const newApartment: Apartment = {
      id: `apt-${Date.now()}`,
      name,
      address,
    };
    setApartments(prev => [...prev, newApartment]);
    // Auto-select if it's the first apartment
    if (apartments.length === 0) {
      setSelectedApartment(newApartment.id);
    }
    return newApartment.id;
  };

  const deleteApartment = async (apartmentId: string) => {
    const apartment = apartments.find(a => a.id === apartmentId);
    if (!apartment) return;

    const confirmed = await actionModal.confirm({
      title: 'Delete Apartment',
      message: `Are you sure you want to delete "${apartment.name}"? This will also remove all answers for this apartment.`,
    });

    if (confirmed) {
      setApartments(prev => prev.filter(a => a.id !== apartmentId));
      // Remove answers for this apartment
      setAnswers(prev => prev.filter(a => a.apartmentId !== apartmentId));
      // Clear selection if this was the selected apartment
      if (selectedApartment === apartmentId) {
        setSelectedApartment(null);
      }
    }
  };

  const updateAnswer = (questionId: string, apartmentId: string, answer: string) => {
    setAnswers(prev => {
      const existing = prev.find(
        a => a.questionId === questionId && a.apartmentId === apartmentId
      );
      if (existing) {
        if (answer === '') {
          // Remove empty answers
          return prev.filter(
            a => !(a.questionId === questionId && a.apartmentId === apartmentId)
          );
        }
        return prev.map(a =>
          a.questionId === questionId && a.apartmentId === apartmentId
            ? { ...a, answer }
            : a
        );
      } else if (answer !== '') {
        return [...prev, { questionId, apartmentId, answer }];
      }
      return prev;
    });
  };

  const getAnswer = (questionId: string, apartmentId: string): string => {
    const answer = answers.find(
      a => a.questionId === questionId && a.apartmentId === apartmentId
    );
    return answer?.answer || '';
  };

  return {
    allQuestions,
    customQuestions,
    apartments,
    selectedApartment,
    answers,
    addCustomQuestion,
    deleteCustomQuestion,
    addApartment,
    deleteApartment,
    updateAnswer,
    getAnswer,
    setSelectedApartment,
  };
}
