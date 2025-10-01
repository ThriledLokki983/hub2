# Feature: Enhanced Dynamic Home Journey Timeline (Backend)

## 🎯 Objective

Enhance the existing journey timeline functionality to:
- Create a more interactive, personalized timeline for each user based on their onboarding data
- Integrate with the existing journey and milestone structure
- Provide real-time updates for step status, due dates, and notifications
- Improve integration with other app features (financial dashboard, documents)

---

## 📊 Database Schema Design (Extended)

The application already has tables for user journeys, milestones, and tasks. We'll enhance these with additional timeline-specific features.

### Existing Tables to Leverage
- `user_journeys` - Main journey table with user_id and status
- `milestones` - Master list of milestones
- `user_milestones` - Per-user instances of milestones
- `user_tasks` - Specific tasks for each milestone
- `timeline_steps` - Master list of timeline steps
- `user_timeline_steps` - Per-user instances of timeline steps

### Timeline Step Extensions
Add the following columns to `timeline_steps`:
```sql
ALTER TABLE timeline_steps ADD COLUMN category VARCHAR(20) NOT NULL DEFAULT 'shared' CHECK (category IN ('buying', 'selling', 'shared'));
ALTER TABLE timeline_steps ADD COLUMN priority INTEGER NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5);
ALTER TABLE timeline_steps ADD COLUMN dependencies JSONB DEFAULT '[]'::jsonb;
ALTER TABLE timeline_steps ADD COLUMN related_tool_ids JSONB DEFAULT '[]'::jsonb;
```

### User Timeline Step Extensions
Add the following columns to `user_timeline_steps`:
```sql
ALTER TABLE user_timeline_steps ADD COLUMN priority INTEGER NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5);
ALTER TABLE user_timeline_steps ADD COLUMN notification_enabled BOOLEAN NOT NULL DEFAULT TRUE;
```

### Timeline Template Table
Create a new table for timeline step templates that can be applied based on user profile:
```sql
CREATE TABLE timeline_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(20) NOT NULL DEFAULT 'shared' CHECK (category IN ('buying', 'selling', 'shared')),
  default_days_offset INTEGER,
  default_priority INTEGER DEFAULT 3 CHECK (default_priority BETWEEN 1 AND 5),
  required_onboarding_flags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  updated_at TIMESTAMP NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
);
```

---

## 🔄 Integration with Existing Architecture

### 1. Extend JourneyService with Timeline Generator
Enhance the existing JourneyService by adding:

```typescript
/**
 * Generate initial user timeline based on onboarding data
 * @param userId User ID
 * @param onboardingData User's onboarding profile
 * @returns The generated timeline steps
 */
public async generateUserTimeline(userId: string, onboardingData: OnboardingData): Promise<any[]> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if user exists and has a journey
    const journeyResult = await client.query('SELECT id FROM user_journeys WHERE user_id = $1', [userId]);

    if (journeyResult.rows.length === 0) {
      throw new HttpException(404, 'Journey not found for this user');
    }

    const journeyId = journeyResult.rows[0].id;

    // Get all timeline templates that match user's profile
    const templates = await this.getMatchingTemplates(client, onboardingData);

    // Delete existing timeline steps for this user
    await client.query('DELETE FROM user_timeline_steps WHERE user_id = $1', [userId]);

    // Create user timeline steps based on templates
    const timelineSteps = [];
    for (const template of templates) {
      const stepId = uuidv4();

      // Calculate due date based on template offset
      const dueDate = template.default_days_offset
        ? new Date(Date.now() + template.default_days_offset * 24 * 60 * 60 * 1000)
        : null;

      // Create timeline step
      const result = await client.query(
        `INSERT INTO user_timeline_steps
         (id, user_id, timeline_step_id, status, due_date, priority, notification_enabled)
         VALUES ($1, $2, $3, 'pending', $4, $5, TRUE)
         RETURNING *`,
        [stepId, userId, template.id, dueDate, template.default_priority]
      );

      timelineSteps.push(result.rows[0]);
    }

    await client.query('COMMIT');
    return timelineSteps;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error(`Error generating timeline: ${error.message}`);
    throw error;
  } finally {
    client.release();
  }
}
```

### 2. Extend Current Timeline Retrieval
Enhance the current `getJourneyTimeline` method to include:

- Dependency resolution
- Tool integration
- Sorting capabilities
- Status filters

```typescript
/**
 * Get enhanced user timeline with dependencies and tools
 * @param userId User ID
 * @param filters Optional status and category filters
 * @returns Enhanced timeline
 */
public async getEnhancedTimeline(
  userId: string,
  filters?: { status?: string; category?: string; sort?: string }
): Promise<any[]> {
  try {
    // Use existing function as base
    const baseTimeline = await this.getJourneyTimeline(userId);

    // Apply filters, sorting, and enhancement logic
    // ...implementation details...

    return enhancedTimeline;
  } catch (error) {
    logger.error(`Error fetching enhanced timeline: ${error.message}`);
    throw error;
  }
}
```

---

## 🌐 New API Endpoints (For JourneyRoute)

### Timeline Generation
```
POST /api/v1/journey/timeline/generate
```
- Authorization: Required
- Request Body: `{ onboardingData?: OnboardingData }` (optional - will use stored data if not provided)
- Response: Created timeline with steps
- Status Codes: 201, 400, 401, 500

### Retrieve Enhanced Timeline
```
GET /api/v1/journey/timeline/enhanced
```
- Authorization: Required
- Query Parameters:
  - `status` (optional): Filter by status
  - `category` (optional): Filter by category
  - `sort` (optional): Sort field and direction
- Response: Array of timeline steps with progress summary
- Status Codes: 200, 401, 404

