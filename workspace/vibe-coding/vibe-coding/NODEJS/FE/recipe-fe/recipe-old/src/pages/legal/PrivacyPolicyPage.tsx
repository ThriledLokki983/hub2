import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiCalendar, FiChevronRight, FiExternalLink } from 'react-icons/fi';
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

// Styled components
const PolicyContainer = styled.div`
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
  padding: ${spacing.xl};
  margin-bottom: ${spacing.xxl};
`;

const LastUpdated = styled.div`
  display: flex;
  align-items: center;
  color: ${colors.galaxyGrey};
  font-size: 0.9rem;
  margin-bottom: ${spacing.xl};

  svg {
    margin-right: ${spacing.xs};
  }
`;

const PolicySection = styled.div`
  margin-bottom: ${spacing.xl};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SubSectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.md};
  border-bottom: 1px solid ${colors.cosmicLatte};
  padding-bottom: ${spacing.sm};
`;

const List = styled.ul`
  margin: ${spacing.md} 0;
  padding-left: ${spacing.xl};

  li {
    margin-bottom: ${spacing.sm};
    color: ${colors.galaxyGrey};
    line-height: 1.6;
  }
`;

const TableOfContents = styled.div`
  background-color: ${colors.cosmicLatte}50;
  border-radius: ${borderRadius.md};
  padding: ${spacing.lg};
  margin-bottom: ${spacing.xl};
`;

const TOCTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.md};
`;

const TOCList = styled.ol`
  margin: 0;
  padding-left: ${spacing.xl};

  li {
    margin-bottom: ${spacing.sm};
  }
`;

const TOCLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  color: ${colors.emeraldGreen};
  cursor: pointer;
  font-size: 0.95rem;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  svg {
    margin-left: ${spacing.xs};
    font-size: 0.85rem;
  }
`;

const RelatedPoliciesContainer = styled.div`
  margin-top: ${spacing.xxl};
`;

const RelatedPolicyLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.md};
  background-color: ${colors.white};
  border-radius: ${borderRadius.md};
  box-shadow: ${shadows.soft};
  margin-bottom: ${spacing.md};
  text-decoration: none;
  color: ${colors.deepSpace};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.medium};
    background-color: ${colors.cosmicLatte}30;
  }
`;

const PolicyLinkText = styled.div`
  h4 {
    font-size: 1.1rem;
    font-weight: ${typography.fontWeights.light};
    margin-bottom: ${spacing.xs};
  }

  p {
    font-size: 0.9rem;
    color: ${colors.galaxyGrey};
  }
`;

const PolicyLinkIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.emeraldGreen};
`;

const ExternalLink = styled.a`
  color: ${colors.emeraldGreen};
  text-decoration: none;
  display: inline-flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }

  svg {
    margin-left: ${spacing.xs};
    font-size: 0.85rem;
  }
`;

