import React, {Component} from 'react';
import { connect } from 'react-redux';

import DatePicker from 'react-datepicker';
import moment from 'moment';

import { history } from '../../../../store';

import Button from '../../../common/Button';
import { signUp } from '../../../common/authModals/modalTypes'

import { createGive, updateGive } from '../../../../actions/give';
import { VOLUNTEER } from '../../../../helpers/projectTypes';

class VolunteerForm extends Component {

    state = {
        skills: '',
        date: moment().startOf('day'),
		startTime: moment().add(2, 'h'),
		endTime: moment()
			.add(2, 'h')
            .add(30, 'm'),
        isRequest: false,
        availabilityTimeList: [],
        inputSkillErr: false
    }

    componentDidMount() {
        if (this.props._id) {
            this.setState({
                skills: this.props.vol.skills,
                date: moment.unix(this.props.giveAt),
                startTime: moment.unix(this.props.vol.startTime),
                endTime: moment.unix(this.props.vol.endTime),
                availabilityTimeList: [{
                    index: 0,
                    date: moment.unix( this.props.giveAt),
                    startTime: moment.unix(this.props.vol.startTime),
                    endTime: moment.unix(this.props.vol.endTime)
                }]
            });
        } else {
            this.setState({
                availabilityTimeList: [{
                    index: 0,
                    date: moment().startOf('day'),
                    startTime: moment().add(2, 'h'),
                    endTime: moment().add(2, 'h').add(30, 'm')
                }] 
            });
        }
    }

    inputHelper = key => e => {
        if (key === 'skills') {
            if (e.target.value) {
                this.setState({
                    inputSkillErr: false
                });
            }
        }
        this.setState({ [key]: e.target.value });
    }

    handlingTime = (index, key) => e => {
        let currentValue = e;

        this.setState(prevState => ({
            availabilityTimeList: prevState.availabilityTimeList.map(each => {
                if (each.index === index) {
                    let availabilityTimeInfo = {...each};
                    availabilityTimeInfo[key] = currentValue;
                    
                    return availabilityTimeInfo;
                } else {
                    return {...each};
                }
            })
        }));
    }

    onClickAdd = e => {
        let { isAuth } = this.props;
        if (!isAuth)
            return;

        let { availabilityTimeList } = this.state;

        let newAvailabilityTime;
        if (this.props._id) {
            newAvailabilityTime = {
                index: availabilityTimeList[availabilityTimeList.length - 1].index + 1,
                date: moment.unix(this.props.giveAt),
                startTime: moment.unix(this.props.vol.startTime),
                endTime: moment.unix(this.props.vol.endTime)
            };
        } else {
            newAvailabilityTime = {
                index: availabilityTimeList[availabilityTimeList.length - 1].index + 1,
                date: moment().startOf('day'),
                startTime: moment().add(2, 'h'),
                endTime: moment().add(2, 'h').add(30, 'm'),
            };
        }

        this.setState(prevState => ({
            availabilityTimeList: [...prevState.availabilityTimeList, newAvailabilityTime]
        }));
    }

    onClickDelete = index => e => {
        let { isAuth } = this.props;
        if (!isAuth)
            return;

        let { availabilityTimeList } = this.state;

        if (availabilityTimeList.length === 1) {
            let newAvailabilityTimeList;
            if (this.props._id) {
                newAvailabilityTimeList = [{
                    index: 0,
                    date: moment.unix(this.props.giveAt),
                    startTime: moment.unix(this.props.vol.startTime),
                    endTime: moment.unix(this.props.vol.endTime)
                }];
            } else {
                newAvailabilityTimeList = [{
                    index: 0,
                    date: moment().startOf('day'),
                    startTime: moment().add(2, 'h'),
                    endTime: moment().add(2, 'h').add(30, 'm'),
                }];
            }
            this.setState({
                availabilityTimeList: newAvailabilityTimeList
            });
        } else if (availabilityTimeList.length > 1) {
            this.setState(prevState => ({
                availabilityTimeList: prevState.availabilityTimeList.filter(e => e.index !== index)
            }));
        }
    }

