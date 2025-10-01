import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import { QueryProvider } from './contexts/providers';

import './styles/base.scss';

const container = document.getElementById('root');
const root = container && createRoot(container);

root?.render(
  <StrictMode>
    <QueryProvider>
      <Router>
        <App />
      </Router>
    </QueryProvider>
  </StrictMode>,
);
