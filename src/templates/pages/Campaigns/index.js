import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Header, Projects, DonorRequests } from './component'

import { VOLUNTEER, DONATION, PICKUP } from '../../../helpers/projectTypes'

import { setUnreadProjectsCount } from '../../../actions/authActions'
import { getNonprofitTotalDonation } from '../../../actions/donate'

import './campaigns.css'

const projectTypes = { volunteer: VOLUNTEER, donations: DONATION, pickup: PICKUP }

class Campaigns extends Component {
	
	state = {
		activeType: -1,
		selectedProject: "",
		userId: "",
		showWithdrawModal: false
	}

	componentDidMount() {
		const { user } = this.props;
		if (!user) {
			this.props.history.push('/')
			return;
		}

		const { campaign, id } = this.props.match.params
		
		if (projectTypes[campaign] !== undefined) {
			this.setState({ activeType: projectTypes[campaign] })
		} else {
			this.props.history.push('/')
		}

		if (id !== undefined) {
			this.setState({userId: id})
		} else {
			this.props.history.push('/')
		}

		this.props.dispatch(
			setUnreadProjectsCount({
				type: campaign
			})
		);

		this.props.dispatch(
			getNonprofitTotalDonation({
				_id: user._id
			})
		);

		window.scroll(0, 0);
	}

	onSelectProject = projectId => {
		this.setState({ selectedProject: projectId })
	}

	render() {
		const {
			activeType,
			selectedProject,
			userId
		} = this.state;

		const { nonprofitTotalDonation } = this.props;
		
		return (
			<div className="CampaignsPage">
				<Header activeType={activeType} userId={userId} />
				<div className="separator-30" />
				<Projects 
					activeType={activeType} 
					onSelectProject={this.onSelectProject} 
					selectedProject={selectedProject} 
					totalDonation={nonprofitTotalDonation} />
				<div className="separator-50" />
				<DonorRequests activeType={activeType} projectId={selectedProject} />
			</div>
		)
	}
}

const mapStateToProps = state => ({
	user: state.authentication.user,
	nonprofitTotalDonation: state.donate.nonprofitTotalDonation
})

export default connect(
	mapStateToProps,
	null
)(Campaigns)