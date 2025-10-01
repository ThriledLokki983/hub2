import Home from './Home';
import HomeContainer from './HomeContainer';
import { HomeProps } from './Home.interface';
import HomeRedesigned from './HomeRedesigned';
import HomeContainerRedesigned from './HomeContainerRedesigned';
import HomeContainerWithToggle from './HomeContainerWithToggle';

export {
  Home,
  HomeContainer,
  HomeRedesigned,
  HomeContainerRedesigned,
  HomeContainerWithToggle,
  type HomeProps,
};

// Default export is the container that handles design toggle
export default HomeContainerWithToggle;
