//@flow
import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
import ClassNames from "classnames";
import ReactDOM from "react-dom";

const KODIV_CN = "a-keyboard-hover-only-div";

///a duv only shows outline when keyboard focus
// no outline when mouse focus

const KODIV: React.FC<any> = forwardRef((props: any, ref) => {
  const domCont: any = useRef();
  const [allowOutline, setAllowOutline] = useState(true);
  const [inDrag, setInDrag] = useState(false);

  let cancelBlurOnce: boolean;
  //hacking for upload open file dialog
  const disableOutlineForFileDialog = () => {
    // this.setState({
    //   allowOutline: false
    // });
    setAllowOutline(false);
    cancelBlurOnce = true;
  }

  const onMouseDown = (event: any) => {
    // this.setState({
    //   allowOutline: false
    // });
    setAllowOutline(false);
    const { onMouseDown }: any = props;
    onMouseDown && onMouseDown(event);
  };

  const onBlur = (event: any) => {
    if (cancelBlurOnce) {
      cancelBlurOnce = false;
      return;
    }

    setAllowOutline(true);
    // this.setState({
    //   allowOutline: true
    // });

    const { onBlur }: any = props;
    onBlur && onBlur(event);
  };

  const onDragEnter = (event: any) => {
    const { dragable, onDragEnter }: any = props;
    if (!dragable) {
      return;
    }
    setAllowOutline(true);
    setInDrag(true);
    // this.setState({
    //   allowOutline: true,
    //   inDrag: true
    // });

    onDragEnter && onDragEnter(event);
  };

  const onDragLeave = (event: { preventDefault: () => void; clientX: any; clientY: any; }) => {
    const { dragable, onDragLeave }: any = props;
    if (!dragable) {
      return;
    }

    event.preventDefault();
    const that: any = this;
    const dom: any = ReactDOM.findDOMNode(domCont.current);
    const container = dom.getClientRects();
    if (!container[0]) {
      return;
    }
    const { left, right, top, bottom } = container[0];

    const x = event.clientX;
    const y = event.clientY;

    if (x <= left || x >= right || y <= top || y >= bottom) {
      setAllowOutline(false);
      setInDrag(false);
      // this.setState({
      //   allowOutline: false,
      //   inDrag: false
      // });
    }

    onDragLeave && onDragLeave(event);
  };

  const onDrop = () => {
    const { dragable }: any = props;
    if (!dragable) {
      return;
    }
    setAllowOutline(false);
    setInDrag(false);
    // this.setState({
    //   allowOutline: false,
    //   inDrag: false
    // });
  };

  const onKeyDownDefault = (event: { key: string; }) => {
    const { isButton }: any = props;
    if (isButton) {
      return;
    }
    if (event.key === "Enter") {
      const that: any = this;
      const dom: any = ReactDOM.findDOMNode(domCont.current);
      dom.click();
    }
  };

  useImperativeHandle(ref, () => ({
    disableOutlineForFileDialog,
  }));


  const {
    className,
    children,
    isSpan,
    isButton,
    tabIndex,
    dragable,
    isLi,
    isLoading,
    isLoadingBlocking,

    onClick,
    onKeyDown,

    ...others
  }: any = props;
  const classNames = ClassNames(className, {
    "a-no-outline-click": !allowOutline,
    "in-drag": allowOutline && inDrag
  });
  const that: any = this;
  const commonProps = {
    tabIndex: tabIndex || 0,
    className: classNames,
    onClick: onClick || (() => { }),
    onMouseDown: onMouseDown,
    onBlur: onBlur,
    onDragEnter: onDragEnter,
    onDragLeave: onDragLeave,
    onDrop: onDrop,
    onKeyDown: onKeyDown || onKeyDownDefault,
    ref: domCont
  };



  if (isLi) {
    return (
      <li {...commonProps} {...others}>
        {children}
      </li>
    );
  } else if (isButton) {
    if (isLoading && isLoadingBlocking) {
      commonProps.onClick = () => { };
    }

    return (
      <button type="button" {...commonProps} {...others}>
        {children}
      </button>
    );
  } else if (isSpan) {
    return (
      <span {...commonProps} {...others}>
        {children}
      </span>
    );
  } else {
    return (
      <div {...commonProps} {...others}>
        {children}
      </div>
    );
  }
})

export default KODIV;
