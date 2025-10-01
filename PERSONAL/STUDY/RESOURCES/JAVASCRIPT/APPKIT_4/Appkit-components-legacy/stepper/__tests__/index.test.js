import React from 'react';
import { mount } from 'enzyme';
import {Steppers, Stepper} from '../index';

describe('Stepper', () => {
    it('render corrently', () => {
        const onActiveIndexChange = jest.fn(); // mock click prop
        const wrapper = mount(
        <Steppers onActiveIndexChange={onActiveIndexChange} >
            <Stepper label='test1' status='normal'></Stepper>
            <Stepper label='test2' status='normal'></Stepper>
            <Stepper status='normal'></Stepper>
            <Stepper label='test4' status='normal'></Stepper>
        </Steppers>
        );
        // test click
        wrapper.find('.ap-progress-stepper-btn').first().simulate('click');
        expect(onActiveIndexChange).toHaveBeenCalled();

        // test onkeydown
        wrapper.find('.ap-progress-stepper-btn').at(1).simulate('keydown', {key: 'ArrowLeft', preventDefault(){}});
        wrapper.find('.ap-progress-stepper-btn').at(1).simulate('keydown', {key: 'ArrowRight', preventDefault(){}});
        wrapper.find('.ap-progress-stepper-btn').at(1).simulate('keydown', {key: 'Enter', preventDefault(){}});

        // test onfocus
        wrapper.find('.ap-progress-stepper-btn').at(3).simulate('focus');
    });
});