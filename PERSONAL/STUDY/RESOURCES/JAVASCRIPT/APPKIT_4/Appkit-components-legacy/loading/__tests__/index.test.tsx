import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Loading } from '../index';
describe('Loading', () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('render Loading baseline', () => {
        const wrapper = mount(

            <>
                <Loading indeterminate={true} linearWidth={'350px'} compact={true}></Loading>
                <Loading indeterminate={false} compact={false}></Loading>
                <Loading loadingType="circular" circularWidth={'50px'} indeterminate={false} compact={false}></Loading>
                <Loading loadingType="circular" circularWidth={'100px'} indeterminate={true} compact={false}></Loading>
            </>
        );
        expect(toJson(wrapper)).toMatchSnapshot();

    });

})
