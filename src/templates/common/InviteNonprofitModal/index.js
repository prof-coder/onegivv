import React, { Component } from 'react'

import Modal from '../Modal'
import Button from '../Button'

class InviteNonprofitModal extends Component {

    state = {
        inviteName: ''
    }

    inviteChange = e => {
		this.setState({ inviteName: e.target.value })
    }

    onClickInviteNonProfit = e => {
		if (e)
            e.stopPropagation();
            
        this.props.inviteNonprofit(this.state.inviteName);
        this.props.closeInviteModal();
	}
    
    render() {
        const { showInviteModal, closeInviteModal } = this.props;
        const { inviteName } = this.state;

        return (
            <Modal
                title="Invite a nonprofit to join OneGivv!"
                showModal={showInviteModal}
                closeModal={closeInviteModal} 
                width="350px"
                className="inviteNonprofitModalBody">
                <div className="input-name">
                    <input className="_input main-font" placeholder="Enter nonprofit name" value={inviteName} onChange={this.inviteChange} />
                </div>
                <div className="bottom-box">
                    <Button
                        onClick={this.onClickInviteNonProfit}
                        className="invite"
                        label="Invite"
                        padding="10px 31px"
                        disabled ={!inviteName}
                    />
                </div>
            </Modal>
        )
    }

}

export default InviteNonprofitModal