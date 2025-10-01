import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Table, Column } from '../index';

describe('Table', () => {

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const tdata = [
    {
      order: '92330',
      city: 'Hong Kong',
      fulfilled: 'Yes',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
      total: 94.24
    },
    {
      order: '23638',
      city: 'Stockholm',
      fulfilled: 'No',
      description: 'Sed do eiusmod tempor incididunt ut labore',
      total: 373.08
    },
    {
      order: '82070',
      city: 'São Paulo',
      fulfilled: 'Yes',
      description: 'Et dolore magna aliqua consectetur',
      total: 837.56
    },
    {
      order: '36301',
      city: 'Saint Petersburg',
      fulfilled: 'Yes',
      description: 'Ut enim ad minim veniam quis nostrud exercitation',
      total: 128.86
    },
    {
      order: '45230',
      city: 'Toronto',
      fulfilled: 'Yes',
      description: 'Ullamco laboris nisi ut aliquip ex ea commodo consequat',
      total: 238.01
    }
  ];

  it('render correctly', () => {
    const onCheckChange = jest.fn();
    const func1 = jest.fn();
    const func2 = jest.fn();
    const wrapper = mount(
      <Table originalData={tdata} hasTitle checkbox onCheckChange={onCheckChange}>
        <Column sortKey='order' sortFunc1={func1} sortFunc2={func2}>Order</Column>
        <Column sortKey='city'>City</Column>
        <Column sortKey='fulfilled'>Fulfilled</Column>
        <Column sortKey='description'>Description</Column>
        <Column sortKey='total' slot='start'>Total</Column>
      </Table>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.find('.header-container').first().simulate('click'); // Test the first click of first 'th' with func1 and func2
    wrapper.find('.header-container').first().simulate('click'); // Test the second click of first 'th' with func1 and func2
    wrapper.find('.header-container').first().simulate('click'); // Test the third click of first 'th' with func1 and func2
    wrapper.find('.header-container').at(1).simulate('click'); // Test the first click of second 'th' with func1 and func2
    wrapper.find('.header-container').at(1).simulate('click'); // Test the second click of second 'th' with func1 and func2
    wrapper.find('.header-container').first().simulate('keydown', { key: 'Enter', preventDefault() { } }); // Test the keydown event of first 'th' element
    jest.runAllTimers(); // Run all the settimeout within all methods in sort() function
  });
})
