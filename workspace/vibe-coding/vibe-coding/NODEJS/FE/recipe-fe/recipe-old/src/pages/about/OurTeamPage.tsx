import React from 'react';
import styled from 'styled-components';
import { FiMapPin, FiMail, FiLink, FiLinkedin } from 'react-icons/fi';
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

// Styled components
const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${spacing.xl};
  margin: ${spacing.xl} 0;

  @media (max-width: ${breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const TeamMemberCard = styled.div`
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  overflow: hidden;
  box-shadow: ${shadows.soft};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${shadows.medium};
  }
`;

const MemberImage = styled.div<{ backgroundImage: string }>`
  width: 100%;
  height: 260px;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center top;
`;

const MemberInfo = styled.div`
  padding: ${spacing.lg};
`;

const MemberName = styled.h3`
  font-size: 1.2rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.xs};
`;

const MemberTitle = styled.div`
  font-size: 0.9rem;
  color: ${colors.emeraldGreen};
  margin-bottom: ${spacing.md};
`;

const MemberLocation = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  font-size: 0.9rem;
  color: ${colors.galaxyGrey};
  margin-bottom: ${spacing.sm};
`;

const MemberBio = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${colors.galaxyGrey};
  margin-bottom: ${spacing.md};
`;

const MemberLinks = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-top: ${spacing.md};
`;

const MemberLink = styled.a`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  color: ${colors.deepSpace};
  font-size: 0.9rem;
  text-decoration: none;

  &:hover {
    color: ${colors.emeraldGreen};
    text-decoration: underline;
  }
`;

const LeadershipSection = styled.div`
  margin: ${spacing.xxl} 0;
`;

const DepartmentSection = styled.div`
  margin: ${spacing.xxl} 0;
`;

const TeamValues = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing.xl};
  margin: ${spacing.xl} 0;

  @media (max-width: ${breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ValueCard = styled.div`
  background-color: ${colors.white};
  padding: ${spacing.xl};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
  text-align: center;
`;

const ValueIcon = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${spacing.lg};
  border-radius: ${borderRadius.full};
  background-color: ${colors.cosmicLatte};
  color: ${colors.emeraldGreen};
  font-size: 1.8rem;
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

const JoinSection = styled.div`
  margin: ${spacing.xxl} 0;
  padding: ${spacing.xl};
  background-color: ${colors.cosmicLatte}80;
  border-radius: ${borderRadius.lg};
  text-align: center;
`;

const JoinText = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: ${colors.galaxyGrey};
  max-width: 700px;
  margin: 0 auto ${spacing.lg};
`;

// Mock data
const leadershipTeam = [
  {
    id: 1,
    name: 'Kwame Owusu',
    title: 'Founder & CEO',
    location: 'Accra, Ghana',
    image:
      'https://images.unsplash.com/photo-1548449112-96a38a643324?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    bio: "Kwame founded Afrochef with a mission to preserve Ghana's culinary heritage and make traditional recipes accessible worldwide.",
    email: 'kwame@afrochef.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 2,
    name: 'Ama Darko',
    title: 'Chief Content Officer',
    location: 'Kumasi, Ghana',
    image:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    bio: 'Ama oversees all content creation and ensures the authenticity and quality of recipes and cultural information shared on our platform.',
    email: 'ama@afrochef.com',
    linkedin: 'https://linkedin.com',
    website: 'https://amadarko.com',
  },
  {
    id: 3,
    name: 'Dr. Kofi Asante',
    title: 'Research Director',
    location: 'Cape Coast, Ghana',
    image:
      'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    bio: 'With a PhD in Food Anthropology, Dr. Asante leads our research efforts to document and preserve traditional Ghanaian recipes and cooking techniques.',
    email: 'kofi@afrochef.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 4,
    name: 'Efua Mensah',
    title: 'Chief Culinary Officer',
    location: 'Accra, Ghana',
    image:
      'https://images.unsplash.com/photo-1594745561149-2211ca8c5d98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    bio: 'A renowned chef with over 15 years of experience, Efua ensures that all recipes are not only authentic but also accessible to home cooks around the world.',
    email: 'efua@afrochef.com',
    linkedin: 'https://linkedin.com',
    website: 'https://efuamensah.com',
  },
];

const culinaryTeam = [
  {
    id: 5,
    name: 'Abena Boateng',
    title: 'Senior Recipe Developer',
    location: 'Accra, Ghana',
    image:
      'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    bio: "Abena creates and tests recipes, ensuring they're authentic, delicious, and can be recreated in kitchens worldwide.",
    email: 'abena@afrochef.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 6,
    name: 'Isaac Amoah',
    title: 'Culinary Researcher',
    location: 'Kumasi, Ghana',
    image:
      'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    bio: 'Isaac travels throughout Ghana documenting regional variations in dishes and hunting down rare recipes passed through generations.',
    email: 'isaac@afrochef.com',
  },
  {
    id: 7,
    name: 'Maame Adwoa',
    title: 'Ingredient Specialist',
    location: 'Tamale, Ghana',
    image:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    bio: 'Maame specializes in researching traditional Ghanaian ingredients and identifying suitable substitutions for international cooks.',
    email: 'maame@afrochef.com',
    linkedin: 'https://linkedin.com',
  },
];

const contentTeam = [
  {
    id: 8,
    name: 'Yaw Osei',
    title: 'Content Director',
    location: 'Accra, Ghana',
    image:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    bio: 'Yaw oversees our content strategy, ensuring that our recipes, stories, and cultural context are presented in engaging, educational ways.',
    email: 'yaw@afrochef.com',
    linkedin: 'https://linkedin.com',
    website: 'https://yawosei.com',
  },
  {
    id: 9,
    name: 'Fiifi Mensah',
    title: 'Lead Developer',
    location: 'Accra, Ghana',
    image:
      'https://images.unsplash.com/photo-1531891570158-e71b35a485bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
    bio: 'Fiifi leads the development of our platform, creating intuitive user experiences that make discovering and cooking Ghanaian cuisine accessible and enjoyable for users worldwide.',
    email: 'fiifi@afrochef.com',
    website: 'https://fiifimensah.dev',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 10,
    name: 'Adjoa Baah',
    title: 'UX/UI Designer',
    location: 'Accra, Ghana',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80',
    bio: 'Adjoa designs the visual elements of our platform, creating beautiful, functional interfaces that reflect Ghanaian cultural aesthetics while ensuring a seamless user experience.',
    email: 'adjoa@afrochef.com',
    linkedin: 'https://linkedin.com',
  },
];

const OurTeamPage = () => {
  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem to='/'>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem to='/about'>About</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>Our Team</BreadcrumbCurrent>
      </Breadcrumbs>

      <PageTitle>Our Team</PageTitle>
      <PageDescription>
        Meet the passionate individuals behind Afrochef who are dedicated to
        preserving and sharing Ghana's rich culinary traditions with the world.
        Our diverse team brings together expertise in culinary arts, research,
        technology, and storytelling.
      </PageDescription>

      <LeadershipSection>
        <SectionTitle>Leadership Team</SectionTitle>
        <Paragraph>
          Our leadership team brings together diverse expertise in food,
          technology, research, and business to guide our mission of preserving
          and sharing Ghanaian culinary heritage.
        </Paragraph>

        <TeamGrid>
          {leadershipTeam.map((member) => (
            <TeamMemberCard key={member.id}>
              <MemberImage backgroundImage={member.image} />
              <MemberInfo>
                <MemberName>{member.name}</MemberName>
                <MemberTitle>{member.title}</MemberTitle>
                <MemberLocation>
                  <FiMapPin /> {member.location}
                </MemberLocation>
                <MemberBio>{member.bio}</MemberBio>

                <MemberLinks>
                  <MemberLink href={`mailto:${member.email}`}>
                    <FiMail /> Email
                  </MemberLink>
                  {member.website && (
                    <MemberLink
                      href={member.website}
                      target='_blank'
                      rel='noopener noreferrer'>
                      <FiLink /> Website
                    </MemberLink>
                  )}
                  {member.linkedin && (
                    <MemberLink
                      href={member.linkedin}
                      target='_blank'
                      rel='noopener noreferrer'>
                      <FiLinkedin /> LinkedIn
                    </MemberLink>
                  )}
                </MemberLinks>
              </MemberInfo>
            </TeamMemberCard>
          ))}
        </TeamGrid>
      </LeadershipSection>

      <DepartmentSection>
        <SectionTitle>Culinary Team</SectionTitle>
        <Paragraph>
          Our culinary experts research, develop, and test recipes to ensure
          authenticity and quality, preserving traditional techniques while
          making them accessible for home cooks everywhere.
        </Paragraph>

        <TeamGrid>
          {culinaryTeam.map((member) => (
            <TeamMemberCard key={member.id}>
              <MemberImage backgroundImage={member.image} />
              <MemberInfo>
                <MemberName>{member.name}</MemberName>
                <MemberTitle>{member.title}</MemberTitle>
                <MemberLocation>
                  <FiMapPin /> {member.location}
                </MemberLocation>
                <MemberBio>{member.bio}</MemberBio>

                <MemberLinks>
                  <MemberLink href={`mailto:${member.email}`}>
                    <FiMail /> Email
                  </MemberLink>
                  {member.website && (
                    <MemberLink
                      href={member.website}
                      target='_blank'
                      rel='noopener noreferrer'>
                      <FiLink /> Website
                    </MemberLink>
                  )}
                  {member.linkedin && (
                    <MemberLink
                      href={member.linkedin}
                      target='_blank'
                      rel='noopener noreferrer'>
                      <FiLinkedin /> LinkedIn
                    </MemberLink>
                  )}
                </MemberLinks>
              </MemberInfo>
            </TeamMemberCard>
          ))}
        </TeamGrid>
      </DepartmentSection>

      <DepartmentSection>
        <SectionTitle>Content Team</SectionTitle>
        <Paragraph>
          Our content creators bring Ghanaian cuisine to life through engaging
          videos, beautiful photography, and compelling storytelling that
          captures the cultural context of our recipes.
        </Paragraph>

        <TeamGrid>
          {contentTeam.map((member) => (
            <TeamMemberCard key={member.id}>
              <MemberImage backgroundImage={member.image} />
              <MemberInfo>
                <MemberName>{member.name}</MemberName>
                <MemberTitle>{member.title}</MemberTitle>
                <MemberLocation>
                  <FiMapPin /> {member.location}
                </MemberLocation>
                <MemberBio>{member.bio}</MemberBio>

                <MemberLinks>
                  <MemberLink href={`mailto:${member.email}`}>
                    <FiMail /> Email
                  </MemberLink>
                  {member.website && (
                    <MemberLink
                      href={member.website}
                      target='_blank'
                      rel='noopener noreferrer'>
                      <FiLink /> Website
                    </MemberLink>
                  )}
                  {member.linkedin && (
                    <MemberLink
                      href={member.linkedin}
                      target='_blank'
                      rel='noopener noreferrer'>
                      <FiLinkedin /> LinkedIn
                    </MemberLink>
                  )}
                </MemberLinks>
              </MemberInfo>
            </TeamMemberCard>
          ))}
        </TeamGrid>
      </DepartmentSection>

      <PageSection>
        <SectionTitle>Our Values</SectionTitle>
        <Paragraph>
          The principles that guide our work and commitment to sharing Ghanaian
          culinary heritage with the world.
        </Paragraph>

        <TeamValues>
          <ValueCard>
            <ValueIcon>🌍</ValueIcon>
            <ValueTitle>Cultural Preservation</ValueTitle>
            <ValueDescription>
              We are committed to documenting and preserving traditional
              Ghanaian recipes and cooking techniques, ensuring this culinary
              heritage continues for future generations.
            </ValueDescription>
          </ValueCard>
          <ValueCard>
            <ValueIcon>🤝</ValueIcon>
            <ValueTitle>Inclusive Collaboration</ValueTitle>
            <ValueDescription>
              We work with chefs, home cooks, food historians, and communities
              across Ghana to create a comprehensive and authentic
              representation of our diverse food traditions.
            </ValueDescription>
          </ValueCard>
          <ValueCard>
            <ValueIcon>✨</ValueIcon>
            <ValueTitle>Excellence & Authenticity</ValueTitle>
            <ValueDescription>
              We maintain the highest standards in our recipe testing,
              photography, and content creation, ensuring we represent Ghanaian
              cuisine with accuracy and respect.
            </ValueDescription>
          </ValueCard>
        </TeamValues>
      </PageSection>

      <JoinSection>
        <SectionTitle>Join Our Team</SectionTitle>
        <JoinText>
          We're always looking for talented individuals who share our passion
          for Ghanaian food and culture. Whether you're a recipe developer,
          content creator, researcher, or technologist, we'd love to hear from
          you.
        </JoinText>
        <Button
          $primary
          onClick={() => (window.location.href = '/careers')}>
          View Current Openings
        </Button>
      </JoinSection>
    </>
  );
};

export default OurTeamPage;
