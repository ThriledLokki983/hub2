/**
 * Script to seed the regions table with the 16 regions of Ghana
 */
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create a connection to the database
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  password: process.env.POSTGRES_PASSWORD || undefined,
});

// The 16 regions of Ghana with descriptions
const regions = [
  {
    name: 'Greater Accra Region',
    description:
      'The capital region of Ghana, containing the national capital Accra. It is the smallest region in terms of land area but the most densely populated.',
  },
  {
    name: 'Ashanti Region',
    description: "Home to the Ashanti people and Ghana's second largest city Kumasi. Known for its rich cultural heritage and gold mining.",
  },
  {
    name: 'Eastern Region',
    description: 'Known for its mountainous terrain, waterfalls and the Akosombo Dam. Major towns include Koforidua and Akosombo.',
  },
  {
    name: 'Western Region',
    description:
      'Rich in natural resources including gold, diamonds, manganese, and offshore oil. Known for beautiful beaches and Sekondi-Takoradi as its capital.',
  },
  {
    name: 'Central Region',
    description: 'Home to several historic sites including Cape Coast Castle and Elmina Castle. Known for fishing and tourism.',
  },
  {
    name: 'Volta Region',
    description: 'Located along the eastern border with Togo. Known for Lake Volta, the largest artificial lake in the world by surface area.',
  },
  {
    name: 'Northern Region',
    description: 'The largest region in Ghana before its division. Known for savannah vegetation and traditional kingdoms.',
  },
  {
    name: 'Upper East Region',
    description: 'Located in the northeastern corner of Ghana. Known for its unique architecture and art, particularly the Tongo Hills.',
  },
  {
    name: 'Upper West Region',
    description: 'The northwestern part of Ghana. Known for its rural settings and the Wechiau Community Hippo Sanctuary.',
  },
  {
    name: 'Brong-Ahafo Region',
    description: 'Known for agriculture, particularly cashew and cocoa production, and the Boabeng-Fiema Monkey Sanctuary.',
  },
  {
    name: 'Western North Region',
    description: 'Created in 2018 from the Western Region. Known for cocoa farming and forest reserves.',
  },
  {
    name: 'Ahafo Region',
    description: 'Created in 2018 from the Brong-Ahafo Region. Known for gold mining and agricultural production.',
  },
  {
    name: 'Bono Region',
    description: 'Created in 2018 from the Brong-Ahafo Region. Home to the regional capital Sunyani and known for agriculture.',
  },
  {
    name: 'Bono East Region',
    description: 'Created in 2018 from the Brong-Ahafo Region. Known for its agricultural activities and the Kintampo waterfalls.',
  },
  {
    name: 'North East Region',
    description: 'Created in 2018 from the Northern Region. Home to the Gambaga escarpment and the Nakpanduri escarpment.',
  },
  {
    name: 'Savannah Region',
    description: "Created in 2018 from the Northern Region. Contains the Mole National Park, Ghana's largest wildlife refuge.",
  },
  {
    name: 'Oti Region',
    description: 'Created in 2018 from the Volta Region. Named after the Oti River, which flows through the region.',
  },
];

async function seedRegions() {
  const client = await pool.connect();

  try {
    console.log('Started seeding regions...');

    // Check if regions table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'regions'
      );
    `);

    if (!tableExists.rows[0].exists) {
      console.error('Regions table does not exist. Please run migrations first.');
      return;
    }

    // Check if there are regions already
    const existingRegions = await client.query('SELECT COUNT(*) FROM regions WHERE deleted_at IS NULL');
    if (parseInt(existingRegions.rows[0].count, 10) > 0) {
      console.log('Regions already exist in the database. Skipping seed to avoid duplicates.');
      console.log(`Current count: ${existingRegions.rows[0].count} regions`);
      return;
    }

    // Begin transaction
    await client.query('BEGIN');

    // Insert all regions
    for (const region of regions) {
      await client.query('INSERT INTO regions (name, description) VALUES ($1, $2)', [region.name, region.description]);
      console.log(`Added region: ${region.name}`);
    }

    // Commit transaction
    await client.query('COMMIT');

    console.log('Successfully seeded all 16 regions of Ghana.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding regions:', error.message);
  } finally {
    client.release();
    // Close the pool
    await pool.end();
  }
}

seedRegions();
