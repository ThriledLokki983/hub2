import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import {
    QueryClient,
    QueryClientProvider,
  } from 'react-query'
  import { ReactQueryDevtools } from 'react-query/devtools'
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
        <QueryClientProvider client={new QueryClient()}>
			<App />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
		</BrowserRouter>
	</StrictMode>
);
