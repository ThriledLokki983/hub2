import React, { PureComponent } from 'react';
import Months from './YearView/Months';
import ClassNames from 'classnames';

type YearViewPropsType = {
  keyboradHighlight?: any,
  activeStartDate?: any,
  formatMonth?: any,
  locale?: string,
  maxDate?: any,
  minDate?: any,
  onChange?: Function,
  setActiveRange?: Function,
  value?: any,
  valueType?: string,
  onClick: any,
}
export default class YearView extends PureComponent<YearViewPropsType> {
  renderMonths() {
    return (
      <Months {...this.props} />
    );
  }

  render() {
    const { keyboradHighlight } = this.props;

    const className = ClassNames('react-calendar__year-view',
      {
        "keyboard-date-view-inner-highlight": keyboradHighlight
      }
    );

    return (
      <div className={className}>
        {this.renderMonths()}
      </div>
    );
  }
}
