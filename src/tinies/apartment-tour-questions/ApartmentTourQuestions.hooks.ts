import { FIREBASE_TINY_PATH } from '@lib/firebase';
import { useTinyDataLoader, useTinyDataSaver, withDefaults } from '@lib/tinies/tinies.hooks';
import { useActionModal } from '@moondreamsdev/dreamer-ui/hooks';
import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_COST_CATEGORIES,
  DEFAULT_ONE_TIME_FEES,
  QUESTIONS,
} from './ApartmentTourQuestions.data';
import {
  Answer,
  Apartment,
  ApartmentCost,
  ApartmentNote,
  ApartmentTourQuestionsData,
  CostItem,
  CustomLink,
  FollowUpItem,
  Question,
  Unit,
} from './ApartmentTourQuestions.types';

const defaultApartmentTourData: ApartmentTourQuestionsData = {
  customQuestions: [],
  apartments: [],
  selectedApartment: null,
  answers: [],
  notes: [],
  followUps: [],
  costs: [],
  units: [],
};

const defaultQuestion: Question = {
  id: '',
  category: '',
  question: '',
  isCustom: false,
  associatedApartments: [],
};

const defaultCustomLink: CustomLink = {
  id: '',
  label: '',
  url: '',
};

const defaultApartment: Apartment = {
  id: '',
  name: '',
  address: '',
  website: '',
  phoneNumber: '',
  email: '',
  customLinks: [],
  keyAmenities: [],
};

const defaultUnit: Unit = {
  id: '',
  name: '',
  apartmentId: '',
  rentPrice: null,
};

const defaultAnswer: Answer = {
  questionId: '',
  apartmentId: '',
  answer: '',
};

const defaultApartmentNote: ApartmentNote = {
  apartmentId: '',
  note: '',
};

const defaultFollowUpItem: FollowUpItem = {
  id: '',
  apartmentId: '',
  text: '',
  completed: false,
};

const defaultCostItem: CostItem = {
  id: '',
  label: '',
  amount: 0,
  isCustom: false,
  unitId: null,
  isOneTime: false,
};

