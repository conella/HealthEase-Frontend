import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Manually mock CSS
import { vi } from 'vitest';

// Mock all CSS imports
vi.mock('*.css', () => {
    return {}; // Return an empty object for CSS imports
  });

export function setupVuetify() {
  return createVuetify({
    components,
    directives,
  })
}