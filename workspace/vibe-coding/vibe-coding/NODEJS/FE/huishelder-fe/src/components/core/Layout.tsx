import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { colors, spacing, breakpoints } from '../../styles/theme/theme';

interface ContainerProps {
  fluid?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const maxWidths = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const Container = styled.div<ContainerProps>`
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: ${spacing[4]};
  padding-left: ${spacing[4]};

  ${props =>
    !props.fluid &&
    css`
      max-width: ${props.maxWidth ? maxWidths[props.maxWidth] : maxWidths.lg};
    `}

  @media (min-width: ${breakpoints.sm}) {
    padding-right: ${spacing[6]};
    padding-left: ${spacing[6]};
  }

  @media (min-width: ${breakpoints.lg}) {
    padding-right: ${spacing[8]};
    padding-left: ${spacing[8]};
  }
`;

interface GridProps {
  columns?: { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: keyof typeof spacing;
  rowGap?: keyof typeof spacing;
  columnGap?: keyof typeof spacing;
}

export const Grid = styled.div<GridProps>`
  display: grid;
  gap: ${props => (props.gap ? spacing[props.gap] : spacing[4])};
  row-gap: ${props => (props.rowGap ? spacing[props.rowGap] : undefined)};
  column-gap: ${props => (props.columnGap ? spacing[props.columnGap] : undefined)};

  ${props =>
    props.columns?.sm &&
    css`
      grid-template-columns: repeat(${props.columns.sm}, minmax(0, 1fr));
    `}

  @media (min-width: ${breakpoints.md}) {
    ${props =>
      props.columns?.md &&
      css`
        grid-template-columns: repeat(${props.columns.md}, minmax(0, 1fr));
      `}
  }

  @media (min-width: ${breakpoints.lg}) {
    ${props =>
      props.columns?.lg &&
      css`
        grid-template-columns: repeat(${props.columns.lg}, minmax(0, 1fr));
      `}
  }

  @media (min-width: ${breakpoints.xl}) {
    ${props =>
      props.columns?.xl &&
      css`
        grid-template-columns: repeat(${props.columns.xl}, minmax(0, 1fr));
      `}
  }
`;

interface FlexProps {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  gap?: keyof typeof spacing;
}

export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  justify-content: ${props =>
    props.justify === 'between'
      ? 'space-between'
      : props.justify === 'around'
        ? 'space-around'
        : props.justify === 'evenly'
          ? 'space-evenly'
          : props.justify || 'flex-start'};
  align-items: ${props =>
    props.align === 'start'
      ? 'flex-start'
      : props.align === 'end'
        ? 'flex-end'
        : props.align || 'stretch'};
  gap: ${props => (props.gap ? spacing[props.gap] : undefined)};
`;

interface SpacerProps {
  size?: keyof typeof spacing;
  axis?: 'vertical' | 'horizontal';
}

export const Spacer = styled.div<SpacerProps>`
  ${props =>
    props.axis === 'vertical'
      ? css`
          width: 1px;
          height: ${props.size ? spacing[props.size] : spacing[4]};
        `
      : props.axis === 'horizontal'
        ? css`
            height: 1px;
            width: ${props.size ? spacing[props.size] : spacing[4]};
          `
        : css`
            width: ${props.size ? spacing[props.size] : spacing[4]};
            height: ${props.size ? spacing[props.size] : spacing[4]};
          `}
`;

export const Section = styled.section`
  padding: ${spacing[12]} 0;
  background-color: ${colors.boneWhite};

  &.alt {
    background-color: ${colors.warmFog};
  }
`;

export const Main = styled.main`
  /* Adjust based on your header height */
  min-height: calc(100vh - 64px);
  background-color: ${colors.boneWhite};
`;
