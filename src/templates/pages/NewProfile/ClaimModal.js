import React, {Component} from 'react'
import { connect } from 'react-redux'

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

import Modal from '../../common/Modal'
import Button from '../../common/Button'

class VerificationModal extends Component {

    state = {
        // passcode: "",
        name: '',
        email: '',
        phoneNumber: ''
    }

    // passcodeChange = e => {
    //     this.setState({ [e.target.name]: e.target.value }, () => {
    //         if (this.state.passcode.length === 7) {
    //             this.props.onClaim(this.state.passcode)
    //         }
    //     });
    // }

    componentDidMount() {
    }

    render() {
        // const { passcode } = this.state;

        let { name, email, phoneNumber } = this.state;

        const {
			showModal,
            closeModal,
            onSupport
        } = this.props;
        
        return(
            <Modal className="claimModalSection" showModal={showModal} width="300px" padding="30px 30px" closeModal={closeModal}>
                <div className="claim-wizard-content">
                    <img src="/images/ui-icon/profile/user.svg" alt="user" />
                    <span className="m-b-10 text-center claim-desc">&nbsp;&nbsp;To claim your profile, please contact our team for help!</span>
                    
                    <div className="infoBody">
                        <div className="rowBody">
                            <p className="caption">Name</p>
                            <input type="text" className="infoInput" value={name} onChange={e => this.setState({ name: e.target.value })} />
                        </div>
                        <div className="rowBody">
                            <p className="caption">Email</p>
                            <input type="text" className="infoInput" value={email} onChange={e => this.setState({ email: e.target.value })} />
                        </div>
                        <div className="rowBody">
                            <p className="caption">Phone</p>
                            <PhoneInput
                                placeholder="Enter phone number"
                                value={phoneNumber}
                                onChange={value => this.setState({ phoneNumber: value })} />
                        </div>
                    </div>
                    {/* <input className="m-b-10 passcode" placeholder="Passcode...." value={passcode} name='passcode' onChange={this.passcodeChange}/> */}

                    <Button className="m-r-5 supportBtn" label="Contact Support" onClick={onSupport} solid noBorder />
                </div>
            </Modal>
        )
    }
}

export default connect()(VerificationModal)