import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSave, FiUserCheck, FiLock, FiMail, FiBell, FiHelpCircle, FiTrash2 } from 'react-icons/fi';
import { colors, typography, spacing, shadows, borderRadius } from '../../theme/theme';

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Mock user data - in a real app, this would come from context or state
  const [userData, setUserData] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatar: '',
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Save settings logic would go here
    alert('Settings saved successfully!');
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <SettingsForm onSubmit={handleSaveSettings}>
            <SettingGroup>
              <SettingLabel>Profile Photo</SettingLabel>
              <AvatarContainer>
                <Avatar>
                  {userData.avatar ? <img src={userData.avatar} alt="Profile" /> :
                    <AvatarPlaceholder>{userData.name.charAt(0)}</AvatarPlaceholder>
                  }
                </Avatar>
                <AvatarActions>
                  <Button type="button">Upload Photo</Button>
                  <TextButton type="button">Remove</TextButton>
                </AvatarActions>
              </AvatarContainer>
            </SettingGroup>

            <SettingGroup>
              <SettingLabel htmlFor="name">Full Name</SettingLabel>
              <Input
                id="name"
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({...userData, name: e.target.value})}
              />
            </SettingGroup>

            <SettingGroup>
              <SettingLabel htmlFor="email">Email Address</SettingLabel>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({...userData, email: e.target.value})}
              />
              <FieldHint>This email will be used for account notifications.</FieldHint>
            </SettingGroup>

            <ButtonContainer>
              <SubmitButton type="submit">
                <FiSave /> Save Changes
              </SubmitButton>
            </ButtonContainer>
          </SettingsForm>
        );
      case 'security':
        return (
          <SettingsForm onSubmit={handleSaveSettings}>
            <SettingGroup>
              <SettingLabel htmlFor="current-password">Current Password</SettingLabel>
              <Input
                id="current-password"
                type="password"
                placeholder="Enter your current password"
              />
            </SettingGroup>

            <SettingGroup>
              <SettingLabel htmlFor="new-password">New Password</SettingLabel>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
              />
              <FieldHint>Password must be at least 8 characters.</FieldHint>
            </SettingGroup>

            <SettingGroup>
              <SettingLabel htmlFor="confirm-password">Confirm New Password</SettingLabel>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
              />
            </SettingGroup>

            <ButtonContainer>
              <SubmitButton type="submit">
                <FiSave /> Update Password
              </SubmitButton>
            </ButtonContainer>
          </SettingsForm>
        );
      case 'notifications':
        return (
          <SettingsForm onSubmit={handleSaveSettings}>
            <ToggleGroup>
              <ToggleLabel>
                Enable Notifications
                <Toggle
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                />
              </ToggleLabel>
              <FieldHint>Receive updates about new recipes and features.</FieldHint>
            </ToggleGroup>

            <ToggleGroup>
              <ToggleLabel>
                Email Notifications
                <Toggle
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                />
              </ToggleLabel>
              <FieldHint>Receive notifications via email.</FieldHint>
            </ToggleGroup>

            <ToggleGroup>
              <ToggleLabel>
                Dark Mode
                <Toggle
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
              </ToggleLabel>
              <FieldHint>Use dark theme across the application.</FieldHint>
            </ToggleGroup>

            <ButtonContainer>
              <SubmitButton type="submit">
                <FiSave /> Save Preferences
              </SubmitButton>
            </ButtonContainer>
          </SettingsForm>
        );
      case 'account':
        return (
          <SettingsForm>
            <SettingGroup>
              <SectionTitle>Account Management</SectionTitle>
              <p>Manage your account settings and preferences.</p>
            </SettingGroup>

            <SettingAction>
              <ActionButton type="button">
                Download My Data
              </ActionButton>
              <FieldHint>Get a copy of all your personal data.</FieldHint>
            </SettingAction>

            <SettingAction>
              <DangerButton type="button">
                <FiTrash2 /> Delete Account
              </DangerButton>
              <FieldHint>Permanently delete your account and all associated data.</FieldHint>
            </SettingAction>
          </SettingsForm>
        );
      default:
        return null;
    }
  };

  return (
    <SettingsContainer>
      <SettingsHeader>
        <PageTitle>Account Settings</PageTitle>
        <PageDescription>Manage your account settings and preferences</PageDescription>
      </SettingsHeader>

      <SettingsContent>
        <Sidebar>
          <NavItem
            onClick={() => setActiveSection('profile')}
            className={activeSection === 'profile' ? 'active' : ''}
          >
            <FiUserCheck />
            Profile Information
          </NavItem>
          <NavItem
            onClick={() => setActiveSection('security')}
            className={activeSection === 'security' ? 'active' : ''}
          >
            <FiLock />
            Security & Password
          </NavItem>
          <NavItem
            onClick={() => setActiveSection('notifications')}
            className={activeSection === 'notifications' ? 'active' : ''}
          >
            <FiBell />
            Notifications
          </NavItem>
          <NavItem
            onClick={() => setActiveSection('account')}
            className={activeSection === 'account' ? 'active' : ''}
          >
            <FiMail />
            Account Management
          </NavItem>
          <SupportLink href="/resources/faq" target="_blank">
            <FiHelpCircle />
            Help & Support
          </SupportLink>
        </Sidebar>

        <MainContent>
          <SectionTitle>{getSectionTitle(activeSection)}</SectionTitle>
          {renderActiveSection()}
        </MainContent>
      </SettingsContent>
    </SettingsContainer>
  );
};

// Helper function to get the section title
const getSectionTitle = (section: string): string => {
  switch (section) {
    case 'profile':
      return 'Profile Information';
    case 'security':
      return 'Security & Password';
    case 'notifications':
      return 'Notification Preferences';
    case 'account':
      return 'Account Management';
    default:
      return '';
  }
};

