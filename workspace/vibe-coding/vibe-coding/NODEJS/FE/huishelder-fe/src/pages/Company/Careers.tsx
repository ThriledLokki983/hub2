import React, { useState } from 'react';
import styles from './Company.module.scss';

/**
 * Careers listings interface
 */
interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

/**
 * Company Careers page component
 */
const Careers: React.FC = () => {
  // Sample job listings - would typically come from an API
  const jobOpenings: JobOpening[] = [
    {
      id: 'dev-001',
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Amsterdam, Netherlands',
      type: 'Full-time',
      description:
        'We are looking for an experienced frontend developer to join our team and help build exceptional user experiences for our real estate platform.',
    },
    {
      id: 'dev-002',
      title: 'Backend Engineer',
      department: 'Engineering',
      location: 'Amsterdam, Netherlands',
      type: 'Full-time',
      description:
        'Join our backend team to develop and maintain the APIs and services that power our platform.',
    },
    {
      id: 'mkt-001',
      title: 'Digital Marketing Specialist',
      department: 'Marketing',
      location: 'Utrecht, Netherlands',
      type: 'Full-time',
      description:
        'Help grow our digital presence through strategic marketing campaigns and analytics.',
    },
    {
      id: 'ops-001',
      title: 'Real Estate Operations Manager',
      department: 'Operations',
      location: 'Amsterdam, Netherlands',
      type: 'Full-time',
      description:
        'Oversee our property operations and ensure smooth transactions between buyers and sellers.',
    },
    {
      id: 'cus-001',
      title: 'Customer Success Representative',
      department: 'Customer Service',
      location: 'Remote (Netherlands)',
      type: 'Part-time',
      description:
        'Provide exceptional support to our users and help them navigate the property buying and selling process.',
    },
  ];

  // Department filter state
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);

  // Get unique departments
  const departments = Array.from(new Set(jobOpenings.map(job => job.department)));

  // Filtered job openings
  const filteredJobs = departmentFilter
    ? jobOpenings.filter(job => job.department === departmentFilter)
    : jobOpenings;

  return (
    <>
      <header className={styles['page-header']}>
        <h1>Join Our Team</h1>
        <p>
          Be part of the future of real estate in the Netherlands. Explore opportunities to grow,
          innovate, and make an impact.
        </p>
      </header>

      <section className={styles.section}>
        <h2>Why Work With Us</h2>
        <p>
          At HuisHelder, we're transforming the real estate industry in the Netherlands. We're
          always looking for passionate, creative individuals to join our mission of making property
          transactions more transparent and efficient.
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Growth & Development</h3>
            <p>
              Continuous learning opportunities and clear career advancement paths to help you reach
              your professional goals.
            </p>
          </div>
          <div className={styles.card}>
            <h3>Work-Life Balance</h3>
            <p>
              Flexible working arrangements, generous vacation policy, and respect for your time
              outside of work.
            </p>
          </div>
          <div className={styles.card}>
            <h3>Competitive Compensation</h3>
            <p>
              Attractive salary packages, performance bonuses, and comprehensive benefits designed
              for your well-being.
            </p>
          </div>
          <div className={styles.card}>
            <h3>Innovative Environment</h3>
            <p>
              State-of-the-art offices, the latest technology, and an atmosphere that fosters
              creativity and collaboration.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Current Openings</h2>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '12px' }}>Filter by Department</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setDepartmentFilter(null)}
              className={`${styles.button} ${departmentFilter === null ? '' : styles.secondary}`}
              style={{ padding: '8px 16px' }}
            >
              All Departments
            </button>
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setDepartmentFilter(dept)}
                className={`${styles.button} ${departmentFilter === dept ? '' : styles.secondary}`}
                style={{ padding: '8px 16px' }}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        <div>
          {filteredJobs.map(job => (
            <div
              key={job.id}
              className={styles.card}
              style={{ marginBottom: '16px', borderLeft: '4px solid #3A4F41' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <h3 style={{ marginBottom: '8px' }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <span style={{ color: '#6E7673' }}>{job.department}</span>
                    <span style={{ color: '#6E7673' }}>{job.location}</span>
                    <span
                      style={{
                        background: '#F4C77B',
                        color: '#3A4F41',
                        padding: '0 8px',
                        borderRadius: '4px',
                        fontSize: '14px',
                      }}
                    >
                      {job.type}
                    </span>
                  </div>
                </div>
                <button className={styles.button} style={{ marginLeft: '16px' }}>
                  Apply Now
                </button>
              </div>
              <p>{job.description}</p>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className={styles['message-box']}>
            <p>
              No job openings found for the selected department. Please check back later or try
              another department.
            </p>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2>Our Hiring Process</h2>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            marginTop: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
            }}
          >
            <div
              style={{
                backgroundColor: '#F4C77B',
                color: '#3A4F41',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0,
              }}
            >
              1
            </div>
            <div>
              <h3>Application Review</h3>
              <p>
                Our team carefully reviews your application materials to assess your qualifications
                and fit for the role.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
            }}
          >
            <div
              style={{
                backgroundColor: '#F4C77B',
                color: '#3A4F41',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0,
              }}
            >
              2
            </div>
            <div>
              <h3>Initial Interview</h3>
              <p>
                A conversation with our HR team to discuss your background, interests, and how you
                might contribute to HuisHelder.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
            }}
          >
            <div
              style={{
                backgroundColor: '#F4C77B',
                color: '#3A4F41',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0,
              }}
            >
              3
            </div>
            <div>
              <h3>Skills Assessment</h3>
              <p>
                Depending on the role, we may ask you to complete a practical task or assessment to
                demonstrate your skills.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
            }}
          >
            <div
              style={{
                backgroundColor: '#F4C77B',
                color: '#3A4F41',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0,
              }}
            >
              4
            </div>
            <div>
              <h3>Team Interview</h3>
              <p>
                Meet with potential team members and managers to discuss specific role
                responsibilities and company culture.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
            }}
          >
            <div
              style={{
                backgroundColor: '#F4C77B',
                color: '#3A4F41',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0,
              }}
            >
              5
            </div>
            <div>
              <h3>Offer & Onboarding</h3>
              <p>
                Successful candidates receive an offer and, upon acceptance, begin our comprehensive
                onboarding program.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Don't See What You're Looking For?</h2>
        <p>
          We're always interested in meeting talented individuals who are passionate about real
          estate and technology. Send your CV and a cover letter to{' '}
          <a href="mailto:careers@huishelder.nl" style={{ color: '#3A4F41', fontWeight: 'bold' }}>
            careers@huishelder.nl
          </a>{' '}
          and tell us how you can contribute to our team.
        </p>
        <button className={`${styles.button} ${styles.secondary}`} style={{ marginTop: '16px' }}>
          Send Open Application
        </button>
      </section>
    </>
  );
};

export default Careers;
