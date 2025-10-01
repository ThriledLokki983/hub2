import { RouteObject } from 'react-router-dom';

export type CustomRouteObject = RouteObject & {
  label?: string;
  isNav?: boolean;
  isEnd?: boolean;
  isIndex?: boolean;
  title: string;
};