### Update Timeline Step
```
PATCH /api/v1/journey/timeline/steps/:stepId
```
- Authorization: Required
- Request Body: Partial step update (status, targetDate, etc.)
- Response: Updated step
- Status Codes: 200, 400, 401, 403, 404

### Timeline Progress Summary
```
GET /api/v1/journey/timeline/progress
```
- Authorization: Required
- Response: Progress metrics and statistics
- Status Codes: 200, 401

---

## 🛠️ Implementation Details

### 1. Integration with Existing Milestone System
- Create a bridge between milestones and timeline steps
- Link tasks to timeline steps through a relationship table
- Keep timeline step status in sync with milestone/task completion

```sql
-- Create a table to link milestones to timeline steps
CREATE TABLE milestone_timeline_step_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  timeline_step_id UUID NOT NULL REFERENCES timeline_steps(id) ON DELETE CASCADE,
  UNIQUE(milestone_id, timeline_step_id)
);
```

### 2. Dependency Resolution Engine
- Implement a directed graph for step dependencies
- Store dependencies as a JSONB array of step IDs in the database
- Add a utility function to check if prerequisites are completed:

```typescript
/**
 * Check if a timeline step's dependencies are completed
 * @param userId User ID
 * @param stepId Step ID
 * @returns Whether all dependencies are completed
 */
private async areDependenciesFulfilled(userId: string, stepId: string): Promise<boolean> {
  const query = `
    SELECT
      ts.dependencies as dependencies,
      COUNT(uts2.id) FILTER (WHERE uts2.status = 'completed') as completed_count,
      json_array_length(ts.dependencies) as total_dependencies
    FROM user_timeline_steps uts
    JOIN timeline_steps ts ON uts.timeline_step_id = ts.id
    LEFT JOIN user_timeline_steps uts2 ON
      uts2.user_id = uts.user_id AND
      uts2.timeline_step_id = ANY(SELECT value::uuid FROM jsonb_array_elements_text(ts.dependencies))
    WHERE uts.id = $1 AND uts.user_id = $2
    GROUP BY ts.dependencies
  `;

  const result = await pool.query(query, [stepId, userId]);

  if (result.rows.length === 0) return true; // No dependencies

  const row = result.rows[0];
  return row.completed_count >= row.total_dependencies;
}
```

### 3. Notification Integration
- Link timeline step status changes to the notification system
- Add notification preferences in user profile
- Send reminders based on due dates approaching:

```typescript
/**
 * Schedule notifications for upcoming timeline steps
 */
public async scheduleTimelineNotifications(): Promise<void> {
  // This would be called by a CRON job
  const query = `
    SELECT
      uts.id, uts.user_id, ts.name, uts.due_date
    FROM user_timeline_steps uts
    JOIN timeline_steps ts ON uts.timeline_step_id = ts.id
    WHERE
      uts.status <> 'completed' AND
      uts.notification_enabled = TRUE AND
      uts.due_date IS NOT NULL AND
      uts.due_date BETWEEN NOW() AND NOW() + INTERVAL '3 days'
  `;

  const result = await pool.query(query);

  for (const step of result.rows) {
    // Send notification through existing notification system
    // ...implementation details...
  }
}
```

### 4. Integration with Financial Dashboard
- Link relevant timeline steps to financial calculations
- Update financial data when related timeline steps complete
- Show financial summary in timeline view

---

## 🔒 Security & Performance

### Security Measures
- Use existing authentication middleware (AuthMiddleware)
- Validate all step IDs against the user's own steps
- Add proper input validation for all endpoints

### Performance Optimizations
- Add these additional indexes:
```sql
CREATE INDEX idx_timeline_steps_category ON timeline_steps(category);
CREATE INDEX idx_user_timeline_steps_status ON user_timeline_steps(status);
CREATE INDEX idx_user_timeline_steps_due_date ON user_timeline_steps(due_date);
```
- Implement caching for frequently accessed timelines
- Use pagination for timeline retrieval
- Optimize queries with proper JOINs and filtering

---

## 🧪 Testing Strategy

### Unit Tests
Add tests for:
- Timeline generation with various onboarding profiles
- Dependency resolution logic
- Date calculation algorithms

### Integration Tests
- End-to-end API tests with database interactions
- Verify authentication and authorization rules
- Test concurrent timeline updates

Example test structure:
```typescript
describe('Timeline Feature', () => {
  describe('GET /api/v1/journey/timeline/enhanced', () => {
    it('should return enhanced timeline for authenticated user', async () => {
      // Test implementation
    });

    it('should properly filter timeline by status', async () => {
      // Test implementation
    });
  });
});
```

---

## 📚 Documentation

- Update existing Swagger documentation to include new endpoints
- Document the relationship between journeys, milestones, and timeline steps
- Add examples for frontend developers

Example Swagger documentation:
```yaml
/journey/timeline/enhanced:
  get:
    tags:
      - Journey
    summary: Get enhanced user timeline
    description: Returns all timeline steps with dependencies and related tools
    security:
      - bearerAuth: []
    parameters:
      - in: query
        name: status
        schema:
          type: string
          enum: [pending, in_progress, completed, blocked]
        description: Filter by step status
      - in: query
        name: category
        schema:
          type: string
          enum: [buying, selling, shared]
        description: Filter by step category
    responses:
      '200':
        description: Timeline retrieved successfully
      '401':
        description: Unauthorized
      '404':
        description: Timeline not found
```

---

## 🧩 Implementation Priorities

1. Database schema extensions
2. Enhancement of existing timeline retrieval
3. Addition of dependency resolution
4. New API endpoints
5. Frontend integration
6. Notification system integration
7. Testing and documentation
