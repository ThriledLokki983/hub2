import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
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
  SubSectionTitle,
  Paragraph,
  PageSection,
} from '../../components/PageComponents';
import Button from '../../components/Button';

// Styled components
const PolicyContainer = styled.div`
  background-color: ${colors.white};
  padding: ${spacing.lg};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
  margin-bottom: ${spacing.xl};

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.xl};
  }
`;

const LastUpdated = styled.p`
  color: ${colors.galaxyGrey};
  font-size: 0.9rem;
  margin-bottom: ${spacing.lg};
  font-style: italic;
`;

const TableOfContents = styled.div`
  background-color: ${colors.cosmicLatte}50;
  padding: ${spacing.md};
  border-radius: ${borderRadius.md};
  margin-bottom: ${spacing.xl};
`;

const TOCTitle = styled.h3`
  font-size: 1.1rem;
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.md};
  font-weight: ${typography.fontWeights.light};
`;

const TOCList = styled.ul`
  list-style: none;
  padding-left: ${spacing.md};
`;

const TOCItem = styled.li`
  margin-bottom: ${spacing.sm};
  position: relative;
  padding-left: ${spacing.sm};

  &:before {
    content: '';
    position: absolute;
    left: -${spacing.xs};
    top: 10px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: ${colors.darkPastelRed};
  }
`;

const TOCLink = styled.a`
  color: ${colors.deepSpace};
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;

  &:hover {
    color: ${colors.darkPastelRed};
    text-decoration: underline;
  }
`;

const PolicySection = styled.div`
  margin-bottom: ${spacing.xl};
  scroll-margin-top: 100px;
`;

const UnorderedList = styled.ul`
  margin-bottom: ${spacing.lg};
  padding-left: ${spacing.lg};
  color: ${colors.galaxyGrey};

  li {
    margin-bottom: ${spacing.sm};
    line-height: 1.7;
  }
`;

const OrderedList = styled.ol`
  margin-bottom: ${spacing.lg};
  padding-left: ${spacing.lg};
  color: ${colors.galaxyGrey};

  li {
    margin-bottom: ${spacing.sm};
    line-height: 1.7;
  }
`;

const CookieTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: ${spacing.md} 0 ${spacing.lg};
  color: ${colors.galaxyGrey};
  font-size: 0.9rem;
`;

const TableHead = styled.thead`
  background-color: ${colors.emeraldGreen}20;
`;

const TableHeader = styled.th`
  padding: ${spacing.sm} ${spacing.md};
  text-align: left;
  border: 1px solid ${colors.cosmicLatte};
  color: ${colors.deepSpace};
  font-weight: ${typography.fontWeights.regular};
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${colors.cosmicLatte}30;
  }
`;

const TableCell = styled.td`
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${colors.cosmicLatte};
  line-height: 1.5;
  vertical-align: top;
`;

const ContactInfoBox = styled.div`
  background-color: ${colors.cosmicLatte}60;
  padding: ${spacing.lg};
  border-radius: ${borderRadius.md};
  margin: ${spacing.lg} 0;
  border-left: 3px solid ${colors.emeraldGreen};
