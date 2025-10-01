import React, { useState } from 'react';
import styled from 'styled-components';
import { FiEdit, FiUser, FiSave, FiX, FiHeart, FiBookmark, FiSettings } from 'react-icons/fi';
import {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  breakpoints,
} from '../../theme/theme';
import Button from '../../components/Button';
import { kenteAccentHorizontal } from '../../components/KentePatterns';

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing.xl} ${spacing.md};

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.xl};
  }
`;

const ProfileTitle = styled.h1`
  ${kenteAccentHorizontal}
  font-weight: ${typography.fontWeights.light};
  font-size: 2rem;
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.xl};
  position: relative;
  display: inline-block;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.lg};

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: 300px 1fr;
  }
`;

const ProfileSidebar = styled.div`
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
  padding: ${spacing.lg};
  height: auto;
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: ${colors.papayaWhip};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${spacing.lg};
  font-size: 3rem;
  color: ${colors.emeraldGreen};
  border: 3px solid ${colors.antiqueWhite};
  box-shadow: ${shadows.soft};
  position: relative;
  overflow: hidden;
`;

const AvatarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

const AvatarEditIcon = styled.div`
  color: ${colors.white};
  font-size: 1.5rem;
`;

const ProfileName = styled.h2`
  text-align: center;
  font-weight: ${typography.fontWeights.medium};
  font-size: 1.5rem;
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.sm};
`;

const ProfileUsername = styled.p`
  text-align: center;
  font-size: 1rem;
  color: ${colors.galaxyGrey};
  margin-bottom: ${spacing.lg};
`;

const ProfileNavList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ProfileNavItem = styled.li<{ $active?: boolean }>`
  margin-bottom: ${spacing.sm};

  a, button {
    display: flex;
    align-items: center;
    padding: ${spacing.sm} ${spacing.md};
    border-radius: ${borderRadius.md};
    text-decoration: none;
    color: ${props => props.$active ? colors.emeraldGreen : colors.galaxyGrey};
    background-color: ${props => props.$active ? `${colors.emeraldGreen}10` : 'transparent'};
    border: none;
    width: 100%;
    text-align: left;
    font-size: 1rem;
    font-family: ${typography.fontFamily};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: ${colors.antiqueWhite};
      color: ${colors.emeraldGreen};
    }

    svg {
      margin-right: ${spacing.sm};
    }
  }
`;

const ProfileContent = styled.div`
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.soft};
  padding: ${spacing.xl};
