

export const getScrollWidth = () => {
    let noScroll, scroll, Div = document.createElement('div');
    Div.style.cssText = 'position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;';
    noScroll = document.body.appendChild(Div).clientWidth;
    Div.style.overflowY = 'scroll';
    scroll = Div.clientWidth;
    document.body.removeChild(Div);
    return noScroll-scroll||0;
}