import React from 'react';
import ReactDOM from 'react-dom'
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Footer } from '../index';

describe('Header', () => {

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  
  it('render correctly', () => {
    const footerContent = "© 2022 PwC. All rights reserved. PwC refers to the US member firm of the PwC network or one of its subsidiaries or affiliates.";
    const footerType = 'links';
    const footerLinks = [
        { name: 'Privacy policy', href: '#' },
        { name: 'Terms and conditions', href: '#' },
        { name: 'Cookie notice', href: '#' }
    ];
    
    const wrapper = shallow(
      <Footer content={footerContent} type={footerType} links={footerLinks}></Footer>
    );
  
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.find('.ap-header-options-item').at(0).simulate('keydown', {key: 'Enter', preventDefault(){}});
  });






})