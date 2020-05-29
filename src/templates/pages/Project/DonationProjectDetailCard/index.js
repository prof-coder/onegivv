import React, { Component } from 'react';

import NumberFormat from 'react-number-format';

import Card from '../../../common/Card';
import Button from '../../../common/Button';
import UserAvatar from '../../../common/userComponents/userAvatar';
import SharingModal from '../../../common/SharingModal';

import Money from './Money';

class DonationProjectDetailCard extends Component {

    state = {
        isSeeAll: false,
        initialDonorShowCount: 5
    }

    onSeeAll = () => {
        this.setState({
            isSeeAll: true
        });
    }

    render() {
        const { isSeeAll, initialDonorShowCount } = this.state;

        const { 
            project, 
            isMy, 
            gotToEditProject, 
            turnOnOffProject,
            cancelProject,
            isEnd,
            isCancel,
            isDonation,
            showSharingModalDonation,
            closeSharingModalDonation,
            showSharingDonation
        } = this.props;
        
        const url = process.env.REACT_APP_BACKEND_URL + `/project-preview/` + project._id;

        return (
            <section className="donationProjectDetailCardSection">
                <SharingModal url={url} content={project.title} showModal={showSharingDonation} closeModal={closeSharingModalDonation} />
                <Card className="donationProjectDetailCard">
                    <div className="titleBody">
                        <img src="/images/ui-icon/profile/donate-icon.svg" alt="donate-icon" />
                        <p>Make a donation</p>
                    </div>
                    <div className="donationStatusBody">
                        <Money project={project} isMy={isMy} isEnd={isEnd} isCancel={isCancel} />
                    </div>
                    <div className="facebookFlexWrapper">
                        <div className="facebook-btn">
                            <button 
                                className="button is-outlined is-rounded sharing-button"
                                onClick={e => {
                                    e.stopPropagation()
                                    showSharingModalDonation()
                                }}
                            >
                                Share
                            </button>
                        </div>
                        { isDonation && isMy &&
                            <div className="control-project" style={{ marginTop: 15 }}>
                                <Button
                                    label={project.isTurnedOff ? 'Turn On' : 'Turn Off'}
                                    inverse
                                    onClick={e => {
                                        e.stopPropagation()
                                        turnOnOffProject(project.isTurnedOff)
                                    }}
                                    disabled={false}
                                    padding="5px 5px"
                                    className="turnOffBtn"
                                />
                                <Button
                                    label={project.isCancel ? 'Recover' : 'Cancel'}
                                    inverse
                                    onClick={e => {
                                        e.stopPropagation()
                                        cancelProject(project.isCancel)
                                    }}
                                    disabled={false}
                                    padding="5px 5px"
                                    className="cancelBtn"
                                />
                                <Button
                                    label="Edit"
                                    inverse
                                    onClick={e => {
                                        e.stopPropagation()
                                        gotToEditProject()
                                    }}
                                    disabled={project.isTurnedOff || project.isCancel}
                                    padding="5px 5px"
                                    className="editBtn"
                                />
                            </div>
                        }
				    </div>
                    <div className="donatesListBody">
                        <div className="donatesList">
                            { project.money && project.money.donate_list && project.money.donate_list.length > 0 && project.money.donate_list.map((e, i) => {
                                if (!isSeeAll && i >= initialDonorShowCount) {
                                    return (null)
                                } else {
                                    return (
                                        <div className="eachDonate" key={i}>
                                            <div>
                                                <UserAvatar
                                                    imgUser={e.avatar}
                                                    imgUserType={0}
                                                    userId={e._id}
                                                    size={40}
                                                />
                                                <p className="name">{e.firstName}&nbsp;{e.lastName}</p>
                                            </div>
                                            <p className="amount">
                                                <NumberFormat value={e.amount} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                            </p>
                                        </div>
                                    )
                                }
                            }) }
                        </div>
                        <div className="seeAllBtnBody">
                            <div className="seeAllBtn" onClick={this.onSeeAll}>
                                <p>See All</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </section>
        )
    }

}

export default DonationProjectDetailCard