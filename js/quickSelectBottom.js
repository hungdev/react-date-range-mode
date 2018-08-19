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
    switch (rangeDay) {
      case 'today':
        this.props.onCustom(false)
        this.props.quickSetRangeDate('today')
        break;
      case 'yesterday':
        this.props.onCustom(false)
        // this.setState({ isSelected: rangeDay })
        break;
      case 'customRange':
        // this.setState({ isSelected: rangeDay })
        this.props.onCustom(true)
        break;
      default:
      //code block
    }
  }

  render() {
    const { className } = this.props;
    const { isSelected } = this.state;
    return (
      <div className={className}>
        <div className='button-select-bottom'>Day</div>
        <div className='button-select-bottom'>Week</div>
        <div className='button-select-bottom'>Quarter</div>
        <div className='button-select-bottom'>Year</div>
        <div className='button-select-bottom'>Apply</div>
        <div className='button-select-bottom'>Cancel</div>
      </div>
    );
  }
}
