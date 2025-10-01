import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiSearch, FiUser, FiX, FiSettings, FiHeart, FiLogOut, FiLogIn, FiUserPlus, FiHome, FiBook, FiMapPin, FiInfo, FiShield } from 'react-icons/fi';
import {
  colors,
  typography,
  shadows,
  spacing,
  breakpoints,
} from '../theme/theme';
import { kenteAccentHorizontal } from './KentePatterns';
import { useAuth } from '../contexts/AuthContext';

// Add auth context type
interface AuthUser {
  data: {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
  }
  message: string;
}

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const HeaderContainer = styled.header`
  background-color: ${colors.cosmicLatte};
  padding: ${spacing.sm} ${spacing.sm};
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: ${shadows.soft};

  @media (min-width: ${breakpoints.mobile}) {
    padding: ${spacing.md} ${spacing.lg};
  }

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.md} ${spacing.lg};
  }

  @media (min-width: ${breakpoints.desktop}) {
    padding: ${spacing.lg} ${spacing.xl};
  }
`;

const TopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${spacing.sm};

  @media (min-width: ${breakpoints.mobile}) {
    margin-bottom: ${spacing.md};
  }

  @media (min-width: ${breakpoints.tablet}) {
    margin-bottom: ${spacing.md};
  }

  @media (min-width: ${breakpoints.desktop}) {
    margin-bottom: ${spacing.lg};
  }
`;

const LogoContainer = styled.div`
  flex-shrink: 0;
`;

const Logo = styled(Link)`
  ${kenteAccentHorizontal}
  font-weight: ${typography.fontWeights.light};
  color: ${colors.deepSpace};
  font-size: 1.4rem;
  position: relative;
  display: inline-block;
  text-decoration: none;

  @media (min-width: ${breakpoints.mobile}) {
    font-size: 1.6rem;
  }

  @media (min-width: ${breakpoints.desktop}) {
    font-size: 1.75rem;
  }