// Component
const PrivacyPolicyPage: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem to='/'>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem to='/legal'>Legal</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>Privacy Policy</BreadcrumbCurrent>
      </Breadcrumbs>

      <PageTitle>Privacy Policy</PageTitle>
      <PageDescription>
        Learn about how we collect, use, and protect your personal information
        when you use Aduanepafie.
      </PageDescription>

      <LastUpdated>
        <FiCalendar size={14} />
        Last updated: April 15, 2025
      </LastUpdated>

      <TableOfContents>
        <TOCTitle>Contents</TOCTitle>
        <TOCList>
          <li>
            <TOCLink onClick={() => scrollToSection('information-collection')}>
              Information We Collect <FiChevronRight />
            </TOCLink>
          </li>
          <li>
            <TOCLink onClick={() => scrollToSection('information-use')}>
              How We Use Your Information <FiChevronRight />
            </TOCLink>
          </li>
          <li>
            <TOCLink onClick={() => scrollToSection('information-sharing')}>
              Information Sharing <FiChevronRight />
            </TOCLink>
          </li>
          <li>
            <TOCLink onClick={() => scrollToSection('cookies')}>
              Cookies and Tracking Technologies <FiChevronRight />
            </TOCLink>
          </li>
          <li>
            <TOCLink onClick={() => scrollToSection('data-security')}>
              Data Security <FiChevronRight />
            </TOCLink>
          </li>
          <li>
            <TOCLink onClick={() => scrollToSection('user-rights')}>
              Your Rights and Choices <FiChevronRight />
            </TOCLink>
          </li>
          <li>
            <TOCLink onClick={() => scrollToSection('children')}>
              Children's Privacy <FiChevronRight />
            </TOCLink>
          </li>
          <li>
            <TOCLink onClick={() => scrollToSection('international')}>
              International Data Transfers <FiChevronRight />
            </TOCLink>
          </li>
          <li>
            <TOCLink onClick={() => scrollToSection('updates')}>
              Changes to This Policy <FiChevronRight />
            </TOCLink>
          </li>
          <li>
            <TOCLink onClick={() => scrollToSection('contact')}>
              Contact Us <FiChevronRight />
            </TOCLink>
          </li>
        </TOCList>
      </TableOfContents>

      <PolicyContainer>
        <PolicySection id='information-collection'>
          <SectionTitle>Information We Collect</SectionTitle>
          <Paragraph>
            We collect information from you when you use our website, create an
            account, post comments, save recipes, or interact with our services.
            The types of information we may collect include:
          </Paragraph>
          <List>
            <li>
              <strong>Personal Information:</strong> Name, email address,
              profile picture, and account preferences.
            </li>
            <li>
              <strong>Account Information:</strong> Login credentials, account
              settings, and security information.
            </li>
            <li>
              <strong>User-Generated Content:</strong> Recipes, comments,
              ratings, and other content you create or upload.
            </li>
            <li>
              <strong>Usage Information:</strong> Information about how you use
              our website, which features you interact with, and your
              preferences.
            </li>
            <li>
              <strong>Device and Technical Information:</strong> IP address,
              browser type, device information, operating system, and other
              technical details.
            </li>
          </List>
          <SubSectionTitle>Information You Provide to Us</SubSectionTitle>
          <Paragraph>
            When you create an account, we collect your name, email address, and
            password. When you complete your profile, you may choose to provide
            additional information such as your location, cooking preferences,
            dietary restrictions, and a profile picture. You may also provide
            information when you:
          </Paragraph>
          <List>
            <li>Submit a recipe or other content to our platform</li>
            <li>Leave comments or reviews on recipes</li>
            <li>Communicate with us or other users through our platform</li>
            <li>Respond to surveys or participate in promotions</li>
            <li>Subscribe to newsletters or other communications</li>
          </List>
          <SubSectionTitle>Information Collected Automatically</SubSectionTitle>
          <Paragraph>
            We automatically collect certain information when you visit our
            website, including:
          </Paragraph>
          <List>
            <li>
              Log data (IP address, browser type, pages visited, time spent on
              pages)
            </li>
            <li>
              Device information (device type, operating system, unique device
              identifiers)
            </li>
            <li>Location information (general location based on IP address)</li>
            <li>
              Cookies and similar tracking technologies (as described below)
            </li>
          </List>
        </PolicySection>

        <PolicySection id='information-use'>
          <SectionTitle>How We Use Your Information</SectionTitle>
          <Paragraph>
            We use the information we collect to provide, maintain, and improve
            our services. Specifically, we use your information to:
          </Paragraph>
          <List>
            <li>Create and manage your account</li>
            <li>Provide personalized recipe recommendations</li>
            <li>Process and respond to your requests and inquiries</li>
            <li>
              Enable you to share recipes, comments, and interact with other
              users
            </li>
            <li>
              Send you updates, newsletters, marketing communications, and other
              information that may be of interest to you
            </li>
            <li>Analyze usage patterns to improve our website and services</li>
            <li>
              Ensure compliance with our terms of service and applicable laws
            </li>
            <li>
              Detect and prevent fraud, spam, abuse, security incidents, and
              other harmful activities
            </li>
            <li>Debug to identify and repair errors in our services</li>
          </List>
        </PolicySection>

        <PolicySection id='information-sharing'>
          <SectionTitle>Information Sharing</SectionTitle>
          <Paragraph>
            We do not sell your personal information. We may share your
            information in the following circumstances:
          </Paragraph>
          <List>
            <li>
              <strong>With Your Consent:</strong> We may share information when
              you direct us to do so.
            </li>
            <li>
              <strong>Publicly Shared Information:</strong> Information you post
              publicly on our website (such as recipes, comments, and reviews)
              will be viewable by other users.
            </li>
            <li>
              <strong>Service Providers:</strong> We may share information with
              third-party vendors who need access to information to provide
              services on our behalf (such as hosting, email delivery,
              analytics, etc.).
            </li>
            <li>
              <strong>Business Transfers:</strong> If we are involved in a
              merger, acquisition, or sale of all or a portion of our assets,
              your information may be transferred as part of that transaction.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose information
              if required to do so by law or in response to valid requests by
              public authorities.
            </li>
          </List>
        </PolicySection>

        <PolicySection id='cookies'>
          <SectionTitle>Cookies and Tracking Technologies</SectionTitle>
          <Paragraph>
            We use cookies and similar tracking technologies to collect and
            store information about your preferences and how you interact with
            our website. A cookie is a small text file stored on your device. We
            use the following types of cookies:
          </Paragraph>
          <List>
            <li>
              <strong>Essential Cookies:</strong> Necessary for the website to
              function properly.
            </li>
            <li>
              <strong>Preference Cookies:</strong> Remember your preferences and
              settings.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand how users
              interact with our website.
            </li>
            <li>
              <strong>Marketing Cookies:</strong> Used to deliver relevant
              advertisements and track their effectiveness.
            </li>
          </List>
          <Paragraph>
            You can control cookies through your browser settings. However,
            disabling certain cookies may limit your ability to use some
            features of our website.
          </Paragraph>
          <Paragraph>
            For more information, please see our{' '}
            <ExternalLink href='/legal/cookie-policy'>
              Cookie Policy <FiExternalLink />
            </ExternalLink>
            .
          </Paragraph>
        </PolicySection>

        <PolicySection id='data-security'>
          <SectionTitle>Data Security</SectionTitle>
          <Paragraph>
            We implement appropriate technical and organizational measures to
            protect your personal information from unauthorized access,
            disclosure, alteration, or destruction. However, no method of
            transmission over the Internet or method of electronic storage is
            100% secure, and we cannot guarantee absolute security.
          </Paragraph>
          <Paragraph>
            We retain your personal information only for as long as necessary to
            fulfill the purposes outlined in this Privacy Policy, unless a
            longer retention period is required or permitted by law.
          </Paragraph>
        </PolicySection>

        <PolicySection id='user-rights'>
          <SectionTitle>Your Rights and Choices</SectionTitle>
          <Paragraph>
            Depending on your location, you may have certain rights regarding
            your personal information, including:
          </Paragraph>
          <List>
            <li>
              <strong>Access:</strong> You can request a copy of the personal
              information we hold about you.
            </li>
            <li>
              <strong>Correction:</strong> You can request that we correct
              inaccurate or incomplete information about you.
            </li>
            <li>
              <strong>Deletion:</strong> You can request that we delete your
              personal information in certain circumstances.
            </li>
            <li>
              <strong>Restriction:</strong> You can request that we restrict the
              processing of your information in certain circumstances.
            </li>
            <li>
              <strong>Data Portability:</strong> You can request a copy of your
              information in a structured, commonly used, and machine-readable
              format.
            </li>
            <li>
              <strong>Objection:</strong> You can object to our processing of
              your personal information in certain circumstances.
            </li>
          </List>
          <Paragraph>
            To exercise these rights, please contact us at
            privacy@aduanepafie.com. We will respond to your request within the
            timeframe required by applicable law.
          </Paragraph>
          <SubSectionTitle>Email Communications</SubSectionTitle>
          <Paragraph>
            You can opt out of receiving marketing emails from us by clicking
            the "unsubscribe" link in any marketing email we send. Even if you
            opt out of marketing communications, we may still send you
            service-related communications.
          </Paragraph>
        </PolicySection>

        <PolicySection id='children'>
          <SectionTitle>Children's Privacy</SectionTitle>
          <Paragraph>
            Our services are not directed to children under the age of 13 (or 16
            in certain jurisdictions). We do not knowingly collect personal
            information from children. If you believe we have collected personal
            information from a child, please contact us, and we will take steps
            to delete the information.
          </Paragraph>
        </PolicySection>

        <PolicySection id='international'>
          <SectionTitle>International Data Transfers</SectionTitle>
          <Paragraph>
            We may process and store your information in countries other than
            your own, including in the United States. These countries may have
            different data protection laws than your country of residence. By
            using our services, you consent to the transfer of your information
            to these countries. We take appropriate safeguards to ensure that
            your information is adequately protected in any country where it is
            processed.
          </Paragraph>
        </PolicySection>

        <PolicySection id='updates'>
          <SectionTitle>Changes to This Policy</SectionTitle>
          <Paragraph>
            We may update this Privacy Policy from time to time. If we make
            material changes, we will notify you by posting a notice on our
            website or, in some cases, by sending you an email notification. We
            encourage you to review this Privacy Policy periodically.
          </Paragraph>
        </PolicySection>

        <PolicySection id='contact'>
          <SectionTitle>Contact Us</SectionTitle>
          <Paragraph>
            If you have questions or concerns about this Privacy Policy or our
            data practices, please contact us at:
          </Paragraph>
          <Paragraph>
            <strong>Email:</strong> privacy@aduanepafie.com
            <br />
            <strong>Address:</strong> Aduanepafie, 123 Culinary Lane, Accra,
            Ghana
          </Paragraph>
        </PolicySection>
      </PolicyContainer>

      <RelatedPoliciesContainer>
        <SectionTitle>Related Legal Documents</SectionTitle>

        <RelatedPolicyLink to='/legal/terms-of-service'>
          <PolicyLinkText>
            <h4>Terms of Service</h4>
            <p>The rules and guidelines for using our platform</p>
          </PolicyLinkText>
          <PolicyLinkIcon>
            <FiChevronRight size={20} />
          </PolicyLinkIcon>
        </RelatedPolicyLink>

        <RelatedPolicyLink to='/legal/cookie-policy'>
          <PolicyLinkText>
            <h4>Cookie Policy</h4>
            <p>How we use cookies and similar technologies</p>
          </PolicyLinkText>
          <PolicyLinkIcon>
            <FiChevronRight size={20} />
          </PolicyLinkIcon>
        </RelatedPolicyLink>

        <RelatedPolicyLink to='/legal/contributor-guidelines'>
          <PolicyLinkText>
            <h4>Contributor Guidelines</h4>
            <p>Guidelines for submitting and sharing recipes</p>
          </PolicyLinkText>
          <PolicyLinkIcon>
            <FiChevronRight size={20} />
          </PolicyLinkIcon>
        </RelatedPolicyLink>
      </RelatedPoliciesContainer>
    </>
  );
};

export default PrivacyPolicyPage;
