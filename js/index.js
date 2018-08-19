import React from 'react';
import moment from 'moment';
import CommonFn from './commonFn';
import QuickSelectRight from './quickSelectRight';
import QuickSelectBottom from './quickSelectBottom';
import min from 'lodash/min';
import max from 'lodash/max';
import CalendarSelect from './calendarSelect';
import 'font-awesome/css/font-awesome.css';
import '../assets/style/main.css';

export default class DateRange extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      format: props.format || 'x', // Date format
      minDate: CommonFn.ymd(props.minDate || '1900-01-01'),
      maxDate: CommonFn.ymd(props.maxDate || '2200-01-01'),
      startMonth: CommonFn.ym(props.startDate), // Default start month (current month)
      endMonth: props.endDate && !props.sync ? CommonFn.ym(props.endDate)
        : moment(props.startDate || undefined).add(1, 'months').format('YYYY-MM'), // Default end month (current month + 1)
      showCalendar: false, // show calendar
      startDate: props.startDate ? CommonFn.ymd(props.startDate) : '', // Default start time
      endDate: props.endDate ? CommonFn.ymd(props.endDate) : '', // Default end time
      hoverTime: '', // Mouse hover date
      isSelecting: '', //Select status: '', 'startDate', 'endDate'
      placeholder: props.placeholder || 'YYYY-MM-DD',
      lang: props.lang === 'zh-cn' ? 'zh-cn' : 'en',
      sync: props.sync || false, // the left and right months are synchronized

      isCustom: false
    };

    this.dateCallback = this.dateCallback.bind(this);
  }

  // Show, hide calendar
  dateSectionDisplay(type) {
    const { startMonth, endMonth, showCalendar } = this.state;
    if (showCalendar !== (type === 'show')) {
      // Processing start and end month display order
      if (startMonth > endMonth) {
        this.setState({
          startMonth: endMonth,
          endMonth: startMonth,
        });
      } else if (startMonth === endMonth) {
        this.setState({
          endMonth: moment(endMonth).add(1, 'month').format('YYYY-MM'),
        });
      }

      this.setState({
        showCalendar: type === 'show',
        isSelecting: type === 'show' ? 'startDate' : '',
      });
    }
  }

  // Modify the year and month of the calendar display
  calendarChange(type, unit, section) {
    if (!this.state.sync) {
      const name = `${section}Month`;
      this.setState({
        [name]: moment(this.state[name]).add(type, unit).format('YYYY-MM'),
      });
    } else {
      this.setState({
        startMonth: moment(this.state.startMonth).add(type, unit).format('YYYY-MM'),
        endMonth: moment(this.state.endMonth).add(type, unit).format('YYYY-MM'),
      });
    }
  }

  // Click on the calendar date to select the time
  selectTime(time) {
    if (this.state.isSelecting === 'startDate') { // select first time
      this.setState({
        startDate: time,
        endDate: time,
        isSelecting: 'endDate',
        hoverTime: time,
      }, this.dateCallback);
    } else if (this.state.isSelecting === 'endDate') {  // select second time
      let { startDate, endDate } = this.state;
      if (startDate > time) {
        endDate = startDate;
        startDate = time;
      } else {
        endDate = time;
      }
      this.setState({
        startDate,
        endDate,
        isSelecting: '',
        showCalendar: false,
      }, this.dateCallback);
    }
  }

  // Mouse hover date, selected area
  mouseEnterTime(time) {
    if (this.state.isSelecting === 'endDate') {
      this.setState({ hoverTime: time });
    }
  }

  // the date is selected
  isSelected(date) {
    const { startDate, endDate, hoverTime } = this.state;
    const timeArr = [startDate, endDate];
    if (hoverTime) timeArr.push(hoverTime);
    if (date > min(timeArr) && date < max(timeArr)) {
      return 'selected';
    } else if (date === min(timeArr) || date === max(timeArr)) {
      return 'start-or-end-selected';
    }
    return '';
  }

  // When you select the time, the mouse moves out of the calendar area
  calendarMouseLeave() {
    if (this.state.isSelecting === 'endDate') {
      this.setState({ hoverTime: '' });
    }
  }

  // Callback component external method, outgoing modification
  dateCallback() {
    const { changeStartDate, changeEndDate } = this.props;
    const { startDate, endDate, format } = this.state;
    if (changeStartDate) {
      changeStartDate(moment(startDate).format(format));
    }
    if (changeEndDate) {
      changeEndDate(
        moment(endDate)
          .set({
            hour: 23,
            minute: 59,
            second: 59,
            millisecond: 999,
          })
          .format(format)
      );
    }
  }

  quickSetRangeDate(range) {
    const { format } = this.state
    switch (range) {
      case 'today':
        this.setRangeCallback(moment().format(format), moment().format(format))
        break;
      case 'yesterday':
        // this.props.onCustom(false)
        this.setRangeCallback(moment().add(-1, 'days').format(format), moment().add(-1, 'days').format(format))
        break;
      case 'last7Days':
        this.setRangeCallback(moment().add(-7, 'days').format(format), moment().format(format))
        break;
      case 'last30Days':
        this.setRangeCallback(moment().add(-30, 'days').format(format), moment().format(format))
        break;
      case 'thisMonth':
        this.setRangeCallback(moment().startOf('month').format(format), moment().endOf("month").format(format))
        break;
      case 'lastMonth':
        this.setRangeCallback(moment().subtract(1,'months').startOf('month').format(format), moment().subtract(1,'months').endOf('month').format(format))
        break;
      case 'customRange':
        // this.setState({ isSelected: rangeDay })
        this.props.onCustom && this.props.onCustom(true)
        break;
      default:
      //code block
    }

  }

  setRangeCallback(startDate, endDate) {
    this.setState({
      startDate: startDate,
      endDate: endDate,
      // isSelecting: 'endDate',
      // hoverTime: moment().format(format),
      showCalendar: false,
    }, this.dateCallback);
  }

  render() {
    const { minDate, maxDate, startMonth, endMonth, startDate, endDate, showCalendar, placeholder, lang, sync, isCustom } = this.state;

    return (
      <div className="date-range-body">
        <div
          className="input-section"
          onClick={() => this.dateSectionDisplay('show')}
        >
          <input type="text" className="start-time" value={startDate} placeholder={placeholder} />
          <span className="clip-span">——</span>
          <input type="text" className="end-time" value={endDate} placeholder={placeholder} />
        </div>

        <div
          className={`date-section ${showCalendar && 'date-section-show'} ${!isCustom && 'quick-select-section-container'} `}
          style={!isCustom ? { width: 250 } : {}}
          onMouseLeave={() => this.calendarMouseLeave()}
        >
          {isCustom ?
            <div className='calendar-section'>
              <CalendarSelect
                // ref={ref => this.calendarStart = ref}
                className="date-start-section"
                calendarMonth={startMonth}
                minDate={minDate}
                maxDate={maxDate}
                lang={lang}
                sync={sync && 'start'}
                showCalendar={showCalendar}
                isSelected={item => this.isSelected(item)}
                selectTime={item => this.selectTime(item)}
                mouseEnterTime={item => this.mouseEnterTime(item)}
                calendarChange={(type, unit) => this.calendarChange(type, unit, 'start')}
              />

              <CalendarSelect
                className="date-end-section"
                calendarMonth={endMonth}
                minDate={minDate}
                maxDate={maxDate}
                lang={lang}
                sync={sync && 'end'}
                showCalendar={showCalendar}
                isSelected={item => this.isSelected(item)}
                selectTime={item => this.selectTime(item)}
                mouseEnterTime={item => this.mouseEnterTime(item)}
                calendarChange={(type, unit) => this.calendarChange(type, unit, 'end')}
              />
            </div> : null}
          <QuickSelectRight
            className={`quick-select-section ${!isCustom && 'padding-bottom-col-select'}`}
            style={{ paddingBottomWidth: 30 }}
            onCustom={(value) => this.setState({ isCustom: value })}
            quickSetRangeDate={(range) => this.quickSetRangeDate(range)}
          />
          {isCustom ?
            <QuickSelectBottom
              className='quick-select-bottom-section'
            /> : null}
        </div>
        {showCalendar &&
          <div className="bg-for-close" onClick={() => this.dateSectionDisplay('hide')} />
        }
      </div>
    );
  }
}
