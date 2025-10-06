import { useState } from 'react';
import { useActionModal } from '@moondreamsdev/dreamer-ui/hooks';
import { Question, Apartment, Answer, ApartmentNote, FollowUpItem, CustomLink, ApartmentCost, CostItem, Unit } from './ApartmentTourQuestions.types';
import { QUESTIONS, DEFAULT_COST_CATEGORIES } from './ApartmentTourQuestions.data';

export function useApartmentTourData() {
  const actionModal = useActionModal();

  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [notes, setNotes] = useState<ApartmentNote[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpItem[]>([]);
  const [costs, setCosts] = useState<ApartmentCost[]>([]);

  const allQuestions = [...QUESTIONS, ...customQuestions];

  const addCustomQuestion = (question: string, category: string, associatedApartments?: string[]) => {
    const newQuestion: Question = {
      id: `custom-${Date.now()}`,
      category,
      question,
      isCustom: true,
      associatedApartments,
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

  const updateQuestionAssociations = (questionId: string, associatedApartments?: string[]) => {
    // If associatedApartments is an empty array, delete the question
    if (associatedApartments && associatedApartments.length === 0) {
      setCustomQuestions(prev => prev.filter(q => q.id !== questionId));
      // Also remove any answers for this question
      setAnswers(prev => prev.filter(a => a.questionId !== questionId));
      return;
    }
    
    setCustomQuestions(prev =>
      prev.map(q =>
        q.id === questionId
          ? { ...q, associatedApartments }
          : q
      )
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

  // Cost management
  const getCosts = (apartmentId: string, unitId?: string): CostItem[] => {
    const apartmentCost = costs.find(c => c.apartmentId === apartmentId);
    if (apartmentCost) {
      // Filter by unitId if provided
      if (unitId) {
        return apartmentCost.costs.filter(cost => cost.unitId === unitId);
      }
      // Return costs without unitId (apartment-level costs)
      const buildingWideCosts = apartmentCost.costs.filter(cost => !cost.unitId);
      
      // If no building-wide costs exist yet, return defaults
      if (buildingWideCosts.length === 0) {
        const defaultCosts: CostItem[] = DEFAULT_COST_CATEGORIES.map((category, index) => ({
          id: `default-${apartmentId}-${index}`,
          label: category.label,
          amount: 0,
          isCustom: category.isCustom,
        }));
        return defaultCosts;
      }
      
      return buildingWideCosts;
    }
    
    // Return default cost categories with 0 amounts (only if no unitId specified)
    // For units, we don't return defaults - they're created when the unit is added
    if (!unitId) {
      const defaultCosts: CostItem[] = DEFAULT_COST_CATEGORIES.map((category, index) => ({
        id: `default-${apartmentId}-${index}`,
        label: category.label,
        amount: 0,
        isCustom: category.isCustom,
      }));
      
      return defaultCosts;
    }
    
    return [];
  };

  const updateCost = (apartmentId: string, costId: string, amount: number, unitId?: string) => {
    setCosts(prev => {
      const existing = prev.find(c => c.apartmentId === apartmentId);
      
      if (existing) {
        const updatedCosts = existing.costs.map(cost =>
          cost.id === costId ? { ...cost, amount } : cost
        );
        
        return prev.map(c =>
          c.apartmentId === apartmentId ? { ...c, costs: updatedCosts } : c
        );
      } else {
        // Create new apartment cost entry
        const defaultCosts = DEFAULT_COST_CATEGORIES.map((category, index) => ({
          id: `default-${apartmentId}-${index}`,
          label: category.label,
          amount: 0,
          isCustom: category.isCustom,
          unitId,
        }));
        
        const updatedCosts = defaultCosts.map(cost =>
          cost.id === costId ? { ...cost, amount } : cost
        );
        
        const newApartmentCost: ApartmentCost = {
          apartmentId,
          costs: updatedCosts,
        };
        
        return [...prev, newApartmentCost];
      }
    });
  };

  const addCustomCost = (apartmentId: string, label: string, unitId?: string) => {
    setCosts(prev => {
      const existing = prev.find(c => c.apartmentId === apartmentId);
      const newCost: CostItem = {
        id: `custom-${Date.now()}`,
        label,
        amount: 0,
        isCustom: true,
        unitId,
      };
      
      if (existing) {
        return prev.map(c =>
          c.apartmentId === apartmentId
            ? { ...c, costs: [...c.costs, newCost] }
            : c
        );
      } else {
        const defaultCosts = unitId ? [] : DEFAULT_COST_CATEGORIES.map((category, index) => ({
          id: `default-${apartmentId}-${index}`,
          label: category.label,
          amount: 0,
          isCustom: category.isCustom,
        }));
        
        const newApartmentCost: ApartmentCost = {
          apartmentId,
          costs: [...defaultCosts, newCost],
        };
        
        return [...prev, newApartmentCost];
      }
    });
  };

  const addUnitCosts = (apartmentId: string, unitId: string) => {
    setCosts(prev => {
      const existing = prev.find(c => c.apartmentId === apartmentId);
      
      // Only add "Rent" for units, not all the default categories
      const unitCosts: CostItem[] = [{
        id: `unit-${unitId}-rent`,
        label: 'Rent',
        amount: 0,
        isCustom: false,
        unitId,
      }];
      
      if (existing) {
        return prev.map(c =>
          c.apartmentId === apartmentId
            ? { ...c, costs: [...c.costs, ...unitCosts] }
            : c
        );
      } else {
        const newApartmentCost: ApartmentCost = {
          apartmentId,
          costs: unitCosts,
        };
        
        return [...prev, newApartmentCost];
      }
    });
  };

  const deleteCustomCost = (apartmentId: string, costId: string) => {
    setCosts(prev =>
      prev.map(c =>
        c.apartmentId === apartmentId
          ? { ...c, costs: c.costs.filter(cost => cost.id !== costId) }
          : c
      )
    );
  };

  // Unit management
  const addUnit = (apartmentId: string, unitName: string) => {
    const newUnit: Unit = {
      id: `unit-${Date.now()}`,
      name: unitName,
      apartmentId,
    };
    
    setApartments(prev =>
      prev.map(apt => {
        if (apt.id === apartmentId) {
          const currentUnits = apt.units || [];
          return { ...apt, units: [...currentUnits, newUnit] };
        }
        return apt;
      })
    );
    
    return newUnit.id;
  };

  const deleteUnit = async (apartmentId: string, unitId: string) => {
    const apartment = apartments.find(a => a.id === apartmentId);
    const unit = apartment?.units?.find(u => u.id === unitId);
    
    if (!unit) return;

    const confirmed = await actionModal.confirm({
      title: 'Delete Unit',
      message: `Are you sure you want to delete "${unit.name}"? This will also remove all costs associated with this unit.`,
    });

    if (confirmed) {
      setApartments(prev =>
        prev.map(apt => {
          if (apt.id === apartmentId && apt.units) {
            const updatedUnits = apt.units.filter(u => u.id !== unitId);
            return { ...apt, units: updatedUnits.length > 0 ? updatedUnits : undefined };
          }
          return apt;
        })
      );
      
      // Remove costs associated with this unit
      setCosts(prev =>
        prev.map(c => {
          if (c.apartmentId === apartmentId) {
            return { ...c, costs: c.costs.filter(cost => cost.unitId !== unitId) };
          }
          return c;
        })
      );
    }
  };

  const getUnits = (apartmentId: string): Unit[] => {
    const apartment = apartments.find(a => a.id === apartmentId);
    return apartment?.units || [];
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
    updateQuestionAssociations,
    isQuestionAssociated,
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
    addUnitCosts,
  };
}
