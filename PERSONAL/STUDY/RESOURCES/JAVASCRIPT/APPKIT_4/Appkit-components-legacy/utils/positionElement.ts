const getViewport = () => {
    let win = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        w = win.innerWidth || e.clientWidth || g.clientWidth,
        h = win.innerHeight || e.clientHeight || g.clientHeight;

    return { width: w, height: h };
}
const isOutOfBounds = (element: any) => {
    let { top, left, width, height } = element.getBoundingClientRect();
    let viewport = getViewport();
    return (left + width > viewport.width) || (left < 0) || (top < 0) || (top + height > viewport.height);
}
export const align = (target: any, element: any, position: string = 'bottom', autoAdjust: boolean = true, distance: number = 6, elementPadding: boolean = false, isDropdown?: boolean) => {
    if (!element || !target) return;
    let newPosition = {};
    switch (position) {
        case 'top-left':
        case 'top-right':
        case 'top':
            newPosition = alignTop(target, element, position, autoAdjust, distance, elementPadding);
            if (autoAdjust && isOutOfBounds(element)) {
                newPosition = alignBottom(target, element, position, autoAdjust, distance, elementPadding);
                if (isDropdown) break;
                if (isOutOfBounds(element)) {
                    newPosition = alignRight(target, element, position, autoAdjust, distance, elementPadding);
                    if (isOutOfBounds(element)) {
                        newPosition = alignLeft(target, element, position, autoAdjust, distance, elementPadding);
                    }
                }
            }
            break;

        case 'bottom-left':
        case 'bottom-right':
        case 'bottom':
            newPosition = alignBottom(target, element, position, autoAdjust, distance, elementPadding);
            if (autoAdjust && isOutOfBounds(element)) {
                newPosition = alignTop(target, element, position, autoAdjust, distance, elementPadding);
                if (isDropdown&&isOutOfBounds(element)){
                    newPosition = alignBottom(target, element, position, autoAdjust, distance, elementPadding);
                    break;
                }
                if (isOutOfBounds(element)) {
                    newPosition = alignRight(target, element, position, autoAdjust, distance, elementPadding);

                    if (isOutOfBounds(element)) {
                        newPosition = alignLeft(target, element, position, autoAdjust, distance, elementPadding);
                    }
                }
            }
            break;

        case 'left-top':
        case 'left-bottom':
        case 'left':
            newPosition = alignLeft(target, element, position, autoAdjust, distance, elementPadding);
            if (autoAdjust && isOutOfBounds(element)) {
                newPosition = alignRight(target, element, position, autoAdjust, distance, elementPadding);

                if (isOutOfBounds(element)) {
                    newPosition = alignTop(target, element, position, autoAdjust, distance, elementPadding);

                    if (isOutOfBounds(element)) {
                        newPosition = alignBottom(target, element, position, autoAdjust, distance, elementPadding);
                    }
                }
            }
            break;

        case 'right-top':
        case 'right-bottom':
        case 'right':
            newPosition = alignRight(target, element, position, autoAdjust, distance, elementPadding);
            if (autoAdjust && isOutOfBounds(element)) {
                newPosition = alignLeft(target, element, position, autoAdjust, distance, elementPadding);

                if (isOutOfBounds(element)) {
                    newPosition = alignTop(target, element, position, autoAdjust, distance, elementPadding);

                    if (isOutOfBounds(element)) {
                        newPosition = alignBottom(target, element, position, autoAdjust, distance, elementPadding);
                    }
                }
            }
            break;
    }

    return newPosition;
}


const alignTop = (target: any, element: any, position: string, autoAdjust: boolean, distance: number, elementPadding: boolean) => {
    const host = target?.getBoundingClientRect();
    const tooltip = element?.getBoundingClientRect();
    let left = host.left + (host.width - tooltip.width) / 2;
    let positionDistance = 0;
    if (!elementPadding) positionDistance = distance;
    switch (position) {
        case 'top-left':
            left = host.left;
            break;
        case 'top-right':
            left = host.right - tooltip.width;
            break;
        case 'bottom-left':
            left = host.left;
            break;
        case 'bottom-right':
            left = host.right - tooltip.width;
            break;
    }
    let top = host.top - tooltip.height - positionDistance;
    // if (paddingRef.current) {
    //     paddingRef.current.style.margin = 0;
    //     paddingRef.current.style.marginBottom = distance + 'px';
    // }
    if (element && elementPadding) {
        element.style.padding = 0;
        element.style.paddingBottom = distance + 'px';
    }
    element.style.left = left + 'px';
    element.style.top = top + 'px';
    if (autoAdjust && isOutOfBounds(element)) {
        left = host.left;
        element.style.left = left + 'px';

        if (isOutOfBounds(element)) {
            left = host.right - tooltip.width;
            if (left < 0) left = 0;
            element.style.left = left + 'px';
        }
    }
    return {
        top, left
    }
}

