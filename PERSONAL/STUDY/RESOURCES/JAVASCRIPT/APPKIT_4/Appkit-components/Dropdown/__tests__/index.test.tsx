import React from 'react';
import { mount } from 'enzyme';
import { DropdownButton } from '../index';
import toJson from 'enzyme-to-json';

describe('DropdownButton', () => {

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('should be DropdownButton 1', () => {
        const onVisibleChange = jest.fn();
        const dropdownSelectHandle = jest.fn();
        const onClick = jest.fn();
        const wrapper = mount(<div>
            <div><button className="outside-btn"></button></div>
            <DropdownButton
                dropdownClassName={'ap-field-Dropdown'}
                splitButton={false}
                apperance='field'
                data={[
                    {
                        label: 'China',
                        value: 'China',
                        descValue: '+86'
                    }]}
                dropdownItemArialabel={true}
                onClick={onClick}
                onSelect={dropdownSelectHandle}
                onVisibleChange={onVisibleChange}
                prefixTemplate={() => {
                    return (
                        <span>12</span>
                    )
                }}
                suffixTemplate={() => {
                    return (
                        <span>12</span>
                    )
                }}
                value={'China'}
            ></DropdownButton>
        </div>);
        expect(toJson(wrapper)).toMatchSnapshot();

        wrapper.find('.ap-field-Dropdown-button-group').first().simulate('click');
        wrapper.find('.outside-btn').first().simulate('click');
        wrapper.find('.ap-field-Dropdown-button-group').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
        wrapper.find('.outside-btn').first().simulate('click');
        wrapper.find('.ap-field-Dropdown-button-group').first().simulate('keydown', { key: 'Space', preventDefault() { } });
        wrapper.find('.outside-btn').first().simulate('click');
        wrapper.find('.ap-field-Dropdown-button-group').first().simulate('keydown', { keyCode: 32, preventDefault() { } });
    });

    it('should be DropdownButton 2', () => {
        const onVisibleChange = jest.fn();
        const dropdownSelectHandle = jest.fn();
        const onClick = jest.fn();
        const wrapper = mount(<DropdownButton
            dropdownClassName={'ap-field-Dropdown'}
            splitButton={true}
            apperance='button'
            data={[
                {
                    label: 'China',
                    value: 'China',
                    descValue: '+86'
                }]}
            dropdownItemArialabel={true}
            onClick={onClick}
            onSelect={dropdownSelectHandle}
            onVisibleChange={onVisibleChange}
            prefixTemplate={() => {
                return (
                    <span>12</span>
                )
            }}
            suffixTemplate={() => {
                return (
                    <span>12</span>
                )
            }}
            value={'China'}
        ></DropdownButton>);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('.group-right').first().simulate('click');
        wrapper.find('.group-left').first().simulate('click');
        wrapper.find('.group-right').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
        wrapper.find('.group-right').first().simulate('keydown', { key: 'Space', preventDefault() { } });
        wrapper.find('.group-right').first().simulate('keydown', { keyCode: 32, preventDefault() { } });
    });

    it('should be DropdownButton 2', () => {
        const onVisibleChange = jest.fn();
        const dropdownSelectHandle = jest.fn();
        const wrapper = mount(<DropdownButton
            dropdownClassName={'ap-field-Dropdown'}
            splitButton={true}
            apperance='button'
            data={[
                {
                    label: 'China',
                    value: 'China',
                    descValue: '+86'
                }]}
            dropdownItemArialabel={true}
            visible={false}
            disabled={true}
            onSelect={dropdownSelectHandle}
            onVisibleChange={onVisibleChange}
            prefixTemplate={() => {
                return (
                    <span>12</span>
                )
            }}
            suffixTemplate={() => {
                return (
                    <span>12</span>
                )
            }}
            value={'China'}
        ></DropdownButton>);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('.group-right').first().simulate('click');
        wrapper.find('.group-left').first().simulate('click');
        wrapper.find('.group-right').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
        wrapper.find('.group-right').first().simulate('keydown', { key: 'Space', preventDefault() { } });
        wrapper.find('.group-right').first().simulate('keydown', { keyCode: 32, preventDefault() { } });
    });
})
