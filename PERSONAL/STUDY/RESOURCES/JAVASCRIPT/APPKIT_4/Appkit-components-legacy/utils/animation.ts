let targetValue: any = null;
export let slideUp = (target: any, duration=500) => {
      // target.style.transitionProperty = 'height, margin, padding';
      // target.style.transitionDuration = duration + 'ms';
      target.style.transition = `height ${duration}ms, margin ${duration}ms, padding ${duration}ms`;
      target.style.boxSizing = 'border-box';
      target.style.height = target.offsetHeight + 'px';
      target.offsetHeight;
      target.style.overflow = 'hidden';
      let reduceHeightTimer = setTimeout(() => {
        target.style.height = 0;
        clearTimeout(reduceHeightTimer);
      }, 0);
      // target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      let timer = window.setTimeout( () => {
        target.style.display = 'none';
        target.style.removeProperty('height');
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        target.style.removeProperty('overflow');
        // target.style.removeProperty('transition-duration');
        // target.style.removeProperty('transition-property');
        target.style.removeProperty('transition');
        clearTimeout(timer);
        next(targetValue, duration);
      }, duration);
    }
  
  export let slideDown = (target: any, duration=500) => {
      target.style.removeProperty('display');
      let display = window.getComputedStyle(target).display;
      if (display === 'none')
        display = 'block';
      target.style.display = display;
      let height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      // target.offsetHeight;
      // target.style.boxSizing = 'border-box';
      // target.style.transitionProperty = "height, margin, padding";
      // target.style.transitionDuration = duration + 'ms';
      // target.style.transition = `height ${duration}ms, margin ${duration}ms, padding ${duration}ms`;
      let addHeightTimer = setTimeout(() => {
        // target.style.paddingTop = 0;
        // target.style.paddingBottom = 0;
        // target.style.marginTop = 0;
        // target.style.marginBottom = 0;
        // target.offsetHeight;
        target.style.boxSizing = 'border-box';
        target.style.transition = `height ${duration}ms, margin ${duration}ms, padding ${duration}ms`;
        target.style.height = height + 'px';
        clearTimeout(addHeightTimer);
      }, 0);
      // target.style.transition = `height ${duration}ms, margin ${duration}ms, padding ${duration}ms`;
      // target.style.height = height + 'px';
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      let timer = window.setTimeout( () => {
        target.style.removeProperty('height');
        target.style.removeProperty('overflow');
        // target.style.removeProperty('transition-duration');
        // target.style.removeProperty('transition-property');
        target.style.removeProperty('transition');
        clearTimeout(timer);
        next(targetValue, duration);
      }, duration);
    }

let timers: any[] = [];
let isStart = false;
let add = (timer: any, target: any, duration: number) => {
  timers.push(timer);
  targetValue = target;
  run(target, duration);
};  

let run = (target: any, duration: number) => {
  if (!isStart) {
    let firstTimer = timers.shift();
    if (firstTimer) {
      isStart = true;
      firstTimer(target, duration);
    }
  }
};

let next = (target: any, duration: number) => {
  isStart = false;
  run(target, duration);
};

export let slideTrigger = (isSlideUp: boolean, target: any, duration=500) => {
  if (isSlideUp) {
    add(slideUp, target, duration);
  } else {
    add(slideDown, target, duration);
  }
}

