import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import  {Navigation} from '../index';

describe('Navigation', () => {

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  
  it('render correctly', () => {
 
    const navList = [
        {
            name: 'Welcome',
            prefixIcon: 'hand-wave',
            suffixIcon: 'down-chevron'
        },
        {
            name: 'Getting started',
            prefixIcon: 'download-cloud',
            suffixIcon: 'down-chevron'
        },
        {
            name: 'Styleguide',
            prefixIcon: 'venn-abc',
            suffixIcon: 'down-chevron'
        },
        {
            name: 'Components',
            prefixIcon: 'particulates',
            suffixIcon: 'down-chevron'
        },
        {
            name: 'Support',
            prefixIcon: 'help-question',
            suffixIcon: 'down-chevron'
        }
    ];

    const onClickLogo = (event) => {
        console.log('onClickLogo', event);
    }

    const redirect = (event, index) => {
       
        // routing logic here
        console.log(index);
    }

    const onCollapseEvent = (collapsed, event) => {
      console.log('onClickCollapseEvent', collapsed, event);
  }

    const wrapper = shallow(
      <Navigation navList={navList}
      solid={true}
      // collapsed={collapsed}
      onClickCollapseEvent={onCollapseEvent}
      onClickLogo={onClickLogo}
      onClickItem={redirect}
      // width="280px"
      className="sitedemo"
      selectedIndex={0}
      titleTemplate={() => "Lorem ipsum"}>
  </Navigation>
    );
  
    expect(toJson(wrapper)).toMatchSnapshot();
    
  });

  it('click item correctly', () => {
    const navList = [
        {
            name: 'Welcome',
            prefixIcon: 'hand-wave',
            suffixIcon: 'down-chevron'
        },
        {
            name: 'Getting started',
            prefixIcon: 'download-cloud',
            suffixIcon: 'down-chevron'
        },
        {
            name: 'Styleguide',
            prefixIcon: 'venn-abc',
            suffixIcon: 'down-chevron'
        },
        {
            name: 'Components',
            prefixIcon: 'particulates',
            suffixIcon: 'down-chevron'
        },
        {
            name: 'Support',
            prefixIcon: 'help-question',
            suffixIcon: 'down-chevron'
        }
    ];

    const onClickLogo = (event) => {
        console.log('onClickLogo', event);
    }

    const redirect = (event, index) => {
        // routing logic here
        console.log(index);
    }

    const onCollapseEvent = (collapsed, event) => {
      console.log('onClickCollapseEvent', collapsed, event);
  }

    const wrapper = mount(
      <Navigation navList={navList}
      solid={false}
      // collapsed={collapsed}
      onClickCollapseEvent={onCollapseEvent}
      onClickLogo={onClickLogo}
      onClickItem={redirect}
      // width="280px"
      className="sitedemo"
      selectedIndex={0}
      titleTemplate={() => "Lorem ipsum"}>
  </Navigation>
    );
  
    expect(toJson(wrapper)).toMatchSnapshot();
    
    expect(wrapper.setState({collapsed: true}).toBeTruthy());
  
    wrapper.find('.ap-navigation-logo').at(0).simulate('click');
    wrapper.find('.itemContent').at(0).simulate('click');
    wrapper.find('.ap-navigation-item.collapsed-item').at(0).simulate('click');
    wrapper.find('.itemContent').at(0).simulate('keydown', {key: 'Enter', preventDefault(){}});
    wrapper.find('.ap-navigation-logo').at(0).simulate('click');
    wrapper.find('.itemContent').at(0).simulate('click');
    wrapper.find('.itemContent').at(0).simulate('keydown', {key: 'Enter', preventDefault(){}});
  });

  it('collapse correctly', () => {
    const navList = [
        {
            name: 'Welcome',
            prefixIcon: 'hand-wave',
            suffixIcon: 'down-chevron'
        },
        {
            name: 'Getting started',
            prefixIcon: 'download-cloud',
            suffixIcon: 'down-chevron'
        },
        {
            name: 'Styleguide',
            prefixIcon: 'venn-abc',
            suffixIcon: 'down-chevron'
        },
        {
            name: 'Components',
            prefixIcon: 'particulates',
            suffixIcon: 'down-chevron'
        },
        {
            name: 'Support',
            prefixIcon: 'help-question',
            suffixIcon: 'down-chevron'
        }
    ];

    const onClickLogo = (event) => {
        console.log('onClickLogo', event);
    }

    const redirect = (event, index) => {
        // routing logic here
        console.log(index);
    }

    const onCollapseEvent = (collapsed, event) => {
      console.log('onClickCollapseEvent', collapsed, event);
  }

    const wrapper = mount(
      <Navigation navList={navList}
      solid={false}
      // collapsed={collapsed}
      onClickCollapseEvent={onCollapseEvent}
      onClickLogo={onClickLogo}
      onClickItem={redirect}
      // width="280px"
      className="sitedemo"
      selectedIndex={0}
      titleTemplate={() => "Lorem ipsum"}
>
  </Navigation>
    );
  
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.find('.ap-navigation-item.collapsed-item').at(0).simulate('click');
    wrapper.find('.itemContent').at(0).simulate('click');
    wrapper.find('.ap-navigation-item').at(0).simulate('keyup', {key: 'Enter', preventDefault(){}});
  });
})