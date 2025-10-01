import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { List, ListItem } from '../index';
describe('Input', () => {

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('render textarea correctly', () => {
    const data = [
      { id: "1", primary: "Hong Kong", secondary: "Just now" },
      { id: "2", primary: "Stockholm", secondary: "3m ago" },
      { id: "3", primary: "São Paulo", secondary: "34m ago" },
      { id: "4", primary: "Saint Petersburg", secondary: "1h 58m ago" },
    ]
    const renderItem = (item: any, index: number) => {
      return (
        <ListItem
          key={index}
          role="option"
          onClick={() => { }}
          onKeyDown={() => { }}
          avatar={<div className="ap-list-avatar-container"></div>}
          title={<div className="ap-list-avatar-container"></div>}
        >
          <span className='primary-text'>{item.primary}</span>
          <span className='secondary-text'>{item.secondary}</span>
        </ListItem>
      )
    }
    const wrapper = mount(
      <List itemKey='id' itemHeight={80} bordered={true} data={data} renderItem={renderItem} width={331} style={{ display: 'inline-block' }}></List>
    );
    expect(toJson(wrapper)).toMatchSnapshot(); 
  });

  it('render textarea correctly', () => {
    const data = [
      { id: "1", primary: "Hong Kong", secondary: "Just now" },
      { id: "2", primary: "Stockholm", secondary: "3m ago" },
      { id: "3", primary: "São Paulo", secondary: "34m ago" },
      { id: "4", primary: "Saint Petersburg", secondary: "1h 58m ago" },
    ]
    const renderItem = (item: any, index: number) => {
      return (
        <ListItem
          key={index}
          role="option"
          onClick={() => { }}
          onKeyDown={() => { }}
          description={<div className="ap-list-avatar-container"></div>}
        >
          <span className='primary-text'>{item.primary}</span>
          <span className='secondary-text'>{item.secondary}</span>
        </ListItem>
      )
    }
    const wrapper = mount(
      <List itemKey='id' itemHeight={80} bordered={true} data={data} renderItem={renderItem} width={331} style={{ display: 'inline-block' }}></List>
    );
    expect(toJson(wrapper)).toMatchSnapshot(); 
  });

  it('render textarea correctly', () => {
    const data = [
      { id: "1", primary: "Hong Kong", secondary: "Just now" },
      { id: "2", primary: "Stockholm", secondary: "3m ago" },
      { id: "3", primary: "São Paulo", secondary: "34m ago" },
      { id: "4", primary: "Saint Petersburg", secondary: "1h 58m ago" },
    ]
    const wrapper = mount(
      <List itemKey='id' itemHeight={80} bordered={true} data={data} width={331} style={{ display: 'inline-block' }}></List>
    );
    expect(toJson(wrapper)).toMatchSnapshot(); 
  });
})
