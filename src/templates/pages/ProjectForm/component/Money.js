import React, { Component } from 'react'
import { connect } from 'react-redux'

class Money extends Component {

	constructor(props) {
		super(props)
		this.state = {
			quantity: this.props.quantity || 0
		}
	}

	inputHelper = key => ({ target }) =>
		this.setState({ [key]: target.value }, () => {
			this.props.update &&
				this.props.update({ quantity: this.state.quantity })
	})

	clickedCheckBox = () => {
		let isExactly = false;
		if (!this.props.isExactly) {
			isExactly = true;
		} 
		this.props.update&& this.props.update({isExactly: isExactly})
	}
	
	render() {
		let { quantity, isExactly, disabled } = this.props

		return (
			<div className="project-money">
				<div className="field field-1">
					<label className="label">Donation Goal Amount:</label>
					<input
						className="main-font control"
						type="number"
						id="projectMoneyCreate"
						placeholder="What volunteers will have to do"
						onChange={this.inputHelper('quantity')}
						value={quantity}
						disabled={disabled}
					/>
				</div>
				<label className="field field-2 exactly-checkbox-container">
					<p className="label main-font">Exactly:</p>
					<input
						type="checkbox"
						checked={isExactly}
						onChange={this.clickedCheckBox}
						disabled={disabled}
					/>
					<span className="checkmark-need"></span>
				</label>
				<span className="globalErrorHandler" />
			</div>
		)
	}
}

export default connect()(Money)