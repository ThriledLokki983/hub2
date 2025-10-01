import React, { PureComponent } from 'react';
import Years from './DecadeView/Years';
import ClassNames from 'classnames';

type DecadeViewProps = {
  activeStartDate?: Date,
  locale?: string,
  maxDate?: Date,
  minDate?: Date,
  onChange?: Function,
  setActiveRange?: Function,
  value?: any,
  valueType?: string,
  keyboradHighlight?: any,
  onClick?: any
}
export default class DecadeView extends PureComponent<DecadeViewProps> {
  renderYears() {
    return (
      <Years {...this.props} />
    );
  }

  render() {
    const { keyboradHighlight } = this.props;

    const className = ClassNames("react-calendar__decade-view",
      {
        "keyboard-date-view-inner-highlight": keyboradHighlight
      }
    );

    return (
      <div className={className}>
        {this.renderYears()}
      </div>
    );
  }
}
