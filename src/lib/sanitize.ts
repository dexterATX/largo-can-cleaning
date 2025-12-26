/**
 * Server-side HTML sanitization utility for blog posts
 * Removes dangerous tags, attributes, and URLs to prevent XSS attacks
 */

// Dangerous tags that should be completely removed
const DANGEROUS_TAGS = [
  'script',
  'iframe',
  'object',
  'embed',
  'form',
  'input',
  'button',
  'textarea',
  'select',
  'style',
  'link',
  'meta',
  'base',
  'applet',
  'frame',
  'frameset',
  'layer',
  'ilayer',
  'bgsound',
  'xml',
]

// Regex patterns for sanitization
const PATTERNS = {
  // Match dangerous tags (opening and closing) with their content for script/style
  dangerousTagsWithContent: new RegExp(
    `<(script|style)[^>]*>[\\s\\S]*?<\\/\\1>`,
    'gi'
  ),
  // Match dangerous opening tags
  dangerousOpenTags: new RegExp(
    `<(${DANGEROUS_TAGS.join('|')})(\\s[^>]*)?\\/?\\s*>`,
    'gi'
  ),
  // Match dangerous closing tags
  dangerousCloseTags: new RegExp(`<\\/(${DANGEROUS_TAGS.join('|')})\\s*>`, 'gi'),
  // Match on* event handlers (onclick, onerror, onload, etc.)
  eventHandlers: /\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi,
  // Match javascript: URLs in any attribute
  javascriptUrls: /\s+(href|src|action|formaction|data|poster|background)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi,
  // Match javascript: in url() CSS
  javascriptCssUrls: /url\s*\(\s*(?:"javascript:[^"]*"|'javascript:[^']*'|javascript:[^)]*)\s*\)/gi,
  // Match vbscript: URLs
  vbscriptUrls: /\s+(href|src|action|formaction|data)\s*=\s*(?:"vbscript:[^"]*"|'vbscript:[^']*')/gi,
  // Match data: URLs that could contain scripts (allow images)
  dangerousDataUrls: /\s+(href|src|action|formaction)\s*=\s*(?:"data:(?!image\/)[^"]*"|'data:(?!image\/)[^']*')/gi,
  // Match expression() in CSS (IE vulnerability)
  cssExpressions: /expression\s*\([^)]*\)/gi,
  // Match srcdoc attribute (can contain full HTML documents)
  srcdocAttr: /\s+srcdoc\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi,
  // Match dangerous attributes
  dangerousAttrs: /\s+(dynsrc|lowsrc|fscommand|seeksegmenttime)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi,
}

/**
 * Sanitizes HTML content by removing dangerous tags, attributes, and URLs
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return ''
  }

  let sanitized = html

  // Remove script and style tags with their content first
  sanitized = sanitized.replace(PATTERNS.dangerousTagsWithContent, '')

  // Remove dangerous opening tags
  sanitized = sanitized.replace(PATTERNS.dangerousOpenTags, '')

  // Remove dangerous closing tags
  sanitized = sanitized.replace(PATTERNS.dangerousCloseTags, '')

  // Remove on* event handlers
  sanitized = sanitized.replace(PATTERNS.eventHandlers, '')

  // Remove javascript: URLs
  sanitized = sanitized.replace(PATTERNS.javascriptUrls, '')

  // Remove javascript: in CSS url()
  sanitized = sanitized.replace(PATTERNS.javascriptCssUrls, '')

  // Remove vbscript: URLs
  sanitized = sanitized.replace(PATTERNS.vbscriptUrls, '')

  // Remove dangerous data: URLs (keep image data URLs)
  sanitized = sanitized.replace(PATTERNS.dangerousDataUrls, '')

  // Remove CSS expressions
  sanitized = sanitized.replace(PATTERNS.cssExpressions, '')

  // Remove srcdoc attribute
  sanitized = sanitized.replace(PATTERNS.srcdocAttr, '')

  // Remove other dangerous attributes
  sanitized = sanitized.replace(PATTERNS.dangerousAttrs, '')

  return sanitized.trim()
}

/**
 * Input length validation constants
 */
export const INPUT_LIMITS = {
  TITLE_MAX: 200,
  SLUG_MAX: 100,
  CONTENT_MAX: 100000,
  META_DESCRIPTION_MAX: 160,
  EXCERPT_MAX: 500,
} as const

/**
 * Validation error messages
 */
export const VALIDATION_MESSAGES = {
  TITLE_TOO_LONG: `Title must be ${INPUT_LIMITS.TITLE_MAX} characters or less`,
  SLUG_TOO_LONG: `Slug must be ${INPUT_LIMITS.SLUG_MAX} characters or less`,
  CONTENT_TOO_LONG: `Content must be ${INPUT_LIMITS.CONTENT_MAX} characters or less`,
  META_DESCRIPTION_TOO_LONG: `Meta description must be ${INPUT_LIMITS.META_DESCRIPTION_MAX} characters or less`,
  EXCERPT_TOO_LONG: `Excerpt must be ${INPUT_LIMITS.EXCERPT_MAX} characters or less`,
} as const

/**
 * Validates input length for blog post fields
 * @param field - The field name
 * @param value - The value to validate
 * @param maxLength - Maximum allowed length
 * @returns Error message if validation fails, null otherwise
 */
export function validateLength(
  field: string,
  value: string | undefined | null,
  maxLength: number
): string | null {
  if (value && value.length > maxLength) {
    return `${field} must be ${maxLength} characters or less`
  }
  return null
}

/**
 * Validates all blog post input fields
 * @param data - Blog post data to validate
 * @returns Object with isValid boolean and errors array
 */
export function validateBlogPostInput(data: {
  title?: string | null
  slug?: string | null
  content?: string | null
  meta_description?: string | null
  excerpt?: string | null
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (data.title && data.title.length > INPUT_LIMITS.TITLE_MAX) {
    errors.push(VALIDATION_MESSAGES.TITLE_TOO_LONG)
  }

  if (data.slug && data.slug.length > INPUT_LIMITS.SLUG_MAX) {
    errors.push(VALIDATION_MESSAGES.SLUG_TOO_LONG)
  }

  if (data.content && data.content.length > INPUT_LIMITS.CONTENT_MAX) {
    errors.push(VALIDATION_MESSAGES.CONTENT_TOO_LONG)
  }

  if (
    data.meta_description &&
    data.meta_description.length > INPUT_LIMITS.META_DESCRIPTION_MAX
  ) {
    errors.push(VALIDATION_MESSAGES.META_DESCRIPTION_TOO_LONG)
  }

  if (data.excerpt && data.excerpt.length > INPUT_LIMITS.EXCERPT_MAX) {
    errors.push(VALIDATION_MESSAGES.EXCERPT_TOO_LONG)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Sanitizes blog post content fields
 * @param data - Blog post data with content to sanitize
 * @returns Sanitized blog post data
 */
export function sanitizeBlogPostContent<
  T extends { content?: string | null; excerpt?: string | null },
>(data: T): T {
  const sanitized = { ...data }

  if (sanitized.content) {
    sanitized.content = sanitizeHtml(sanitized.content)
  }

  if (sanitized.excerpt) {
    sanitized.excerpt = sanitizeHtml(sanitized.excerpt)
  }

  return sanitized
}
