import React from 'react';
// import ReactDOM from 'react-dom';
import { getCurrentTheme, getCurrentLevel } from '../index';
import ClassNames from 'classnames';

import ReactDOMType from '../utils/reactRequire';

// simple wrapper
// 1. add node the body
// 2. remove container after unmount

const _ID_ = "PopWrapper";

function willUnmount() {
  removeNode();
}

function removeNode(selector){
  //Change the behavior of Banner, only show one banner at same time.
  let renderedDiv = document.getElementById(_ID_);
  if (renderedDiv) {
    ReactDOM.unmountComponentAtNode(renderedDiv);
    getContainer(selector).removeChild(renderedDiv);
  }
}

function getContainer(selector){
  return document.querySelector(selector) || document.getElementById("root") || document.body;
}

const PopWrapper = function(Component, selector){
  return function(props = {}) {
    removeNode(selector);
    const div = document.createElement('div');
    div.id = _ID_;

    const theme = getCurrentTheme();
    const level = getCurrentLevel();

    const cn = ClassNames({
      "a-theme-container": theme,
      "a-alert-pop-wrapper": Component.displayName === "Alert",
      "a-banner-pop-wrapper": Component.displayName === "Banner"
    });
    div.className = cn;
    div.setAttribute("theme", theme);
    div.setAttribute("level", level);


    getContainer(selector).insertBefore(div, getContainer().childNodes[0]);
    const element = React.createElement(
      Component,
      Object.assign({}, props, {willUnmount})
    );
    ReactDOMType(div, element);
    // ReactDOM.render(element, div);
  };
}

export default PopWrapper;
