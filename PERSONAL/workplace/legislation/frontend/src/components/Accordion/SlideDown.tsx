import { SlideDownProps, SlideDownContentProps, SlideDownContentState } from './SlideDown.interface';

import React, { forwardRef, Component } from 'react'
import sliderStyles from './SlideDown.module.scss'

class SlideDownContent extends Component<SlideDownContentProps, SlideDownContentState> {

  static defaultProps = {
    transitionOnAppear: true,
    closed: false
  }

  private outerRef: HTMLDivElement | null = null

  constructor(props: SlideDownContentProps) {
    super(props)

    this.state = {
      children: props.children,
      childrenLeaving: false
    }
  }

  private handleRef = (ref: HTMLDivElement | null) => {
    /* Handle both the internal and forwardedRef and maintain correct typings */
    this.outerRef = ref

    if (this.props.forwardedRef) {
      if (typeof this.props.forwardedRef === 'function') {
        this.props.forwardedRef(ref)
      } else if (typeof this.props.forwardedRef === 'object') {
        const forwardedRef = this.props.forwardedRef as any
        forwardedRef.current = ref
      } else {
        throw new Error(`Invalid forwardedRef ${this.props.forwardedRef}`)
      }
    }
  }

  componentDidMount() {
    if (this.outerRef) {
      if (this.props.closed || !this.props.children) {
        this.outerRef.classList.add(`${sliderStyles.root__closed}`)
        this.outerRef.style.height = '0px'
      } else if (this.props.transitionOnAppear) {
        this.startTransition('0px')
      } else {
        this.outerRef.style.height = 'auto'
        this.outerRef.style.display = 'block';
      }
    }
  }

  getSnapshotBeforeUpdate() {
    /* Prepare to resize */
    return this.outerRef ? this.outerRef.getBoundingClientRect().height + 'px' : null
  }

  static getDerivedStateFromProps(props: SlideDownContentProps, state: SlideDownContentState) {
    if (props.children) {
      return {
        children: props.children,
        childrenLeaving: false
      }
    } else if (state.children) {
      return {
        children: state.children,
        childrenLeaving: true
      }
    } else {
      return null
    }
  }

  componentDidUpdate(_prevProps: any, _prevState: any, snapshot: string | null) {
    if (this.outerRef) {
      this.startTransition(snapshot || '')
    }
  }

  private startTransition(prevHeight: string) {
    let endHeight = '0px'
    let offsetHeightValue
    if (!this.props.closed && !this.state.childrenLeaving && this.state.children) {
      const addExtraValue = (pxString: string, value: number) => {
        const numericPart = parseFloat(pxString);
        return `${numericPart + value}px`;
      };
      this.outerRef?.classList.remove(`${sliderStyles.root__closed}`)
      this.outerRef!.style.height = 'auto'
      this.outerRef!.style.display = 'block';
      // endHeight = addExtraValue(getComputedStyle(this.outerRef!).height, 15);
      endHeight = getComputedStyle(this.outerRef!).height;
    }

    if (parseFloat(endHeight).toFixed(2) !== parseFloat(prevHeight).toFixed(2)) {
      this.outerRef?.classList.add(`${sliderStyles.root__transitioning}`)
      this.outerRef!.style.height = prevHeight
      offsetHeightValue = this.outerRef!.offsetHeight // force repaint
      this.outerRef!.style.transitionProperty = 'all'
      this.outerRef!.style.height = endHeight
    }
    if (offsetHeightValue === 1) {
      this.outerRef?.classList.remove('showtransitioning')
    }
  }

  private endTransition() {
    this.outerRef?.classList.remove(`${sliderStyles.root__transitioning}`)
    this.outerRef!.style.transitionProperty = 'none'
    this.outerRef!.style.height = this.props.closed ? '0px' : 'auto'

    if (this.props.closed || !this.state.children) {
      this.outerRef?.classList.add(`${sliderStyles.root__closed}`);
    }
  }

  private handleTransitionEnd = (evt: React.TransitionEvent) => {
    if ((evt.target === this.outerRef) && (evt.propertyName === 'all')) {
      if (this.state.childrenLeaving) {
        this.setState({ children: null, childrenLeaving: false }, () => this.endTransition())
      } else {
        this.endTransition()
      }
    }
  }

  render() {
    const {
      as = 'div',
      children,
      className,
      closed,
      transitionOnAppear,
      forwardedRef,
      ...rest
    } = this.props;

    return React.createElement(
      as,
      {
        ref: this.handleRef,
        className: sliderStyles.root__slidedown,
        onTransitionEnd: this.handleTransitionEnd,
        ...rest
      },
      this.state.children
    );
  }

}

export const SlideDown = forwardRef((props: SlideDownProps, ref: React.Ref<HTMLDivElement>) => (
  <SlideDownContent {...props} forwardedRef={ref} />
))

export default SlideDown
