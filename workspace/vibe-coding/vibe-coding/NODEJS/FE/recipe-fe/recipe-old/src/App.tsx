import styled from 'styled-components';
import { useRoutes } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';

// Import routes configuration
import { routes } from './routes/routes';

// Layout Components
const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Routes renderer component
const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

function App() {
  return (
    <AppContainer>
      <GlobalStyles />
      <AppRoutes />
    </AppContainer>
  );
}

export default App;
