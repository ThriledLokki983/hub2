import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Rate } from '../index';
import { Tooltip } from '../../tooltip/index';
import { Slider } from '../../slider/index';
describe('Rate', () => {

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('render baseline correctly', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Rate tooltips={['xx', 'xx1', 'xx2', 'xx4', 'xx5']} allowClear={true} type={"baseline"} icon={"icon-rating-fill"}
        onChange={onChange}></Rate>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.find('.ap-ratings-item').first().simulate('click');
    
    wrapper.find('.ap-ratings-item').at(1).simulate('keyup', { key: 'Enter', preventDefault() { } });
  });

  it('render readonly correctly', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Rate allowClear={true} type={"readonly"} defaultValue={2} onChange={onChange}>
        <span className="icon-emoji-great sentiment-icon"></span>
      </Rate>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.find('.ap-ratings-item').first().simulate('click');
    wrapper.find('.ap-ratings-item').at(1).simulate('keyup', { key: 'Enter', preventDefault() { } });
    
    wrapper.find('.ap-ratings-item').at(1).simulate('keyup', { key: 'Space', preventDefault() { } });
  });

  it('render sentiment correctly', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Rate type={"sentiment"} defaultValue={2} icon={"icon-rating-fill"} onChange={onChange}></Rate>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.find('.ap-ratings-item').first().simulate('click');
    
    wrapper.find('.ap-ratings-item').at(1).simulate('keyup', { key: 'Enter', preventDefault() { } });
  });

  it('render sentiment slider correctly', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Rate type={"sentiment"} slider defaultValue={2} icon={"icon-rating-fill"} onChange={onChange}></Rate>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('render sentiment slider correctly', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Rate type={"sentiment"} slider defaultValue={1} icon={"icon-rating-fill"} onChange={onChange}></Rate>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('render sentiment slider correctly', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Rate type={"sentiment"} slider defaultValue={2} icon={"icon-rating-fill"} onChange={onChange}></Rate>
    );
    expect(toJson(wrapper)).toMatchSnapshot();

  });
  it('render sentiment slider correctly', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Rate type={"sentiment"} slider defaultValue={3} icon={"icon-rating-fill"} onChange={onChange}></Rate>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('render sentiment custom correctly', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Rate type={"sentiment"} tooltips={['xx', 'xx1', 'xx2', 'xx4', 'xx4']} defaultValue={3} icon={"icon-rating-fill"} onChange={onChange}
        sentimentOptions={[
          { className: "icon-emoji-awful sentiment-icon", },
          { className: "icon-emoji-bad sentiment-icon", },
          { className: "icon-emoji-okay sentiment-icon", },
          { className: "icon-emoji-good sentiment-icon", },
          { className: "icon-emoji-great sentiment-icon", }
        ]} ></Rate>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('render sentiment slider correctly', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Rate type={"sentiment"} slider defaultValue={4} icon={"icon-rating-fill"} onChange={onChange}></Rate>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  it('render sentiment slider correctly', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Rate type={"sentiment"} slider defaultValue={5} icon={"icon-rating-fill"} onChange={onChange}></Rate>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
})
