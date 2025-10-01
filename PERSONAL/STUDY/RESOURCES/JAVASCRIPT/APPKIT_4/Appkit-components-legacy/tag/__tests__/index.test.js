import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Tag } from '../index';

describe('Tag', () => {

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  
  it('render correctly', () => {
    const wrapper = shallow(
      <Tag closable size="lg">
        Hello World!
      </Tag>,
    );
  
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should be closable', () => {
    const onClose = jest.fn();
    const wrapper = mount(<Tag closable size="sm" onClose={onClose} />);
    expect(wrapper.find('.ap-tag-close-icon').hostNodes().length).toBe(1);
    expect(wrapper.find('.ap-tag:not(.ap-tag-hidden)').length).toBe(1);
    wrapper.find('.ap-tag-close-icon').hostNodes().simulate('click');
    expect(onClose).toHaveBeenCalled();
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper.find('.ap-tag:not(.ap-tag-hidden)').length).toBe(0);
  });
})