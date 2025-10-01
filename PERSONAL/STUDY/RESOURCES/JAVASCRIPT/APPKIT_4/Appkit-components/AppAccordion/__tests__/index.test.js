import React from 'react';
import ReactDOM from 'react-dom'
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Accordion, AccordionItem } from '../index';

describe('Accordion', () => {

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('render correctly', () => {
    const wrapper = shallow(
      <Accordion activeKeys={[]}>
        <AccordionItem itemKey="1" title={"Hong Kong"}>
          <span className="AccordionItem-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris nisi ut aliquip ex ea commodo consequat.</span>
        </AccordionItem>
        <AccordionItem itemKey="2" title={"Stockholm"}>
          <span className="AccordionItem-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris nisi ut aliquip ex ea commodo consequat.</span>
        </AccordionItem>
        <AccordionItem itemKey="3" title={"São Paulo"}>
          <span className="AccordionItem-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris nisi ut aliquip ex ea commodo consequat.</span>
        </AccordionItem>
        <AccordionItem itemKey="4" title={"Saint Petersburg"}>
          <span className="AccordionItem-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris nisi ut aliquip ex ea commodo consequat.</span>
        </AccordionItem>
      </Accordion>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should be onClick', () => {
    const onClickAccordion = jest.fn();
    const wrapper = mount(<Accordion activeKeys={[]} onClick={onClickAccordion}>
      <AccordionItem itemKey="1" title={"Hong Kong"}>
        <span className="AccordionItem-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat.</span>
      </AccordionItem></Accordion>);
    expect(wrapper.find('.ap-accordion-toggle').hostNodes().length).toBe(1);
    // wrapper.find('.ap-accordion-toggle').hostNodes().simulate('click');
    wrapper.find('.ap-accordion').at(0).simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
  });

  it('should be AccordionItem', () => {
    const onAccordionItemClick = jest.fn();
    const wrapper = mount(
      <Accordion activeKeys={[]} onClick={onAccordionItemClick}>
        <AccordionItem expanded={true} excludeElementToToggle={".ap-tabset-toggle-wrapper"} toggleFromBody={true} itemKey="1" title={"Hong Kong"}>
          <span className="AccordionItem-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris nisi ut aliquip ex ea commodo consequat.</span>
        </AccordionItem>
        <AccordionItem itemKey="2" title={"Hong Konga"}>
          <span className="AccordionItem-text">Lorema ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris nisi ut aliquip ex ea commodo consequat.</span>
        </AccordionItem>
      </Accordion>);
    expect(wrapper.find('.ap-accordion-toggle').hostNodes().length).toBe(2);
    wrapper.find('.ap-accordion').at(0).simulate('keydown', { key: 'Space', preventDefault() { } });
    wrapper.find('.ap-accordion').at(0).simulate('keydown', { key: 'ArrowUp', preventDefault() { } });
    wrapper.find('.ap-accordion').at(0).simulate('keydown', { key: 'ArrowUp', preventDefault() { } });
    wrapper.find('.ap-accordion').at(0).simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
    wrapper.find('.ap-accordion').at(0).simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
    wrapper.find('.ap-accordion').at(0).simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
    wrapper.find('.ap-accordion').at(0).simulate('keydown', { key: 'ArrowUp', preventDefault() { } });
    wrapper.find('.ap-accordion').at(0).simulate('keydown', { key: 'Home', preventDefault() { } });
    wrapper.find('.ap-accordion').at(0).simulate('keydown', { key: 'End', preventDefault() { } });
    wrapper.find('.ap-accordion').at(0).simulate('keydown', { key: 'Enter', preventDefault() { } });
    wrapper.find('.ap-accordion').at(0).simulate('click');
  });
})
