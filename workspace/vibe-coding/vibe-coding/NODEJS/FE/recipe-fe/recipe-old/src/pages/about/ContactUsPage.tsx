import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  FiMapPin,
  FiMail,
  FiPhone,
  FiClock,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
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

// Styled components
const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: ${spacing.xxl};
  margin: ${spacing.xl} 0;

  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled.div`
  background-color: ${colors.white};
  padding: ${spacing.xl};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
`;

const InfoList = styled.div`
  margin: ${spacing.lg} 0;
`;

const InfoItem = styled.div`
  display: flex;
  margin-bottom: ${spacing.lg};
  align-items: flex-start;
`;

const InfoIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${borderRadius.full};
  background-color: ${colors.emeraldGreen}20;
  color: ${colors.emeraldGreen};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-right: ${spacing.lg};
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.xs};
`;

const InfoText = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${colors.galaxyGrey};
`;

const InfoLink = styled.a`
  color: ${colors.emeraldGreen};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const OfficeHoursList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const OfficeHoursItem = styled.li`
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  padding: ${spacing.sm} 0;
  border-bottom: 1px solid ${colors.cosmicLatte};

  &:last-child {
    border-bottom: none;
  }
`;

const OfficeDay = styled.span`
  color: ${colors.deepSpace};
`;

const OfficeTime = styled.span`
  color: ${colors.galaxyGrey};
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-top: ${spacing.lg};
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${borderRadius.full};
  background-color: ${colors.cosmicLatte};
  color: ${colors.deepSpace};
  transition: all 0.2s ease;
  font-size: 1.1rem;

  &:hover {
    background-color: ${colors.emeraldGreen};
    color: ${colors.white};
    transform: translateY(-3px);
  }
`;

const ContactForm = styled.form`
  background-color: ${colors.white};
  padding: ${spacing.xl};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.md};
`;

const FormDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${colors.galaxyGrey};
  margin-bottom: ${spacing.lg};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing.md};

  @media (max-width: ${breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${spacing.md};
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.9rem;
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.xs};
`;

const FormInput = styled.input`
  width: 100%;
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${colors.cosmicLatte};
  border-radius: ${borderRadius.md};
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.emeraldGreen};
    box-shadow: 0 0 0 2px ${colors.emeraldGreen}30;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${colors.cosmicLatte};
  border-radius: ${borderRadius.md};
  font-size: 1rem;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23317039' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;

  &:focus {
    outline: none;
    border-color: ${colors.emeraldGreen};
    box-shadow: 0 0 0 2px ${colors.emeraldGreen}30;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${colors.cosmicLatte};
  border-radius: ${borderRadius.md};
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.emeraldGreen};
    box-shadow: 0 0 0 2px ${colors.emeraldGreen}30;
  }
`;

const FormSubmitGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${spacing.lg};

  @media (max-width: ${breakpoints.sm}) {
    flex-direction: column;
    gap: ${spacing.md};
    align-items: flex-start;
  }
`;

const FormPolicy = styled.p`
  font-size: 0.85rem;
  color: ${colors.galaxyGrey};

  @media (max-width: ${breakpoints.sm}) {
    order: 2;
  }
`;

const PolicyLink = styled(Link)`
  color: ${colors.emeraldGreen};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled(Button)`
  @media (max-width: ${breakpoints.sm}) {
    width: 100%;
    order: 1;
  }
`;

