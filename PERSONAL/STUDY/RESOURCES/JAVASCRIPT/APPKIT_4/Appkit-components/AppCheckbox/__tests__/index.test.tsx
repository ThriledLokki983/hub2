import React from 'react';
import { mount } from 'enzyme';
import { Checkbox, CheckboxGroup } from '../index';
import toJson from 'enzyme-to-json';

describe('Badge', () => {

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('should be radio', () => {
        const onChange = jest.fn();
        const wrapper = mount(
            <CheckboxGroup value={["2"]} name="city" onChange={onChange}>
                <Checkbox value={'1'}>Hong Kong</Checkbox>
                <Checkbox value={'2'}>Stockholm</Checkbox>
                <Checkbox value={'3'}>São Paulo</Checkbox>
                <Checkbox value={'4'} disabled={true}>Saint Petersburg</Checkbox>
            </CheckboxGroup>);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('.ap-checkbox').first().simulate('click');
        wrapper.find('.ap-checkbox').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
        wrapper.find('.ap-checkbox').first().simulate('keydown', { key: 'Space', preventDefault() { } });
        wrapper.find('.ap-checkbox-input').first().simulate('focus');
        wrapper.find('.ap-checkbox-input').first().simulate('blur');
    });

})