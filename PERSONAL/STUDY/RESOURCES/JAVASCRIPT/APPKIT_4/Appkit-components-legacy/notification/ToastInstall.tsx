import * as React from "react";
import ToastManager, { ToastManagerProps, ToastContainerInstance } from "./ToastManager";
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";

const PORTAL_ID = "ap-notifications";

const defaultContainerId = 'ap-notifications';

export interface Toaster {
  createNotification: (message: React.ReactNode, options?: ToastManagerProps) => string;
  closeToast: (key: string) => void;
  clear: () => void;
}

const Toaster: any = () => {
  if (!isBrowser) {
    return;
  }

  const containers = new Map<string, React.RefObject<ToastContainerInstance>>();

  const createContainer = (containerId: string, props: ToastManagerProps) => {
    const [container] = ToastManager.getInstance(props);
    containers.set(containerId || defaultContainerId, container);
    // console.log('container=wws==', container, containers)
    return container;
  }


  const getContainer = (containerId?: string) => {
    if (containers.size == 0) {
      return null;
    }
    return containers.get(containerId || defaultContainerId);
  }

  const closeAll = () => {
    containers.forEach(c => c.current!.clear());
  };

  const createNotification = (notification: React.ReactNode, options: ToastManagerProps = {}) => {
    const { position } = options;

    let container = getContainer(position);
    if (!container) {
      container = createContainer(options.position ?? '', options);
    }
    // console.log('container===2', container, position)
    // return container.current!.push(notification);

    setTimeout(() => {
      return container?.current!.push(notification);
    })

  };

  const close = (id: number) => {
    containers.forEach(c => c.current!.remove(id));
  }

  return {
    closeAll,
    notify: createNotification,
    close
  }
}

const toaster = new Toaster();

export { toaster }