const FormMessage = styled.div<{ $isError?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  margin-top: ${spacing.md};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  font-size: 0.9rem;
  color: ${(props) =>
    props.$isError ? colors.darkPastelRed : colors.emeraldGreen};
  background-color: ${(props) =>
    props.$isError ? `${colors.darkPastelRed}15` : `${colors.emeraldGreen}15`};
`;

const MapSection = styled.div`
  margin: ${spacing.xxl} 0;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: ${borderRadius.lg};
  overflow: hidden;
  box-shadow: ${shadows.soft};
  margin-top: ${spacing.xl};
  position: relative;
  background-color: ${colors.cosmicLatte}50;
`;

const MapPlaceholder = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: ${colors.galaxyGrey};
`;

const MapImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FAQSection = styled.div`
  margin: ${spacing.xxl} 0;
`;

const FAQList = styled.div`
  margin-top: ${spacing.xl};
`;

const FAQItem = styled.div`
  margin-bottom: ${spacing.md};
  border-bottom: 1px solid ${colors.cosmicLatte};
  padding-bottom: ${spacing.md};

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const FAQQuestion = styled.button<{ $isOpen?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: ${spacing.md} 0;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};

  svg {
    color: ${colors.emeraldGreen};
    transition: transform 0.2s ease;
    transform: ${(props) => (props.$isOpen ? 'rotate(180deg)' : 'rotate(0)')};
  }
`;

const FAQAnswer = styled.div<{ $isOpen?: boolean }>`
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  padding: 0 0 ${spacing.md};
  font-size: 1rem;
  line-height: 1.6;
  color: ${colors.galaxyGrey};
`;

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitStatus, setSubmitStatus] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);

  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send the form data to your backend here

    // Simulate form submission
    setSubmitStatus({
      message:
        'Your message has been sent successfully! We will get back to you soon.',
      isError: false,
    });

    // Reset form after submission
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
    });

    // Clear success message after a few seconds
    setTimeout(() => {
      setSubmitStatus(null);
    }, 5000);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: 'How can I contribute a traditional recipe to your platform?',
      answer:
        'We welcome community contributions! You can email us your recipe at recipes@aduanepafie.com with photos and a personal story about the dish. Our culinary team will review it and may reach out for more details before publishing.',
    },
    {
      question:
        'Do you offer cooking classes or events to learn Ghanaian cooking?',
      answer:
        'Yes! We regularly host both virtual and in-person cooking workshops in Accra. Check our Events page for upcoming classes or sign up for our newsletter to get notified about new events.',
    },
    {
      question: 'I found an error in one of your recipes. How can I report it?',
      answer:
        'We appreciate your help in maintaining accuracy. Please use our Contact form with the subject "Recipe Correction" and include the recipe name and the correction needed. Our culinary team will review and update accordingly.',
    },
    {
      question: 'Can I use your recipes for commercial purposes?',
      answer:
        "Our recipes are for personal use only. If you're interested in using our content for commercial purposes, please contact our licensing team at business@aduanepafie.com to discuss licensing options.",
    },
    {
      question:
        'How can I collaborate with your platform as a chef or content creator?',
      answer:
        'We\'re always open to collaborations with chefs, food writers, photographers, and content creators who share our passion for Ghanaian cuisine. Please use our Contact form with the subject "Collaboration Inquiry" detailing your proposal and portfolio.',
    },
  ];

  return (
    <>
      <Breadcrumbs>
        <BreadcrumbItem to='/'>Home</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem to='/about'>About</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbCurrent>Contact Us</BreadcrumbCurrent>
      </Breadcrumbs>

      <PageTitle>Contact Us</PageTitle>
      <PageDescription>
        Have questions, feedback, or just want to say hello? We'd love to hear
        from you! Reach out using the contact form below or find our direct
        contact information.
      </PageDescription>

      <ContactGrid>
        <ContactInfo>
          <SectionTitle>Get in Touch</SectionTitle>
          <InfoList>
            <InfoItem>
              <InfoIcon>
                <FiMapPin />
              </InfoIcon>
              <InfoContent>
                <InfoTitle>Our Location</InfoTitle>
                <InfoText>
                  15 Independence Avenue <br />
                  Osu, Accra <br />
                  Ghana
                </InfoText>
              </InfoContent>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <FiMail />
              </InfoIcon>
              <InfoContent>
                <InfoTitle>Email Us</InfoTitle>
                <InfoText>
                  <InfoLink href='mailto:info@aduanepafie.com'>
                    info@aduanepafie.com
                  </InfoLink>
                  <br />
                  <InfoLink href='mailto:support@aduanepafie.com'>
                    support@aduanepafie.com
                  </InfoLink>
                </InfoText>
              </InfoContent>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <FiPhone />
              </InfoIcon>
              <InfoContent>
                <InfoTitle>Call Us</InfoTitle>
                <InfoText>
                  <InfoLink href='tel:+233302123456'>+233 30 212 3456</InfoLink>
                  <br />
                  Monday to Friday, 9am to 5pm GMT
                </InfoText>
              </InfoContent>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <FiClock />
              </InfoIcon>
              <InfoContent>
                <InfoTitle>Office Hours</InfoTitle>
                <OfficeHoursList>
                  <OfficeHoursItem>
                    <OfficeDay>Monday - Friday</OfficeDay>
                    <OfficeTime>9:00 AM - 5:00 PM</OfficeTime>
                  </OfficeHoursItem>
                  <OfficeHoursItem>
                    <OfficeDay>Saturday</OfficeDay>
                    <OfficeTime>10:00 AM - 2:00 PM</OfficeTime>
                  </OfficeHoursItem>
                  <OfficeHoursItem>
                    <OfficeDay>Sunday</OfficeDay>
                    <OfficeTime>Closed</OfficeTime>
                  </OfficeHoursItem>
                </OfficeHoursList>
              </InfoContent>
            </InfoItem>
          </InfoList>

          <SectionTitle>Follow Us</SectionTitle>
          <InfoText>
            Connect with us on social media for the latest recipes, cooking
            tips, and updates on Ghanaian cuisine.
          </InfoText>
          <SocialLinks>
            <SocialLink
              href='https://facebook.com'
              title='Facebook'>
              <i className='fab fa-facebook-f'></i>
            </SocialLink>
            <SocialLink
              href='https://instagram.com'
              title='Instagram'>
              <i className='fab fa-instagram'></i>
            </SocialLink>
            <SocialLink
              href='https://twitter.com'
              title='Twitter'>
              <i className='fab fa-twitter'></i>
            </SocialLink>
            <SocialLink
              href='https://youtube.com'
              title='YouTube'>
              <i className='fab fa-youtube'></i>
            </SocialLink>
          </SocialLinks>
        </ContactInfo>

        <ContactForm onSubmit={handleSubmit}>
          <FormTitle>Send Us a Message</FormTitle>
          <FormDescription>
            Whether you have a question about recipes, feedback on our platform,
            or want to explore collaboration opportunities, we're here to help.
          </FormDescription>

          <FormGrid>
            <FormGroup>
              <FormLabel htmlFor='firstName'>First Name*</FormLabel>
              <FormInput
                type='text'
                id='firstName'
                name='firstName'
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor='lastName'>Last Name*</FormLabel>
              <FormInput
                type='text'
                id='lastName'
                name='lastName'
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </FormGrid>

          <FormGroup>
            <FormLabel htmlFor='email'>Email Address*</FormLabel>
            <FormInput
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor='subject'>Subject*</FormLabel>
            <FormSelect
              id='subject'
              name='subject'
              value={formData.subject}
              onChange={handleInputChange}
              required>
              <option value=''>Select a subject</option>
              <option value='General Question'>General Question</option>
              <option value='Recipe Support'>Recipe Support</option>
              <option value='Technical Issue'>Technical Issue</option>
              <option value='Business Inquiry'>Business Inquiry</option>
              <option value='Feedback'>Feedback</option>
              <option value='Other'>Other</option>
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor='message'>Message*</FormLabel>
            <FormTextarea
              id='message'
              name='message'
              value={formData.message}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormSubmitGroup>
            <FormPolicy>
              By submitting this form, you agree to our{' '}
              <PolicyLink to='/privacy-policy'>Privacy Policy</PolicyLink> and{' '}
              <PolicyLink to='/terms-of-service'>Terms of Service</PolicyLink>.
            </FormPolicy>

            <SubmitButton
              $primary
              type='submit'>
              Send Message <FiSend />
            </SubmitButton>
          </FormSubmitGroup>

          {submitStatus && (
            <FormMessage $isError={submitStatus.isError}>
              {submitStatus.isError ? <FiAlertCircle /> : <FiCheckCircle />}
              {submitStatus.message}
            </FormMessage>
          )}
        </ContactForm>
      </ContactGrid>

      <MapSection>
        <SectionTitle>Visit Our Office</SectionTitle>
        <Paragraph>
          Our office is centrally located in Osu, Accra, within easy reach of
          major landmarks. We welcome visitors during our regular office hours —
          feel free to stop by!
        </Paragraph>

        <MapContainer>
          {/* In a real application, you would integrate Google Maps or another mapping service here */}
          <MapPlaceholder>
            <h3>Map of our location</h3>
            <p>15 Independence Avenue, Osu, Accra, Ghana</p>
          </MapPlaceholder>
          <MapImage
            src='https://images.unsplash.com/photo-1527255754861-3ac1a9746150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
            alt='Map of Accra, Ghana'
          />
        </MapContainer>
      </MapSection>

      <FAQSection>
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        <Paragraph>
          Find quick answers to common questions about our platform, recipes,
          and services.
        </Paragraph>

        <FAQList>
          {faqs.map((faq, index) => (
            <FAQItem key={index}>
              <FAQQuestion
                $isOpen={openFAQ === index}
                onClick={() => toggleFAQ(index)}>
                {faq.question}
                {openFAQ === index ? <FiChevronUp /> : <FiChevronDown />}
              </FAQQuestion>
              <FAQAnswer $isOpen={openFAQ === index}>{faq.answer}</FAQAnswer>
            </FAQItem>
          ))}
        </FAQList>
      </FAQSection>
    </>
  );
};

export default ContactUsPage;
