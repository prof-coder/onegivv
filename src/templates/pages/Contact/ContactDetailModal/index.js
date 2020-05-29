import React, { Component } from 'react';
import { connect } from 'react-redux';

import moment from 'moment';

import Modal from '../../../common/Modal';
import UserAvatar from '../../../common/userComponents/userAvatar';
import IconButton from '../../../common/IconButton';
import Autocomplete from '../../../common/Autocomplete'

import { editContact } from '../../../../actions/contact';
import { getDonationListToNonprofit } from '../../../../actions/donate';

class ContactDetailModal extends Component {

    allowedTime = moment()
		.subtract(16, 'year')
		.subtract(1, 'day')
		.format('YYYY-MM-DD')

    state = {
        isEditPhone: false,
        isEditBirthday: false,
        isEditAddress: false,
        phone: '',
        birthday: this.allowedTime,
        address: '',
        email: '',
        isModalShow: false
    }

    onChangePhone = e => {
        this.setState({
            phone: e.target.value
        });
    }

    onClickEditPhone = e => {
        if (!this.props.contactDetailInfo)
            return;

        this.setState(prevState => ({
            isEditPhone: !prevState.isEditPhone
        }));
        
        if (this.state.isEditPhone) {
            this.props.editContact({
				_id: this.props.contactDetailInfo._id,
				phone: this.state.phone,
				cb: () => {
				}
			})
        }
    }

    onChangeBirthday = e => {
		this.setState({
            birthday: e.target.value
        });
    }

    onClickEditBirthday = e => {
        if (!this.props.contactDetailInfo)
            return;

        this.setState(prevState => ({
            isEditBirthday: !prevState.isEditBirthday
        }));
        
        if (this.state.isEditBirthday) {
            let utcBirthday = parseInt(moment(this.state.birthday).valueOf() / 1000);
            this.props.editContact({
				_id: this.props.contactDetailInfo._id,
				birthDate: utcBirthday,
				cb: () => {
				}
			})
        }
    }

    onClickEditAddress = e => {
        if (!this.props.contactDetailInfo)
            return;

        this.setState(prevState => ({
            isEditAddress: !prevState.isEditAddress
        }));
        
        if (this.state.isEditAddress) {
            this.props.editContact({
				_id: this.props.contactDetailInfo._id,
				address: this.state.address,
				cb: () => {
				}
			})
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.contactDetailInfo && nextProps.contactDetailInfo.phone !== this.state.phone) {
            this.setState({
                phone: nextProps.contactDetailInfo.phone
            });
        }
        if (nextProps.contactDetailInfo && nextProps.contactDetailInfo.birthDate !== this.state.birthday) {
            this.setState({
                birthday: moment(nextProps.contactDetailInfo.birthDate * 1000).format('YYYY-MM-DD')
            });
        }
        if (nextProps.contactDetailInfo && nextProps.contactDetailInfo.address !== this.state.address) {
            this.setState({
                address: nextProps.contactDetailInfo.address
            });
        }
        if (nextProps.contactDetailInfo && nextProps.contactDetailInfo.email !== this.state.email) {
            this.setState({
                email: nextProps.contactDetailInfo.email,
                isModalShow: nextProps.showContactDetailModal
            });

            const { authUser } = this.props;
            if (!authUser || !authUser._id) {
                return;
            }
            
            this.props.getDonationListToNonprofit({
                _id: authUser._id,
                email: nextProps.contactDetailInfo.email,
                // email: "james@onebenefactor.com",
                skip: 0,
                limit: 3
            });
        }
    }

