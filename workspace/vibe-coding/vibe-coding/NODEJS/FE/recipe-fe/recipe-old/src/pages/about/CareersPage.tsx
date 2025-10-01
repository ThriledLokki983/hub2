import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  FiBriefcase,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiArrowRight,
  FiFilter,
} from 'react-icons/fi';
import {
  colors,
  typography,
  spacing,
  shadows,
  breakpoints,
  borderRadius,
} from '../../theme/theme';
import {
  PageTitle,
  PageDescription,
  Breadcrumbs,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbCurrent,
  SectionTitle,
  Paragraph,
  PageSection,
} from '../../components/PageComponents';
import Button from '../../components/Button';
import { kenteBackground } from '../../components/KentePatterns';

// Styled components
const CareerHero = styled.div`
  background: linear-gradient(
    to right,
    ${colors.deepSpace},
    ${colors.emeraldGreen}
  );
  color: ${colors.white};
  padding: ${spacing.xxl};
  border-radius: ${borderRadius.lg};
  margin: ${spacing.xl} 0;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: ${colors.white}10;
  }

  @media (max-width: ${breakpoints.md}) {
    padding: ${spacing.lg};
  }
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: ${typography.fontWeights.light};
  margin-bottom: ${spacing.lg};
  max-width: 700px;

  @media (max-width: ${breakpoints.md}) {
    font-size: 1.8rem;
  }
`;

const HeroText = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  max-width: 600px;
  margin-bottom: ${spacing.lg};

  @media (max-width: ${breakpoints.md}) {
    font-size: 1rem;
  }
`;

const JobOpeningsSection = styled.div`
  margin: ${spacing.xxl} 0;
`;

const JobFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${spacing.md};
  margin-bottom: ${spacing.xl};
  align-items: center;

  @media (max-width: ${breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FilterItem = styled.div<{ $active?: boolean }>`
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${(props) =>
    props.$active ? colors.emeraldGreen : colors.white};
  color: ${(props) => (props.$active ? colors.white : colors.deepSpace)};
  border-radius: ${borderRadius.full};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid
    ${(props) => (props.$active ? colors.emeraldGreen : colors.cosmicLatte)};

  &:hover {
    background-color: ${(props) =>
      props.$active ? colors.emeraldGreen : colors.cosmicLatte};
  }

  @media (max-width: ${breakpoints.sm}) {
    width: 100%;
    text-align: center;
  }
`;

const SortContainer = styled.div`
  position: relative;
  margin-left: auto;
  z-index: 5;

  @media (max-width: ${breakpoints.sm}) {
    width: 100%;
    margin-left: 0;
  }
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${colors.white};
  border: 1px solid ${colors.cosmicLatte};
  border-radius: ${borderRadius.md};
  color: ${colors.deepSpace};
  cursor: pointer;
  transition: all 0.2s ease;
  gap: ${spacing.sm};
  font-size: 0.9rem;

  &:hover {
    background-color: ${colors.cosmicLatte};
  }

  @media (max-width: ${breakpoints.sm}) {
    width: 100%;
    justify-content: space-between;
    font-size: 0.8rem;
  }
`;

const SortDropdown = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  min-width: 180px;
  background-color: ${colors.white};
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.medium};
  padding: ${spacing.md};
  margin-top: ${spacing.xs};
`;

const SortOption = styled.div`
  padding: ${spacing.xs} 0;
  cursor: pointer;

  &:hover {
    color: ${colors.emeraldGreen};
  }
`;

const JobsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

const JobCard = styled.div`
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
  padding: ${spacing.lg};
  transition: all 0.3s ease;
  display: flex;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.medium};
  }

  @media (max-width: ${breakpoints.md}) {
    flex-direction: column;
  }
`;

const JobMain = styled.div`
  flex: 1;
  padding-right: ${spacing.lg};

  @media (max-width: ${breakpoints.md}) {
    padding-right: 0;
    padding-bottom: ${spacing.md};
    border-bottom: 1px solid ${colors.cosmicLatte};
    margin-bottom: ${spacing.md};
  }
`;

const JobTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.xs};
`;

const JobType = styled.div`
  display: inline-block;
  padding: ${spacing.xs} ${spacing.sm};
  background-color: ${colors.cosmicLatte};
  color: ${colors.emeraldGreen};
  font-size: 0.8rem;
  border-radius: ${borderRadius.full};
  margin-right: ${spacing.md};
`;

const JobMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${spacing.md};
  margin: ${spacing.md} 0;
  color: ${colors.galaxyGrey};
  font-size: 0.9rem;
`;

const JobMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
`;

const JobDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${colors.galaxyGrey};
  margin-bottom: ${spacing.md};
`;

const JobSide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  min-width: 150px;

  @media (max-width: ${breakpoints.md}) {
    align-items: flex-start;
  }
`;

const JobPostedDate = styled.div`
  font-size: 0.85rem;
  color: ${colors.galaxyGrey};
  margin-bottom: ${spacing.md};
`;

const ValuesSection = styled.div`
  margin: ${spacing.xxl} 0;
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing.lg};
  margin-top: ${spacing.xl};

  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ValueCard = styled.div`
  background-color: ${colors.white};
  padding: ${spacing.lg};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${shadows.medium};
  }
`;

const ValueIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${borderRadius.full};
  background-color: ${colors.emeraldGreen}20;
  color: ${colors.emeraldGreen};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto ${spacing.md};
`;

const ValueTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.md};
`;

const ValueDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${colors.galaxyGrey};
`;

const BenefitsSection = styled.div`
  background-color: ${colors.cosmicLatte}30;
  margin: ${spacing.xxl} 0;
  padding: ${spacing.xl};
  border-radius: ${borderRadius.lg};
`;

const BenefitsList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing.xl};
  margin-top: ${spacing.xl};

  @media (max-width: ${breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const BenefitItem = styled.div`
  display: flex;
  gap: ${spacing.md};
`;

const BenefitIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${borderRadius.full};
  background-color: ${colors.white};
  color: ${colors.emeraldGreen};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  box-shadow: ${shadows.soft};
`;

const BenefitContent = styled.div`
  flex: 1;
`;

const BenefitTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.sm};
`;

const BenefitDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${colors.galaxyGrey};
`;

const ProcessSection = styled.div`
  margin: ${spacing.xxl} 0;
`;

const ProcessSteps = styled.div`
  margin-top: ${spacing.xl};
  position: relative;
  padding: 0 ${spacing.md};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 24px;
    width: 2px;
    background-color: ${colors.cosmicLatte};
    z-index: 1;
  }
`;

const ProcessStep = styled.div`
  display: flex;
  gap: ${spacing.lg};
  padding-bottom: ${spacing.xl};
  position: relative;

  &:last-child {
    padding-bottom: 0;
  }
`;

const StepNumber = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${borderRadius.full};
  background-color: ${colors.emeraldGreen};
  color: ${colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: ${typography.fontWeights.medium};
  flex-shrink: 0;
  position: relative;
  z-index: 2;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.md};
`;

const StepDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${colors.galaxyGrey};
`;

const ContactSection = styled.div`
  background: ${kenteBackground};
  margin: ${spacing.xxl} 0;
  padding: ${spacing.xl};
  border-radius: ${borderRadius.lg};
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const ContactTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.md};
`;

const ContactText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: ${colors.galaxyGrey};
  max-width: 700px;
  margin: 0 auto ${spacing.lg};
`;

const ContactEmail = styled.a`
  color: ${colors.emeraldGreen};
  font-weight: ${typography.fontWeights.medium};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

