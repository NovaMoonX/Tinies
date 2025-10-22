import { CarPart } from './CarMaintenance.types';
import {
  DEFAULT_INTERNAL_PARTS,
  DEFAULT_EXTERNAL_PARTS,
  PART_DETECTION_KEYWORDS,
} from './CarMaintenance.data';

/**
 * Get all default car parts (internal and external)
 */
export function getAllDefaultParts(): Omit<CarPart, 'id' | 'isCustom'>[] {
  return [...DEFAULT_INTERNAL_PARTS, ...DEFAULT_EXTERNAL_PARTS];
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Auto-detect car parts from service title, description, and notes
 * Returns array of part names that should be associated with the service
 */
export function autoDetectCarParts(
  title: string,
  description: string,
  notes: string,
  availableParts: CarPart[],
): string[] {
  const detectedPartIds: string[] = [];
  const searchText = `${title} ${description} ${notes}`.toLowerCase();

  // Check each part's detection keywords
  for (const [partName, keywords] of Object.entries(PART_DETECTION_KEYWORDS)) {
    const hasMatch = keywords.some((keyword) =>
      searchText.includes(keyword.toLowerCase()),
    );

    if (hasMatch) {
      // Find the corresponding part ID from available parts
      const part = availableParts.find((p) => p.name === partName);
      if (part && !detectedPartIds.includes(part.id)) {
        detectedPartIds.push(part.id);
      }
    }
  }

  return detectedPartIds;
}

/**
 * Format date for display
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Format mileage
 */
export function formatMileage(mileage: number): string {
  return `${mileage.toLocaleString()} mi`;
}

/**
 * Calculate days since service
 */
export function daysSince(isoDate: string): number {
  const date = new Date(isoDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get service history summary for a car
 */
export function getServiceSummary(serviceCount: number, totalCost: number): string {
  const result = `${serviceCount} service${serviceCount !== 1 ? 's' : ''} • ${formatCurrency(totalCost)} total`;
  return result;
}
