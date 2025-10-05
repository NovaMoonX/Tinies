import { useState } from 'react';
import { useActionModal } from '@moondreamsdev/dreamer-ui/hooks';
import { Question, Apartment, Answer, ApartmentNote, FollowUpItem, CustomLink } from './ApartmentTourQuestions.types';
import { QUESTIONS } from './ApartmentTourQuestions.data';

export function useApartmentTourData() {
  const actionModal = useActionModal();

  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [notes, setNotes] = useState<ApartmentNote[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpItem[]>([]);

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

  const addApartment = (name: string) => {
    const newApartment: Apartment = {
      id: `apt-${Date.now()}`,
      name,
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
      // Remove notes for this apartment
      setNotes(prev => prev.filter(n => n.apartmentId !== apartmentId));
      // Remove follow-ups for this apartment
      setFollowUps(prev => prev.filter(f => f.apartmentId !== apartmentId));
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

  // Note management
  const updateNote = (apartmentId: string, note: string) => {
    setNotes(prev => {
      const existing = prev.find(n => n.apartmentId === apartmentId);
      if (existing) {
        return prev.map(n =>
          n.apartmentId === apartmentId ? { ...n, note } : n
        );
      } else if (note !== '') {
        return [...prev, { apartmentId, note }];
      }
      return prev;
    });
  };

  const getNote = (apartmentId: string): string => {
    const note = notes.find(n => n.apartmentId === apartmentId);
    return note?.note || '';
  };

  // Follow-up management
  const addFollowUp = (apartmentId: string, text: string) => {
    const newFollowUp: FollowUpItem = {
      id: `followup-${Date.now()}`,
      apartmentId,
      text,
      completed: false,
    };
    setFollowUps(prev => [...prev, newFollowUp]);
  };

  const toggleFollowUp = (followUpId: string) => {
    setFollowUps(prev =>
      prev.map(f =>
        f.id === followUpId ? { ...f, completed: !f.completed } : f
      )
    );
  };

  const deleteFollowUp = (followUpId: string) => {
    setFollowUps(prev => prev.filter(f => f.id !== followUpId));
  };

  const getFollowUps = (apartmentId: string): FollowUpItem[] => {
    const result = followUps.filter(f => f.apartmentId === apartmentId);
    return result;
  };

  // Question association management
  const toggleQuestionAssociation = (questionId: string, apartmentId: string) => {
    setCustomQuestions(prev =>
      prev.map(q => {
        if (q.id === questionId) {
          const currentAssociations = q.associatedApartments || [];
          const isAssociated = currentAssociations.includes(apartmentId);
          
          const newAssociations = isAssociated
            ? currentAssociations.filter(id => id !== apartmentId)
            : [...currentAssociations, apartmentId];

          const result = {
            ...q,
            associatedApartments: newAssociations.length > 0 ? newAssociations : undefined,
          };
          return result;
        }
        return q;
      })
    );
  };

  const isQuestionAssociated = (questionId: string, apartmentId: string): boolean => {
    const question = customQuestions.find(q => q.id === questionId);
    if (!question || !question.associatedApartments) {
      return true; // Default questions and non-associated custom questions show for all apartments
    }
    const result = question.associatedApartments.includes(apartmentId);
    return result;
  };

  // Apartment details management
  const updateApartmentDetails = (apartmentId: string, updates: Partial<Apartment>) => {
    setApartments(prev =>
      prev.map(apt =>
        apt.id === apartmentId ? { ...apt, ...updates } : apt
      )
    );
  };

  const addCustomLink = (apartmentId: string, label: string, url: string) => {
    setApartments(prev =>
      prev.map(apt => {
        if (apt.id === apartmentId) {
          const newLink: CustomLink = {
            id: `link-${Date.now()}`,
            label,
            url,
          };
          const currentLinks = apt.customLinks || [];
          return { ...apt, customLinks: [...currentLinks, newLink] };
        }
        return apt;
      })
    );
  };

  const deleteCustomLink = (apartmentId: string, linkId: string) => {
    setApartments(prev =>
      prev.map(apt => {
        if (apt.id === apartmentId && apt.customLinks) {
          const updatedLinks = apt.customLinks.filter(link => link.id !== linkId);
          return { ...apt, customLinks: updatedLinks.length > 0 ? updatedLinks : undefined };
        }
        return apt;
      })
    );
  };

  const getApartment = (apartmentId: string): Apartment | undefined => {
    const result = apartments.find(a => a.id === apartmentId);
    return result;
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
    updateNote,
    getNote,
    addFollowUp,
    toggleFollowUp,
    deleteFollowUp,
    getFollowUps,
    toggleQuestionAssociation,
    isQuestionAssociated,
    updateApartmentDetails,
    addCustomLink,
    deleteCustomLink,
    getApartment,
  };
}
