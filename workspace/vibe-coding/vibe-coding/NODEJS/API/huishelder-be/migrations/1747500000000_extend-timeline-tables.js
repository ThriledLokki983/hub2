/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = pgm => {
  // Add extensions to timeline_steps table
  pgm.addColumns('timeline_steps', {
    category: {
      type: 'varchar(20)',
      notNull: true,
      default: 'shared',
      check: "category IN ('buying', 'selling', 'shared')",
    },
    priority: {
      type: 'integer',
      notNull: true,
      default: 3,
      check: 'priority BETWEEN 1 AND 5',
    },
    dependencies: {
      type: 'jsonb',
      default: pgm.func("'[]'::jsonb"),
    },
    related_tool_ids: {
      type: 'jsonb',
      default: pgm.func("'[]'::jsonb"),
    },
  });

  // Add extensions to user_timeline_steps table
  pgm.addColumns('user_timeline_steps', {
    priority: {
      type: 'integer',
      notNull: true,
      default: 3,
      check: 'priority BETWEEN 1 AND 5',
    },
    notification_enabled: {
      type: 'boolean',
      notNull: true,
      default: true,
    },
  });

  // Create timeline_templates table
  pgm.createTable(
    'timeline_templates',
    {
      id: {
        type: 'uuid',
        primaryKey: true,
        default: pgm.func('gen_random_uuid()'),
      },
      title: {
        type: 'varchar(255)',
        notNull: true,
      },
      description: {
        type: 'text',
      },
      category: {
        type: 'varchar(20)',
        notNull: true,
        default: 'shared',
        check: "category IN ('buying', 'selling', 'shared')",
      },
      default_days_offset: {
        type: 'integer',
      },
      default_priority: {
        type: 'integer',
        default: 3,
        check: 'default_priority BETWEEN 1 AND 5',
      },
      required_onboarding_flags: {
        type: 'jsonb',
        default: pgm.func("'[]'::jsonb"),
      },
      created_at: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func("(now() at time zone 'utc')"),
      },
      updated_at: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func("(now() at time zone 'utc')"),
      },
    },
    {
      comment: 'Timeline step templates based on user profile',
    },
  );

  // Create milestone_timeline_step_links table
  pgm.createTable(
    'milestone_timeline_step_links',
    {
      id: {
        type: 'uuid',
        primaryKey: true,
        default: pgm.func('gen_random_uuid()'),
      },
      milestone_id: {
        type: 'uuid',
        notNull: true,
        references: 'milestones(id)',
        onDelete: 'CASCADE',
      },
      timeline_step_id: {
        type: 'uuid',
        notNull: true,
        references: 'timeline_steps(id)',
        onDelete: 'CASCADE',
      },
    },
    {
      comment: 'Links between milestones and timeline steps',
    },
  );

  // Add unique constraint to milestone_timeline_step_links
  pgm.addConstraint('milestone_timeline_step_links', 'milestone_timeline_step_links_unique', {
    unique: ['milestone_id', 'timeline_step_id'],
  });

  // Create additional indexes as specified in the documentation
  pgm.createIndex('timeline_steps', 'category', { ifNotExists: true });
  pgm.createIndex('user_timeline_steps', 'status', { ifNotExists: true });
  pgm.createIndex('user_timeline_steps', 'due_date', { ifNotExists: true });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {
  // Drop tables in reverse order (to respect foreign key constraints)
  pgm.dropTable('milestone_timeline_step_links', { ifExists: true });

  // Drop columns from user_timeline_steps
  pgm.dropColumns('user_timeline_steps', ['priority', 'notification_enabled'], { ifExists: true });

  // Drop columns from timeline_steps
  pgm.dropColumns('timeline_steps', ['category', 'priority', 'dependencies', 'related_tool_ids'], { ifExists: true });

  // Drop timeline_templates table
  pgm.dropTable('timeline_templates', { ifExists: true });
};
