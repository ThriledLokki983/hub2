# 🧭 Frontend Implementation: Dynamic Home Journey Timeline

## 🌟 Feature Overview

Create an elegant, user-friendly timeline that guides users through their home buying/selling journey with the sophistication of the HuisHelder brand experience, integrating seamlessly with our existing design system and component library.

## 🧱 Tech Stack Integration

- **React** with TypeScript
- **React Query** for data management via existing `useQueryApi` and `useMutationApi` hooks
- **SCSS Modules** following our design system variables and mixins
- **API Endpoint**: `/journey/timeline/enhanced` - to be configured in `configs/journey-endpoints.ts`

## 🎯 Feature Goals

- Present a personalized, dynamic timeline reflecting user's onboarding profile
- Enable seamless interaction with journey milestones
- Provide clear visual feedback on progress status
- Create a sense of accomplishment through the home journey
- Integrate with existing Journey components and patterns

## 📦 Component Architecture

### 1. `TimelineContainer.tsx`

The primary timeline container with data fetching logic.

**Responsibilities:**

- Fetch timeline data using our existing `useQueryApi` hook
- Handle mutations with `useMutationApi` hook from our API utilities
- Manage loading, error, and empty states
- Pass data and handlers to presentational components
- Follow the container/presentation pattern used throughout the application

```typescript
// Example usage of our API hooks
const {
  data: response,
  isLoading,
  error,
  refetch,
} = useQueryApi<TimelineData>(JOURNEY_TIMELINE_ENHANCED, null);
```

### 2. `TimelineStepCard.tsx`

Individual timeline milestone component following our existing UI patterns.

**Visual Elements:**

- Step information using our typography variables
- Status badge with our color system variables:
  - Pending: `$slate-gray`
  - In Progress: `$accent-color` (soft-amber)
  - Completed: `$primary-color` (deep-olive-green)
- Due date formatted with date-fns (as used in existing Timeline components)
- Action buttons using our `<Button>` component

**Interaction:**

- Expandable details using our existing toggle patterns
- Status change via `<CustomSelect>` component (our existing dropdown)
- Date selection utilizing the existing date formatting utilities
- Notes with expandable sections consistent with our UI patterns

### 3. `TimelineFilterBar.tsx`

Filter and sort controls using our existing UI components.

**Features:**

- Status filter using `<CustomSelect>` component
- Category selector similar to our existing form patterns
- Sort options using our existing select components

### 4. `TimelineProgressBar.tsx`

Visual progress indicator using our design system variables.

**Display:**

- Overall completion percentage with progress visualization
- Status indicators using consistent iconography
- Animated transitions using our `$transition-base` variable

## 🗂️ File Structure

```
src/
  ├── components/
  │   └── Journey/
  │       ├── TimelineEnhanced/
  │       │   ├── TimelineStepCard.tsx
  │       │   ├── TimelineStepCard.interface.ts
  │       │   ├── TimelineStepCard.module.scss
  │       │   ├── TimelineFilterBar.tsx
  │       │   ├── TimelineFilterBar.interface.ts
  │       │   ├── TimelineFilterBar.module.scss
  │       │   ├── TimelineProgressBar.tsx
  │       │   ├── TimelineProgressBar.interface.ts
  │       │   ├── TimelineProgressBar.module.scss
  │       │   ├── index.ts
  │       │   └── shared.ts
  │       └── index.ts (update to export new components)
  ├── configs/
  │   └── journey-endpoints.ts (add new endpoint)
  ├── hooks/
  │   └── useJourney.ts (extend to support enhanced timeline)
  └── pages/
      └── Timeline/
          ├── EnhancedTimeline.tsx
          ├── EnhancedTimelineContainer.tsx
          └── EnhancedTimeline.module.scss
```

## 🔄 API Integration

### Endpoint Configuration

Add the new endpoint to `configs/journey-endpoints.ts`:

```typescript
export const JOURNEY_TIMELINE_ENHANCED: ApiEndpointInterface = {
  endpoint: '/journey/timeline/enhanced',
  method: 'GET',
  cache: true,
  json: true,
  cacheControl: 'max-age=300', // Cache for 5 minutes
};
```

### Data Fetching with useQueryApi

Follow our established pattern for data fetching:

```typescript
// In TimelineContainer.tsx
const {
  data: response,
  isLoading,
  error: fetchError,
  refetch,
} = useQueryApi<TimelineData>(JOURNEY_TIMELINE_ENHANCED, null, {
  staleTime: 5 * 60 * 1000,
  cacheTime: 30 * 60 * 1000,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
});
```

### Mutations with useMutationApi

Use our existing mutation pattern:

```typescript
// In TimelineContainer.tsx
const {
  mutate: updateStep,
  isPending: isUpdating,
  error: updateError,
} = useMutationApi(UPDATE_TIMELINE_STEP, {
  onSuccess: () => {
    // Refetch timeline data after successful update
    refetch();
  },
});
```

## 🧩 Implementation Tips

### 1. Extend Existing Interfaces

```typescript
// Extend existing TimelineStep interface
export interface EnhancedTimelineStep extends TimelineStep {
  category?: 'buying' | 'selling' | 'shared';
  priority?: number;
  dependencies?: string[];
  notifications?: boolean;
  notes?: string;
}

// Match our API response pattern
export interface EnhancedTimelineData {
  steps: EnhancedTimelineStep[];
  completion_percentage: number;
  category_breakdown: {
    buying: number;
    selling: number;
    shared: number;
  };
}
```

