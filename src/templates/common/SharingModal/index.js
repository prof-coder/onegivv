import React, { Component } from 'react'
import Modal from '../Modal'
import {svgIcons} from '../../../helpers/svgIcons'
import { 
	FacebookShareButton,
	TwitterShareButton,
	EmailShareButton,
	WhatsappShareButton
 } from 'react-share';


class SharingModal extends Component {

    state = {
        url: '',
        content: '',
        isCopied: false
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            url: nextProps.url
        });
    }

    copyToClipboard = e => {

		this.refs.searchInputRef.select();
		document.execCommand('copy');

		this.setState({
            isCopied: true
        });

        setTimeout(
		    function() {
		        this.setState({isCopied: false});
		        var textField = document.createElement('textarea')
		        document.body.appendChild(textField)
		        textField.select()
		        textField.remove()
		    }
		    .bind(this),
		    3000
		);
	};
    render() {
    	const { isCopied } = this.state;
        const { url, content } = this.props;
		return (
			<Modal className="share-modal" padding="30px" width="100%" showModal={this.props.showModal} closeModal={this.props.closeModal}>
				<div className="share-component">
					<h4>Help by sharing</h4>
					<p>Please Share</p>
					<ul className="sharing-list">
						<li className="sharing-list-item">
							<FacebookShareButton
								className="button is-outlined is-rounded"
								url={url}
								quote={content}>
								<span className="svg-icons" dangerouslySetInnerHTML={{__html: svgIcons.facebook}} /> Facebook
							</FacebookShareButton>
						</li>
						<li className="sharing-list-item">
							<TwitterShareButton
								className="button is-outlined is-rounded"
								url={url}
								title={content}>
								<span className="svg-icons" dangerouslySetInnerHTML={{__html: svgIcons.twitter}} /> Twitter
							</TwitterShareButton>
						</li>
						<li className="sharing-list-item">
							<EmailShareButton
								className="button is-outlined is-rounded"
								url={url}
								subject={content}>
								<span className="svg-icons" dangerouslySetInnerHTML={{__html: svgIcons.email}} /> Email
							</EmailShareButton>
						</li>
						<li className="sharing-list-item">
							<WhatsappShareButton
								className="button is-outlined is-rounded"
								url={url}
								title={content}>
								<span className="svg-icons" dangerouslySetInnerHTML={{__html: svgIcons.whatsapp}} /> WhatsApp
							</WhatsappShareButton>
						</li>
						<li className="sharing-list-item">
							<a 
								href={'fb-messenger://share?link=' + url} 
								className="button is-outlined is-rounded">
								<span className="svg-icons" dangerouslySetInnerHTML={{__html: svgIcons.messenger}} /> Messenger
							</a>
						</li>
						<li className="sharing-list-item">
							<a 
								href={'sms:?&body=Hi I would like to share ' + content + ' ' + url} 
								className="button is-outlined is-rounded">
								<span className="svg-icons" dangerouslySetInnerHTML={{__html: svgIcons.textsharing}} /> Text
							</a>
						</li>
					</ul>
					<div className="sharing-copy-form">
						<div className="sharing-copy--input">
							<span>Copy Link</span>
							<input className="searchInput" type="text" value={url} placeholder="Search for nonprofits …" readOnly="readonly" ref="searchInputRef" onClick={this.copyToClipboard}/>
						</div>
						<div className="sharing-copy-button-wrapper">
							<button className="sharing-copy-button" onClick={this.copyToClipboard}>Copy</button>
						</div>
					</div>
					<div className="sharing-options">
						{ isCopied
							? <span className="sharing-options-copied">Copied!</span>
							: ''
						}
						<div className="sharing-options--text">
							<strong>Tip:</strong> 
							Paste this fundraiser link anywhere.
						</div>
						<div className="sharing-options--icons">
							<span className="svg-icons" dangerouslySetInnerHTML={{__html: svgIcons.instagram}} />
							<span className="svg-icons" dangerouslySetInnerHTML={{__html: svgIcons.slack}} />
							<span className="svg-icons" dangerouslySetInnerHTML={{__html: svgIcons.home}} />
							<span className="svg-icons" dangerouslySetInnerHTML={{__html: svgIcons.moreOptions}} />
						</div>
					</div>
				</div>
			</Modal>
		)
	}
}

export default SharingModal
