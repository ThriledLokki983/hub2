import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { colors, spacing, breakpoints } from '../theme/theme';
import Header from './Header';
import Footer from './Footer';

// Styled components for layout
const MainContent = styled.main`
  flex: 1;
  background-color: ${colors.cosmicLatte};
`;

const PageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing.md};

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.lg};
  }

  @media (min-width: ${breakpoints.desktop}) {
    padding: ${spacing.xl};
  }
`;

// Layout wrapper with Header and Footer
const Layout = () => {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement search functionality
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <MainContent>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </MainContent>
      <Footer />
    </>
  );
};

export default Layout;