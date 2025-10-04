import { useState } from 'react';
import { Question, Apartment, Answer } from './ApartmentTourQuestions.types';
import { QUESTIONS } from './ApartmentTourQuestions.data';

export function useApartmentTourData() {
  // Custom questions
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);

  // Apartments
  const [apartments, setApartments] = useState<Apartment[]>([]);

  // Selected apartment
  const [selectedApartment, setSelectedApartment] = useState<string | null>(null);

  // Answers
  const [answers, setAnswers] = useState<Answer[]>([]);

  // All questions (predefined + custom)
  const allQuestions = [...QUESTIONS, ...customQuestions];

  // Helper functions
  const addCustomQuestion = (question: string, category: string) => {
    const newQuestion: Question = {
      id: `custom-${Date.now()}`,
      category,
      question,
      isCustom: true,
    };
    setCustomQuestions(prev => [...prev, newQuestion]);
  };

  const deleteCustomQuestion = (questionId: string) => {
    setCustomQuestions(prev => prev.filter(q => q.id !== questionId));
    // Also remove any answers for this question
    setAnswers(prev => prev.filter(a => a.questionId !== questionId));
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

  const deleteApartment = (apartmentId: string) => {
    setApartments(prev => prev.filter(a => a.id !== apartmentId));
    // Remove answers for this apartment
    setAnswers(prev => prev.filter(a => a.apartmentId !== apartmentId));
    // Clear selection if this was the selected apartment
    if (selectedApartment === apartmentId) {
      setSelectedApartment(null);
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
