import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import Switch from "react-switch"

import NumberFormat from 'react-number-format'

import Button from '../../../../common/Button'

import { VOLUNTEER, DONATION, PICKUP } from '../../../../../helpers/projectTypes';

class MiniCard extends Component {

	state = {
	}

	componentDidMount() {
	}

	changeView = e => {}

	render() {
		const {
			userId,
			projectId,
			cover,
			title,
			onDetailView,
			onUpdateModal,
			onSelectProject,
			isSelected,
			isTemplateProject,
			isEnd,
			isCancel,
			activeType,
			projectType,
			donate_summary,
			money,
			needs
		} = this.props;

		let proc = 0, total = 0, current = 0;
		
		if (projectType === DONATION || projectType === PICKUP) {
			if (money) {
				total = money.total;
				current = money.current;
				proc = (money.current / money.total) * 100;
			} else {
				if (donate_summary) {
					if (donate_summary.total) total = donate_summary.total;
					if (donate_summary.total_applicants) current = donate_summary.total_applicants;
					proc = (current / total) * 100;
				}
			}
		} else if (projectType === VOLUNTEER) {
			if (needs && needs.length > 0) {
				for (let i = 0; i < needs.length; i++) {
					total = needs[i].of;
					current = needs[i].current;
				}
				proc = (current / total) * 100;
			}
		}
		
		return (
			<div className={`ProjectMiniCard ${isSelected && 'active'}`}>
				<div className="CardBody">
					<div className="CardHeader">
						<label htmlFor="switch-view">
							<Switch
								id="switch-view"
								onChange={this.changeView}
								checked={false}
								offColor="#1AAAFF"
								checkedIcon={
									<div
										style={{
											display: "flex",
											alignItems: "center",
											height: "100%",
											fontFamily: "Roboto",
											fontSize: 14,
											color: "white",
											marginLeft: 5,
											paddingRight: 2
										}}
									>
										Off
									</div>
								}
								uncheckedIcon={
									<div
										style={{
											display: "flex",
											alignItems: "center",
											height: "100%",
											fontFamily: "Roboto",
											fontSize: 14,
											color: "white",
											marginLeft: 5,
											paddingRight: 2
										}}
									>
										Live
									</div>
								}
								width={70}
							/>
						</label>
						<div className="bullets"><img src="/images/ui-icon/bullets.svg" alt="" /></div>
					</div>
					<div className="CoverImg" onClick={() => {
						if (!isTemplateProject)
							onSelectProject(projectId)
						}}>
						<img src={cover} className="preview" alt="" />
					</div>
					<div className="CardContent">
						{ !isEnd && !isCancel && (
							<div>
								<h4 className="title" onClick={() => {
									if (!isTemplateProject)
										onSelectProject(projectId)
								}}>{ title }</h4>
								{/* <p className="description">{ description }</p> */}
								{/* <p className='description bottom'></p> */}
							</div>
						) }
						{ !isEnd && !isCancel &&
							<div className='summary'>
								<div>
									{ projectType === VOLUNTEER &&
										<div>
											<p>{current}</p>
											<p>Volunteers</p>
										</div>
									}
									{ projectType === DONATION &&
										<div>
											<p>{money && money.total_applicants}</p>
											<p>Donors</p>
										</div>
									}
									{ projectType === PICKUP &&
										<div>
											<p>{current}</p>
											<p>PickUps</p>
										</div>
									}
								</div>
								<div>
									{ projectType === VOLUNTEER && ( <div className='total'>
										<p>
											<NumberFormat value={current} displayType={'text'} thousandSeparator={true} prefix={''} />/
											<NumberFormat value={total} displayType={'text'} thousandSeparator={true} prefix={''} />
										</p>
										<p className="right">Goal</p>
									</div> ) }
									{ projectType === DONATION && ( <div className='total'>
										<p>
											<NumberFormat value={current} displayType={'text'} thousandSeparator={true} prefix={'$'} />/
											<NumberFormat value={total} displayType={'text'} thousandSeparator={true} prefix={'$'} />
										</p>
										<p className="right">Goal</p>
									</div> ) }
									{ projectType === PICKUP && ( <div className='total'>
										<p>
											<NumberFormat value={current} displayType={'text'} thousandSeparator={true} prefix={''} />/
											<NumberFormat value={total} displayType={'text'} thousandSeparator={true} prefix={''} />
										</p>
										<p className="right">Goal</p>
									</div> ) }
								</div>
							</div>
						}
						{ !isEnd && !isCancel &&
							<div className="flex-wrapper">
								<div className="progressBar">
									<div className="progress-wrapper">
										<div className="progress">
											<div className="progress-contain"
												style={{
													width: `${
														proc > 100
															? 100
															: proc
													}%`
												}}
											/>
										</div>
									</div>
								</div>
							</div>
						}
						{ (isEnd || isCancel) && (
							<div>
								{ isEnd && <h4 className='completed-title'>Completed</h4> }
								{ isCancel && <h4 className='completed-title'>Canceled</h4> }
								<p className='description'><b>Project:</b>&nbsp;{ title }</p>
								{ projectType === VOLUNTEER && <p className='description bottom'>Raised: {donate_summary && donate_summary.total_applicants}</p> }
								{ projectType === DONATION && <p className='description bottom'>Raised: {money && money.current}</p> }
								{ projectType === PICKUP && <p className='description bottom'>Raised: {donate_summary && donate_summary.current}</p> }
							</div>
						) }
						<div className="actionButtons">
							{ activeType !== VOLUNTEER && isEnd && (
								<Button label="Update" onClick={onUpdateModal({projectId, title})} />
							) }
							{ isCancel && (
								<NavLink
									to={`/${userId}/project/edit/${projectId}`}>
									<Button label="Edit" disabled={true} />
								</NavLink>
							) }
							{ !isEnd && !isCancel && (
								<NavLink
									to={`/${userId}/project/edit/${projectId}`}>
									<Button label="Edit" disabled={isTemplateProject} />
								</NavLink>
							)}
							<Button label="View" className="btn-view" onClick={onDetailView({projectId, title})} disabled={isTemplateProject} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default MiniCard