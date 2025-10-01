import React from 'react';
import { mount } from 'enzyme';
import { Pagination } from '../index';
import toJson from 'enzyme-to-json';

describe('Badge', () => {

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('should be Pagination', () => {
        const onPageChange = jest.fn();
        const wrapper = mount(<Pagination key={2} current={2} total={520} onPageChange={onPageChange}></Pagination>);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('.ap-pagination-btn-prev').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
        wrapper.find('.ap-pagination-btn-next').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
        wrapper.find('.ap-field-input').first().simulate('change', { key: '3', preventDefault() { } });
        wrapper.find('.ap-field-input').first().simulate('keyup', { key: 'Enter', preventDefault() { } });
        wrapper.find('.ap-field-input').first().simulate('keyup', { key: 'Up', preventDefault() { } });
        wrapper.find('.ap-field-input').first().simulate('keyup', { key: 'Down', preventDefault() { } });
        // wrapper.find('.ap-field-input').first().simulate('keydown', { key: 'Up', preventDefault() { } });
        // wrapper.find('.ap-field-input').first().simulate('keydown', { key: 'Down', preventDefault() { } });
        wrapper.find('.ap-field-input').first().simulate('blur');
    });
    it('should be Pagination 1', () => {
        const onPageChange = jest.fn();
        const wrapper = mount(<Pagination key={2} current={666} total={520} onPageChange={onPageChange}></Pagination>);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('.ap-pagination-btn-prev').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
    });
    it('should be Pagination 2', () => {
        const onPageChange = jest.fn();
        const wrapper = mount(<Pagination key={2} current={-8} total={5} onPageChange={onPageChange}></Pagination>);
        expect(toJson(wrapper)).toMatchSnapshot();
        wrapper.find('.ap-pagination-btn-next').first().simulate('keydown', { key: 'Enter', preventDefault() { } });
    });
})