### 2. Component State Management

```typescript
// Example component state for TimelineFilterBar
const [filters, setFilters] = useState({
  status: 'all',
  category: 'all',
  sortBy: 'due_date',
});

const handleFilterChange = (key: string, value: string) => {
  setFilters(prev => ({
    ...prev,
    [key]: value,
  }));
};
```

### 3. SCSS Module Pattern

Follow our SCSS module pattern with imports:

```scss
@import '../../styles/utils';
@import '../Journey/Journey.module.scss';

.timelineContainer {
  // Your styles here using design system variables
  margin-bottom: $spacing-lg;

  .stepCard {
    background-color: $warm-fog;
    border-radius: $border-radius-lg;
    box-shadow: $shadow-subtle;
    transition: $transition-base;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-medium;
    }
  }

  // ... more styles
}
```

### 4. Component Exports

Follow our module export pattern:

```typescript
// In components/Journey/TimelineEnhanced/index.ts
export { default as TimelineStepCard } from './TimelineStepCard';
export { default as TimelineFilterBar } from './TimelineFilterBar';
export { default as TimelineProgressBar } from './TimelineProgressBar';

// In components/Journey/index.ts - update to include:
export { TimelineStepCard, TimelineFilterBar, TimelineProgressBar } from './TimelineEnhanced';
```

### 5. API Integration

Leverage our existing pattern for endpoint configuration:

```typescript
// In configs/journey-endpoints.ts
export const JOURNEY_TIMELINE_ENHANCED: ApiEndpointInterface = {
  endpoint: '/journey/timeline/enhanced',
  method: 'GET',
  cache: true,
  json: true,
  cacheControl: 'max-age=300',
};

export const UPDATE_TIMELINE_STEP_ENHANCED: ApiEndpointInterface = {
  endpoint: '/journey/timeline/step',
  method: 'PATCH',
  cache: false,
  json: true,
};
```

### 6. Hook Integration

Extend the `useJourney` hook to support the enhanced timeline features:

```typescript
// Example extension to useJourney.ts
const enhancedTimelineQuery = useQueryApi<EnhancedTimelineResponse>(
  JOURNEY_TIMELINE_ENHANCED,
  null,
  {
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  },
);

// Transform API data to frontend model
const enhancedTimelineData = useMemo(() => {
  // Transform logic here
  return transformedData;
}, [enhancedTimelineQuery.data]);

// Add to the return object
return {
  // ... existing return values
  enhancedTimeline: enhancedTimelineData,
  isEnhancedTimelineLoading: enhancedTimelineQuery.isLoading,
  enhancedTimelineError: enhancedTimelineQuery.error,
};
```

## 🎨 UI Implementation Details

### Step Display Logic

- Default sort: `due_date ASC` then `priority DESC`
- Conditional rendering for dependent steps
- Status transition rules enforced through UI logic

### Visual Styling

- Use our 4pt spacing system variables: `$spacing-xs`, `$spacing-sm`, `$spacing-md`, `$spacing-lg`, etc.
- Apply our color system variables:
  - Primary actions: `$primary-color` (deep-olive-green)
  - Accents/highlights: `$accent-color` (soft-amber)
  - Alerts/warnings: `$clay-red`
  - Cards/surfaces: `$warm-fog`, `$bone-white`
  - Text: `$text-color`, `$text-color-secondary`
- Typography: Follow our existing text sizing with `$font-size-sm`, `$font-size-base`, `$font-size-lg` variables
- Animations: Use our standard transition: `$transition-base` (`0.2s ease-out`)

### Integration with Existing Components

Leverage our existing Journey components:

- Reuse patterns from `src/components/Journey/Timeline.tsx` for consistency
- Follow status badge patterns in `Timeline.module.scss`
- Utilize existing loading and error states from our components
- Match the expandable milestone pattern from the current implementation

## 🧪 Testing Requirements

- Unit tests for all components with `@testing-library/react`
- Integration tests for filtering, sorting and status updates
- Accessibility tests for keyboard navigation and screen readers
- Test edge cases (empty states, loading states, error states)
- Follow the same testing patterns in our existing test files

## 🔍 Code Quality Requirements

- Follow our established project structure with:
  - Component interfaces in `.interface.ts` files
  - Styles in `.module.scss` files
  - Container/presentation component separation
- Use existing hooks: `useQueryApi`, `useMutationApi`, date formatting utilities
- Add JSDoc comments for all components and functions
- Implement proper error handling using our error patterns

## 📱 Responsive Considerations

- Mobile-first approach following our existing breakpoint mixins
- Timeline collapses to vertical stack on mobile (similar to current Timeline component)
- Touch-friendly interaction targets (min 44px)
- Consider simplified filter options on smaller screens
- Use our media query mixins for responsive design:

  ```scss
  @media (max-width: 768px) {
    // Tablet styles
  }

  @media (max-width: 480px) {
    // Mobile styles
  }
  ```

## 🔄 Journey Integration

- Ensure the enhanced timeline integrates with the `useJourney` hook
- Connect with the journey data transformation patterns from the existing implementation
- Maintain compatibility with current journey dashboard components