// Styled Components
const SettingsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing.lg};
`;

const SettingsHeader = styled.div`
  margin-bottom: ${spacing.xl};
  border-bottom: 1px solid ${colors.antiqueWhite};
  padding-bottom: ${spacing.md};
`;

const PageTitle = styled.h1`
  color: ${colors.deepSpace};
  font-weight: ${typography.fontWeights.medium};
  margin: 0 0 ${spacing.xs} 0;
  font-size: 2rem;
`;

const PageDescription = styled.p`
  color: ${colors.galaxyGrey};
  font-size: 1rem;
  margin: 0;
`;

const SettingsContent = styled.div`
  display: flex;
  gap: ${spacing.xl};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  flex: 0 0 250px;
	display: flex;
	flex-direction: column;

  @media (max-width: 768px) {
    flex: 1;
    margin-bottom: ${spacing.lg};
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${spacing.md};
  color: ${colors.galaxyGrey};
  border-radius: 0px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: ${spacing.xs};
  font-weight: ${typography.fontWeights.regular};

  svg {
    margin-right: ${spacing.md};
    font-size: 1.2rem;
  }

  &:hover {
    background-color: ${colors.cosmicLatte};
    color: ${colors.emeraldGreen};
  }

  &.active {
    background-color: ${colors.cosmicLatte};
    color: ${colors.emeraldGreen};
    font-weight: ${typography.fontWeights.medium};
    border-left: 3px solid ${colors.emeraldGreen};
  }
`;

const SupportLink = styled.a`
  display: flex;
  align-items: center;
  padding: ${spacing.md};
  color: ${colors.galaxyGrey};
  border-radius: ${borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: auto;
  text-decoration: none;
  border-top: 1px solid ${colors.antiqueWhite};

  svg {
    margin-right: ${spacing.md};
    font-size: 1.2rem;
  }

  &:hover {
    color: ${colors.emeraldGreen};
  }
`;

const MainContent = styled.div`
  flex: 1;
  background-color: ${colors.white};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.lg};
  box-shadow: ${shadows.soft};
`;

const SectionTitle = styled.h2`
  color: ${colors.deepSpace};
  font-weight: ${typography.fontWeights.medium};
  margin: 0 0 ${spacing.lg} 0;
  font-size: 1.5rem;
`;

const SettingsForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

const SettingGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const SettingLabel = styled.label`
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.deepSpace};
  margin-bottom: ${spacing.xs};
`;

const Input = styled.input`
  padding: ${spacing.md};
  border: 1px solid ${colors.antiqueWhite};
  border-radius: ${borderRadius.md};
  font-family: ${typography.fontFamily};
  font-size: 1rem;
  color: ${colors.deepSpace};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.emeraldGreen};
    box-shadow: 0 0 0 2px ${colors.papayaWhip};
  }
`;

const FieldHint = styled.span`
  color: ${colors.galaxyGrey};
  font-size: 0.85rem;
  margin-top: ${spacing.xs};
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.lg};
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: ${borderRadius.circle};
  overflow: hidden;
  background-color: ${colors.antiqueWhite};
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: ${typography.fontWeights.light};
  color: ${colors.emeraldGreen};
  background-color: ${colors.papayaWhip};
`;

const AvatarActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const ButtonContainer = styled.div`
  margin-top: ${spacing.lg};
`;

const Button = styled.button`
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${colors.white};
  color: ${colors.deepSpace};
  border: 1px solid ${colors.antiqueWhite};
  border-radius: ${borderRadius.md};
  cursor: pointer;
  font-family: ${typography.fontFamily};
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.cosmicLatte};
  }
`;

const TextButton = styled.button`
  background: none;
  border: none;
  color: ${colors.galaxyGrey};
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;
  font-family: ${typography.fontFamily};
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.emeraldGreen};
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  padding: ${spacing.md} ${spacing.xl};
  background-color: ${colors.emeraldGreen};
  color: ${colors.white};
  border: none;
  border-radius: ${borderRadius.md};
  font-family: ${typography.fontFamily};
  font-weight: ${typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.deepSpace};
  }
`;

const ToggleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const ToggleLabel = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: ${typography.fontWeights.medium};
  color: ${colors.deepSpace};
`;

const Toggle = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 50px;
  height: 24px;
  background-color: ${props => props.checked ? colors.emeraldGreen : colors.antiqueWhite};
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    top: 2px;
    left: ${props => props.checked ? '28px' : '2px'};
    transition: left 0.3s ease;
    box-shadow: ${shadows.soft};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${colors.papayaWhip};
  }
`;

const SettingAction = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  margin-top: ${spacing.sm};
`;

const ActionButton = styled.button`
  padding: ${spacing.md};
  background-color: ${colors.white};
  color: ${colors.deepSpace};
  border: 1px solid ${colors.antiqueWhite};
  border-radius: ${borderRadius.md};
  font-family: ${typography.fontFamily};
  font-weight: ${typography.fontWeights.regular};
  cursor: pointer;
  transition: all 0.2s ease;
  width: fit-content;

  &:hover {
    background-color: ${colors.cosmicLatte};
    border-color: ${colors.emeraldGreen};
  }
`;

const DangerButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.md};
  background-color: white;
  color: ${colors.darkPastelRed};
  border: 1px solid ${colors.darkPastelRed}40;
  border-radius: ${borderRadius.md};
  font-family: ${typography.fontFamily};
  font-weight: ${typography.fontWeights.regular};
  cursor: pointer;
  transition: all 0.2s ease;
  width: fit-content;

  &:hover {
    background-color: ${colors.darkPastelRed}10;
  }
`;

export default SettingsPage;