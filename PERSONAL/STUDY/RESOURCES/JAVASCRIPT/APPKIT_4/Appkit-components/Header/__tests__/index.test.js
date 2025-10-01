import React from 'react';
import ReactDOM from 'react-dom'
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Header, HeaderOptionItem } from '../index';

describe('Header', () => {

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('render correctly', () => {
    const onClickLogo = (event) => {
      console.log('onClickLogo', event);
  }

    const wrapper = shallow(
      <Header
      onClickLogo={onClickLogo}
      titleTemplate={() => "Appkit"}
      contentTemplate={() => <HeaderOptionItem iconName="search-outline" label="Search"></HeaderOptionItem>}
      optionsTemplate={() => {
          return (
              <>
                  <HeaderOptionItem iconName="help-question-outline" label="Support" onClick={() => console.log('Sup')}></HeaderOptionItem>
                  <HeaderOptionItem iconName="notification-outline" label="Alerts"></HeaderOptionItem>
              </>
          )
      }}>
  </Header>,
    );
  
    expect(toJson(wrapper)).toMatchSnapshot();
  });
  
  it('render option item', () => {
    const onClickLogo = (event) => {
      console.log('onClickLogo', event);
  }

    const wrapper = mount(
      <Header
      onClickLogo={onClickLogo}
      titleTemplate={() => "Appkit"}
      contentTemplate={() => <HeaderOptionItem iconName="search-outline" label="Search"></HeaderOptionItem>}
      optionsTemplate={() => {
          return (
              <>
                  <HeaderOptionItem iconName="help-question-outline" onClick={() => console.log('Support')}></HeaderOptionItem>
                  <HeaderOptionItem iconName="notification-outline" label="Alerts" onClick={()=>console.log('Alerts')}></HeaderOptionItem>
              </>
          )
      }}>
  </Header>
    );
  
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.find('.ap-header-options-item').at(0).simulate('click');
    wrapper.find('.ap-header-options-item').at(0).simulate('keyup', {key: 'ArrowUp', preventDefault(){}});
    wrapper.find('.ap-header-options-item').at(0).simulate('keyup', {key: 'Enter', preventDefault(){}});
  });






})