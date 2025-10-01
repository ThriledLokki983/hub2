import React from 'react';
import { mount } from 'enzyme';
import { Radio, RadioGroup } from '../index';
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
        const onClick = jest.fn();
        const wrapper = mount(
            <RadioGroup defaultValue={'2'} name="city" onChange={onChange}>
                <Radio value={'1'}>Hong Kong</Radio>
                <Radio value={'2'} onClick={onClick}>Stockholm</Radio>
                <Radio value={'3'}>São Paulo</Radio>
                <Radio value={'4'} disabled={true}>Saint Petersburg</Radio>
            </RadioGroup>);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('.ap-radio').first().simulate('click');
        wrapper.find('.ap-radio').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
        wrapper.find('.ap-radio').first().simulate('keydown', { key: 'Space', preventDefault() { } });
        wrapper.find('.ap-radio-input').first().simulate('focus');
        wrapper.find('.ap-radio-input').first().simulate('blur');
    });

})