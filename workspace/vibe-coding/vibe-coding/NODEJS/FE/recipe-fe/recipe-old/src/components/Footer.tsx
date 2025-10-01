import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  colors,
  typography,
  spacing,
  breakpoints,
  shadows,
} from '../theme/theme';
import { kenteAccentHorizontal, kenteBackground } from './KentePatterns';

const FooterWrapper = styled.div`
  position: relative;
  width: 100%;
  z-index: 1;
  margin-top: ${spacing.xxl};
  background-color: ${colors.deepSpace};
  color: ${colors.white};
`;

const FooterContainer = styled.footer`
  color: ${colors.antiqueWhite};
  padding: ${spacing.xl} ${spacing.md};
  position: relative;
  overflow: hidden;
  width: 100%;
  height: auto;

  @media (min-width: ${breakpoints.mobile}) {
    padding: ${spacing.xl} ${spacing.lg};
  }

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.xxl} ${spacing.xl};
  }
`;

const FooterBackgroundPattern = styled.div`
  ${kenteBackground}
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.03;
  z-index: 0;
`;

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.xl};

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: 1.5fr 1fr 1fr;
    gap: ${spacing.lg};
  }

  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: ${spacing.xl};
  }
`;

const FooterBranding = styled.div`
  margin-bottom: ${spacing.lg};
`;

const FooterLogo = styled(Link)`
  color: ${colors.white};
  font-weight: ${typography.fontWeights.light};
  font-size: 1.75rem;
  margin-bottom: ${spacing.sm};
  position: relative;
  display: inline-block;
  ${kenteAccentHorizontal}
  text-decoration: none;
`;

const FooterTagline = styled.p`
  font-size: 0.9rem;
  margin-top: ${spacing.md};
  max-width: 90%;
  font-weight: ${typography.fontWeights.light};
  line-height: 1.5;
  color: ${colors.antiqueWhite};

  @media (min-width: ${breakpoints.tablet}) {
    max-width: 80%;
  }
`;

const FooterColumnTitle = styled.h3`
  color: ${colors.white};
  font-size: 1rem;
  font-weight: ${typography.fontWeights.regular};
  margin-bottom: ${spacing.md};
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 30px;
    height: 2px;
    background-color: ${colors.maximumYellow};
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLink = styled.li`
  margin-bottom: ${spacing.sm};
`;

const FooterLinkStyled = styled(Link)`
  color: ${colors.antiqueWhite};
  font-size: 0.9rem;
  font-weight: ${typography.fontWeights.light};
  transition: color 0.2s ease;
  position: relative;
  padding-left: ${spacing.sm};
  text-decoration: none;
  display: block;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background-color: ${colors.darkPastelRed};
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }

  &:hover {
    color: ${colors.maximumYellow};

    &:before {
      opacity: 1;
    }
  }
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
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: ${colors.white};
  box-shadow: ${shadows.soft};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.medium};
    color: ${colors.maximumYellow};
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const FooterBottom = styled.div`
  margin-top: ${spacing.xl};
  padding-top: ${spacing.md};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
`;

const Copyright = styled.p`
  font-size: 0.8rem;
  color: ${colors.antiqueWhite};
  opacity: 0.8;
  margin-bottom: ${spacing.sm};

  @media (min-width: ${breakpoints.tablet}) {
    margin-bottom: 0;
  }
`;

const FooterBottomLinks = styled.div`
  display: flex;
  gap: ${spacing.md};
`;

const FooterBottomLink = styled(Link)`
  font-size: 0.8rem;
  color: ${colors.antiqueWhite};
  opacity: 0.8;
  text-decoration: none;

  &:hover {
    color: ${colors.maximumYellow};
    opacity: 1;
  }
