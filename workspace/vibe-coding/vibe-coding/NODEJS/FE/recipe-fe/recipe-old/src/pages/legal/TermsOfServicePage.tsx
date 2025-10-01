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

// Styled components - reusing the same elegant style as Privacy Policy
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
const TermsOfServicePage: React.FC = () => {
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
        <BreadcrumbCurrent>Terms of Service</BreadcrumbCurrent>
      </Breadcrumbs>

      <PageTitle>Terms of Service</PageTitle>
      <PageDescription>
        The rules and guidelines for using our platform. Please read these terms
        carefully before using Aduanepafie.
      </PageDescription>

      <LastUpdated>
        <FiCalendar size={14} />
        Last updated: April 15, 2025
      </LastUpdated>

      <TableOfContents>
        <TOCTitle>Contents</TOCTitle>
        <TOCList>
          <li>
            <TOCLink onClick={() => scrollToSection('acceptance')}>
              Acceptance of Terms <FiChevronRight />
            </TOCLink>
          </li>
          <li>
            <TOCLink onClick={() => scrollToSection('account')}>
              Account Registration <FiChevronRight />
            </TOCLink>
          </li>
          <li>
            <TOCLink onClick={() => scrollToSection('content')}>
              User-Generated Content <FiChevronRight />
            </TOCLink>
          </li>
          <li>
            <TOCLink onClick={() => scrollToSection('intellectual-property')}>
              Intellectual Property Rights <FiChevronRight />
            </TOCLink>
          </li>
          <li>
            <TOCLink onClick={() => scrollToSection('prohibited')}>
              Prohibited Activities <FiChevronRight />
            </TOCLink>
          </li>
          <li>
            <TOCLink onClick={() => scrollToSection('termination')}>
              Termination <FiChevronRight />
            </TOCLink>
          </li>
          <li>
            <TOCLink onClick={() => scrollToSection('disclaimer')}>
              Disclaimer of Warranties <FiChevronRight />
            </TOCLink>
          </li>
          <li>
            <TOCLink onClick={() => scrollToSection('limitation')}>
              Limitation of Liability <FiChevronRight />
            </TOCLink>
          </li>
          <li>
            <TOCLink onClick={() => scrollToSection('changes')}>
              Changes to Terms <FiChevronRight />
            </TOCLink>
          </li>
          <li>
            <TOCLink onClick={() => scrollToSection('governing-law')}>
              Governing Law <FiChevronRight />
            </TOCLink>
          </li>
        </TOCList>
      </TableOfContents>

      <PolicyContainer>
        <PolicySection id='acceptance'>
          <SectionTitle>Acceptance of Terms</SectionTitle>
          <Paragraph>
            By accessing or using the Aduanepafie website, mobile application,
            or any other services provided by Aduanepafie ("Services"), you
            agree to be bound by these Terms of Service. If you do not agree to
            these terms, please do not use our Services.
          </Paragraph>
          <Paragraph>
            These terms constitute a legally binding agreement between you and
            Aduanepafie regarding your use of the Services. You must be at least
            13 years old to use our Services. If you are under 18, you must have
            your parent or guardian's permission to use the Services and they
            must agree to these Terms on your behalf.
          </Paragraph>
        </PolicySection>

        <PolicySection id='account'>
          <SectionTitle>Account Registration</SectionTitle>
          <Paragraph>
            To access certain features of our Services, you may need to create
            an account. When you create an account, you must provide accurate
            and complete information. You are solely responsible for:
          </Paragraph>
          <List>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>
              Promptly notifying us of any unauthorized use of your account
            </li>
          </List>
          <Paragraph>
            We reserve the right to disable any user account at any time if, in
            our opinion, you have failed to comply with these Terms.
          </Paragraph>
        </PolicySection>

        <PolicySection id='content'>
          <SectionTitle>User-Generated Content</SectionTitle>
          <Paragraph>
            Our Services allow you to post, submit, and share content, such as
            recipes, comments, reviews, and other materials ("User Content").
            You retain ownership rights in your User Content, but by posting
            User Content on our platform, you grant us a worldwide,
            non-exclusive, royalty-free, sublicensable, and transferable license
            to use, reproduce, modify, adapt, publish, translate, create
            derivative works from, distribute, and display such User Content.
          </Paragraph>
          <SubSectionTitle>Content Guidelines</SubSectionTitle>
          <Paragraph>
            You are solely responsible for your User Content. User Content must
            not:
          </Paragraph>
          <List>
            <li>Infringe any third party's intellectual property rights</li>
            <li>Contain harmful, offensive, or illegal content</li>
            <li>Contain false, misleading, or deceptive information</li>
            <li>Promote violence, discrimination, or illegal activities</li>
            <li>Violate anyone's privacy or publicity rights</li>
            <li>Contain malware, viruses, or other harmful code</li>
          </List>
          <Paragraph>
            We reserve the right to remove any User Content that violates these
            Terms or that we determine is harmful, offensive, or otherwise
            objectionable.
          </Paragraph>
        </PolicySection>

        <PolicySection id='intellectual-property'>
          <SectionTitle>Intellectual Property Rights</SectionTitle>
          <Paragraph>
            The Services and their contents, features, and functionality
            (including but not limited to text, graphics, images, code, and
            software) are owned by Aduanepafie or its licensors and are
            protected by copyright, trademark, patent, and other intellectual
            property laws.
          </Paragraph>
          <Paragraph>
            Our name, logo, and all related names, logos, product and service
            names, designs, and slogans are trademarks of Aduanepafie or its
            licensors. You must not use such marks without our prior written
            permission.
          </Paragraph>
        </PolicySection>

        <PolicySection id='prohibited'>
          <SectionTitle>Prohibited Activities</SectionTitle>
          <Paragraph>You agree not to:</Paragraph>
          <List>
            <li>
              Use the Services for any unlawful purpose or in violation of these
              Terms
            </li>
            <li>
              Engage in any activity that interferes with or disrupts the
              Services
            </li>
            <li>Attempt to bypass any security features of the Services</li>
            <li>
              Use automated means (such as bots or scrapers) to access or
              collect data from the Services
            </li>
            <li>Create multiple accounts or engage in abusive behavior</li>
            <li>Impersonate another person or entity</li>
            <li>
              Publish or share recipes or other content that could cause harm if
              followed
            </li>
            <li>
              Use the Services to transmit spam, chain letters, or other
              unsolicited communications
            </li>
          </List>
        </PolicySection>

        <PolicySection id='termination'>
          <SectionTitle>Termination</SectionTitle>
          <Paragraph>
            We may terminate or suspend your access to the Services immediately,
            without prior notice or liability, for any reason, including,
            without limitation, if you breach these Terms.
          </Paragraph>
          <Paragraph>
            Upon termination, your right to use the Services will immediately
            cease. All provisions of these Terms that by their nature should
            survive termination shall survive, including ownership provisions,
            warranty disclaimers, indemnity, and limitations of liability.
          </Paragraph>
          <Paragraph>
            You may also terminate your account at any time by contacting us or
            using the account deletion feature within the Services.
          </Paragraph>
        </PolicySection>

        <PolicySection id='disclaimer'>
          <SectionTitle>Disclaimer of Warranties</SectionTitle>
          <Paragraph>
            THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS
            WITHOUT ANY WARRANTIES OF ANY KIND. ADUANEPAFIE DISCLAIMS ALL
            WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT.
          </Paragraph>
          <Paragraph>
            We do not guarantee that the Services will be uninterrupted, secure,
            or error-free, or that any recipes or content will be accurate or
            suitable for consumption. You acknowledge that you prepare and
            consume recipes at your own risk.
          </Paragraph>
        </PolicySection>

        <PolicySection id='limitation'>
          <SectionTitle>Limitation of Liability</SectionTitle>
          <Paragraph>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, ADUANEPAFIE SHALL NOT BE
            LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
            PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER
            INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL,
            OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
          </Paragraph>
          <List>
            <li>
              YOUR ACCESS TO, USE OF, OR INABILITY TO ACCESS OR USE THE SERVICES
            </li>
            <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICES</li>
            <li>ANY CONTENT OBTAINED FROM THE SERVICES</li>
            <li>
              UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR
              CONTENT
            </li>
          </List>
          <Paragraph>
            IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU EXCEED THE AMOUNT YOU
            HAVE PAID TO US IN THE PAST SIX MONTHS.
          </Paragraph>
        </PolicySection>

        <PolicySection id='changes'>
          <SectionTitle>Changes to Terms</SectionTitle>
          <Paragraph>
            We reserve the right to modify these Terms at any time. If we make
            material changes to these Terms, we will notify you by posting the
            revised Terms on our website or, in some cases, by sending you an
            email notification.
          </Paragraph>
          <Paragraph>
            Your continued use of the Services after the effective date of the
            revised Terms constitutes your acceptance of the changes. It is your
            responsibility to check these Terms periodically for changes.
          </Paragraph>
        </PolicySection>

        <PolicySection id='governing-law'>
          <SectionTitle>Governing Law</SectionTitle>
          <Paragraph>
            These Terms shall be governed by and construed in accordance with
            the laws of Ghana, without regard to its conflict of law provisions.
            You agree to submit to the personal and exclusive jurisdiction of
            the courts located in Accra, Ghana for the resolution of any
            disputes.
          </Paragraph>
          <Paragraph>
            If any provision of these Terms is found to be invalid or
            unenforceable, the remaining provisions will remain in full force
            and effect.
          </Paragraph>
        </PolicySection>
      </PolicyContainer>

      <RelatedPoliciesContainer>
        <SectionTitle>Related Legal Documents</SectionTitle>

        <RelatedPolicyLink to='/legal/privacy-policy'>
          <PolicyLinkText>
            <h4>Privacy Policy</h4>
            <p>How we collect, use, and protect your information</p>
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

export default TermsOfServicePage;
