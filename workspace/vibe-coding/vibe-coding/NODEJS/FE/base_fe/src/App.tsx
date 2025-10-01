import { ReactElement } from 'react';
import { useRoutes } from 'react-router-dom';

import ROUTES from './configs/routes';

import withMainAppHocs from 'hocs';
import { useAppStateContext } from 'contexts';
import { Loading } from 'pages'


const Core = () => {

  const routes = useRoutes(ROUTES);
  const { state: appState } = useAppStateContext();

  /**
   * Render global loading state.
   */
  if (appState.isLoading) {
    return (
      <Loading />
    );
  }

  /**
   * Render the app.
   */
  return (
    <App routes={routes} />
  );

};

export default withMainAppHocs(Core);

function App({ routes }: MainAppInterface) {
  return routes;
}

interface MainAppInterface {
  routes: ReactElement | null;
}
