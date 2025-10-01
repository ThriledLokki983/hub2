import React from 'react';
import { mount } from 'enzyme';
import { Select, SelectGroup } from '../index';
import toJson from 'enzyme-to-json';
import { Badge } from '../../badge/index';

describe('Select', () => {

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('should be select', () => {
        const onselect = jest.fn();
        const wrapper = mount(
            <div><Select
                required
                data={[
                    { value: 0, label: 'Default1' },
                    { value: 'item2', label: 'Disabled' },
                    { value: 'item3', label: 'Icon', iconName: 'thumb-up-outline' },
                    { value: 'item4', label: 'Badge', badgeValue: 'New' },
                    { value: 'item5', label: 'Description', descValue: 'Lorem ipsum' },
                ]}
                defaultValue={NaN}
                disabledItemValues={['item2']}
                badgeTemplate={item => {
                    return (item.badgeValue && <Badge size="lg" style={{ marginLeft: 8 }} value={item.badgeValue}></Badge>)
                }}
                prefixTemplate={item => {
                    return (item.iconName && <span className={`Appkit4-icon icon-${item.iconName}`}></span>)
                }}
                // searchable
                onSelect={onselect}>
            </Select>
                <SelectGroup></SelectGroup>
            </div>);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('.ap-dropdown-single').first().simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
        wrapper.find('.ap-dropdown-single').first().simulate('keydown', { key: 'ArrowUp', preventDefault() { } });
        wrapper.find('.ap-dropdown-single').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
        wrapper.find('.ap-dropdown-single').first().simulate('click');
        wrapper.find('.ap-option-item').first().simulate('click');
        wrapper.find('.ap-dropdown-single').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
        wrapper.find('.ap-dropdown-single').first().simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
        wrapper.find('.ap-dropdown-single').first().simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
        wrapper.find('.ap-dropdown-single').first().simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
        wrapper.find('.ap-dropdown-single').first().simulate('keydown', { key: 'ArrowDown', preventDefault() { } });
        wrapper.find('.ap-dropdown-single').first().simulate('keydown', { key: 'ArrowUp', preventDefault() { } });
        wrapper.find('.ap-dropdown-single').first().simulate('keydown', { key: ' ', preventDefault() { } });
        wrapper.find('.ap-dropdown-single').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
        wrapper.find('.ap-dropdown-single').first().simulate('keydown', { key: 'Tab', preventDefault() { } });
        wrapper.find('.ap-dropdown-single').first().simulate('click');
        wrapper.find('.ap-dropdown-single').first().simulate('keydown', { key: 'Escape', preventDefault() { } });
    });

    it('should be select MULTI SEARCH', () => {
        const onSelect = jest.fn();
        const wrapper = mount(
            <Select
                data={[
                    { value: 'item1', label: 'White' },
                    { value: 'item2', label: 'Black' },
                    { value: 'item3', label: 'Pink' },
                    { value: 'item4', label: 'Small' },
                    { value: 'item5', label: 'Medium' },
                    { value: 'item6', label: 'Large' },
                    { value: 'item7', label: 'Extra large' }
                ]}
                onVisibleChange={(open) => { console.log("dropdown state:", open) }}
                searchPlaceholder={"Search"}
                placeholder={"Dropdown"}
                searchable={true}
                value={['item4', 'item6']}
                onSelect={onSelect}
                multiple
                visible={true}
                disabled={false}
                searchKeyword='L'
            >
            </Select>);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('.ap-dropdown-multiple').first().simulate('click');
        wrapper.find('.ap-option-item').first().simulate('click');
        wrapper.find('.ap-search-input .ap-field-input').first().simulate('change', { key: 'la', preventDefault() { } });
        wrapper.find('.ap-dropdown-multiple').first().simulate('keydown', { keyCode: '80', preventDefault() { } });
        wrapper.find('.ap-dropdown-multiple').first().simulate('keydown', { keyCode: '110', preventDefault() { } });
    });

})