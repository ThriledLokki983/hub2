import * as React from "react";
import { unmountComponentAtNode } from 'react-dom';
import { useState, useCallback, useImperativeHandle, useRef } from 'react';
import { Transition } from 'react-transition-group';
import { setupGetInstanceId } from '../utils';
import ReactDOMType from '../utils/reactRequire';

const getInstanceId = setupGetInstanceId();

export interface ToastManagerProps {
  className?: string;
  style?: React.CSSProperties;
  position?: string;
  // 'top' | 'bottom';
  clickToClose?: boolean;
  duration?: number;
  showTimer?: boolean;
  expandable?: boolean;
  maxCount?: number;
  container?: HTMLElement | (() => HTMLElement);
}

export interface ToastContainerInstance {
  root: HTMLElement;
  push: (message: React.ReactNode) => string;
  remove: (key: string) => void;
  clear: () => void;
  destroy: () => void;
}

export interface NodeProps {
  className?: string;
  style?: React.CSSProperties;
  onClose?: (event?: React.MouseEvent<HTMLDivElement>) => void;
}

interface MessageType {
  key?: string;
  visible?: boolean;
  node: React.ReactElement<NodeProps>;
}

interface ToastContainerComponent {
  className?: string;
  style?: React.CSSProperties;
  position?: 'top' | 'bottom';
  container?: HTMLElement | (() => HTMLElement);
  getInstance: (
    props: ToastManagerProps
  ) => [React.RefObject<ToastContainerInstance>, () => void];
}

const useMessages = (props: any) => {
  const {
    maxCount = 5
  } = props;
  const [messages, setMessages] = useState<MessageType[]>([]);

  const getKey = useCallback(
    (key?: string) => {
      if (typeof key === 'undefined' && messages.length) {
        return messages[messages.length - 1].key;
      }
      return key;
    },
    [messages]
  );

  const push = useCallback(
    message => {
      const key = getInstanceId().toString();
      let curMessages = [...messages, { key, visible: true, node: message }];
      if (maxCount !== 0 && curMessages.length > maxCount) return;
      setMessages([...messages, { key, visible: true, node: message }]);
      return key;
    },
    [messages]
  );

  const clear = useCallback(() => {
    // Set all existing messages to be invisible.
    setMessages(messages.map(msg => ({ ...msg, visible: false })));

    // Remove all invisible messages after 400ms.
    // The delay removal here is to preserve the animation.
    setTimeout(() => {
      setMessages([]);
    }, 400);
  }, [messages]);

  const remove = useCallback(
    (key?: string) => {
      // Set the message of the specified key to invisible.
      setMessages(
        messages.map(n => {
          if (n.key === getKey(key)) {
            n.visible = false;
          }
          return n;
        })
      );

      // Remove invisible messages after 400ms.
      setTimeout(() => {
        setMessages(messages.filter(msg => msg.visible));
      }, 400);
    },
    [messages, getKey]
  );

  return { messages, push, clear, remove };
};

const ToastManager: ToastContainerComponent = React.forwardRef(
  (props: ToastManagerProps, ref) => {
    const rootRef = useRef<HTMLDivElement>();

    const {
      className,
      position = 'topCenter',
      clickToClose = false,
      expandable,
      duration = 0,
      showTimer = false,
      maxCount,
      ...rest
    } = props;
    const { push, clear, remove, messages } = useMessages(props);
    useImperativeHandle(ref, () => ({ root: rootRef.current, push, clear, remove }));

    // console.log('useMessages(props)===9999', ref, useMessages(props))
    const elements = messages.map((item, index) => {
      return (
        <Transition
          key={item.key}
          in={item.visible}
          timeout={300}
          unmountOnExit
        >
          {state => {
            return (
              <div className={`fade fade-${state}`}>
                {
                  React.cloneElement(item.node, {
                    ref,
                    position,
                    config: true,
                    clickToClose,
                    expandable,
                    showTimer,
                    duration,
                    // Remove the message after the specified time.
                    close: () => remove(item.key),
                    ...rest
                  })
                }
              </div>
            )
          }}
        </Transition>)
    });

    return (
      <div
        ref={rootRef}
        className={`ap-notifications ap-notifications-${position}`}
      >
        {elements}
      </div>
    );
  }
) as any;


ToastManager.getInstance = (props: ToastManagerProps) => {
  const { container, ...rest } = props;
  const containerRef = React.createRef<ToastContainerInstance>();
  // const containerRef = React.useRef<ToastContainerInstance>();
  // console.log('containerRef===', containerRef)
  const mountElement = document.createElement('div');

  const containerElement = typeof container === 'function' ? container() : container;

  //  Parent is document.body or the existing dom element
  const parentElement = containerElement || document.body;

  // Add the detached element to the parent
  parentElement.appendChild(mountElement);

  function destroy() {
    unmountComponentAtNode(mountElement);
    parentElement.removeChild(mountElement);
  }

  // render(<ToastManager ref={containerRef} {...rest} />, mountElement);
  ReactDOMType(mountElement, <ToastManager ref={containerRef} {...rest} />);

  return [containerRef, destroy];
};


export default ToastManager