`;

const InfoItem = styled.p`
  margin-bottom: ${spacing.sm};
  color: ${colors.galaxyGrey};
  font-size: 0.95rem;
  line-height: 1.7;

  strong {
    color: ${colors.deepSpace};
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${spacing.xl};
  flex-wrap: wrap;
  gap: ${spacing.md};

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const CookiePolicyPage: React.FC = () => {
  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem to='/'>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>Cookie Policy</BreadcrumbCurrent>
      </Breadcrumbs>

      <PageTitle>Cookie Policy</PageTitle>
      <PageDescription>
        This Cookie Policy explains how Aduanepafie ("we", "us", or "our") uses
        cookies and similar technologies on our website. We encourage you to
        read this policy to understand what cookies are, how we use them, and
        your choices regarding their use.
      </PageDescription>

      <PolicyContainer>
        <LastUpdated>Last Updated: April 20, 2025</LastUpdated>

        <TableOfContents>
          <TOCTitle>Contents</TOCTitle>
          <TOCList>
            <TOCItem>
              <TOCLink href='#what-are-cookies'>What Are Cookies</TOCLink>
            </TOCItem>
            <TOCItem>
              <TOCLink href='#how-we-use-cookies'>How We Use Cookies</TOCLink>
            </TOCItem>
            <TOCItem>
              <TOCLink href='#types-of-cookies'>
                Types of Cookies We Use
              </TOCLink>
            </TOCItem>
            <TOCItem>
              <TOCLink href='#cookie-list'>List of Cookies</TOCLink>
            </TOCItem>
            <TOCItem>
              <TOCLink href='#third-party'>Third-Party Cookies</TOCLink>
            </TOCItem>
            <TOCItem>
              <TOCLink href='#cookie-control'>Your Cookie Choices</TOCLink>
            </TOCItem>
            <TOCItem>
              <TOCLink href='#privacy-link'>
                Relationship with Privacy Policy
              </TOCLink>
            </TOCItem>
            <TOCItem>
              <TOCLink href='#updates'>Updates to this Cookie Policy</TOCLink>
            </TOCItem>
            <TOCItem>
              <TOCLink href='#contact'>Contact Us</TOCLink>
            </TOCItem>
          </TOCList>
        </TableOfContents>

        <PolicySection id='what-are-cookies'>
          <SectionTitle>What Are Cookies</SectionTitle>
          <Paragraph>
            Cookies are small text files that are stored on your computer,
            tablet, mobile phone, or other device when you visit a website. They
            are widely used to make websites work more efficiently, provide a
            better user experience, and give website owners information about
            how visitors use their site.
          </Paragraph>
          <Paragraph>
            Cookies may be "session cookies" (which expire when you close your
            browser) or "persistent cookies" (which remain on your device for a
            set period or until you delete them).
          </Paragraph>
          <Paragraph>
            In addition to cookies, we may use other similar technologies like
            web beacons (also known as pixel tags), tracking URLs, or software
            development kits (SDKs). These technologies do similar things to
            cookies, allowing us to track user activity across our website and
            services.
          </Paragraph>
        </PolicySection>

        <PolicySection id='how-we-use-cookies'>
          <SectionTitle>How We Use Cookies</SectionTitle>
          <Paragraph>
            At Aduanepafie, we use cookies and similar technologies for the
            following purposes:
          </Paragraph>
          <UnorderedList>
            <li>
              <strong>Essential functionality:</strong> To ensure the proper
              functioning of our website, including authenticating users,
              remembering your preferences, and securing your session.
            </li>
            <li>
              <strong>Analytics and performance:</strong> To understand how
              visitors interact with our website, which pages are most popular,
              and identify areas for improvement.
            </li>
            <li>
              <strong>Personalization:</strong> To remember your preferences and
              personalize your experience, such as saving your favorite recipes
              or regional cuisine preferences.
            </li>
            <li>
              <strong>Security:</strong> To help protect our website and users
              from malicious activity and ensure our services operate securely.
            </li>
            <li>
              <strong>Advertising and marketing:</strong> To deliver relevant
              ads and measure their effectiveness, both on our site and on
              third-party websites.
            </li>
          </UnorderedList>
        </PolicySection>

        <PolicySection id='types-of-cookies'>
          <SectionTitle>Types of Cookies We Use</SectionTitle>
          <SubSectionTitle>Essential Cookies</SubSectionTitle>
          <Paragraph>
            These cookies are necessary for the website to function properly and
            cannot be disabled in our systems. They are usually set in response
            to actions you take, such as logging in, filling in forms, or
            setting your privacy preferences. Without these cookies, services
            you request cannot be provided.
          </Paragraph>

          <SubSectionTitle>Performance and Analytics Cookies</SubSectionTitle>
          <Paragraph>
            These cookies allow us to count visits and traffic sources so we can
            measure and improve the performance of our website. They help us
            understand which pages are the most and least popular, and see how
            visitors move around the site. If you disable these cookies, we
            won't know when you've visited our site.
          </Paragraph>

          <SubSectionTitle>Functional Cookies</SubSectionTitle>
          <Paragraph>
            These cookies enable enhanced functionality and personalization on
            our website. They may be set by us or by third-party providers whose
            services we have added to our pages. If you disable these cookies,
            some or all of these services may not function properly.
          </Paragraph>

          <SubSectionTitle>Targeting and Advertising Cookies</SubSectionTitle>
          <Paragraph>
            These cookies may be set through our website by our advertising
            partners. They may be used by those companies to build a profile of
            your interests and show you relevant advertisements on other sites.
            They do not directly store personal information but are based on
            uniquely identifying your browser and internet device.
          </Paragraph>

          <SubSectionTitle>Social Media Cookies</SubSectionTitle>
          <Paragraph>
            These cookies are set by social media services that we have added to
            the site to enable you to share our content with your friends and
            networks. They can track your browser across other sites and build a
            profile of your interests. This may impact the content and messages
            you see on other websites you visit.
          </Paragraph>
        </PolicySection>

        <PolicySection id='cookie-list'>
          <SectionTitle>List of Cookies</SectionTitle>
          <Paragraph>
            Here is a detailed list of the cookies we use on our website:
          </Paragraph>

          <CookieTable>
            <TableHead>
              <tr>
                <TableHeader>Name</TableHeader>
                <TableHeader>Provider</TableHeader>
                <TableHeader>Purpose</TableHeader>
                <TableHeader>Duration</TableHeader>
              </tr>
            </TableHead>
            <tbody>
              <TableRow>
                <TableCell>session_id</TableCell>
                <TableCell>Aduanepafie</TableCell>
                <TableCell>
                  Maintains user session state across page requests
                </TableCell>
                <TableCell>Session</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>auth_token</TableCell>
                <TableCell>Aduanepafie</TableCell>
                <TableCell>Authenticates logged-in users</TableCell>
                <TableCell>30 days</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>pref_cuisine</TableCell>
                <TableCell>Aduanepafie</TableCell>
                <TableCell>
                  Remembers user preferences for regional cuisines
                </TableCell>
                <TableCell>90 days</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>recipe_history</TableCell>
                <TableCell>Aduanepafie</TableCell>
                <TableCell>Tracks recently viewed recipes</TableCell>
                <TableCell>30 days</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>_ga</TableCell>
                <TableCell>Google Analytics</TableCell>
                <TableCell>
                  Used to distinguish users for analytics purposes
                </TableCell>
                <TableCell>2 years</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>_fbp</TableCell>
                <TableCell>Facebook</TableCell>
                <TableCell>
                  Used by Facebook to deliver advertisements
                </TableCell>
                <TableCell>90 days</TableCell>
              </TableRow>
            </tbody>
          </CookieTable>
        </PolicySection>

        <PolicySection id='third-party'>
          <SectionTitle>Third-Party Cookies</SectionTitle>
          <Paragraph>
            Some cookies are placed by third parties on our behalf. These
            cookies help us understand how visitors interact with our website,
            provide social media features, and assist with our marketing
            efforts.
          </Paragraph>
          <Paragraph>We use the following third-party services:</Paragraph>
          <UnorderedList>
            <li>
              <strong>Google Analytics:</strong> We use Google Analytics to
              understand how visitors interact with our website. Google
              Analytics uses cookies to collect standard internet log
              information and visitor behavior information. This information is
              used to track visitor use of the website and to compile
              statistical reports on website activity.
            </li>
            <li>
              <strong>Facebook Pixel:</strong> We use Facebook Pixel to measure
              the effectiveness of our advertising campaigns and to build
              tailored audiences for future advertisements.
            </li>
            <li>
              <strong>YouTube:</strong> Our website incorporates YouTube videos,
              which may set cookies on your device when you view them.
            </li>
            <li>
              <strong>Social sharing buttons:</strong> We provide buttons that
              allow you to share our content on social media platforms like
              Facebook, Twitter, and Pinterest. These buttons may set cookies on
              your device when you use them.
            </li>
          </UnorderedList>
          <Paragraph>
            Please note that we do not have direct control over the information
            collected by these third parties. For more information about how
            they use your information, please refer to their respective privacy
            policies.
          </Paragraph>
        </PolicySection>

        <PolicySection id='cookie-control'>
          <SectionTitle>Your Cookie Choices</SectionTitle>
          <Paragraph>
            You have the right to decide whether to accept or reject cookies.
            Most web browsers automatically accept cookies, but you can usually
            modify your browser settings to reject cookies if you prefer.
          </Paragraph>

          <SubSectionTitle>Browser Controls</SubSectionTitle>
          <Paragraph>
            You can set or amend your web browser controls to accept or refuse
            cookies. If you choose to reject cookies, you may still use our
            website, but your access to some functionality and areas may be
            restricted.
          </Paragraph>
          <Paragraph>
            Here are links to instructions on how to manage cookies in popular
            web browsers:
          </Paragraph>
          <UnorderedList>
            <li>
              <a
                href='https://support.google.com/chrome/answer/95647'
                target='_blank'
                rel='noopener noreferrer'>
                Google Chrome
              </a>
            </li>
            <li>
              <a
                href='https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop'
                target='_blank'
                rel='noopener noreferrer'>
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                href='https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac'
                target='_blank'
                rel='noopener noreferrer'>
                Safari
              </a>
            </li>
            <li>
              <a
                href='https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09'
                target='_blank'
                rel='noopener noreferrer'>
                Microsoft Edge
              </a>
            </li>
          </UnorderedList>

          <SubSectionTitle>Cookie Preference Tool</SubSectionTitle>
          <Paragraph>
            We provide a cookie management tool that allows you to adjust your
            cookie preferences on our website. You can access this tool by
            clicking the "Cookie Preferences" link in the footer of our website.
          </Paragraph>

          <SubSectionTitle>Do Not Track Signals</SubSectionTitle>
          <Paragraph>
            Some browsers have a "Do Not Track" feature that signals websites
            that you visit not to track your online activities. Currently, our
            website does not respond to "Do Not Track" signals.
          </Paragraph>
        </PolicySection>

        <PolicySection id='privacy-link'>
          <SectionTitle>Relationship with Privacy Policy</SectionTitle>
          <Paragraph>
            This Cookie Policy should be read in conjunction with our
            <Link
              to='/privacy-policy'
              style={{ margin: '0 4px', color: colors.emeraldGreen }}>
              Privacy Policy
            </Link>
            , which provides further details about how we collect, use, and
            disclose personal information.
          </Paragraph>
        </PolicySection>

        <PolicySection id='updates'>
          <SectionTitle>Updates to this Cookie Policy</SectionTitle>
          <Paragraph>
            We may update this Cookie Policy from time to time to reflect
            changes in technology, legal requirements, or our business
            practices. Any changes will be posted on this page, and if the
            changes are significant, we will provide a more prominent notice.
          </Paragraph>
          <Paragraph>
            We encourage you to review this Cookie Policy periodically to stay
            informed about our use of cookies.
          </Paragraph>
        </PolicySection>

        <PolicySection id='contact'>
          <SectionTitle>Contact Us</SectionTitle>
          <Paragraph>
            If you have any questions or concerns about our use of cookies or
            this Cookie Policy, please contact us.
          </Paragraph>

          <ContactInfoBox>
            <InfoItem>
              <strong>Email:</strong> privacy@aduanepafie.com
            </InfoItem>
            <InfoItem>
              <strong>Postal Address:</strong> Aduanepafie Inc., P.O. Box 12345,
              Accra, Ghana
            </InfoItem>
            <InfoItem>
              <strong>Phone:</strong> +233 123 456 7890
            </InfoItem>
          </ContactInfoBox>
        </PolicySection>

        <NavigationButtons>
          <Button
            $outlined
            as={Link}
            to='/privacy-policy'>
            Privacy Policy
          </Button>
          <Button
            $outlined
            as={Link}
            to='/terms-of-service'>
            Terms of Service
          </Button>
        </NavigationButtons>
      </PolicyContainer>
    </>
  );
};

export default CookiePolicyPage;