`;

const ResourcesColumn = styled.div`
  display: none;

  @media (min-width: ${breakpoints.desktop}) {
    display: block;
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterBackgroundPattern />
        <FooterContent>
          <FooterGrid>
            <div>
              <FooterBranding>
                <FooterLogo to='/'>Aduanepafie</FooterLogo>
                <FooterTagline>
                  Celebrating Ghana's culinary heritage with authentic recipes.
                  "Aduane" (food) + "fie" (home) - Your home of delicious
                  Ghanaian cuisine.
                </FooterTagline>
              </FooterBranding>
              <SocialLinks>
                <SocialLink
                  href='#'
                  aria-label='Facebook'>
                  <svg
                    width='18'
                    height='18'
                    viewBox='0 0 24 24'
                    fill='currentColor'>
                    <path d='M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' />
                  </svg>
                </SocialLink>
                <SocialLink
                  href='#'
                  aria-label='Instagram'>
                  <svg
                    width='18'
                    height='18'
                    viewBox='0 0 24 24'
                    fill='currentColor'>
                    <rect
                      x='2'
                      y='2'
                      width='20'
                      height='20'
                      rx='5'
                      ry='5'
                    />
                    <path d='M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z' />
                    <line
                      x1='17.5'
                      y1='6.5'
                      x2='17.51'
                      y2='6.5'
                    />
                  </svg>
                </SocialLink>
                <SocialLink
                  href='#'
                  aria-label='Twitter'>
                  <svg
                    width='18'
                    height='18'
                    viewBox='0 0 24 24'
                    fill='currentColor'>
                    <path d='M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' />
                  </svg>
                </SocialLink>
                <SocialLink
                  href='#'
                  aria-label='YouTube'>
                  <svg
                    width='18'
                    height='18'
                    viewBox='0 0 24 24'
                    fill='currentColor'>
                    <path d='M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z' />
                    <polygon points='9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02' />
                  </svg>
                </SocialLink>
              </SocialLinks>
            </div>

            <div>
              <FooterColumnTitle>Explore</FooterColumnTitle>
              <FooterLinks>
                <FooterLink>
                  <FooterLinkStyled to='/recipes'>Recipes</FooterLinkStyled>
                </FooterLink>
                <FooterLink>
                  <FooterLinkStyled to='/regional-cuisines'>
                    Regional Cuisines
                  </FooterLinkStyled>
                </FooterLink>
                <FooterLink>
                  <FooterLinkStyled to='/seasonal-dishes'>
                    Seasonal Dishes
                  </FooterLinkStyled>
                </FooterLink>
                <FooterLink>
                  <FooterLinkStyled to='/special-occasions'>
                    Special Occasions
                  </FooterLinkStyled>
                </FooterLink>
                <FooterLink>
                  <FooterLinkStyled to='/featured-chefs'>
                    Featured Chefs
                  </FooterLinkStyled>
                </FooterLink>
              </FooterLinks>
            </div>

            <div>
              <FooterColumnTitle>About Us</FooterColumnTitle>
              <FooterLinks>
                <FooterLink>
                  <FooterLinkStyled to='/our-story'>Our Story</FooterLinkStyled>
                </FooterLink>
                <FooterLink>
                  <FooterLinkStyled to='/our-team'>Our Team</FooterLinkStyled>
                </FooterLink>
                <FooterLink>
                  <FooterLinkStyled to='/testimonials'>
                    Testimonials
                  </FooterLinkStyled>
                </FooterLink>
                <FooterLink>
                  <FooterLinkStyled to='/careers'>Careers</FooterLinkStyled>
                </FooterLink>
                <FooterLink>
                  <FooterLinkStyled to='/contact'>Contact Us</FooterLinkStyled>
                </FooterLink>
              </FooterLinks>
            </div>

            <ResourcesColumn>
              <FooterColumnTitle>Resources</FooterColumnTitle>
              <FooterLinks>
                <FooterLink>
                  <FooterLinkStyled to='/cooking-tips'>
                    Cooking Tips
                  </FooterLinkStyled>
                </FooterLink>
                <FooterLink>
                  <FooterLinkStyled to='/ingredient-guide'>
                    Ingredient Guide
                  </FooterLinkStyled>
                </FooterLink>
                <FooterLink>
                  <FooterLinkStyled to='/kitchen-tools'>
                    Kitchen Tools
                  </FooterLinkStyled>
                </FooterLink>
                <FooterLink>
                  <FooterLinkStyled to='/blog'>Blog</FooterLinkStyled>
                </FooterLink>
                <FooterLink>
                  <FooterLinkStyled to='/faq'>FAQ</FooterLinkStyled>
                </FooterLink>
              </FooterLinks>
            </ResourcesColumn>
          </FooterGrid>

          <FooterBottom>
            <Copyright>
              © {new Date().getFullYear()} Aduanefie. All rights reserved.
            </Copyright>
            <FooterBottomLinks>
              <FooterBottomLink to='/privacy-policy'>
                Privacy Policy
              </FooterBottomLink>
              <FooterBottomLink to='/terms-of-service'>
                Terms of Service
              </FooterBottomLink>
              <FooterBottomLink to='/cookie-policy'>
                Cookie Policy
              </FooterBottomLink>
            </FooterBottomLinks>
          </FooterBottom>
        </FooterContent>
      </FooterContainer>
    </FooterWrapper>
  );
};

export default Footer;
