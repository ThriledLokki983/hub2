import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { DEVELOPMENT } from 'configs/constants';

// Sentry initialization should be imported first!
import "./sentry";
import App from './App';

import './styles/base.scss';


const container = document.getElementById('root');
const root = container && createRoot(container);
const queryClient = new QueryClient();

root?.render(
  <StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={DEVELOPMENT ? true : true} />
      </QueryClientProvider>
    </Router>
  </StrictMode>
);
