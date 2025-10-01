import React from 'react';
import { mount } from 'enzyme';
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from '../index';
import toJson from 'enzyme-to-json';

describe('Badge', () => {

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('should be Breadcrumb', () => {
        const wrapper = mount(<Breadcrumb>
            <BreadcrumbItem currentPage={true}>
                <span className="Appkit4-icon icon-folder-closed-outline"></span>
                <span tabIndex={0}>Hong Kong</span>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <span tabIndex={0}>Stockholm</span>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <span tabIndex={0}>São Paulo</span>
            </BreadcrumbItem>
            <BreadcrumbItem currentPage={false} separator={<span className="Appkit4-icon icon-right-chevron-outline"></span>}>
                <span>Saint Petersburg</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator prefixCls="ap"></BreadcrumbSeparator>
        </Breadcrumb>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
    it('should be BreadcrumbItem', () => {
        const wrapper = mount(
            <BreadcrumbItem currentPage={false} separator={<span className="Appkit4-icon icon-right-chevron-outline"></span>}>
                <span>Saint Petersburg</span>
            </BreadcrumbItem>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
})