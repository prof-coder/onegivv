import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

import {
	getRequestsByParams,
	clearRequests,
	confirmOrRejectParticipation
} from '../../../../actions/project'

import { getDonationListToNonprofit, getRecurringListToNonprofit } from '../../../../actions/donate'

import {
	VOLUNTEER,
	DONATION,
	PICKUP
} from '../../../../helpers/projectTypes'

import {
	PENDING,
	ACCEPT,
	REJECT
} from '../../../../helpers/participationTypes'

import RequestsTable from './RequestsTable'

class DonorRequests extends Component {

	state = {
		currentTab: "",
		page: 0,
		limit: 10,
		search: "",
		projectId: ""
	}

	componentWillUnmount() {
		this.props.clearRequests()
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.currentTab === '' && nextProps.activeType !== -1)
			this.setDefaultTab(nextProps.activeType)
		if (this.state.projectId !== nextProps.projectId) {
			this.setState( { page: 0, projectId: nextProps.projectId }, () => {
				this.loadRequests()
			} )
		}
	}

	setDefaultTab = (type) => {
		switch (type) {
			case VOLUNTEER:
				this.onVolunteerTab('all')
				break;
			case DONATION:
				this.onDonationTab('all')
				break;
			case PICKUP:
				this.onPickupTab('new')
				break;
			default:
				break;
		}
	}

	onVolunteerTab = tab => {
		this.setState({ currentTab: tab, page: 0 }, () => {
			this.loadRequests()
		})
	}

	onDonationTab = tab => {
		this.setState({ currentTab: tab, page: 0 }, () => {
			this.loadRequests()
		})
	}

	onPickupTab = tab => {
		this.setState({ currentTab: tab, page: 0 }, () => {
			this.loadRequests()
		})
	}

	loadRequests = () => {
		const { isAuth, authUser } = this.props;
		if (!isAuth)
			return;

		let { page, limit } = this.state;

		let query = {
			projectType: this.props.activeType,
			skip: this.state.page * this.state.limit,
			limit: this.state.limit,
			search: this.state.search,
			projectId: this.state.projectId
		}

		switch (query.projectType) {
			case VOLUNTEER:
				if (this.state.currentTab === 'new') {
					query = {
						...query,
						status: [PENDING]
					}
				}
				else if (this.state.currentTab === 'recurring') {
					query = {
						...query,
						status: [ACCEPT, REJECT]
					}
				}
				break;
			case DONATION:
				if (this.state.currentTab === 'recurring') {}
				else if (this.state.currentTab === 'non-cash') {}
				break;
			case PICKUP:
				if (this.state.currentTab === 'new') {
					query = {
						...query,
						status: [PENDING]
					}
				}
				else if (this.state.currentTab === 'upcoming') {
					query = {
						...query,
						status: [ACCEPT,REJECT]
					}
				}
				break;
			default:
				break;
		}

		if (query.projectType === VOLUNTEER) {
			this.props.getRequestsByParams(query)
		} else if (query.projectType === DONATION) {
			if (this.state.currentTab === 'all') {
				this.props.getDonationListToNonprofit({
					_id: authUser._id,
					skip: page * limit,
					limit: limit
				});
			} else if (this.state.currentTab === 'recurring') {
				this.props.getRecurringListToNonprofit({
					_id: authUser._id,
					skip: page * limit,
					limit: limit
				});
			}
		} else if (query.projectType === PICKUP) {
			this.props.getRequestsByParams(query)
		}
	}

	filterByUsername = e => {
		this.setState({ page: 0, search: e.target.value }, () => {
			this.loadRequests()
		})
	}

	gotoPage = page => {
		this.setState({ page: page }, () => {
			this.loadRequests()
		})
	}

	acceptRequest = e => {
		let need = {}
		need._id = e._id
		need.projectId = e.project._id
		need.status = ACCEPT

		this.props.confirmOrRejectParticipation(need)
	}

	rejectRequest = e => {
		let need = {}
		need._id = e._id
		need.projectId = e.project._id
		need.status = REJECT

		this.props.confirmOrRejectParticipation(need)
	}

	render() {
		const {
			currentTab,
			limit,
			page
		} = this.state

		const {
			activeType,
			requests,
			donationListToNonprofit,
			donationListToProject
		} = this.props

		return (
			<div className="CampaignsPageRequests">
				{ activeType === VOLUNTEER && 
					<div className="RequestsHeader">
						<NavLink to="#" className={`main-font tab ${currentTab === 'all' ? 'active' : ''}`} onClick={e => {
							e.stopPropagation()
							this.onVolunteerTab('all')
						}}>All Volunteers</NavLink>
						<NavLink to="#" className={`main-font tab ${currentTab === 'new' ? 'active' : ''}`} onClick={e => {
							e.stopPropagation()
							this.onVolunteerTab('new')
						}}>New Volunteer Applications</NavLink>
						<NavLink to="#" className={`main-font tab ${currentTab === 'recurring' ? 'active' : ''}`} onClick={e => {
							e.stopPropagation()
							this.onVolunteerTab('recurring')
						}}>Recurring Volunteers</NavLink>
					</div>
				}
				{ activeType === DONATION && 
					<div className="RequestsHeader">
						<NavLink to="#" className={`main-font tab ${currentTab === 'all' ? 'active' : ''}`} onClick={e => {
							e.stopPropagation()
							this.onDonationTab('all')
						}}>All Money Donations</NavLink>
						<NavLink to="#" className={`main-font tab ${currentTab === 'recurring' ? 'active' : ''}`} onClick={e => {
							e.stopPropagation()
							this.onDonationTab('recurring')
						}}>Recurring Gifts</NavLink>
						<NavLink to="#" className={`main-font tab ${currentTab === 'non-cash' ? 'active' : ''}`} onClick={e => {
							e.stopPropagation()
							this.onDonationTab('non-cash')
						}}>Non-Cash Gifts</NavLink>
					</div>
				}
				{ activeType === PICKUP && 
					<div className="RequestsHeader">
						<NavLink to="#" className={`main-font tab ${currentTab === 'new' ? 'active' : ''}`} onClick={e => {
							e.stopPropagation()
							this.onPickupTab('new')
						}}>New PickUp Request</NavLink>
						<NavLink to="#" className={`main-font tab ${currentTab === 'upcoming' ? 'active' : ''}`} onClick={e => {
							e.stopPropagation()
							this.onPickupTab('upcoming')
						}}>Upcoming PickUps</NavLink>
						<NavLink to="#" className={`main-font tab ${currentTab === 'all' ? 'active' : ''}`} onClick={e => {
							e.stopPropagation()
							this.onPickupTab('all')
						}}>All PickUps</NavLink>
					</div>
				}
				<div className="separator-25" />
				<div className="RequestsBody">
					<RequestsTable
						isToProject={false}
						activeType={activeType}
						requests={requests}
						donationListToNonprofit={donationListToNonprofit}
						donationListToProject={donationListToProject}
						page={page}
						gotoPage={this.gotoPage}
						limit={limit}
						filterByUsername={this.filterByUsername}
						acceptRequest={this.acceptRequest}
						rejectRequest={this.rejectRequest} />
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	authUser: state.authentication.user,
    isAuth: state.authentication.isAuth,
	requests: state.project.requests,
	donationListToNonprofit: state.donate.donationListToNonprofit,
	donationListToProject: state.donate.donationListToProject
})

const mapDispatchToProps = {
	getRequestsByParams,
	clearRequests,
	confirmOrRejectParticipation,
	getDonationListToNonprofit,
	getRecurringListToNonprofit
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DonorRequests)