// Mock data
const jobs = [
  {
    id: 1,
    title: 'Senior Recipe Developer',
    type: 'Full-time',
    location: 'Accra, Ghana',
    department: 'Culinary',
    postedDate: 'April 10, 2025',
    description:
      "We're looking for an experienced recipe developer with deep knowledge of Ghanaian cuisine to create, test, and document authentic recipes while ensuring they are accessible to international audiences.",
    remote: false,
    salary: '$50,000 - $65,000',
  },
  {
    id: 2,
    title: 'Content Writer - Ghanaian Food Culture',
    type: 'Full-time',
    location: 'Remote',
    department: 'Content',
    postedDate: 'April 8, 2025',
    description:
      'Join our content team to research and write compelling content about Ghanaian food culture, traditions, and history to complement our recipe collection.',
    remote: true,
    salary: '$45,000 - $55,000',
  },
  {
    id: 3,
    title: 'UX/UI Designer',
    type: 'Full-time',
    location: 'Accra, Ghana',
    department: 'Design',
    postedDate: 'April 5, 2025',
    description:
      'We need a talented designer to help create beautiful, intuitive interfaces that make discovering and learning about Ghanaian cuisine a delightful experience for users worldwide.',
    remote: false,
    salary: '$55,000 - $70,000',
  },
  {
    id: 4,
    title: 'Frontend Developer',
    type: 'Full-time',
    location: 'Remote',
    department: 'Engineering',
    postedDate: 'April 3, 2025',
    description:
      "We're seeking a frontend developer with React experience to build engaging, responsive interfaces for our recipe platform, ensuring a seamless user experience across all devices.",
    remote: true,
    salary: '$60,000 - $80,000',
  },
  {
    id: 5,
    title: 'Food Photographer',
    type: 'Part-time',
    location: 'Accra, Ghana',
    department: 'Content',
    postedDate: 'March 29, 2025',
    description:
      'Capture the vibrant colors and textures of Ghanaian dishes to showcase our recipes in their best light, working closely with our culinary team during cooking sessions.',
    remote: false,
    salary: '$30,000 - $40,000',
  },
  {
    id: 6,
    title: 'Regional Cuisine Researcher - Northern Ghana',
    type: 'Contract',
    location: 'Tamale, Ghana',
    department: 'Research',
    postedDate: 'March 25, 2025',
    description:
      'Work on-location in Northern Ghana to document regional recipes, cooking techniques, and food traditions that are unique to this area, helping to preserve culinary heritage.',
    remote: false,
    salary: 'Contract rate',
  },
];

const companyValues = [
  {
    id: 1,
    icon: '🍲',
    title: 'Cultural Preservation',
    description:
      "We believe in documenting and protecting Ghana's rich food heritage for future generations through authentic recipes and traditions.",
  },
  {
    id: 2,
    icon: '🤝',
    title: 'Community',
    description:
      'We foster a sense of connection and collaboration with home cooks, professional chefs, and food enthusiasts around the world.',
  },
  {
    id: 3,
    icon: '🌱',
    title: 'Sustainability',
    description:
      'We promote ethical food practices and environmentally conscious cooking that respects traditional ingredients and their sources.',
  },
  {
    id: 4,
    icon: '💡',
    title: 'Innovation',
    description:
      'We strive to find creative solutions to preserve tradition while embracing modern technologies and approaches.',
  },
  {
    id: 5,
    icon: '🔍',
    title: 'Attention to Detail',
    description:
      'We believe that excellence lies in the details, from recipe instructions to visual presentation.',
  },
  {
    id: 6,
    icon: '🌍',
    title: 'Community Impact',
    description:
      'We measure our success by the positive impact we have on preserving and celebrating Ghanaian food culture.',
  },
];

const benefits = [
  {
    id: 1,
    icon: <FiClock />,
    title: 'Flexible Work Arrangements',
    description:
      'We offer flexible working hours and remote work options for many positions, allowing you to balance your professional and personal life.',
  },
  {
    id: 2,
    icon: <FiBriefcase />,
    title: 'Professional Development',
    description:
      'We invest in your growth with a generous professional development stipend for courses, conferences, and learning materials.',
  },
  {
    id: 3,
    icon: <FiCalendar />,
    title: 'Generous Leave Policy',
    description:
      'Enjoy a competitive leave policy including vacation days, paid holidays, sick leave, and parental leave.',
  },
  {
    id: 4,
    icon: <FiMapPin />,
    title: 'Culinary Experiences',
    description:
      "Regular team cooking sessions, food tours, and opportunities to experience Ghana's vibrant food scene firsthand.",
  },
];

