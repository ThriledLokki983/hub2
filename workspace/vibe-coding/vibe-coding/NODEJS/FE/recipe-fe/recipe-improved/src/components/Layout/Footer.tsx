import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { colors, spacing, typography, breakpoints } from '../../theme/theme';

const FooterContainer = styled.footer`
  background-color: ${colors.darkBackground};
  color: ${colors.white};
  padding: ${spacing.xl} ${spacing.lg};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 122, 0, 0.5),
      transparent
    );
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${spacing.xl};

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${breakpoints.laptop}) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
`;

const FooterSection = styled.div``;

const FooterLogo = styled(Link)`
  color: ${colors.white};
  text-decoration: none;
  font-weight: 200;
  font-size: 1.8rem;
  letter-spacing: -0.05em;
  display: inline-block;
  margin-bottom: ${spacing.md};

  span {
    color: ${colors.primaryOrange};
  }
`;

const FooterTagline = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-weight: ${typography.fontWeights.light};
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: ${spacing.lg};
  max-width: 300px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-bottom: ${spacing.lg};
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: ${colors.white};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.primaryOrange};
    transform: translateY(-3px);
  }
`;

const FooterHeading = styled.h3`
  color: ${colors.white};
  font-weight: ${typography.fontWeights.light};
  font-size: 1.1rem;
  margin-bottom: ${spacing.md};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 30px;
    height: 2px;
    background-color: ${colors.primaryOrange};
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLinkItem = styled.li`
  margin-bottom: ${spacing.sm};
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: ${typography.fontWeights.light};
  transition: all 0.2s ease;
  position: relative;
  padding-left: ${spacing.sm};

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: ${colors.primaryOrange};
    opacity: 0;
    transform: translateX(-5px);
    transition: all 0.2s ease;
  }

  &:hover {
    color: ${colors.white};
    padding-left: ${spacing.md};

    &::before {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  margin-top: ${spacing.xl};
  padding-top: ${spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Copyright = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  margin-bottom: ${spacing.md};

  @media (min-width: ${breakpoints.tablet}) {
    margin-bottom: 0;
  }
`;

const LegalLinks = styled.div`
  display: flex;
  gap: ${spacing.md};
`;

const LegalLink = styled(Link)`
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.primaryOrange};
  }
`;

const Newsletter = styled.div`
  margin-top: ${spacing.md};
`;

const NewsletterForm = styled.form`
  display: flex;
  margin-top: ${spacing.sm};

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    gap: ${spacing.sm};
  }
`;

const EmailInput = styled.input`
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: ${spacing.sm} ${spacing.md};
  color: ${colors.white};
  font-size: 0.9rem;
  flex-grow: 1;

  &:focus {
    outline: none;
    border-color: ${colors.primaryOrange};
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
  }
`;

const SubscribeButton = styled.button`
  background: linear-gradient(135deg, #FF7A00 0%, #FF8C42 100%);
  color: ${colors.white};
  border: none;
  border-radius: 4px;
  padding: ${spacing.sm} ${spacing.lg};
  font-weight: ${typography.fontWeights.regular};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: ${spacing.sm};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 122, 0, 0.3);
  }

  @media (max-width: ${breakpoints.tablet}) {
    margin-left: 0;
    width: 100%;
  }
`;

const CosmicParticles = styled.div`
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(255, 122, 0, 0.1) 0%, transparent 20%),
    radial-gradient(circle at 80% 70%, rgba(255, 122, 0, 0.05) 0%, transparent 20%);
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <CosmicParticles />
      <FooterContent>
        <FooterSection>
          <FooterLogo to="/">Aduanepa<span>fie</span></FooterLogo>
          <FooterTagline>
            Explore the universe of flavors through our cosmic collection of recipes
          </FooterTagline>
          <SocialLinks>
            <SocialLink href="#" aria-label="Instagram">
              <span>IG</span>
            </SocialLink>
            <SocialLink href="#" aria-label="Facebook">
              <span>FB</span>
            </SocialLink>
            <SocialLink href="#" aria-label="Twitter">
              <span>TW</span>
            </SocialLink>
            <SocialLink href="#" aria-label="Pinterest">
              <span>PT</span>
            </SocialLink>
          </SocialLinks>

          <Newsletter>
            <FooterHeading>Stay Updated</FooterHeading>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginBottom: spacing.sm }}>
              Subscribe for new recipes and cooking tips
            </p>
            <NewsletterForm>
              <EmailInput
                type="email"
                placeholder="Your email address"
                aria-label="Email address"
              />
              <SubscribeButton type="submit">Subscribe</SubscribeButton>
            </NewsletterForm>
          </Newsletter>
        </FooterSection>

        <FooterSection>
          <FooterHeading>Quick Links</FooterHeading>
          <FooterLinks>
            <FooterLinkItem>
              <FooterLink to="/">Home</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/recipes">Recipes</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/categories">Categories</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/discover">Discover</FooterLink>
            </FooterLinkItem>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <FooterHeading>Categories</FooterHeading>
          <FooterLinks>
            <FooterLinkItem>
              <FooterLink to="/categories/breakfast">Breakfast</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/categories/lunch">Lunch</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/categories/dinner">Dinner</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/categories/dessert">Dessert</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/categories/vegetarian">Vegetarian</FooterLink>
            </FooterLinkItem>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <FooterHeading>Resources</FooterHeading>
          <FooterLinks>
            <FooterLinkItem>
              <FooterLink to="/about">About Us</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/contact">Contact</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/blog">Blog</FooterLink>
            </FooterLinkItem>
            <FooterLinkItem>
              <FooterLink to="/faq">FAQs</FooterLink>
            </FooterLinkItem>
          </FooterLinks>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <Copyright>
          © {currentYear} Cosmeat. All rights reserved.
        </Copyright>
        <LegalLinks>
          <LegalLink to="/privacy">Privacy Policy</LegalLink>
          <LegalLink to="/terms">Terms of Service</LegalLink>
          <LegalLink to="/cookies">Cookie Policy</LegalLink>
        </LegalLinks>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
