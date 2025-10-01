import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Input, TextArea } from '../index';
describe('Input', () => {

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('render input correctly', () => {
    const onChange = jest.fn();
    const prefix = (<i className="Appkit4-icon ap-field-prefix-icon icon-lockclosed-locked-outline" aria-hidden="true"></i>);
    const suffix = (
      <span tabIndex={0} role="button" aria-label="tooltip" className="Appkit4-icon icon-information-outline ap-field-icon-btn" aria-describedby="field-tooltip"></span>

    );
    const emailError = "8jh".match(/^[a-zA-Z0-9_\-\.]+@[a-zA-Z0-9_-]+(\.com)+$/) === null;
    const errorContent = (<div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">Please enter a valid email address </div>);
    const wrapper = mount(
      <Input
        type={"text"}
        title={"Email address"}
        value={''}
        error={emailError}
        errorNode={errorContent}
        allowClear={true}
        placeholder='please input email'
        onClick={() => { console.log('you clicked the input') }}
        onChange={onChange}
        prefix={prefix}
        suffix={suffix}
        onClear={() => { console.log('you clear the input') }}
      >
        {(
          <div aria-live="polite" className="ap-field-email-validation-suggestion"> Did you mean
            <span onClick={(e) => { e.preventDefault() }}> @pwc.com</span>?</div>
        )}
      </Input>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.find('.ap-Field-wrapper').first().simulate('click');
    wrapper.find('.ap-Field-input').first().simulate('keyup', { key: 'e', preventDefault() { } });
    wrapper.find('.ap-Field').first().simulate('keyup', { key: 'Tab', preventDefault() { } });
    wrapper.find('.ap-Field-cleaner').first().simulate('click');
    wrapper.find('.ap-Field').first().simulate('keyup', { key: 'b', preventDefault() { } });
    wrapper.find('.ap-Field-cleaner').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
    wrapper.find('.ap-Field-cleaner').first().simulate('focus');
    wrapper.find('.ap-Field-cleaner').first().simulate('blur');

  });
  it('render input correctly', () => {
    const onChange = jest.fn();
    const prefix = (<i className="Appkit4-icon ap-field-prefix-icon icon-lockclosed-locked-outline" aria-hidden="true"></i>);
    const suffix = (
      <span tabIndex={0} role="button" aria-label="tooltip" className="Appkit4-icon icon-information-outline ap-field-icon-btn" aria-describedby="field-tooltip"></span>

    );
    const emailError = "8jh".match(/^[a-zA-Z0-9_\-\.]+@[a-zA-Z0-9_-]+(\.com)+$/) === null;
    const errorContent = (<div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">Please enter a valid email address </div>);
    const wrapper = mount(
      <Input
        type={"text"}
        title={"Email address"}
        value={'123'}
        error={emailError}
        errorNode={errorContent}
        allowClear={true}
        placeholder='please input email'
        onClick={() => { console.log('you clicked the input') }}
        onChange={onChange}
        prefix={prefix}
        suffix={suffix}
        onClear={() => { console.log('you clear the input') }}
      >
        {(
          <div aria-live="polite" className="ap-field-email-validation-suggestion"> Did you mean
            <span onClick={(e) => { e.preventDefault() }}> @pwc.com</span>?</div>
        )}
      </Input>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.find('.ap-Field-wrapper').first().simulate('click');
    wrapper.find('.ap-Field-input').first().simulate('change', { key: '1', preventDefault() { } });
    wrapper.find('.ap-Field-input').first().simulate('keyup', { key: 'e', preventDefault() { } });
    wrapper.find('.ap-Field').first().simulate('keyup', { key: 'Tab', preventDefault() { } });
    wrapper.find('.ap-Field-cleaner').first().simulate('click');
    wrapper.find('.ap-Field').first().simulate('keyup', { key: 'b', preventDefault() { } });
    wrapper.find('.ap-Field-cleaner').first().simulate('keydown', { key: 'Enter', preventDefault() { } });

  });
  it('render input password', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Input type={"password"} title={"password"} revealer={true} value={''} onChange={onChange} />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.find('.ap-Field-wrapper').first().simulate('click');
    wrapper.find('.ap-Field-input').first().simulate('keyup', { key: 'e', preventDefault() { } });
    wrapper.find('.ap-Field').first().simulate('keyup', { key: 'Tab', preventDefault() { } });
    wrapper.find('.ap-Field').first().simulate('keyup', { key: 'b', preventDefault() { } });
    wrapper.find('.ap-Field-icon-btn').first().simulate('click');
    wrapper.find('.ap-Field-icon-btn').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
  });
  it('render input password', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Input type={"password"} title={"password"} revealer={true} value={'123456'} onChange={onChange} />
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.find('.ap-Field-wrapper').first().simulate('click');
    wrapper.find('.ap-Field-input').first().simulate('keyup', { key: 'e', preventDefault() { } });
    wrapper.find('.ap-Field').first().simulate('keyup', { key: 'Tab', preventDefault() { } });
    wrapper.find('.ap-Field').first().simulate('keyup', { key: 'b', preventDefault() { } });
    wrapper.find('.ap-Field-icon-btn').first().simulate('click');
    wrapper.find('.ap-Field-icon-btn').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
  });
  it('render input Dropdown', () => {
    const wrapper = mount(
      <Input
        type={"text"}
        title={"Height"}
        selectedItem={
          {
            label: 'Feet and inches',
            value: 'Feet and inches',
            descValue: 'ft/in',
            unit: 'ft/in'
          }
        }
        dropdown={
          [
            {
              label: 'Centimeters',
              value: 'Centimeters',
              descValue: 'cm',
              unit: 'cm',
              url:'./'
            },
            {
              label: 'Feet and inches',
              value: 'Feet and inches',
              descValue: 'ft/in',
              unit: 'ft/in',url:'./'
            }
          ]
        }
        suffixTemplate={item => {
          return (
            <span>{item.descValue}</span>
          )
        }}
        dropdownChange={()=>{console.log('1')}}
      >
      </Input>
    );
    expect(toJson(wrapper)).toMatchSnapshot();

    wrapper.find('.ap-Field-icon-btn').first().simulate('click');
    wrapper.find('.ap-option-item').first().simulate('click');
  });

  it('render textarea correctly', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <TextArea title={"Email address"} maxLength={200} value={"23"} placeholder="2345" onChange={onChange}/>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.find('.ap-Field-wrapper').first().simulate('click');
    wrapper.find('.ap-Field-input').first().simulate('keyup', { key: 'e', preventDefault() { } });
    wrapper.find('.ap-Field').first().simulate('keyup', { key: 'Tab', preventDefault() { } });
    wrapper.find('.ap-Field').first().simulate('keyup', { key: 'b', preventDefault() { } });
  });

  it('render textarea correctly', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <TextArea title={"Email address"} maxLength={200} value={""} placeholder="2345" onChange={onChange}/>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.find('.ap-Field-wrapper').first().simulate('click');
    wrapper.find('.ap-Field-input').first().simulate('keyup', { key: 'e', preventDefault() { } });
    wrapper.find('.ap-Field-input').first().simulate('change', { key: '1', preventDefault() { } });
    wrapper.find('.ap-Field').first().simulate('keyup', { key: 'Tab', preventDefault() { } });
    wrapper.find('.ap-Field').first().simulate('keyup', { key: 'b', preventDefault() { } });

  });
})
