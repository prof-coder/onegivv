import React, { Component } from 'react'
import { connect } from 'react-redux'

import HeaderModal from '../../components/headerModal'
import { forgotPassword, signUp, signIn } from '../../modalTypes'
import Button from '../../../Button'

import { togglePreloader } from '../../../../../actions/preloader'

class SignIn extends Component {

	state = {
		email: '',
		password: ''
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.preloader.actionName === 'login' && 
			nextProps.preloader.show === false && 
			nextProps.preloader.hasResponseErr) {
				let notValid = document.querySelector(`span.passwordError`);
				let inputValid = document.querySelector(`input[name="password"]`);

				if (notValid)
					notValid.innerHTML = "Password is wrong";
				if (inputValid)
					inputValid.style.borderColor = '#FF4060'
		}
	}

	inputChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	}

	render() {
		const { handleClose, changeTypeId, failedCount } = this.props;
		const { email, password } = this.state;

		return (
			<div className="SignIn">
				<HeaderModal title="Sign In" handleClose={handleClose} />
				<div className="form-wrapper">
					<div className="input-wrapper">
						<input
							type="text"
							className="input-modal-auth"
							name="email"
							maxLength="50"
							autoComplete="disable-autofill"
							value={email}
							onChange={this.inputChange}
						/>
						<span className="placeholder">Email</span>
						<span className="globalErrorHandler" />
					</div>
					<div className="input-wrapper">
						<input
							type="password"
							className="input-modal-auth"
							name="password"
							autoComplete="disable-autofill"
							maxLength="50"
							value={password}
							onChange={this.inputChange}
						/>
						<span className="placeholder">Password</span>
						<span className={`globalErrorHandler passwordError show`}>
							<span className={`${failedCount < 5 ? 'show' : 'hide'}`}>Password attempts remaining: {failedCount}</span>
						</span>
					</div>
					<div className="change-route-in-modal second-in-page">
						<div
							onClick={() => changeTypeId(forgotPassword)}
							className="link-to-type">
							Forgot password?
						</div>
					</div>
					<input type="hidden" name="formType" value={signIn} />
					<Button
						className="select-button"
						label="Continue"
						padding="13px 25px"
					/>
					<div className="change-route-in-modal">
						<span className="text-to-type">
							Don't have an account?
						</span>
						<span
							onClick={() => changeTypeId(signUp)}
							className="link-to-type">
							Sign up
						</span>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	userId: state.authentication.userId,
	isAuth: state.authentication.isAuth,
	preloader: state.preloader
})

const mapDispatchToProps = {
	togglePreloader
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SignIn)