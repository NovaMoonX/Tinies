import { useState } from 'react';
import { useActionModal } from '@moondreamsdev/dreamer-ui/hooks';
import {
  Question,
  Apartment,
  Answer,
  ApartmentNote,
  FollowUpItem,
  CustomLink,
  ApartmentCost,
  CostItem,
  Unit,
} from './ApartmentTourQuestions.types';
import {
  QUESTIONS,
  DEFAULT_COST_CATEGORIES,
} from './ApartmentTourQuestions.data';

export function useApartmentTourData() {
  const actionModal = useActionModal();

  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<string | null>(
    null,
  );
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [notes, setNotes] = useState<ApartmentNote[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpItem[]>([]);
  const [costs, setCosts] = useState<ApartmentCost[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);

  const allQuestions = [...QUESTIONS, ...customQuestions];

  const addCustomQuestion = (
    question: string,
    category: string,
    associatedApartments?: string[],
  ) => {
    const newQuestion: Question = {
      id: `custom-${Date.now()}`,
      category,
      question,
      isCustom: true,
      associatedApartments,
    };
    setCustomQuestions((prev) => [...prev, newQuestion]);
  };

  const deleteCustomQuestion = async (questionId: string) => {
    const question = customQuestions.find((q) => q.id === questionId);
    if (!question) return;

    const confirmed = await actionModal.confirm({
      title: 'Delete Custom Question',
      message: `Are you sure you want to delete "${question.question}"? This will also remove all answers to this question.`,
    });

    if (confirmed) {
      setCustomQuestions((prev) => prev.filter((q) => q.id !== questionId));
      // Also remove any answers for this question
      setAnswers((prev) => prev.filter((a) => a.questionId !== questionId));
    }
  };

  const addApartment = (name: string) => {
    const newApartment: Apartment = {
      id: `apt-${Date.now()}`,
      name,
    };
    setApartments((prev) => [...prev, newApartment]);
    // Auto-select if it's the first apartment
    if (apartments.length === 0) {
      setSelectedApartment(newApartment.id);
    }
    return newApartment.id;
  };

  const deleteApartment = async (apartmentId: string) => {
    const apartment = apartments.find((a) => a.id === apartmentId);
    if (!apartment) return;

    const confirmed = await actionModal.confirm({
      title: 'Delete Apartment',
      message: `Are you sure you want to delete "${apartment.name}"? This will also remove all answers, units, and costs for this apartment.`,
    });

    if (confirmed) {
      setApartments((prev) => prev.filter((a) => a.id !== apartmentId));
      // Remove answers for this apartment
      setAnswers((prev) => prev.filter((a) => a.apartmentId !== apartmentId));
      // Remove notes for this apartment
      setNotes((prev) => prev.filter((n) => n.apartmentId !== apartmentId));
      // Remove follow-ups for this apartment
      setFollowUps((prev) => prev.filter((f) => f.apartmentId !== apartmentId));
      // Remove units for this apartment
      setUnits((prev) => prev.filter((u) => u.apartmentId !== apartmentId));
      // Remove costs for this apartment
      setCosts((prev) => prev.filter((c) => c.apartmentId !== apartmentId));
      // Clear selection if this was the selected apartment
      if (selectedApartment === apartmentId) {
        setSelectedApartment(null);
      }
    }
  };

  const updateAnswer = (
    questionId: string,
    apartmentId: string,
    answer: string,
  ) => {
    setAnswers((prev) => {
      const existing = prev.find(
        (a) => a.questionId === questionId && a.apartmentId === apartmentId,
      );
      if (existing) {
        if (answer === '') {
          // Remove empty answers
          return prev.filter(
            (a) =>
              !(a.questionId === questionId && a.apartmentId === apartmentId),
          );
        }
        return prev.map((a) =>
          a.questionId === questionId && a.apartmentId === apartmentId
            ? { ...a, answer }
            : a,
        );
      } else if (answer !== '') {
        return [...prev, { questionId, apartmentId, answer }];
      }
      return prev;
    });
  };

  const getAnswer = (questionId: string, apartmentId: string): string => {
    const answer = answers.find(
      (a) => a.questionId === questionId && a.apartmentId === apartmentId,
    );
    return answer?.answer || '';
  };

  // Note management
  const updateNote = (apartmentId: string, note: string) => {
    setNotes((prev) => {
      const existing = prev.find((n) => n.apartmentId === apartmentId);
      if (existing) {
        return prev.map((n) =>
          n.apartmentId === apartmentId ? { ...n, note } : n,
        );
      } else if (note !== '') {
        return [...prev, { apartmentId, note }];
      }
      return prev;
    });
  };

  const getNote = (apartmentId: string): string => {
    const note = notes.find((n) => n.apartmentId === apartmentId);
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
    setFollowUps((prev) => [...prev, newFollowUp]);
  };

  const toggleFollowUp = (followUpId: string) => {
    setFollowUps((prev) =>
      prev.map((f) =>
        f.id === followUpId ? { ...f, completed: !f.completed } : f,
      ),
    );
  };

  const deleteFollowUp = (followUpId: string) => {
    setFollowUps((prev) => prev.filter((f) => f.id !== followUpId));
  };

  const getFollowUps = (apartmentId: string): FollowUpItem[] => {
    const result = followUps.filter((f) => f.apartmentId === apartmentId);
    return result;
  };

  // Question association management
  const toggleQuestionAssociation = (
    questionId: string,
    apartmentId: string,
  ) => {
    setCustomQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const currentAssociations = q.associatedApartments || [];
          const isAssociated = currentAssociations.includes(apartmentId);

          const newAssociations = isAssociated
            ? currentAssociations.filter((id) => id !== apartmentId)
            : [...currentAssociations, apartmentId];

          const result = {
            ...q,
            associatedApartments:
              newAssociations.length > 0 ? newAssociations : undefined,
          };
          return result;
        }
        return q;
      }),
    );
  };

  const updateQuestionAssociations = (
    questionId: string,
    associatedApartments?: string[],
  ) => {
    // If associatedApartments is an empty array, delete the question
    if (associatedApartments && associatedApartments.length === 0) {
      setCustomQuestions((prev) => prev.filter((q) => q.id !== questionId));
      // Also remove any answers for this question
      setAnswers((prev) => prev.filter((a) => a.questionId !== questionId));
      return;
    }

    setCustomQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, associatedApartments } : q,
      ),
    );
  };

  const isQuestionAssociated = (
    questionId: string,
    apartmentId: string,
  ): boolean => {
    const question = customQuestions.find((q) => q.id === questionId);
    if (!question || !question.associatedApartments) {
      return true; // Default questions and non-associated custom questions show for all apartments
    }
    const result = question.associatedApartments.includes(apartmentId);
    return result;
  };

  // Apartment details management
  const updateApartmentDetails = (
    apartmentId: string,
    updates: Partial<Apartment>,
  ) => {
    setApartments((prev) =>
      prev.map((apt) =>
        apt.id === apartmentId ? { ...apt, ...updates } : apt,
      ),
    );
  };

  const addCustomLink = (apartmentId: string, label: string, url: string) => {
    setApartments((prev) =>
      prev.map((apt) => {
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
      }),
    );
  };

  const deleteCustomLink = (apartmentId: string, linkId: string) => {
    setApartments((prev) =>
      prev.map((apt) => {
        if (apt.id === apartmentId && apt.customLinks) {
          const updatedLinks = apt.customLinks.filter(
            (link) => link.id !== linkId,
          );
          return {
            ...apt,
            customLinks: updatedLinks.length > 0 ? updatedLinks : undefined,
          };
        }
        return apt;
      }),
    );
  };

  const getApartment = (apartmentId: string): Apartment | undefined => {
    const result = apartments.find((a) => a.id === apartmentId);
    return result;
  };

  // Cost management
  const getCosts = (apartmentId: string, unitId?: string): CostItem[] => {
    const apartmentCost = costs.find((c) => c.apartmentId === apartmentId);
    if (apartmentCost) {
      // Filter by unitId if provided
      if (unitId) {
        return apartmentCost.costs.filter((cost) => cost.unitId === unitId);
      }
      // Return costs without unitId (apartment-level costs)
      const buildingWideCosts = apartmentCost.costs.filter(
        (cost) => !cost.unitId,
      );

      // If no building-wide costs exist yet, return defaults (including building-wide rent)
      if (buildingWideCosts.length === 0) {
        const defaultCosts: CostItem[] = [
          {
            id: `default-${apartmentId}-rent`,
            label: 'Rent',
            amount: 0,
            isCustom: false,
          },
          ...DEFAULT_COST_CATEGORIES.map((category, index) => ({
            id: `default-${apartmentId}-${index}`,
            label: category.label,
            amount: 0,
            isCustom: category.isCustom,
          })),
        ];
        return defaultCosts;
      }

      // Ensure building-wide rent exists
      const hasRent = buildingWideCosts.some((cost) => cost.label === 'Rent');
      if (!hasRent) {
        const rentCost: CostItem = {
          id: `default-${apartmentId}-rent`,
          label: 'Rent',
          amount: 0,
          isCustom: false,
        };
        return [rentCost, ...buildingWideCosts];
      }

      return buildingWideCosts;
    }

    // Return default cost categories with 0 amounts (only if no unitId specified)
    // For units, we don't return defaults - they're created when the unit is added
    if (!unitId) {
      const defaultCosts: CostItem[] = [
        {
          id: `default-${apartmentId}-rent`,
          label: 'Rent',
          amount: 0,
          isCustom: false,
        },
        ...DEFAULT_COST_CATEGORIES.map((category, index) => ({
          id: `default-${apartmentId}-${index}`,
          label: category.label,
          amount: 0,
          isCustom: category.isCustom,
        })),
      ];

      return defaultCosts;
    }

    return [];
  };

  const updateCost = (
    apartmentId: string,
    costId: string,
    amount: number,
    unitId?: string,
  ) => {
    setCosts((prev) => {
      const existing = prev.find((c) => c.apartmentId === apartmentId);

      if (existing) {
        // Check if the cost exists in the stored costs
        const costExists = existing.costs.some((cost) => cost.id === costId);

        if (costExists) {
          // Update existing cost
          const updatedCosts = existing.costs.map((cost) =>
            cost.id === costId ? { ...cost, amount } : cost,
          );

          return prev.map((c) =>
            c.apartmentId === apartmentId ? { ...c, costs: updatedCosts } : c,
          );
        }

        // Cost doesn't exist, need to add defaults first
        const defaultCosts = [
          {
            id: `default-${apartmentId}-rent`,
            label: 'Rent',
            amount: 0,
            isCustom: false,
            unitId: unitId === undefined ? undefined : unitId,
          },
          ...DEFAULT_COST_CATEGORIES.map((category, index) => ({
            id: `default-${apartmentId}-${index}`,
            label: category.label,
            amount: 0,
            isCustom: category.isCustom,
            unitId: undefined, // Default fees are always building-wide
          })),
        ];

        // Add any defaults that don't already exist, then update the target cost
        const newDefaults = defaultCosts.filter(
          (defaultCost) =>
            !existing.costs.some(
              (existingCost) =>
                existingCost.label === defaultCost.label &&
                existingCost.unitId === defaultCost.unitId,
            ),
        );

        const allCosts = [...existing.costs, ...newDefaults];
        const updatedCosts = allCosts.map((cost) =>
          cost.id === costId ? { ...cost, amount } : cost,
        );

        return prev.map((c) =>
          c.apartmentId === apartmentId ? { ...c, costs: updatedCosts } : c,
        );
      }

      // Create new apartment cost entry with building-wide rent + default categories
      const defaultCosts = [
        {
          id: `default-${apartmentId}-rent`,
          label: 'Rent',
          amount: 0,
          isCustom: false,
          unitId: unitId === undefined ? undefined : unitId,
        },
        ...DEFAULT_COST_CATEGORIES.map((category, index) => ({
          id: `default-${apartmentId}-${index}`,
          label: category.label,
          amount: 0,
          isCustom: category.isCustom,
          unitId: undefined, // Default fees are always building-wide
        })),
      ];

      const updatedCosts = defaultCosts.map((cost) =>
        cost.id === costId ? { ...cost, amount } : cost,
      );

      const newApartmentCost: ApartmentCost = {
        apartmentId,
        costs: updatedCosts,
      };

      return [...prev, newApartmentCost];
    });
  };

  const addCustomCost = (
    apartmentId: string,
    label: string,
    unitId?: string,
  ) => {
    setCosts((prev) => {
      const existing = prev.find((c) => c.apartmentId === apartmentId);
      const newCost: CostItem = {
        id: `custom-${Date.now()}`,
        label,
        amount: 0,
        isCustom: true,
        unitId, // Custom costs are always building-wide in the new design
      };

      if (existing) {
        return prev.map((c) =>
          c.apartmentId === apartmentId
            ? { ...c, costs: [...c.costs, newCost] }
            : c,
        );
      }

      // Initialize with building-wide rent + default categories
      const defaultCosts = [
        {
          id: `default-${apartmentId}-rent`,
          label: 'Rent',
          amount: 0,
          isCustom: false,
        },
        ...DEFAULT_COST_CATEGORIES.map((category, index) => ({
          id: `default-${apartmentId}-${index}`,
          label: category.label,
          amount: 0,
          isCustom: category.isCustom,
        })),
      ];

      const newApartmentCost: ApartmentCost = {
        apartmentId,
        costs: [...defaultCosts, newCost],
      };

      return [...prev, newApartmentCost];
    });
  };

  // This function is no longer needed since rent is now stored on the Unit object
  // Keeping it for backward compatibility but it does nothing
  const addUnitCosts = () => {
    // Rent is now stored directly on the Unit object via rentPrice
    // Custom costs can still be added via addCustomCost
  };

  const deleteCustomCost = (apartmentId: string, costId: string) => {
    setCosts((prev) =>
      prev.map((c) =>
        c.apartmentId === apartmentId
          ? { ...c, costs: c.costs.filter((cost) => cost.id !== costId) }
          : c,
      ),
    );
  };

  // Unit management
  const addUnit = (apartmentId: string, unitName: string) => {
    const newUnit: Unit = {
      id: `unit-${Date.now()}`,
      name: unitName,
      apartmentId,
    };

    setUnits((prev) => [...prev, newUnit]);

    return newUnit.id;
  };

  const deleteUnit = async (apartmentId: string, unitId: string) => {
    const unit = units.find((u) => u.id === unitId);

    if (!unit) return;

    const confirmed = await actionModal.confirm({
      title: 'Delete Unit',
      message: `Are you sure you want to delete "${unit.name}"? This will also remove all costs associated with this unit.`,
    });

    if (confirmed) {
      setUnits((prev) => prev.filter((u) => u.id !== unitId));

      // Remove costs associated with this unit
      setCosts((prev) =>
        prev.map((c) => {
          if (c.apartmentId === apartmentId) {
            return {
              ...c,
              costs: c.costs.filter((cost) => cost.unitId !== unitId),
            };
          }
          return c;
        }),
      );
    }
  };

  const getUnits = (apartmentId: string): Unit[] => {
    return units.filter((u) => u.apartmentId === apartmentId);
  };

  const renameUnit = (unitId: string, newName: string) => {
    setUnits((prev) =>
      prev.map((unit) =>
        unit.id === unitId ? { ...unit, name: newName } : unit,
      ),
    );
  };

  const updateUnitRentPrice = (unitId: string, rentPrice: number) => {
    setUnits((prev) =>
      prev.map((unit) =>
        unit.id === unitId ? { ...unit, rentPrice } : unit,
      ),
    );
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
    renameUnit,
    updateUnitRentPrice,
  };
}
