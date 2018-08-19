import React from 'react';
import CommonFn from './commonFn';
import moment from 'moment';

export default class CalendarSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onSelectDay(rangeDay) {
    this.setState({ isSelected: rangeDay })
    this.props.quickSetRangeDate(rangeDay)
    if (['today', 'yesterday', 'last7Days', 'last30Days', 'thisMonth', 'lastMonth'].includes(rangeDay)) {
      this.props.onCustom(false)
    } else {
      this.props.onCustom(true)
    }
  }

  render() {
    const { className } = this.props;
    const { isSelected } = this.state;
    return (
      <div className={className}>
        <div className={`select-button ${isSelected === 'today' && `selected-button`}`}
          onClick={() => this.onSelectDay('today')}>Today</div>
        <div className={`select-button ${isSelected === 'yesterday' && `selected-button`}`}
          onClick={() => this.onSelectDay('yesterday')}>Yesterday</div>
        <div className="select-button"
          onClick={() => this.onSelectDay('last7Days')}>Last 7 days</div>
        <div className="select-button"
          onClick={() => this.onSelectDay('last30Days')}>Last 30 days</div>
        <div className="select-button"
          onClick={() => this.onSelectDay('thisMonth')}>This Month</div>
        <div className="select-button"
          onClick={() => this.onSelectDay('lastMonth')}>Last Month</div>
        <div className={`select-button ${isSelected === 'customRange' && `selected-button`}`}
          onClick={() => this.onSelectDay('customRange')}>Custom Range</div>
      </div>
    );
  }
}