`;

const ProfileSection = styled.div`
  margin-bottom: ${spacing.xl};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-weight: ${typography.fontWeights.medium};
  font-size: 1.25rem;
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProfileForm = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.md};

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${spacing.md};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${spacing.xs};
  color: ${colors.galaxyGrey};
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: ${spacing.sm};
  border: 1px solid ${colors.antiqueWhite};
  border-radius: ${borderRadius.md};
  font-family: ${typography.fontFamily};
  font-size: 1rem;
  color: ${colors.deepSpace};
  background-color: ${colors.white};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.emeraldGreen};
    box-shadow: 0 0 0 2px ${colors.emeraldGreen}20;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${spacing.sm};
  border: 1px solid ${colors.antiqueWhite};
  border-radius: ${borderRadius.md};
  font-family: ${typography.fontFamily};
  font-size: 1rem;
  color: ${colors.deepSpace};
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${colors.emeraldGreen};
    box-shadow: 0 0 0 2px ${colors.emeraldGreen}20;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.md};
  grid-column: 1 / -1;
  margin-top: ${spacing.md};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing.md};

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatItem = styled.div`
  background-color: ${colors.cosmicLatte}30;
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.emeraldGreen};
  margin-bottom: ${spacing.xs};
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${colors.galaxyGrey};
`;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: 'Kofi',
    lastName: 'Mensah',
    username: 'kofim',
    email: 'kofi.mensah@example.com',
    location: 'Accra, Ghana',
    bio: 'Food enthusiast and home chef. I love exploring traditional Ghanaian recipes and giving them modern twists.',
    favoriteRecipes: 24,
    savedRecipes: 42,
    createdRecipes: 8,
    followingChefs: 15,
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the profile to the backend
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserProfile({
      ...userProfile,
      [name]: value
    });
  };

  const renderProfileContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <>
            <ProfileSection>
              <SectionTitle>
                User Statistics
              </SectionTitle>
              <StatsGrid>
                <StatItem>
                  <StatValue>{userProfile.favoriteRecipes}</StatValue>
                  <StatLabel>Favorite Recipes</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{userProfile.savedRecipes}</StatValue>
                  <StatLabel>Saved Recipes</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{userProfile.createdRecipes}</StatValue>
                  <StatLabel>Created Recipes</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{userProfile.followingChefs}</StatValue>
                  <StatLabel>Following Chefs</StatLabel>
                </StatItem>
              </StatsGrid>
            </ProfileSection>

            <ProfileSection>
              <SectionTitle>
                Personal Information
                <Button
                  small
                  onClick={handleEditToggle}
                >
                  {isEditing ? (
                    <>
                      <FiX size={16} style={{ marginRight: spacing.xs }} />
                      Cancel
                    </>
                  ) : (
                    <>
                      <FiEdit size={16} style={{ marginRight: spacing.xs }} />
                      Edit Profile
                    </>
                  )}
                </Button>
              </SectionTitle>

              {isEditing ? (
                <ProfileForm onSubmit={handleSaveProfile}>
                  <FormGroup>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={userProfile.firstName}
                      onChange={handleInputChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={userProfile.lastName}
                      onChange={handleInputChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      type="text"
                      id="username"
                      name="username"
                      value={userProfile.username}
                      onChange={handleInputChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={userProfile.email}
                      onChange={handleInputChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      type="text"
                      id="location"
                      name="location"
                      value={userProfile.location}
                      onChange={handleInputChange}
                    />
                  </FormGroup>

                  <FormGroup style={{ gridColumn: '1 / -1' }}>
                    <Label htmlFor="bio">Bio</Label>
                    <TextArea
                      id="bio"
                      name="bio"
                      value={userProfile.bio}
                      onChange={handleInputChange}
                    />
                  </FormGroup>

                  <FormActions>
                    <Button
                      outlined
                      onClick={() => setIsEditing(false)}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      <FiSave size={16} style={{ marginRight: spacing.xs }} />
                      Save Changes
                    </Button>
                  </FormActions>
                </ProfileForm>
              ) : (
                <div>
                  <FormGroup>
                    <Label>Full Name</Label>
                    <div style={{ fontSize: '1rem', color: colors.deepSpace }}>
                      {userProfile.firstName} {userProfile.lastName}
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <Label>Username</Label>
                    <div style={{ fontSize: '1rem', color: colors.deepSpace }}>
                      {userProfile.username}
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <Label>Email</Label>
                    <div style={{ fontSize: '1rem', color: colors.deepSpace }}>
                      {userProfile.email}
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <Label>Location</Label>
                    <div style={{ fontSize: '1rem', color: colors.deepSpace }}>
                      {userProfile.location}
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <Label>Bio</Label>
                    <div style={{ fontSize: '1rem', color: colors.deepSpace, lineHeight: '1.6' }}>
                      {userProfile.bio}
                    </div>
                  </FormGroup>
                </div>
              )}
            </ProfileSection>
          </>
        );
      case 'favorites':
        return (
          <ProfileSection>
            <SectionTitle>Favorite Recipes</SectionTitle>
            <p>Your favorite recipes will appear here.</p>
          </ProfileSection>
        );
      case 'saved':
        return (
          <ProfileSection>
            <SectionTitle>Saved Recipes</SectionTitle>
            <p>Your saved recipes will appear here.</p>
          </ProfileSection>
        );
      case 'settings':
        return (
          <ProfileSection>
            <SectionTitle>Account Settings</SectionTitle>
            <p>Account settings will appear here.</p>
          </ProfileSection>
        );
      default:
        return (
          <ProfileSection>
            <SectionTitle>Profile</SectionTitle>
            <p>Profile content will appear here.</p>
          </ProfileSection>
        );
    }
  };

  return (
    <ProfileContainer>
      <ProfileTitle>My Profile</ProfileTitle>

      <ProfileGrid>
        <ProfileSidebar>
          <ProfileAvatar>
            {userProfile.firstName.charAt(0) + userProfile.lastName.charAt(0)}
            <AvatarOverlay>
              <AvatarEditIcon>
                <FiEdit />
              </AvatarEditIcon>
            </AvatarOverlay>
          </ProfileAvatar>

          <ProfileName>{userProfile.firstName} {userProfile.lastName}</ProfileName>
          <ProfileUsername>@{userProfile.username}</ProfileUsername>

          <ProfileNavList>
            <ProfileNavItem $active={activeTab === 'profile'}>
              <button onClick={() => setActiveTab('profile')}>
                <FiUser size={18} />
                Profile
              </button>
            </ProfileNavItem>
            <ProfileNavItem $active={activeTab === 'favorites'}>
              <button onClick={() => setActiveTab('favorites')}>
                <FiHeart size={18} />
                Favorites
              </button>
            </ProfileNavItem>
            <ProfileNavItem $active={activeTab === 'saved'}>
              <button onClick={() => setActiveTab('saved')}>
                <FiBookmark size={18} />
                Saved Recipes
              </button>
            </ProfileNavItem>
            <ProfileNavItem $active={activeTab === 'settings'}>
              <button onClick={() => setActiveTab('settings')}>
                <FiSettings size={18} />
                Settings
              </button>
            </ProfileNavItem>
          </ProfileNavList>
        </ProfileSidebar>

        <ProfileContent>
          {renderProfileContent()}
        </ProfileContent>
      </ProfileGrid>
    </ProfileContainer>
  );
};

export default ProfilePage;