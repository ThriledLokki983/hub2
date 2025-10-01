import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { colors, spacing, transitions, breakpoints, borderRadius } from '../../theme/theme';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiHome,
  FiBook,
  FiCompass,
  FiGrid,
  FiSearch,
  FiUser,
  FiHeart,
  FiBookmark,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiUserPlus,
  FiLogIn,
  FiChevronDown
} from 'react-icons/fi';

interface NavLinkProps {
  active?: boolean;
}

interface SearchContainerProps {
  $expanded: boolean;
}

const HeaderContainer = styled.header`
  background-color: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: ${spacing.md} ${spacing.lg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  max-width: 1440px;
  margin: 0 auto;
  gap: ${spacing.md};
  justify-content: space-between;
`;

const Logo = styled(Link)`
  color: ${colors.white};
  text-decoration: none;
  font-weight: 200;
  font-size: 1.8rem;
  letter-spacing: -0.05em;
  transition: ${transitions.normal};
  margin-right: ${spacing.xl};

  span {
    color: ${colors.primaryOrange};
  }

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: ${breakpoints.tablet}) {
    margin-right: 0;
  }
`;

const Nav = styled.nav<{ $mobileOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: ${spacing.xl};

  @media (max-width: ${breakpoints.tablet}) {
    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    height: 100vh;
    background: ${colors.midBackground};
    padding: ${spacing.xl};
    transform: ${props => props.$mobileOpen ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: ${spacing.xl};
    box-shadow: ${props => props.$mobileOpen ? '-5px 0 25px rgba(0, 0, 0, 0.3)' : 'none'};
    z-index: 200;
    overflow-y: auto;
    margin-left: 0;
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  gap: ${spacing.sm};
  margin: 0;
  padding: 0;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    margin-top: ${spacing.xl};
    width: 100%;
  }
`;

const NavItem = styled.li`
  // Make sure there's enough space between items
`;

const NavLink = styled(Link)<NavLinkProps>`
  color: ${props => props.active ? colors.primaryOrange : colors.white};
  text-decoration: none;
  font-weight: 300;
  position: relative;
  letter-spacing: -0.03em;
  transition: ${transitions.normal};
  display: flex;
  align-items: center;
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.md};

  svg {
    margin-right: ${spacing.xs};
    opacity: 0.8;
    transition: ${transitions.normal};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${colors.primaryOrange};
    transform: scaleX(${props => props.active ? 1 : 0});
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover {
    color: ${colors.primaryOrange};
    background: rgba(255, 255, 255, 0.05);

    &::after {
      transform: scaleX(1);
    }

    svg {
      opacity: 1;
      transform: translateY(-1px);
    }
  }

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 1.1rem;
    width: 100%;
  }
`;

const SearchContainer = styled.div<SearchContainerProps>`
  position: relative;
  max-width: ${props => props.$expanded ? '600px' : '40px'};
  width: ${props => props.$expanded ? '100%' : '40px'};
  height: 40px;
  flex-grow: ${props => props.$expanded ? 0.5 : 0};
  margin-right: auto;
  margin-left: ${spacing.xl};
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  overflow: hidden;
  border-radius: ${props => props.$expanded ? borderRadius.md : '50%'};

  @media (max-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

const SearchButton = styled.button<SearchContainerProps>`
  position: absolute;
  left: 0;
  top: 0;
  background: none;
  border: ${props => props.$expanded ? 'none' : `1px solid ${colors.secondaryOrange}`};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  z-index: 2;
  border-radius: 50%;
  transition: ${transitions.normal};

  &:hover {
    color: ${colors.primaryOrange};
    background-color: rgba(255, 255, 255, 0.05);
  }

  > svg {
    stroke: ${colors.primaryOrange};
  }
`;

const SearchInput = styled.input`
  position: absolute;
  width: 100%;
  min-height: 100% !important;
  height: 2.5rem !important;
  background-color: rgba(46, 46, 46, 0.5) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${borderRadius.round} !important;
  padding: ${spacing.sm} ${spacing.sm} ${spacing.sm} 40px !important;
  color: ${colors.white};
  font-size: 0.9rem;
  transition: ${transitions.normal};

  &:focus {
    outline: none;
    border-color: ${colors.primaryOrange};
    box-shadow: 0 0 0 2px rgba(255, 122, 0, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const ProfileSection = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  cursor: pointer;
  color: ${colors.white};
  font-weight: 300;
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.md};
  transition: ${transitions.normal};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${colors.primaryOrange};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  overflow: hidden;
  color: ${colors.white};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + ${spacing.sm});
  right: 0;
  background: ${colors.midBackground};
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: ${borderRadius.md};
  width: 220px;
  padding: ${spacing.md};
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  opacity: ${props => props.$isOpen ? 1 : 0};
  pointer-events: ${props => props.$isOpen ? 'all' : 'none'};
  transition: all 0.2s ease;
  z-index: 100;
`;

const UserInfo = styled.div`
  padding-bottom: ${spacing.md};
  margin-bottom: ${spacing.md};
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const UserName = styled.div`
  font-weight: 400;
  color: ${colors.white};
  margin-bottom: 4px;
`;

const UserEmail = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
`;

const MenuLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: ${spacing.xs} ${spacing.sm};
  color: ${colors.white};
  text-decoration: none;
  font-weight: 300;
  border-radius: ${borderRadius.sm};
  margin-bottom: ${spacing.xs};
  transition: ${transitions.normal};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  svg {
    margin-right: ${spacing.sm};
    opacity: 0.8;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: ${spacing.xs} ${spacing.sm};
  color: ${colors.error};
  font-size: 1rem;
  font-weight: 300;
  cursor: pointer;
  border-radius: ${borderRadius.sm};
  margin-top: ${spacing.sm};
  transition: ${transitions.normal};

  &:hover {
    background: rgba(255, 82, 82, 0.1);
  }

  svg {
    margin-right: ${spacing.sm};
    opacity: 0.8;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.05);
  margin: ${spacing.sm} 0;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${colors.white};
  padding: ${spacing.xs};
  cursor: pointer;
  font-size: 1.5rem;
  z-index: 300;

  @media (max-width: ${breakpoints.tablet}) {
    display: block;
  }
`;

const MobileMenuOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 150;
  opacity: ${props => props.$isOpen ? 1 : 0};
  pointer-events: ${props => props.$isOpen ? 'all' : 'none'};
  transition: opacity 0.3s ease;
`;

const MobileClose = styled.button`
  position: absolute;
  top: ${spacing.md};
  right: ${spacing.md};
  background: none;
  border: none;
  color: ${colors.white};
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 250;
`;

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileMenuOpen &&
        profileDropdownRef.current &&
        profileButtonRef.current &&
        !profileDropdownRef.current.contains(e.target as Node) &&
        !profileButtonRef.current.contains(e.target as Node)
      ) {
        setProfileMenuOpen(false);
      }

      // Close search when clicking outside
      if (
        searchExpanded &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node) &&
        !(e.target as Element).closest('.search-container')
      ) {
        setSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen, searchExpanded]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Focus search input when expanded
  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  const handleToggleSearch = () => {
    setSearchExpanded(!searchExpanded);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setProfileMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleProfileMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProfileMenuOpen(!profileMenuOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      ? name
          .split(' ')
          .map(word => word[0]?.toUpperCase())
          .slice(0, 2)
          .join('')
      : 'U';
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">Aduanepa<span>fie</span></Logo>

        <MobileMenuButton onClick={toggleMobileMenu}>
          <FiMenu size={24} />
        </MobileMenuButton>

        <SearchContainer $expanded={searchExpanded} className="search-container">
          <SearchButton $expanded={searchExpanded} onClick={handleToggleSearch}>
            <FiSearch size={18} />
          </SearchButton>
          <SearchInput
            ref={searchInputRef}
            type="text"
            placeholder="Search for recipes..."
          />
        </SearchContainer>

        <MobileMenuOverlay $isOpen={mobileMenuOpen} onClick={closeMobileMenu} />

        <Nav $mobileOpen={mobileMenuOpen}>
          {mobileMenuOpen && (
            <MobileClose onClick={closeMobileMenu}>
              <FiX size={24} />
            </MobileClose>
          )}

          <NavList>
            <NavItem>
              <NavLink to="/">
                <FiHome size={18} />
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/recipes">
                <FiBook size={18} />
                Recipes
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/categories">
                <FiGrid size={18} />
                Categories
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/discover">
                <FiCompass size={18} />
                Discover
              </NavLink>
            </NavItem>
          </NavList>

          <ProfileSection>
            <ProfileButton
              onClick={toggleProfileMenu}
              ref={profileButtonRef}
            >
              <UserAvatar>
                {currentUser && currentUser.profilePicture ? (
                  <img src={currentUser.profilePicture} alt={currentUser.name} />
                ) : (
                  currentUser ? getInitials(currentUser.name) : <FiUser size={16} />
                )}
              </UserAvatar>
              <FiChevronDown size={16} style={{ marginLeft: spacing.xs }} />
            </ProfileButton>

            <ProfileDropdown
              $isOpen={profileMenuOpen}
              onClick={(e) => e.stopPropagation()}
              ref={profileDropdownRef}
            >
              {currentUser ? (
                <>
                  <UserInfo>
                    <UserName>{currentUser.name}</UserName>
                    <UserEmail>{currentUser.email}</UserEmail>
                  </UserInfo>

                  <MenuLink to="/profile">
                    <FiUser size={16} />
                    My Profile
                  </MenuLink>
                  <MenuLink to="/favorites">
                    <FiHeart size={16} />
                    Saved Recipes
                  </MenuLink>
                  <MenuLink to="/my-recipes">
                    <FiBookmark size={16} />
                    My Recipes
                  </MenuLink>
                  <MenuLink to="/settings">
                    <FiSettings size={16} />
                    Settings
                  </MenuLink>

                  <Divider />

                  <LogoutButton onClick={handleLogout}>
                    <FiLogOut size={16} />
                    Sign Out
                  </LogoutButton>
                </>
              ) : (
                <>
                  <MenuLink to="/login">
                    <FiLogIn size={16} />
                    Sign In
                  </MenuLink>
                  <MenuLink to="/signup">
                    <FiUserPlus size={16} />
                    Create Account
                  </MenuLink>
                </>
              )}
            </ProfileDropdown>
          </ProfileSection>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