const alignBottom = (target: any, element: any, position: string, autoAdjust: boolean, distance: number, elementPadding: boolean) => {
    const host = target.getBoundingClientRect();
    const tooltip = element.getBoundingClientRect();
    let left = host.left + (host.width - tooltip.width) / 2;
    let positionDistance = 0;
    if (!elementPadding) positionDistance = distance;
    switch (position) {
        case 'bottom-left':
            left = host.left;
            break;
        case 'bottom-right':
            left = host.right - tooltip.width;
            break;
        case 'top-left':
            left = host.left;
            break;
        case 'top-right':
            left = host.right - tooltip.width;
            break;
    }
    let top = host.bottom + positionDistance;
    // if (paddingRef.current) {
    //     paddingRef.current.style.margin = 0;
    //     paddingRef.current.style.marginTop = distance + 'px';
    // }
    if (element && elementPadding) {
        element.style.padding = 0;
        element.style.paddingTop = distance + 'px';
    }
    element.style.left = left + 'px';
    element.style.top = top + 'px';

    if (autoAdjust && isOutOfBounds(element)) {
        left = host.left;
        element.style.left = left + 'px';

        if (isOutOfBounds(element)) {
            left = host.right - tooltip.width;
            if (left < 0) left = 0;
            element.style.left = left + 'px';
        }
    }
    return {
        top, left
    }
}

const alignRight = (target: any, element: any, position: string, autoAdjust: boolean, distance: number, elementPadding: boolean) => {
    const host = target.getBoundingClientRect();
    const tooltip = element.getBoundingClientRect();
    let positionDistance = 0;
    if (!elementPadding) positionDistance = distance;
    let left = host.left + host.width + positionDistance;
    // if (paddingRef.current) {
    //     paddingRef.current.style.margin = 0;
    //     paddingRef.current.style.marginLeft = distance + 'px';
    // }
    if (element && elementPadding) {
        element.style.padding = 0;
        element.style.paddingLeft = distance + 'px';
    }
    let top = host.top + (host.height - tooltip.height) / 2;
    switch (position) {
        case 'right-top': top = host.top; break;
        case 'right-bottom': top = host.bottom - tooltip.height; break;
        case 'left-top':
            top = host.top;
            break;
        case 'left-bottom':
            top = host.bottom - tooltip.height;
            break;
    }
    element.style.left = left + 'px';
    element.style.top = top + 'px';

    if (autoAdjust && isOutOfBounds(element)) {
        top = host.top;
        element.style.top = top + 'px';

        if (isOutOfBounds(element)) {
            top = host.bottom - tooltip.height;
            if (top < 0) top = 0;
            element.style.top = top + 'px';
        }
    }
    return {
        top, left
    }
}

const alignLeft = (target: any, element: any, position: string, autoAdjust: boolean, distance: number, elementPadding: boolean) => {
    const host = target.getBoundingClientRect();
    const tooltip = element.getBoundingClientRect();
    let positionDistance = 0;
    if (!elementPadding) positionDistance = distance;
    let left = host.left - tooltip.width - positionDistance;
    // if (paddingRef.current) {
    //     paddingRef.current.style.margin = 0;
    //     paddingRef.current.style.marginRight = distance + 'px';
    // }
    if (element && elementPadding) {
        element.style.padding = 0;
        element.style.paddingRight = distance + 'px';
    }
    let top = host.top + (host.height - tooltip.height) / 2;
    switch (position) {
        case 'left-top':
            top = host.top;
            break;
        case 'left-bottom':
            top = host.bottom - tooltip.height;
            break;
        case 'right-top': top = host.top; break;
        case 'right-bottom': top = host.bottom - tooltip.height; break;
    }
    element.style.left = left + 'px';
    element.style.top = top + 'px';

    if (autoAdjust && isOutOfBounds(element)) {
        top = host.top;
        element.style.top = top + 'px';

        if (isOutOfBounds(element)) {
            top = host.bottom - tooltip.height;
            if (top < 0) top = 0;
            element.style.top = top + 'px';
        }
    }
    return {
        top, left
    }
}