const processSteps = [
  {
    id: 1,
    title: 'Application Review',
    description:
      "After submitting your application, our team will review your qualifications and experience to determine if there's a potential match for the role.",
  },
  {
    id: 2,
    title: 'Initial Screening',
    description:
      'Qualified candidates will be invited to a brief phone or video call to discuss your background, interest in the position, and answer initial questions.',
  },
  {
    id: 3,
    title: 'Skills Assessment',
    description:
      'Depending on the role, you may be asked to complete a practical task related to the position to demonstrate your relevant skills and approach.',
  },
  {
    id: 4,
    title: 'Team Interviews',
    description:
      "You'll meet with several team members to discuss your experience in-depth and determine how you might contribute to our mission and culture.",
  },
  {
    id: 5,
    title: 'Final Decision & Offer',
    description:
      "If selected, you'll receive a job offer outlining compensation, benefits, and other relevant details for your consideration.",
  },
];

const CareersPage = () => {
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Newest');

  // Get unique values for filters
  const departments = ['All', ...new Set(jobs.map((job) => job.department))];
  const locations = [
    'All',
    'Remote',
    ...new Set(jobs.filter((job) => !job.remote).map((job) => job.location)),
  ];

  // Filter jobs based on selected department and location
  const filteredJobs = jobs.filter((job) => {
    const departmentMatch =
      departmentFilter === 'All' || job.department === departmentFilter;
    const locationMatch =
      locationFilter === 'All' ||
      (locationFilter === 'Remote'
        ? job.remote
        : job.location === locationFilter);

    return departmentMatch && locationMatch;
  });

  // Sort jobs based on selection
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'Newest') {
      // Sort by posted date (newest first)
      return (
        new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      );
    } else if (sortBy === 'Oldest') {
      // Sort by posted date (oldest first)
      return (
        new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime()
      );
    } else {
      // Alphabetical (A-Z)
      return a.title.localeCompare(b.title);
    }
  });

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem to='/'>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem to='/about'>About</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>Careers</BreadcrumbCurrent>
      </Breadcrumbs>

      <PageTitle>Join Our Team</PageTitle>

      <CareerHero>
        <HeroTitle>
          Help Preserve and Share Ghana's Rich Culinary Heritage
        </HeroTitle>
        <HeroText>
          We're building a passionate team dedicated to documenting, preserving,
          and celebrating Ghanaian cuisine. Join us in our mission to make
          traditional recipes accessible worldwide while honoring their cultural
          significance.
        </HeroText>
        <Button
          $primary
          onClick={() => {
            const element = document.getElementById('job-openings');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}>
          View Open Positions
        </Button>
      </CareerHero>

      <PageSection>
        <SectionTitle>Why Work With Us</SectionTitle>
        <Paragraph>
          At Aduane Pafie, we're passionate about preserving and celebrating
          Ghanaian culinary traditions. Our team brings together diverse talents
          in food, technology, content creation, and cultural research to build
          a platform that honors Ghana's rich food heritage while making it
          accessible to the world.
        </Paragraph>
        <Paragraph>
          Whether you're a culinary expert, technologist, content creator, or
          researcher, you'll find meaningful work as part of a collaborative
          team that values innovation, cultural authenticity, and community
          impact.
        </Paragraph>
      </PageSection>

      <ValuesSection>
        <SectionTitle>Our Values</SectionTitle>
        <Paragraph>
          These core principles guide our work and shape our organizational
          culture. They reflect our commitment to preserving and sharing
          Ghanaian culinary heritage.
        </Paragraph>

        <ValuesGrid>
          {companyValues.map((value) => (
            <ValueCard key={value.id}>
              <ValueIcon>{value.icon}</ValueIcon>
              <ValueTitle>{value.title}</ValueTitle>
              <ValueDescription>{value.description}</ValueDescription>
            </ValueCard>
          ))}
        </ValuesGrid>
      </ValuesSection>

      <BenefitsSection>
        <SectionTitle>Benefits and Perks</SectionTitle>
        <Paragraph>
          We believe in supporting our team members' professional growth and
          personal well-being, offering competitive benefits that reflect our
          values and commitment to our employees.
        </Paragraph>

        <BenefitsList>
          {benefits.map((benefit) => (
            <BenefitItem key={benefit.id}>
              <BenefitIcon>{benefit.icon}</BenefitIcon>
              <BenefitContent>
                <BenefitTitle>{benefit.title}</BenefitTitle>
                <BenefitDescription>{benefit.description}</BenefitDescription>
              </BenefitContent>
            </BenefitItem>
          ))}
        </BenefitsList>
      </BenefitsSection>

      <JobOpeningsSection id='job-openings'>
        <SectionTitle>Current Openings</SectionTitle>
        <Paragraph>
          Explore our current job opportunities and find a role where you can
          contribute your skills and passion to our mission.
        </Paragraph>

        <JobFilters>
          {departments.map((department) => (
            <FilterItem
              key={department}
              $active={departmentFilter === department}
              onClick={() => setDepartmentFilter(department)}>
              {department}
            </FilterItem>
          ))}

          {locations.map((location) => (
            <FilterItem
              key={location}
              $active={locationFilter === location}
              onClick={() => setLocationFilter(location)}>
              {location}
            </FilterItem>
          ))}

          <SortContainer>
            <SortButton onClick={() => setIsSortOpen(!isSortOpen)}>
              <span>Sort: {sortBy}</span>
              {isSortOpen ? <FiChevronUp /> : <FiChevronDown />}
            </SortButton>
            <SortDropdown $isOpen={isSortOpen}>
              <SortOption
                onClick={() => {
                  setSortBy('Newest');
                  setIsSortOpen(false);
                }}>
                Newest
              </SortOption>
              <SortOption
                onClick={() => {
                  setSortBy('Oldest');
                  setIsSortOpen(false);
                }}>
                Oldest
              </SortOption>
              <SortOption
                onClick={() => {
                  setSortBy('A-Z');
                  setIsSortOpen(false);
                }}>
                Alphabetical (A-Z)
              </SortOption>
            </SortDropdown>
          </SortContainer>
        </JobFilters>

        <JobsList>
          {sortedJobs.map((job) => (
            <JobCard key={job.id}>
              <JobMain>
                <JobTitle>{job.title}</JobTitle>
                <JobType>{job.type}</JobType>
                <JobMeta>
                  <JobMetaItem>
                    <FiMapPin /> {job.location}
                  </JobMetaItem>
                  <JobMetaItem>
                    <FiBriefcase /> {job.department}
                  </JobMetaItem>
                </JobMeta>
                <JobDescription>{job.description}</JobDescription>
              </JobMain>
              <JobSide>
                <JobPostedDate>Posted: {job.postedDate}</JobPostedDate>
                <Button
                  as={Link}
                  to={`/careers/${job.id}`}
                  $primary>
                  Apply Now
                </Button>
              </JobSide>
            </JobCard>
          ))}

          {sortedJobs.length === 0 && (
            <div style={{ textAlign: 'center', padding: spacing.xl }}>
              <h3>No jobs match your current filters</h3>
              <p>
                Try changing your filter selection or check back later for new
                opportunities.
              </p>
            </div>
          )}
        </JobsList>
      </JobOpeningsSection>

      <ProcessSection>
        <SectionTitle>Our Hiring Process</SectionTitle>
        <Paragraph>
          We've designed a thoughtful hiring process to identify candidates who
          not only have the right skills but also share our passion and values.
          Here's what you can expect:
        </Paragraph>

        <ProcessSteps>
          {processSteps.map((step) => (
            <ProcessStep key={step.id}>
              <StepNumber>{step.id}</StepNumber>
              <StepContent>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </StepContent>
            </ProcessStep>
          ))}
        </ProcessSteps>
      </ProcessSection>

      <ContactSection>
        <ContactTitle>Don't See a Perfect Fit?</ContactTitle>
        <ContactText>
          We're always interested in connecting with talented individuals who
          are passionate about Ghanaian cuisine and culture, even if we don't
          currently have an open position that matches your skills. Reach out to
          us at{' '}
          <ContactEmail href='mailto:careers@aduanepafie.com'>
            careers@aduanepafie.com
          </ContactEmail>{' '}
          to introduce yourself and share how you might contribute to our
          mission.
        </ContactText>
      </ContactSection>
    </>
  );
};

export default CareersPage;