	render() {
        const { isEditPhone, isEditBirthday, isEditAddress, phone, birthday, address } = this.state;
        const { contactDetail, contactDetailInfo, showContactDetailModal, closeContactDetailModal, donationListToNonprofit } = this.props;

        if (!contactDetailInfo) {
            return (null);
        }
        
        return (
            <div className="contactDetailModal">
                <Modal title="" showModal={showContactDetailModal} closeModal={() => { closeContactDetailModal(); }}>
                    <div className="content">
                        <div className="left-content">
                            <div className="main-info">
                                <div className="left-wrap">
                                    <div className="info-wrapper">
                                        { contactDetailInfo && contactDetailInfo.contact && <UserAvatar
                                            imgUserType={contactDetailInfo.contact.role}
                                            imgUser={contactDetailInfo.contact.avatar}
                                            userId={contactDetailInfo.contact._id}
                                        />}
                                        { (!contactDetailInfo || !contactDetailInfo.contact) && <div className="empty-avatar" />}
                                        <section className="label">
                                            <div className="label-name">
                                                {contactDetailInfo && contactDetailInfo.fullName}
                                            </div>
                                            <div className="label-contact">
                                                Contact
                                            </div>
                                        </section>
                                    </div>
                                    <div className="social-buttons">
                                        <img className="social-btn" src="/images/ui-icon/social/icon-facebook.svg" alt="facebook" />
                                        <img className="social-btn" src="/images/ui-icon/social/icon-linkedin.svg" alt="linkedin" />
                                        <img className="social-btn" src="/images/ui-icon/social/icon-twitter.svg" alt="twitter" />
                                        <img className="social-btn" src="/images/ui-icon/social/icon-google.svg" alt="google" />
                                    </div>
                                </div>
                                <div className="right-wrap">
                                    <div className="flexBody">
                                        { !isEditPhone && <IconButton icon="/images/ui-icon/icon-phone.svg" label={phone} size="22px" /> }
                                        { isEditPhone &&
                                            <div className="flexBody inner">
                                                <img src="/images/ui-icon/icon-phone.svg" alt="icon-phone" className="phoneIcon" />
                                                <input type="text" value={phone} onChange={this.onChangePhone} className="phoneInput" />
                                            </div>
                                        }
                                        { !contactDetail && <img src="/images/ui-icon/profile/pencil-icon.svg" alt="edit-phone" className="editIcon" onClick={this.onClickEditPhone} /> }
                                    </div>
                                    <div className="flexBody">
                                        <IconButton icon="/images/ui-icon/icon-message.svg" label={contactDetailInfo && contactDetailInfo.email} size="22px" />
                                    </div>
                                    <div className="flexBody">
                                        <IconButton icon="/images/ui-icon/contact/chat_icon.svg" label="Message" size="22px" />
                                    </div>
                                </div>
                            </div>
                            <div className="donation-info">
                                <div className="info tot">
                                    <span className="_value">${contactDetail && contactDetail.totalDonation}</span>
                                    <span className="_label">Total Donation</span>
                                </div>
                                <div className="info last">
                                    <span className="_value">${contactDetail && (contactDetail.lastDonation || 0)}</span>
                                    <span className="_label">Last Donation</span>
                                </div>
                                <div className="info volunteer">
                                    <span className="_value">{contactDetail && contactDetail.totalHours} Hours</span>
                                    <span className="_label">Volunteer Hours</span>
                                </div>
                            </div>
                            <div className="detail-info border">
                                <div className="_label">Last Volunteer Record</div>
                                <div className="_value">{contactDetail && contactDetail.lastActivity && contactDetail.lastActivity.createdAt && moment(contactDetail.lastActivity.createdAt).format("MMMM D, YYYY")}</div>
                            </div>
                            <div className="detail-info border">
                                <div className="_label">Membership Start</div>
                                <div className="_value">{contactDetail && moment(contactDetail.memberSince).format("MMMM D, YYYY")}</div>
                            </div>
                            <div className="detail-info border">
                                <div className="_label">Membership End</div>
                                <div className="_value">{contactDetail && contactDetail.memberEnd && moment(contactDetail.memberEnd).format("MMMM D, YYYY")}</div>
                            </div>
                            <div className="detail-info">
                                <div className="_label">Last Contact</div>
                                <div className="_value">{contactDetail && contactDetail.lastContact && moment(contactDetail.lastContact).format("MMMM D, YYYY")}</div>
                            </div>
                        </div>
                        <div className="right-content">
                            <div className="flexBody">
                                { !isEditBirthday && <IconButton icon="/images/ui-icon/contact/icon-birthday.svg" label={`Birthday :  ${moment(birthday).format("MMMM D, YYYY")}`} size="22px" /> }
                                { isEditBirthday &&
                                    <div className="flexBody inner">
                                        <img src="/images/ui-icon/contact/icon-birthday.svg" alt="icon-birthday" className="birthdayIcon" />
                                        <input
                                            className="date-input"
                                            type="date"
                                            name="birthday"
                                            max={this.allowedTime}
                                            value={birthday}
                                            onChange={this.onChangeBirthday}
                                        />
                                    </div>
                                }
                                { !contactDetail && <img src="/images/ui-icon/profile/pencil-icon.svg" alt="edit-birthday" className="editIcon" onClick={this.onClickEditBirthday} /> }
                            </div>
                            <div className="flexBody">
                                { !isEditAddress && <IconButton icon="/images/ui-icon/contact/location_icon.svg" label={address} size="22px" /> }
                                { isEditAddress &&
                                    <div className="flexBody inner">
                                        <img src="/images/ui-icon/contact/location_icon.svg" alt="icon-address" className="addressIcon" />
                                        <Autocomplete
                                            update={({ location }) =>
                                                this.setState({ address: location.name })
                                            }
                                            name="address"
                                            placeholder="address"
                                            inputPlaceholder="Please input your billing address"
                                            address={address}
                                            className="autocomplete-settings"
                                            errorHandler={<div className="errorHandler" />}
                                        />
                                    </div>
                                }
                                { !contactDetail && <img src="/images/ui-icon/profile/pencil-icon.svg" alt="edit-address" className="editIcon" onClick={this.onClickEditAddress} /> }
                            </div>
                            <div className="activity">
                                <img className="_icon" src="/images/ui-icon/contact/icon-calendar.svg" alt="" />
                                <span className="_label">Activity</span>
                            </div>
                            <div className="activity-year">
                                { donationListToNonprofit && donationListToNonprofit.total > 0 && donationListToNonprofit.rows &&
                                    moment(donationListToNonprofit.rows[0].createdAt).format('YYYY')
                                }
                                { (!donationListToNonprofit || donationListToNonprofit.total === 0 || !donationListToNonprofit.rows )&&
                                    moment().format('YYYY')
                                }
                            </div>
                            <div className="timeline">
                                { donationListToNonprofit && donationListToNonprofit.total > 0 && donationListToNonprofit.rows && donationListToNonprofit.rows.map(each => {
                                    return (
                                        <div className="timeline-item" key={each._id}>
                                            <div className="timeline-icon">
                                                <img src="/images/ui-icon/icon-message.svg" alt="" />
                                            </div>
                                            <div className="timeline-content">
                                                <span className="date">{moment(each.createdAt).format('M/D/YYYY hh:mm A')}</span>
                                                { each.projectInfo &&
                                                    <span className="act">Donation to project ({each.projectInfo.title}) for ${each.amount}</span>
                                                }
                                                { !each.projectInfo &&
                                                    <span className="act">General donation for ${each.amount}</span>
                                                }
                                            </div>
                                        </div>
                                    )
                                }) }
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
		)
	}
}

const mapStateToProps = state => ({
    authUser: state.authentication.user,
    donationListToNonprofit: state.donate.donationListToNonprofit
});

const mapDispatchToProps = {
    editContact,
    getDonationListToNonprofit
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ContactDetailModal);