    onComplete = e => {
        const { isAuth } = this.props;
        if (!isAuth) {
            this.props.closeModal && this.props.closeModal();
            history.push(`?modal=${signUp}`);
            return;
        }

        const { skills, date, availabilityTimeList } = this.state;

        if (!skills) {
            this.setState({
                inputSkillErr: true
            });
            return;
        }
        
        let savedTimeList = [];
        savedTimeList = availabilityTimeList.map(e => {
            let clonedStartTime = e.startTime.clone();
            let clonedEndTime = e.endTime.clone();

            clonedStartTime.set({ day: e.date.get('date'), year: e.date.get('year'), month: e.date.get('month') });
            clonedEndTime.set({ day: e.date.get('date'), year: e.date.get('year'), month: e.date.get('month') });

            let duration = moment.duration(clonedEndTime.diff(clonedStartTime));

            return {
                activeHours: duration.asHours(),
                startTime: clonedStartTime.format('X'),
                endTime: clonedEndTime.format('X'),
            };
        });
        
        this.setState({ isRequest: true });

        if (this.props._id) {
            var data = {
                _id: this.props._id,
                type: VOLUNTEER,
                giveAt: date.format('X'),
                volunteer: {
                    skills: skills,
                    availability: savedTimeList
                },
                cb: () => {
                    this.props.closeModal && this.props.closeModal()
                }
            }
            this.props.updateGive(data);
        } else {
            data = {
                nonprofit: this.props.selectedUser._id,
                type: VOLUNTEER,
                giveAt: date.format('X'),
                volunteer: {
                    skills: skills,
                    availability: savedTimeList
                },
                cb: () => {
                    this.props.closeModal && this.props.closeModal()
                }
            }
            this.props.createGive(data);
        }
    }

    render() {
        const hour = 23 - moment().format('H');
        const { skills, date, availabilityTimeList, isRequest, inputSkillErr } = this.state;
        const { isAuth } = this.props;

        return (
            <section className="volunteerFormSection">
                <div className="titleBody">
                    <img src="/images/ui-icon/profile/volunteer-icon.svg" alt="volunteer-icon" />
                    <p>Enter Volunteer Information</p>
                </div>
                <div className="row">
                    <p className="desc center">List your skills that could help this nonprofit :</p>
                    <input
                        className={`vol-form-input ${inputSkillErr ? 'hasErr' : ''}`} 
                        disabled={isAuth ? false : true} 
                        placeholder="Your skills..." 
                        value={skills} 
                        onChange={this.inputHelper('skills')} />
                    { inputSkillErr && <p className="skillRequiredErrMsg">Please input your skills</p> }
                </div>
                <div className="row">
                    <p className="title center m-b-10">Availability</p>
                    <p className="desc center">Select the days of the week you're available to volunteer</p>
                    { availabilityTimeList && availabilityTimeList.length > 0 && availabilityTimeList.map((e, i) => {
                        return (
                            <div className="row eachAvailabilityTimeList" key={e.index}>
                                <div className="delete" onClick={this.onClickDelete(e.index)}></div>
                                <DatePicker
                                    className="control width-250"
                                    selected={e.date}
                                    key={e.date}
                                    onChange={this.handlingTime(e.index, 'date')}
                                    minDate={moment()}
                                    dateFormat="dddd, MMMM Do YYYY"
                                    disabledKeyboardNavigation
                                    disabled={isAuth ? false : true}
                                />
                                <p className="title center timeTitle">Time</p>                        
                                <div className="row flex timeRow" key={e.index}>
                                    <div className="customDatePickerWidth">
                                        <DatePicker
                                            className="control width-90"
                                            selected={e.startTime}
                                            key={e.startTime}
                                            onChange={this.handlingTime(e.index, 'startTime')}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            dateFormat="h:mm A"
                                            minTime={
                                                !date.isSame(new Date(), 'day')
                                                    ? moment().startOf('day')
                                                    : moment().add(2, 'h')
                                            }
                                            maxTime={
                                                !date.isSame(new Date(), 'day')
                                                    ? moment().endOf('day')
                                                    : moment().add(hour, 'h')
                                            }
                                            disabledKeyboardNavigation
                                            disabled={isAuth ? false : true}
                                        />
                                    </div>
                                    <p className="desc">to</p>
                                    <div className="customDatePickerWidth">
                                        <DatePicker
                                            className="control width-90"
                                            selected={e.endTime}
                                            key={e.endTime}
                                            onChange={this.handlingTime(e.index, 'endTime')}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={10}
                                            dateFormat="h:mm A"
                                            minTime={moment(e.startTime).add(30, 'm')}
                                            maxTime={moment().endOf('day')}
                                            disabledKeyboardNavigation
                                            disabled={isAuth ? false : true}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    }) }
                </div>
                <div className="row p-t-0 p-b-0" style={{ textAlign: 'center' }}>
                    <p className="title center">Add more availability</p>
                    <img className="plusBtn" src="/images/ui-icon/profile/add_availability_icon.svg" alt="item-plus-btn" onClick={this.onClickAdd} />
                </div>
                <div className="row center">
                    <Button label="Send Availability" 
                        disabled={isRequest} 
                        padding="13px 60px" 
                        fontSize="18px" noBorder solid 
                        onClick={this.onComplete} />
                </div>
            </section>
        )
    }
}

const mapStateToProps = state => ({	
    user: state.authentication.user,
    isAuth: state.authentication.isAuth
})

const mapDispatchToProps = {
    createGive,
    updateGive
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VolunteerForm)