`;

const Nav = styled.nav`
  display: none;

  @media (min-width: ${breakpoints.tablet}) {
    display: flex;
    align-items: center;
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: ${colors.deepSpace};
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  @media (min-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

const MobileNav = styled.nav<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${colors.cosmicLatte};
  padding: ${spacing.md};
  box-shadow: ${shadows.medium};
  z-index: 101;

  @media (min-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${colors.galaxyGrey};
  font-weight: ${typography.fontWeights.light};
  position: relative;
  transition: color 0.3s ease;
  font-size: 1.1rem;
  padding: ${spacing.sm} 0;
  text-decoration: none;

  @media (min-width: ${breakpoints.tablet}) {
    margin-left: ${spacing.xl};
    padding: 0;
    font-size: inherit;
  }

  &:hover {
    color: ${colors.emeraldGreen};

    &:after {
      transform: scaleX(1);
      opacity: 1;
    }
  }

  &:after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: ${colors.emeraldGreen};
    transform: scaleX(0);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
    transform-origin: left center;
  }
`;

// New expandable search components
const ExpandableSearchContainer = styled.div`
  flex-grow: 1;
  display: none;
  align-items: center;
  justify-content: flex-end;
  margin: 0 ${spacing.md};
  max-width: 500px;

  @media (min-width: ${breakpoints.tablet}) {
    display: flex; margin-left: auto;
  }
`;

interface ExpandableSearchProps {
  $expanded: boolean;
}

const ExpandableSearchForm = styled.form<ExpandableSearchProps>`
  display: flex;
  align-items: center;
  width: ${({ $expanded }) => ($expanded ? '100%' : '40px')};
  height: 40px;
  position: relative;
  transition: width 0.3s ease;
`;

interface SearchButtonProps {
  $isExpanded: boolean;
}

// Make sure the styled component definition is using transient props properly
const SearchButton = styled.button<SearchButtonProps>`
  background: ${({ $isExpanded }) =>
    $isExpanded ? colors.emeraldGreen : colors.white};
  color: ${({ $isExpanded }) =>
    $isExpanded ? colors.white : colors.emeraldGreen};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
  box-shadow: ${shadows.soft};
  position: absolute;
  right: 0;
  z-index: 2;

  &:hover {
    background-color: ${({ $isExpanded }) =>
      $isExpanded ? `${colors.papayaWhip}dd` : colors.emeraldGreen};
    color: ${({ $isExpanded }) =>
      $isExpanded ? colors.emeraldGreen : colors.white};
  }
`;

const ExpandableInput = styled.input<ExpandableSearchProps>`
  width: 100%;
  height: 40px;
  border-radius: 20px;
  padding: ${spacing.xs} ${spacing.md} ${spacing.xs} ${spacing.md};
  border: none;
  background-color: ${colors.white};
  font-size: 0.9rem;
  color: ${colors.deepSpace};
  box-shadow: ${shadows.soft};
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: ${({ $expanded }) => ($expanded ? '1' : '0')};
  transform: ${({ $expanded }) => ($expanded ? 'translateX(0)' : 'translateX(20px)')};
  pointer-events: ${({ $expanded }) => ($expanded ? 'all' : 'none')};

  &:focus {
    outline: none;
    box-shadow: ${shadows.medium};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;

  @media (min-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${spacing.sm} ${spacing.sm};
  padding-left: ${spacing.lg};
  border-radius: 30px;
  border: none;
  background-color: ${colors.white};
  font-size: 0.85rem;
  letter-spacing: ${typography.letterSpacing};
  color: ${colors.deepSpace};
  box-shadow: ${shadows.soft};
  transition: box-shadow 0.3s ease;
  font-family: ${typography.fontFamily};

  &:focus {
    outline: none;
    box-shadow: ${shadows.medium};
  }

  &::placeholder {
    color: ${colors.galaxyGrey}99;
    font-size: 0.8rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (min-width: ${breakpoints.mobile}) {
    padding: ${spacing.sm} ${spacing.md};
    padding-left: ${spacing.lg};
    font-size: 0.9rem;

    &::placeholder {
      font-size: 0.9rem;
    }
  }

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.md} ${spacing.lg};
    padding-left: ${spacing.xl};

    &::placeholder {
      font-size: 0.9rem;
    }
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: ${spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.galaxyGrey};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: ${breakpoints.mobile}) {
    left: ${spacing.sm};
  }

  @media (min-width: ${breakpoints.tablet}) {
    left: ${spacing.md};
    font-size: 1rem;
  }
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: ${spacing.sm};
  margin-left: ${spacing.md};
  color: ${colors.galaxyGrey};
  transition: color 0.2s ease;
  position: relative;

  &:hover {
    color: ${colors.emeraldGreen};
  }
`;

const ProfileCircle = styled.div<{ $hasImage?: boolean; $isLoggedIn?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.$hasImage ? 'transparent' : props.$isLoggedIn ? colors.emeraldGreen : colors.papayaWhip};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${shadows.soft};
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    background-color: ${props => props.$hasImage ? 'transparent' : props.$isLoggedIn ? `${colors.emeraldGreen}` : `${colors.emeraldGreen}20`};
    transform: scale(1.05);
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileInitials = styled.span`
  color: ${colors.white};
  font-size: 1rem;
  font-weight: ${typography.fontWeights.medium};
  letter-spacing: 0.5px;
`;

const ProfileMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 220px;
  background-color: ${colors.white};
  box-shadow: ${shadows.medium};
  border-radius: 12px;
  padding: ${spacing.sm};
  z-index: 200;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  margin-top: ${spacing.sm};
  opacity: 1;
  visibility: visible;
  overflow: hidden;
`;

const ProfileHeader = styled.div`
  border-bottom: 1px solid ${colors.antiqueWhite};
  padding: ${spacing.sm} ${spacing.md};
  margin-bottom: ${spacing.xs};
`;

const ProfileName = styled.div`
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.xs};
  font-size: 0.95rem;
`;

const ProfileEmail = styled.div`
  color: ${colors.galaxyGrey};
  font-size: 0.8rem;
  margin-bottom: ${spacing.xs};
`;

const ProfileMenuItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: ${spacing.sm} ${spacing.md};
  color: ${colors.deepSpace};
  text-decoration: none;
  font-size: 0.9rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  margin: ${spacing.xs} 0;
  font-weight: ${typography.fontWeights.light};

  svg {
    margin-right: ${spacing.sm};
    color: ${colors.galaxyGrey};
    font-size: 1rem;
    transition: color 0.2s ease, transform 0.3s ease;
  }

  &:hover {
    background-color: rgba(245, 245, 245, 0.7);
    color: ${colors.emeraldGreen};

    svg {
      color: ${colors.emeraldGreen};
      transform: translateX(2px);
    }
  }
`;

const PrivacyLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: ${spacing.sm} ${spacing.md};
  color: ${colors.deepSpace};
  text-decoration: none;
  font-size: 0.9rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  margin-top: ${spacing.xs};
  font-weight: ${typography.fontWeights.medium};
  background-color: ${colors.antiqueWhite}40;

  svg {
    margin-right: ${spacing.sm};
    color: ${colors.emeraldGreen};
    font-size: 1.1rem;
    transition: color 0.2s ease, transform 0.3s ease;
  }

  &:hover {
    background-color: ${colors.antiqueWhite}80;
    color: ${colors.emeraldGreen};

    svg {
      transform: translateX(2px);
    }
  }
`;

const LogoutButton = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing.sm} ${spacing.md};
  color: ${colors.deepSpace};
  text-decoration: none;
  font-size: 0.9rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  margin: ${spacing.xs} 0;

  svg {
    margin-right: ${spacing.sm};
    color: ${colors.galaxyGrey};
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  &:hover {
    background-color: rgba(245, 245, 245, 0.7);
    color: ${colors.darkPastelRed};

    svg {
      color: ${colors.darkPastelRed};
      transform: translateX(2px);
    }
  }
`;

const MenuDivider = styled.div<{ position?: 'last' }>`
  height: 1px;
  background-color: ${colors.antiqueWhite};
  margin-block: ${(props) => props.position === 'last' ? '0px' : spacing.xxl} ${spacing.sm};
  opacity: 0.6;
`;

const MobileProfileLink = styled(NavLink)`
  display: flex;
  align-items: center;

  svg {
    margin-right: ${spacing.xs};
  }
`;

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim() !== '') {
      onSearch(searchQuery);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);

    // Focus the input when expanded
    if (!isSearchExpanded) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
  };

  const handleProfileClick = () => {
    // Always toggle the dropdown menu regardless of user login status
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getProfileDisplay = () => {
    const loggedInUser = currentUser?.data || currentUser || {};

    if (loggedInUser?.name) {
      const initials = loggedInUser.name
        .split(' ')
        .map((part: string) => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
      return <ProfileInitials>{initials}</ProfileInitials>;
    } else {
      return <FiUser size={18} />;
    }
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isProfileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSearchExpanded &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        // Check if we're clicking on the search button itself
        const target = event.target as Element;
        if (!target.closest('button') || !target.closest('button')?.contains(FiSearch as unknown as Node)) {
          setIsSearchExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchExpanded]);

  return (
    <HeaderContainer>
      <TopSection>
        <LogoContainer>
          <Logo to='/'>Aduanepafie</Logo>
        </LogoContainer>

        <ExpandableSearchContainer>
          <ExpandableSearchForm onSubmit={handleSearch} $expanded={isSearchExpanded}>
            <ExpandableInput
              ref={searchInputRef}
              type="text"
              placeholder="Search recipes, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              $expanded={isSearchExpanded}
            />
            <SearchButton
              type={isSearchExpanded ? "submit" : "button"}
              onClick={isSearchExpanded ? undefined : toggleSearch}
              aria-label={isSearchExpanded ? "Submit search" : "Open search"}
              $isExpanded={isSearchExpanded}
            >
              {isSearchExpanded ? <FiSearch size={18} /> : <FiSearch size={18} />}
            </SearchButton>
          </ExpandableSearchForm>
        </ExpandableSearchContainer>

        <Nav>
          <NavLink to='/'>Home</NavLink>
          <NavLink to='/recipes'>Recipes</NavLink>
          <NavLink to='/ingredients'>Ingredients</NavLink>
          <NavLink to='/regions'>Regions</NavLink>
          <NavLink to='/about'>About</NavLink>

          <ProfileButton onClick={handleProfileClick}>
            <ProfileCircle $hasImage={false} $isLoggedIn={!!currentUser}>
              {getProfileDisplay()}
            </ProfileCircle>
            {isProfileMenuOpen && (
              <ProfileMenu $isOpen={isProfileMenuOpen} ref={profileMenuRef}>
                {currentUser ? (
                  <>
                    <ProfileHeader>
                      <ProfileName>{currentUser.name}</ProfileName>
                      <ProfileEmail>{currentUser.email}</ProfileEmail>
                    </ProfileHeader>
                    <ProfileMenuItem to="/profile">
                      <FiUser size={16} />
                      My Profile
                    </ProfileMenuItem>
                    <ProfileMenuItem to="/profile/favorites">
                      <FiHeart size={16} />
                      Saved Recipes
                    </ProfileMenuItem>
                    <ProfileMenuItem to="/profile/settings">
                      <FiSettings size={16} />
                      Account Settings
                    </ProfileMenuItem>
                    <MenuDivider />
                    <LogoutButton onClick={handleLogout} tabIndex={0} role="button" aria-label="Logout">
                      <FiLogOut size={16} />
                      Logout
                    </LogoutButton>
                  </>
                ) : (
                  <>
                    <ProfileMenuItem to="/auth/login">
                      <FiLogIn size={16} />
                      Login
                    </ProfileMenuItem>
                    <ProfileMenuItem to="/auth/signup">
                      <FiUserPlus size={16} />
                      Sign Up
                    </ProfileMenuItem>
                    <ProfileMenuItem to="/profile">
                      <FiUser size={16} />
                      Profile
                    </ProfileMenuItem>
                    <ProfileMenuItem to="/profile/settings">
                      <FiSettings size={16} />
                      Settings
                    </ProfileMenuItem>
                  </>
                )}
                <MenuDivider position={currentUser ? 'last' : undefined}/>
                <PrivacyLink to="/privacy-policy">
                  <FiShield size={16} />
                  Privacy Policy
                </PrivacyLink>
              </ProfileMenu>
            )}
          </ProfileButton>
        </Nav>
        <MobileMenuButton
          onClick={toggleMenu}
          aria-label='Toggle menu'>
          {isMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>
      </TopSection>

      <MobileNav $isOpen={isMenuOpen}>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/recipes'>Recipes</NavLink>
        <NavLink to='/ingredients'>Ingredients</NavLink>
        <NavLink to='/regions'>Regions</NavLink>
        <NavLink to='/about'>About</NavLink>
        <MobileProfileLink to={currentUser ? '/profile' : '/auth/login'}>
          <FiUser size={16} />
          {currentUser ? 'My Profile' : 'Login / Sign Up'}
        </MobileProfileLink>
      </MobileNav>

      {/* Mobile search stays at the bottom for smaller screens */}
      <form onSubmit={handleSearch}>
        <SearchContainer>
          <SearchIcon>
            <FiSearch size={16} />
          </SearchIcon>
          <SearchInput
            type='text'
            placeholder='Search for recipes, ingredients, or regional cuisine...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
      </form>
    </HeaderContainer>
  );
};

export default Header;
