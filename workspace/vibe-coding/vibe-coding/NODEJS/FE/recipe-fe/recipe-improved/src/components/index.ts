import { lazy } from 'react';

// Core components that are likely needed immediately - load eagerly
import Button from './Button/Button';
import ButtonSet from './ButtonSet/ButtonSet';
import Icon from './Icon/Icon';
import FetchLoader from './FetchLoader/FetchLoader';
import Layout from './Layout/Layout'; // Layout is critical for page structure
import LazyComponentWrapper from './LazyComponentWrapper/LazyComponentWrapper';

// Components that can be lazy loaded
const AlertBar = lazy(() => import('./AlertBar/AlertBar'));
const Header = lazy(() => import('./Header/Header'));
const LabeledInput = lazy(() => import('./LabeledInput/LabeledInput'));
const SkipLinks = lazy(() => import('./SkipLinks/SkipLinks'));
const StyledSelect = lazy(() => import('./StyledSelect/StyledSelect'));
const Toast = lazy(() => import('./Toast/Toast'));


export {
  AlertBar,
  Button,
  ButtonSet,
  FetchLoader,
  Header,
  Icon,
  LazyComponentWrapper,
  LabeledInput,
  Layout,
  SkipLinks,
  StyledSelect,
  Toast,
};
