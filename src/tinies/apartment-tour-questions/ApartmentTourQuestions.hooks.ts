import { useEffect, useState } from 'react';
import { Question, Apartment, Answer } from './ApartmentTourQuestions.types';
import { QUESTIONS } from './ApartmentTourQuestions.data';

const STORAGE_KEYS = {
  CUSTOM_QUESTIONS: 'apartment-tour-custom-questions',
  APARTMENTS: 'apartment-tour-apartments',
  ANSWERS: 'apartment-tour-answers',
  SELECTED_APARTMENT: 'apartment-tour-selected-apartment',
};

export function useApartmentTourData() {
  // Custom questions
  const [customQuestions, setCustomQuestions] = useState<Question[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
    return stored ? JSON.parse(stored) : [];
  });

  // Apartments
  const [apartments, setApartments] = useState<Apartment[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.APARTMENTS);
    return stored ? JSON.parse(stored) : [];
  });

  // Selected apartment
  const [selectedApartment, setSelectedApartment] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_APARTMENT);
  });

  // Answers
  const [answers, setAnswers] = useState<Answer[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ANSWERS);
    return stored ? JSON.parse(stored) : [];
  });

  // All questions (predefined + custom)
  const allQuestions = [...QUESTIONS, ...customQuestions];

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(customQuestions));
  }, [customQuestions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APARTMENTS, JSON.stringify(apartments));
  }, [apartments]);

  useEffect(() => {
    if (selectedApartment) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_APARTMENT, selectedApartment);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_APARTMENT);
    }
  }, [selectedApartment]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
  }, [answers]);

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
