import { ReactElement } from 'react';
import { useRoutes } from 'react-router-dom';

import ROUTES from './configs/routes';

import withMainAppHocs from 'hocs';
import { useAppStateContext } from 'contexts';
import { Loading } from 'pages';
import useRouteTitle from 'hooks/useRouteTitle';
import { DesignToggle } from 'components';

const Core = () => {
  const routes = useRoutes(ROUTES);
  const { state: appState } = useAppStateContext();

  // Use the custom hook to update page titles based on routes
  useRouteTitle();

  /**
   * Render global loading state.
   */
  if (appState.isLoading) {
    return <Loading />;
  }

  /**
   * Render the app.
   */
  return <App routes={routes} />;
};

export default withMainAppHocs(Core);

function App({ routes }: MainAppInterface) {
  return (
    <>
      {routes}
      <DesignToggle />
    </>
  );
}

interface MainAppInterface {
  routes: ReactElement | null;
}
