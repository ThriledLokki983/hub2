// Script to populate users table with 10 sample users
const { Pool } = require('pg');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

// Load environment variables
dotenv.config();

// Create a connection to the database
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  port: process.env.POSTGRES_PORT,
  password: process.env.POSTGRES_PASSWORD || undefined,
});

// Sample user data
const sampleUsers = [
  {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    password: 'Password123!',
    title: 'Software Engineer',
    region: 'North America',
  },
  {
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    password: 'Password123!',
    title: 'Product Manager',
    region: 'Europe',
  },
  {
    first_name: 'Alice',
    last_name: 'Johnson',
    middle_name: 'Marie',
    email: 'alice.johnson@example.com',
    password: 'Password123!',
    title: 'Data Scientist',
    region: 'Asia',
  },
  {
    first_name: 'Robert',
    last_name: 'Williams',
    email: 'robert.williams@example.com',
    password: 'Password123!',
    title: 'DevOps Engineer',
    region: 'South America',
  },
  {
    first_name: 'Emily',
    last_name: 'Brown',
    email: 'emily.brown@example.com',
    password: 'Password123!',
    title: 'UX Designer',
    region: 'Australia',
  },
  {
    first_name: 'Michael',
    last_name: 'Davis',
    email: 'michael.davis@example.com',
    password: 'Password123!',
    title: 'Backend Developer',
    region: 'North America',
  },
  {
    first_name: 'Sarah',
    last_name: 'Wilson',
    middle_name: 'Elizabeth',
    email: 'sarah.wilson@example.com',
    password: 'Password123!',
    title: 'Frontend Developer',
    region: 'Europe',
  },
  {
    first_name: 'David',
    last_name: 'Taylor',
    email: 'david.taylor@example.com',
    password: 'Password123!',
    title: 'QA Engineer',
    region: 'Asia',
  },
  {
    first_name: 'Jennifer',
    last_name: 'Anderson',
    email: 'jennifer.anderson@example.com',
    password: 'Password123!',
    title: 'Project Manager',
    region: 'Africa',
  },
  {
    first_name: 'James',
    last_name: 'Martinez',
    email: 'james.martinez@example.com',
    password: 'Password123!',
    title: 'Systems Architect',
    region: 'Europe',
  },
];

async function seedUsers() {
  const client = await pool.connect();

  try {
    console.log('Starting user seeding process...');

    // Begin transaction
    await client.query('BEGIN');

    // Process each user
    for (const user of sampleUsers) {
      // Generate full name
      const fullName = user.middle_name ? `${user.first_name} ${user.middle_name} ${user.last_name}` : `${user.first_name} ${user.last_name}`;

      // Hash the password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Check if user with this email already exists
      const { rows } = await client.query('SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)', [user.email]);

      if (rows[0].exists) {
        console.log(`User with email ${user.email} already exists. Skipping...`);
        continue;
      }

      // Insert user
      const insertResult = await client.query(
        `
        INSERT INTO users(
          first_name,
          last_name,
          middle_name,
          full_name,
          email,
          password,
          title,
          region,
          created_at,
          updated_at
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        RETURNING id, email
        `,
        [user.first_name, user.last_name, user.middle_name || null, fullName, user.email, hashedPassword, user.title, user.region],
      );

      console.log(`Added user: ${insertResult.rows[0].email} with ID: ${insertResult.rows[0].id}`);
    }

    // Commit transaction
    await client.query('COMMIT');
    console.log('User seeding completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding users:', error.message);
    console.error(error.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

// Execute the seeding
seedUsers();
