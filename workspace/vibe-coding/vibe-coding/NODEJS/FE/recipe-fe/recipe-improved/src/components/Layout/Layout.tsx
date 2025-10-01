import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import { colors } from '../../theme/theme';

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${colors.darkBackground};
  position: relative;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(circle at 15% 15%, rgba(46, 46, 46, 0.8) 0%, transparent 25%),
      radial-gradient(circle at 85% 85%, rgba(46, 46, 46, 0.8) 0%, transparent 25%);
    pointer-events: none;
    z-index: -1;
  }
`;

const Main = styled.main`
  flex: 1;
`;

const Layout: React.FC = () => {
  return (
    <LayoutWrapper>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </LayoutWrapper>
  );
};

export default Layout;
