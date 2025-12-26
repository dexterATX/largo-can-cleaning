/**
 * Shared validation utilities for type safety
 */

/**
 * Category relation type from Supabase joins
 */
export interface CategoryRelation {
  id: string
  slug: string
  name: string
  color: string
}

/**
 * Type guard to check if an object is a valid CategoryRelation
 */
export function isCategoryRelation(obj: unknown): obj is CategoryRelation {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'slug' in obj &&
    'name' in obj &&
    'color' in obj
  )
}

/**
 * UUID v4 regex pattern
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * Validates that a string is a valid UUID v4
 */
export function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id)
}

/**
 * Valid device types for analytics
 */
export const VALID_DEVICE_TYPES = ['mobile', 'tablet', 'desktop'] as const
export type DeviceType = (typeof VALID_DEVICE_TYPES)[number]

/**
 * Type guard to check if a value is a valid device type
 */
export function isValidDeviceType(value: unknown): value is DeviceType {
  return (
    typeof value === 'string' &&
    VALID_DEVICE_TYPES.includes(value as DeviceType)
  )
}

/**
 * Type guard to check if a value is a File object
 */
export function isFile(value: unknown): value is File {
  return value instanceof File
}

/**
 * Type guard to check if a value is a non-null string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

/**
 * Type guard to check if a value is a Record object
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Safely extracts a string from FormData.get()
 * Returns null if the value is not a string
 */
export function getFormDataString(formData: FormData, key: string): string | null {
  const value = formData.get(key)
  if (typeof value === 'string') {
    return value
  }
  return null
}

/**
 * Safely extracts a File from FormData.get()
 * Returns null if the value is not a File
 */
export function getFormDataFile(formData: FormData, key: string): File | null {
  const value = formData.get(key)
  if (isFile(value)) {
    return value
  }
  return null
}