const defaultApartmentCost: ApartmentCost = {
  apartmentId: '',
  costs: [],
};

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

  const resetData = useCallback(() => {
    setCustomQuestions([]);
    setApartments([]);
    setSelectedApartment(null);
    setAnswers([]);
    setNotes([]);
    setFollowUps([]);
    setCosts([]);
    setUnits([]);
  }, []);

  // Load data from Firebase Realtime Database on mount
  const { data: loadedData, isLoaded } = useTinyDataLoader<ApartmentTourQuestionsData>(
    FIREBASE_TINY_PATH.APARTMENT_TOUR_QUESTIONS,
    resetData,
  );

  // Update local state when data is loaded
  useEffect(() => {
    if (loadedData) {
      const normalized = withDefaults(loadedData, defaultApartmentTourData);
      
      // Normalize each individual question
      const normalizedCustomQuestions = normalized.customQuestions.map((question) =>
        withDefaults(
          question as Partial<Question> as Partial<Record<string, unknown>>,
          defaultQuestion as unknown as Record<string, unknown>,
        ),
      );
      
      // Normalize each individual apartment and its nested objects
      const normalizedApartments = normalized.apartments.map((apartment) => {
        const normalizedApartment = withDefaults(
          apartment as Partial<Apartment> as Partial<Record<string, unknown>>,
          defaultApartment as unknown as Record<string, unknown>,
        );
        return {
          ...normalizedApartment,
          customLinks: (normalizedApartment.customLinks as CustomLink[]).map((link) =>
            withDefaults(
              link as Partial<CustomLink> as Partial<Record<string, unknown>>,
              defaultCustomLink as unknown as Record<string, unknown>,
            ),
          ),
        };
      });
      
      // Normalize each individual unit
      const normalizedUnits = normalized.units.map((unit) =>
        withDefaults(
          unit as Partial<Unit> as Partial<Record<string, unknown>>,
          defaultUnit as unknown as Record<string, unknown>,
        ),
      );
      
      // Normalize each individual answer
      const normalizedAnswers = normalized.answers.map((answer) =>
        withDefaults(
          answer as Partial<Answer> as Partial<Record<string, unknown>>,
          defaultAnswer as unknown as Record<string, unknown>,
        ),
      );
      
      // Normalize each individual note
      const normalizedNotes = normalized.notes.map((note) =>
        withDefaults(
          note as Partial<ApartmentNote> as Partial<Record<string, unknown>>,
          defaultApartmentNote as unknown as Record<string, unknown>,
        ),
      );
      
      // Normalize each individual follow-up
      const normalizedFollowUps = normalized.followUps.map((followUp) =>
        withDefaults(
          followUp as Partial<FollowUpItem> as Partial<Record<string, unknown>>,
          defaultFollowUpItem as unknown as Record<string, unknown>,
        ),
      );
      
      // Normalize each individual apartment cost and its nested cost items
      const normalizedCosts = normalized.costs.map((apartmentCost) => {
        const normalizedApartmentCost = withDefaults(
          apartmentCost as Partial<ApartmentCost> as Partial<Record<string, unknown>>,
          defaultApartmentCost as unknown as Record<string, unknown>,
        );
        return {
          ...normalizedApartmentCost,
          costs: (normalizedApartmentCost.costs as CostItem[]).map((costItem) =>
            withDefaults(
              costItem as Partial<CostItem> as Partial<Record<string, unknown>>,
              defaultCostItem as unknown as Record<string, unknown>,
            ),
          ),
        };
      });
      
      setCustomQuestions(normalizedCustomQuestions as unknown as Question[]);
      setApartments(normalizedApartments as unknown as Apartment[]);
      setSelectedApartment(normalized.selectedApartment);
      setAnswers(normalizedAnswers as unknown as Answer[]);
      setNotes(normalizedNotes as unknown as ApartmentNote[]);
      setFollowUps(normalizedFollowUps as unknown as FollowUpItem[]);
      setCosts(normalizedCosts as unknown as ApartmentCost[]);
      setUnits(normalizedUnits as unknown as Unit[]);
    }
  }, [loadedData]);

  // Save data to Firebase Realtime Database with debouncing
  const dataToSave: ApartmentTourQuestionsData = {
    customQuestions,
    apartments,
    selectedApartment,
    answers,
    notes,
    followUps,
    costs,
    units,
  };
  useTinyDataSaver(FIREBASE_TINY_PATH.APARTMENT_TOUR_QUESTIONS, dataToSave, isLoaded);

  const allQuestions = [...QUESTIONS, ...customQuestions];

  const addCustomQuestion = (
    question: string,
    category: string,
    associatedApartments: string[] = [],
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
      address: '',
      website: '',
      phoneNumber: '',
      email: '',
      customLinks: [],
      keyAmenities: [],
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
            associatedApartments: newAssociations,
          };
          return result;
        }
        return q;
      }),
    );
  };

  const updateQuestionAssociations = (
    questionId: string,
    associatedApartments: string[] = [],
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
    if (!question || !question.associatedApartments || question.associatedApartments.length === 0) {
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
            customLinks: updatedLinks,
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

  // Amenities management
  const addAmenity = (apartmentId: string, amenity: string) => {
    setApartments((prev) =>
      prev.map((apt) => {
        if (apt.id === apartmentId) {
          const currentAmenities = apt.keyAmenities || [];
          // Only add if not already present
          if (!currentAmenities.includes(amenity)) {
            return { ...apt, keyAmenities: [...currentAmenities, amenity] };
          }
        }
        return apt;
      }),
    );
  };

  const deleteAmenity = (apartmentId: string, amenity: string) => {
    setApartments((prev) =>
      prev.map((apt) => {
        if (apt.id === apartmentId && apt.keyAmenities) {
          const updatedAmenities = apt.keyAmenities.filter((a) => a !== amenity);
          return {
            ...apt,
            keyAmenities: updatedAmenities,
          };
        }
        return apt;
      }),
    );
  };

  const getAllAmenities = (): string[] => {
    const allAmenities = apartments.flatMap((apt) => apt.keyAmenities || []);
    const uniqueAmenities = Array.from(new Set(allAmenities)).sort();
    return uniqueAmenities;
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

      // If no building-wide costs exist yet, return defaults (monthly costs + one-time fees)
      if (buildingWideCosts.length === 0) {
        const defaultMonthlyCosts: CostItem[] = DEFAULT_COST_CATEGORIES.map(
          (category, index) => ({
            id: `default-${apartmentId}-${index}`,
            label: category.label,
            amount: 0,
            isCustom: category.isCustom,
            unitId: null,
            isOneTime: false,
          }),
        );
        const defaultOneTimeFees: CostItem[] = DEFAULT_ONE_TIME_FEES.map(
          (fee, index) => ({
            id: `onetime-${apartmentId}-${index}`,
            label: fee.label,
            amount: 0,
            isCustom: fee.isCustom,
            isOneTime: fee.isOneTime,
            unitId: null,
          }),
        );
        return [...defaultMonthlyCosts, ...defaultOneTimeFees];
      }

      return buildingWideCosts;
    }

    // Return default cost categories with 0 amounts (only if no unitId specified)
    // For units, we don't return defaults - they're created when the unit is added
    if (!unitId) {
      const defaultMonthlyCosts: CostItem[] = DEFAULT_COST_CATEGORIES.map(
        (category, index) => ({
          id: `default-${apartmentId}-${index}`,
          label: category.label,
          amount: 0,
          isCustom: category.isCustom,
          unitId: null,
          isOneTime: false,
        }),
      );
      const defaultOneTimeFees: CostItem[] = DEFAULT_ONE_TIME_FEES.map(
        (fee, index) => ({
          id: `onetime-${apartmentId}-${index}`,
          label: fee.label,
          amount: 0,
          isCustom: fee.isCustom,
          isOneTime: fee.isOneTime,
          unitId: null,
        }),
      );

      return [...defaultMonthlyCosts, ...defaultOneTimeFees];
    }

    return [];
  };

  const updateCost = (apartmentId: string, costId: string, amount: number) => {
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
        const defaultMonthlyCosts = DEFAULT_COST_CATEGORIES.map(
          (category, index) => ({
            id: `default-${apartmentId}-${index}`,
            label: category.label,
            amount: 0,
            isCustom: category.isCustom,
            unitId: null, // Default fees are always building-wide
            isOneTime: false,
          }),
        );
        const defaultOneTimeFees = DEFAULT_ONE_TIME_FEES.map((fee, index) => ({
          id: `onetime-${apartmentId}-${index}`,
          label: fee.label,
          amount: 0,
          isCustom: fee.isCustom,
          isOneTime: fee.isOneTime,
          unitId: null, // One-time fees are always building-wide
        }));
        const allDefaults = [...defaultMonthlyCosts, ...defaultOneTimeFees];

        // Add any defaults that don't already exist, then update the target cost
        const newDefaults = allDefaults.filter(
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

      // Create new apartment cost entry with default categories + one-time fees
      const defaultMonthlyCosts = DEFAULT_COST_CATEGORIES.map(
        (category, index) => ({
          id: `default-${apartmentId}-${index}`,
          label: category.label,
          amount: 0,
          isCustom: category.isCustom,
          unitId: null, // Default fees are always building-wide
          isOneTime: false,
        }),
      );
      const defaultOneTimeFees = DEFAULT_ONE_TIME_FEES.map((fee, index) => ({
        id: `onetime-${apartmentId}-${index}`,
        label: fee.label,
        amount: 0,
        isCustom: fee.isCustom,
        isOneTime: fee.isOneTime,
        unitId: null, // One-time fees are always building-wide
      }));
      const allDefaults = [...defaultMonthlyCosts, ...defaultOneTimeFees];

      const updatedCosts = allDefaults.map((cost) =>
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
    unitId: string | null = null,
    isOneTime: boolean = false,
  ) => {
    setCosts((prev) => {
      const existing = prev.find((c) => c.apartmentId === apartmentId);
      const newCost: CostItem = {
        id: `custom-${Date.now()}`,
        label,
        amount: 0,
        isCustom: true,
        unitId, // Custom costs are always building-wide in the new design
        isOneTime,
      };

      if (existing) {
        return prev.map((c) =>
          c.apartmentId === apartmentId
            ? { ...c, costs: [...c.costs, newCost] }
            : c,
        );
      }

      // Initialize with default categories + one-time fees
      const defaultMonthlyCosts = DEFAULT_COST_CATEGORIES.map(
        (category, index) => ({
          id: `default-${apartmentId}-${index}`,
          label: category.label,
          amount: 0,
          isCustom: category.isCustom,
          unitId: null, // Default fees are always building-wide
          isOneTime: false,
        }),
      );
      const defaultOneTimeFees = DEFAULT_ONE_TIME_FEES.map((fee, index) => ({
        id: `onetime-${apartmentId}-${index}`,
        label: fee.label,
        amount: 0,
        isCustom: fee.isCustom,
        isOneTime: fee.isOneTime,
        unitId: null, // One-time fees are always building-wide
      }));

      const newApartmentCost: ApartmentCost = {
        apartmentId,
        costs: [...defaultMonthlyCosts, ...defaultOneTimeFees, newCost],
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

  const addCustomOneTimeFee = (apartmentId: string, label: string) => {
    return addCustomCost(apartmentId, label, undefined, true);
  };

  // Unit management
  const addUnit = (apartmentId: string, unitName: string) => {
    const newUnit: Unit = {
      id: `unit-${Date.now()}`,
      name: unitName,
      apartmentId,
      rentPrice: null,
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
      prev.map((unit) => (unit.id === unitId ? { ...unit, rentPrice } : unit)),
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
    addAmenity,
    deleteAmenity,
    getAllAmenities,
    getCosts,
    updateCost,
    addCustomCost,
    addCustomOneTimeFee,
    deleteCustomCost,
    addUnit,
    deleteUnit,
    getUnits,
    addUnitCosts,
    renameUnit,
    updateUnitRentPrice,
  };
}
