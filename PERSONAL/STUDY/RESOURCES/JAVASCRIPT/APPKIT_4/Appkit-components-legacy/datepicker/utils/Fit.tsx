import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import detectElementOverflow from './detect-element-overflow';

const isDisplayContentsSupported = typeof window !== 'undefined' && 'CSS' in window && CSS.supports('display', 'contents');
const isMutationObserverSupported = typeof window !== 'undefined' && 'MutationObserver' in window;

const capitalize = (a: any) => a[0].toUpperCase() + a.slice(1);

const findScrollContainer = (element: any) => {
  if (!element) {
    return undefined;
  }

  // hjy note:  a random div is not trustable
  // let parent = element.parentElement;
  // while (parent) {
  //   const { overflow } = window.getComputedStyle(parent);
  //   if (overflow.split(' ').every(o => o === 'auto' || o === 'scroll')) {
  //     return parent;
  //   }
  //   parent = parent.parentElement;
  // }

  return document.getElementById("root") || document.documentElement;
};

const alignAxis = ({
  axis,
  container,
  element,
  invertAxis,
  secondary,
  spacing,
}: any) => {
  const scrollContainer = findScrollContainer(element);

  const parent = container.parentElement;
  const parentCollisions: any = detectElementOverflow(parent, scrollContainer);

  const isX = axis === 'x';
  const startProperty = isX ? 'right' : 'top';
  const endProperty = isX ? 'left' : 'bottom';
  const sizeProperty = isX ? 'width' : 'height';
  const overflowStartProperty = `overflow${capitalize(startProperty)}`;
  const overflowEndProperty = `overflow${capitalize(endProperty)}`;
  const uppercasedSizeProperty = capitalize(sizeProperty);
  const offsetSizeProperty = `offset${uppercasedSizeProperty}`;
  const clientSizeProperty = `client${uppercasedSizeProperty}`;

  let availableStartSpace = -parentCollisions[overflowStartProperty] - spacing;
  let availableEndSpace = -parentCollisions[overflowEndProperty] - spacing;

  if (secondary) {
    availableStartSpace += parent[clientSizeProperty];
    availableEndSpace += parent[clientSizeProperty];
  }

  //child size
  const offsetSize = element[offsetSizeProperty];

  const displayAtStart = () => {
    element.style[startProperty] = 'unset';
    element.style[endProperty] = secondary ? '0' : '100%';
  };

  const displayAtEnd = () => {
    element.style[startProperty] = secondary ? '0' : '100%';
    element.style[endProperty] = 'unset';
  };

  const displayIfFits = (availableSpace: any, display: any) => {
    const fits = offsetSize <= availableSpace;
    if (fits) {
      display();
    }
    return fits;
  };

  const displayAtStartIfFits = () => (
    displayIfFits(availableStartSpace, displayAtStart)
  );

  const displayAtEndIfFits = () => (
    displayIfFits(availableEndSpace, displayAtEnd)
  );

  // keep it, may use it in future
  // const displayWhereverShrinkedFits = () => {
  //   const moreSpaceStart = availableStartSpace > availableEndSpace;
  //   if (moreSpaceStart) {
  //     displayAtStart();
  //   } else {
  //     displayAtEnd();
  //   }
  // };

  let fits;

  if (invertAxis) {
    fits = displayAtStartIfFits() || displayAtEndIfFits();
  } else {
    fits = displayAtEndIfFits() || displayAtStartIfFits();
  }

  if (!fits) {
    // keep it
    // displayWhereverShrinkedFits();
    displayAtEnd();
  }
};

const alignMainAxis = (args: any) => alignAxis(args);

const alignSecondaryAxis = (args: any) => alignAxis({
  ...args,
  axis: args.axis === 'x' ? 'y' : 'x',
  secondary: true,
});

const alignBothAxis = (args: any) => {
  const { invertAxis, invertSecondaryAxis, ...commonArgs } = args;

  alignMainAxis({
    ...commonArgs,
    invertAxis,
  });

  alignSecondaryAxis({
    ...commonArgs,
    invertAxis: invertSecondaryAxis,
  });
};

export default class Fit extends Component<FitPropsType> {
  container: any;
  element: any;
  elementWidth: any;
  elementHeight: any;
  componentDidMount() {
    if (!isDisplayContentsSupported) {
      // eslint-disable-next-line react/no-find-dom-node
      const element = findDOMNode(this);
      this.container = element;
      this.element = element;
    }
    this.fit();

    if (isMutationObserverSupported) {
      this.mutationObserver.observe(this.element, {
        attributes: true,
        attributeFilter: ['class', 'style'],
      });
    }
  }

  onMutation = () => {
    this.fit();
  };

  // Has to be defined after onMutation
  // eslint-disable-next-line react/sort-comp
  mutationObserver: any = isMutationObserverSupported && new MutationObserver(this.onMutation);

  fit = () => {
    const { container, element } = this;

    if (!element) {
      return;
    }

    const elementWidth = element.clientWidth;
    const elementHeight = element.clientHeight;

    // No need to recalculate - already did that for current dimensions
    if (this.elementWidth === elementWidth && this.elementHeight === elementHeight) {
      return;
    }

    // Save the dimensions so that we know we don't need to repeat the function if unchanged
    this.elementWidth = elementWidth;
    this.elementHeight = elementHeight;

    const parent = container.parentElement;

    /**
     * We need to ensure that <Fit />'s child has a absolute position. Otherwise,
     * we wouldn't be able to place the child in the correct position.
     */
    const style = window.getComputedStyle(element);
    const { position } = style;

    if (position !== 'absolute') {
      // no need warnOnDev('<Fit />\'s child does not have absolute position. You should apply `position: absolute` to it.');
      element.style.position = 'absolute';
    }

    /**
     * We need to ensure that <Fit />'s parent has a relative position. Otherwise,
     * we wouldn't be able to place the child in the correct position.
     */
    const parentStyle = window.getComputedStyle(parent);
    const { position: parentPosition } = parentStyle;

    if (parentPosition !== 'relative' && parentPosition !== 'absolute') {
      // no need warnOnDev('<Fit />\'s parent does not have relative position. You should apply `position: relative` to it.');
      parent.style.position = 'relative';
    }

    const {
      invertAxis,
      invertSecondaryAxis,
      mainAxis,
      spacing,
    } = this.props;

    alignBothAxis({
      container,
      element,
      invertAxis,
      invertSecondaryAxis,
      axis: mainAxis,
      spacing,
    });
  }

  render() {
    const { children } = this.props;

    const child = React.Children.only(children);

    if (isDisplayContentsSupported) {
      return (
        <div
          className="a-fit-container"
          style={{ display: 'contents' }}
          ref={(ref) => {
            this.container = ref;
            this.element = ref && ref.firstChild;
          }}
        >
          {child}
        </div>
      );
    } else {
      return (
        <div className="a-fit-container-in-IE">
          {child}
        </div>
      );
    }

  }
}

type FitPropsType = {
  children?: any,
  invertAxis?: boolean,
  invertSecondaryAxis?: boolean,
  mainAxis?: any,
  spacing?: number,
}

