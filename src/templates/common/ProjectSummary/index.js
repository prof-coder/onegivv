import React, { Component } from 'react'

import { VOLUNTEER, DONATION, PICKUP } from '../../../helpers/projectTypes'
import Button from '../Button'
import UpdateModal from '../../pages/Campaigns/component/UpdateModal'
import DetailModal from '../../pages/Campaigns/component/DetailModal';

class ProjectSummary extends Component {

	state = {
		showUpdateModal: false,
		showDetailModal: false,
		activeType: -1
	}

	selectType = (type) => {
		switch (type) {
			case VOLUNTEER:
				return 'volunteer.svg'
			case DONATION:
				return 'money.svg'
			case PICKUP:
				return 'pink-up.svg'
			default:
				return ''
		}
	}

	onClickGiveUpdate = e => {
		if (e) {
			e.stopPropagation()
			e.preventDefault()
		}

		this.setState({
			showUpdateModal: true
		});
	}

	onClickViewVolunteer = e => {
		if (e) {
			e.stopPropagation()
			e.preventDefault()
		}

		this.setState({
			activeType: 0,
			showDetailModal: true
		});
	}

	onClickViewPickup = e => {
		if (e) {
			e.stopPropagation()
			e.preventDefault()
		}

		this.setState({
			activeType: 2,
			showDetailModal: true
		});
	}

	closeUpdateModal = e => {
		this.setState({
			showUpdateModal: false
		});
	}

	closeDetailModal = e => {
		this.setState({
			showDetailModal: false
		});
	}

	onUpdateComplete = info => e => {
		this.setState({
			showUpdateModal: false
		});
	}

	render() {
		const { _id, showSummary, closeSummary, title, projectType, isCancel, isTurnedOff, needs, money, donate_summary, project } = this.props
		const { showUpdateModal, showDetailModal, activeType } = this.state
		
		return (
			<div>
				<div className={`projectSummaryModal ${showSummary ? 'open' : ''}`}>
					<div className="projectSummaryContent">
						<div
							className={`project-type type-${projectType}`} onClick={() => closeSummary()}>
							<img
								className="type"
								src={`/images/ui-icon/${this.selectType(
									projectType
								)}`}
								alt="type"
							/>
						</div>
						{ (!isCancel && !isTurnedOff) && ( <div>
							<label className="complete">Completed</label>
						</div>) }
						{ isCancel && ( <div>
							<label className="cancel">Cancelled</label>
						</div>) }
						{ isTurnedOff && ( <div>
							<label className="cancel">Turned Off</label>
						</div>) }
						<div className="separator-10" />
						<div><label>Project:</label> {title}</div>
						{ projectType === VOLUNTEER && 
							<div>
								<div className="summary-item"><label>Volunteers:</label> <span className="count">{donate_summary && donate_summary.total_applicants}</span></div>
								<div className="separator-10" />
								<div className="action-buttons">
									<Button label="Give Update" solid padding="6px 12px" onClick={this.onClickGiveUpdate} />
									<Button label="View Volunteers" solid inverse padding="6px 12px" onClick={this.onClickViewVolunteer} />
								</div>
							</div>
						}
						{ projectType === DONATION &&
							<div>
								<div className="summary-item"><label>Raised:</label> <span className="count">${money && money.current}</span></div>
								<div className="summary-item"><label>Donors:</label> <span className="count">{money && money.total_applicants}</span></div>
								<div className="separator-10" />
								{/* <div className="action-buttons">
									<Button label="Withdraw" solid padding="6px 12px" />
								</div> */}
							</div>
						}
						{ projectType === PICKUP && 
							<div>
								<div className="summary-item"><label>Items Collected:</label> <span className="count">{donate_summary && donate_summary.current}</span></div>
								<div className="summary-item"><label>From:</label> <span className="count">{donate_summary && donate_summary.total_applicants}</span></div>
								<div className="picups">
									{ needs.map((e,i) => {
										return(<div key={`need-${_id}-${i}`} className="pickup summary-item">
											<label>{e.value}:</label><span className="count">{e.current}</span>
										</div>)
									})}
								</div>
								<div className="separator-10" />
								<div className="action-buttons">
									<Button label="View Pickups" solid padding="6px 12px" onClick={this.onClickViewPickup} />
									<Button label="Give Update" solid inverse padding="6px 12px" onClick={this.onClickGiveUpdate} />
								</div>
							</div>
						}
					</div>
				</div>
				<UpdateModal 
					projectTitle={title}
					showUpdateModal={showUpdateModal}
					closeUpdateModal={this.closeUpdateModal}
					onUpdateComplete={this.onUpdateComplete}
				/>
				<DetailModal
					activeType={activeType}
					project={project} 
					showDetailModal={showDetailModal}
					closeDetailModal={this.closeDetailModal} 
				/>
			</div>
		)
	}
}

export default ProjectSummary;