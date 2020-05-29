import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Select, { components } from 'react-select'
import csv from 'csv'

import { history } from '../../../../../store'

import DashIconButton from '../../../../common/DashIconButton'
import IconButton from '../../../../common/IconButton'
import Button from '../../../../common/Button'
import Modal from '../../../../common/Modal'
import ContentModal from '../../../../common/Modal/ContentModal'
import CheckBox from '../../../../common/CheckBox'

import { unreadProjects } from '../../../../../helpers/websocket'

import { toggleNotification } from '../../../../../actions/notificationActions'
import { uploadDonationList, getDonationListToNonprofit } from '../../../../../actions/donate'

const selectStyles = {
	indicatorSeparator: styles => ({ ...styles, width: 0 }),
	control: styles => ({ ...styles, minHeight: 34, borderRadius: 8, borderColor: '#DDDDDD' }),
	placeholder: styles => ({ ...styles, color: '#ccc' })
}

const DropdownIndicator = props => {
	return (
		components.DropdownIndicator && (
			<components.DropdownIndicator {...props}>
				<img src="/images/ui-icon/icon-filter.svg" alt="" />
			</components.DropdownIndicator>
		)
	);
}

class DonationHeader extends Component {

  state = {
    showImportModal: false,
    file: null,
    showToggle: false,
    headerKey: [],
    isHaveTitles: false,
		csvDonationsArray: [],
		csvShowArray: [],
    selectHeader: [],
    optionDonations: [
      {
        value: 'donorName',
        label: 'Donor_Name'
      }, {
        value: 'donationDate',
        label: 'Donation_Date'
      }, {
        value: 'amount',
        label: 'Amount'
      }, {
        value: 'emailAddress',
        label: 'Email Adress'
      }, {
        value: 'address',
        label: 'Adress'
      }, {
        value: 'phoneNumber',
        label: 'Phone Number '
      }
	],
	isFullNameCheck: false,
	isEmailCheck: false,
	isPhoneCheck: false
  }

  constructor(props) {
		super(props)
		this.previewRef = React.createRef()
	}

  addProject = e => {
    if (e) {
      e.stopPropagation();
    }

    history.push(`/${this.props.userId}/project/create?projectType=1`);
  }

  toggleSubmenu = e => {
    if (e) {
      e.stopPropagation();
    }

    this.setState({ showToggle: true });
  }

  leaveMouseoutOfMenu = e => {
    if (e) {
			e.stopPropagation();
    }
    
		this.setState({ showToggle: false });
  }

  showImportModalFunc = () => {
		this.setState({ showImportModal: 0, headerKey: [] })
	}

  closeImportModal = () => {
		this.setState({ showImportModal: -1, file: null }, () => {
			this.previewRef.current.value = ""
		})
  }
  
  openSelectFile = (e) => {
		e.stopPropagation();
		this.previewRef.current.click()
  }
  
  changeFile = e => {
		if (e.target.files.length === 0)
			return;

		if (e.target.files[0].name.indexOf('.csv') === -1) {
			this.props.toggleNotification({
				isOpen: true,
				resend: false,
				firstTitle: 'Error',
				secondTitle: 'You can only upload CSV files',
				buttonText: 'Ok'
			})
		} else {
			if (
				e.target.files[0] &&
				e.target.files[0].size / 1024 / 1024 <= 10
			) {
				var file = e.target.files[0]
				e.target.value = null
				this.setState({ file: file })
			} else {
				this.props.toggleNotification({
					isOpen: true,
					resend: false,
					firstTitle: 'Error',
					secondTitle: 'File should be up to 10mb',
					buttonText: 'Ok'
				})
			}
		}
  }
  
  onClickImportContact = () => {
		const reader = new FileReader();
		let { headerKey } = this.state
		reader.onload = () => {
			csv.parse(reader.result, (err, data) => {
				let csvDonationsArray = []
				let csvShowArray = []
				
				let index = 0;
				data.forEach(d => {
					csvDonationsArray.push(JSON.parse(JSON.stringify(d)))
					csvShowArray.push(JSON.parse(JSON.stringify(d)))

					if (index === 0) {
						for (var i = 0; i < d.length; i ++) {
							headerKey[i] = {
								key: d[i],
								label: "Select"
							}
						}
					}

					index++;
				})
				this.setState({ showImportModal: 1, csvDonationsArray: csvDonationsArray, csvShowArray: csvShowArray, isHaveTitles: false, headerKey: headerKey })

			});
		};
		reader.readAsBinaryString(this.state.file);
  }

  deepCopyArray(arr) {
	return JSON.parse(JSON.stringify(arr))
  }
  
  toggleCheckbox = isChecked => {
		var content = this.deepCopyArray(this.state.csvDonationsArray)
		var { headerKey } = this.state
		headerKey.forEach(h => {
		})
		if (isChecked) {
			content = this.deepCopyArray(this.state.csvDonationsArray.slice(1))
			
			headerKey.forEach(h => {
				h.label = h.key
			})
		}
		this.setState({ isHaveTitles: isChecked, csvShowArray: content, headerKey: headerKey })
	}

	toggleNameCheck = isChecked => {
		this.setState({ isFullNameCheck: isChecked })
	}

	toggleEmailCheck = isChecked => {
		this.setState({ isEmailCheck: isChecked })
	}

	togglePhoneCheck = isChecked => {
		this.setState({ isPhoneCheck: isChecked })
	}

	onClickImporBack = () => {
		this.setState({ showImportModal: this.state.showImportModal - 1 })
	}

	onClickImportNext = () => {
		var canNext = true;
		if (this.state.showImportModal === 1) {
			this.state.headerKey.forEach( h => {
				canNext = h.key !== ""
			})			
		}
		if (canNext)
			this.setState({ showImportModal: this.state.showImportModal + 1, isEmailCheck: false, isFullNameCheck: false, isPhoneCheck: false })
	}

	onSelectFieldHeader = (fieldKey, target) => {
		let { headerKey } = this.state
		headerKey[fieldKey].key = target.value
		headerKey[fieldKey].label = target.label
		this.setState({ headerKey })		
	}

	onClickSaveArray = () => {
		const { headerKey, csvShowArray } = this.state
		let newArray = csvShowArray.map(c => {
			let donation = {};
			for (var i = 0; i < c.length; i ++) {
				let key = headerKey[i].key.toString();
				key = key.replace(" ", "_");
				key = key.toLowerCase().trim();

				if (key.indexOf("email") > -1) {
					donation.email = c[i];
				} else if (key.indexOf("first") > -1) {
					donation.first_name = c[i];
				} else if (key.indexOf("last") > -1) {
					donation.last_name = c[i];
				} else if (key.indexOf("donor") > -1 || key.indexOf("full") > -1) {
					donation.full_name = c[i];
				} else if (key.indexOf("city") > -1) {
					donation.city = c[i];
				} else if (key.indexOf("street") > -1) {
					donation.street = c[i];
				} else if (key.indexOf("state") > -1) {
					donation.state = c[i];
				} else if (key.indexOf("zip") > -1) {
					donation.zip = c[i];
				} else if (key.indexOf("phone") > -1) {
					donation.phone = c[i];
				} else if (key.indexOf("donation_date") > -1) {
					donation.created_at = c[i];
				} else if (key.indexOf("amount") > -1) {
					donation.amount = c[i];
				} else if (key.indexOf("adress") === 0 || key.indexOf("address") === 0) {
					donation.address = c[i];
				} else {
					donation[key] = c[i];
				}
			}

			if (donation.full_name && (!donation.first_name || !donation.last_name)) {
				let full_name_arr = donation.full_name.toString().split(" ");
				if (full_name_arr.length > 0) {
					donation.first_name = full_name_arr[0];
				}
				if (full_name_arr.length > 1) {
					donation.last_name = full_name_arr[1];	
				}
			} else if (!donation.full_name) {
				donation.full_name = (donation.first_name || '') + ' ' + (donation.last_name || '');
			}

			if (!donation.address) {
				donation.address = (donation.street || '') + (donation.street && ',') + 
									(donation.city || '') + (donation.city && ',') + 
									(donation.state || '') + (donation.state && ',') + 
									(donation.zip || '');
			}

			return donation
		})

		let x = (array) => newArray.filter((v, i) => {
			const con = array.find(c => {
				var flag = true
				if (this.state.isFullNameCheck)
					flag &= (c.full_name === v.full_name)
				if (this.state.isEmailCheck)
					flag &= (c.email === v.email)
				if (this.state.isPhoneCheck)
					flag &= (c.phone === v.phone)

				if (flag)
					return v
				else
					return null
			})
			if (!this.state.isFullNameCheck && !this.state.isEmailCheck && !this.state.isPhoneCheck)
				return array.indexOf(v) === i
			else
				return array.indexOf(con) === i
		})
		newArray = x(newArray)

		this.props.uploadDonationList({
			array: newArray, cb: () => {
				this.setState({ activePage: 1, showImportModal: -1, file: null, headerKey: [], csvShowArray: [], csvContactArray: [] }, () => {
					this.getData()
				})
			}
		})
	}

	getData = () => {
		this.setState({ skip: this.state.limit * (this.state.activePage - 1) }, () => {
			this.props.getDonationListToNonprofit({
				_id: this.props.authUser._id,
				skip: this.state.skip,
				limit: this.state.limit
			});
		})
	}

  render() {
    const { userId, authUser, showGiftModal } = this.props
	const { showImportModal, file, showToggle, isHaveTitles, 
			headerKey, optionDonations, csvShowArray,
			isFullNameCheck, isEmailCheck, isPhoneCheck } = this.state

    return (
      <div className="campaign-header">
        <div className="_title">
          <span>Donation management</span>
          <div className="nav-link DashNavLink">
            <IconButton className='addIcon' onClick={this.toggleSubmenu} icon="/images/ui-icon/icon-add.svg" size="18px" />
            <div className={`popup-menu ${showToggle ? 'open' : ''}`} onMouseLeave = { this.leaveMouseoutOfMenu }>
              <div className="submenu project"
                  onClick={this.addProject}>
                  <span className="_label">Add project</span>
              </div>
              <div className="submenu gift"
                  onClick={showGiftModal}>
                  <span className="_label">Add gift</span>
              </div>
              <div className="submenu gift"
                  onClick={this.showImportModalFunc}>
                  <span className="_label">Import donations</span>
              </div>
            </div>
          </div>
        </div>
        <div className='DashNavContainer'>
          <NavLink to={`/${userId}/dashboard`} className="nav-link DashNavLink">
            <DashIconButton label="Back" icon="/images/ui-icon/dashboard-back.svg" size="36px" fontSize="15px" color="#1AAAFF" />
          </NavLink>
          <NavLink to={`/${userId}/campaigns/volunteer`} className="nav-link DashNavLink">
            <DashIconButton label="Volunteer" icon="/images/ui-icon/campaign-volunteer.svg" size="36px" fontSize="15px" />
            { authUser.unreadVolunteers > 0 && (<span className='UnreadBadge'>{authUser.unreadVolunteers}</span>)}
          </NavLink>
          <NavLink to={`/${userId}/campaigns/pickup`} className="nav-link DashNavLink">
            <DashIconButton label="Pickup" icon="/images/ui-icon/campaign-pickup.svg" size="36px" fontSize="15px" />
            { authUser.unreadPickups > 0 && (<span className='UnreadBadge'>{authUser.unreadPickups}</span>)}
          </NavLink>
          <NavLink to={`/${userId}/contacts`} className="nav-link DashNavLink">
            <DashIconButton label="Contacts" icon="/images/ui-icon/dashboard-contacts.svg" size="36px" fontSize="15px" />
          </NavLink>
        </div>
        <Modal title="Import donations" showModal={showImportModal === 0} closeModal={this.closeImportModal} width="310px">
			<div className="import-donations" onClick={this.onClickBody}>
				<div className="import-donations-content main-font" onClick={this.openSelectFile}>
					<span className="_label">{file === null && "Choose file ..."}{file !== null && file.name}</span>
					<span className="_plus">+</span>
					<input className="_input" type="file" ref={this.previewRef} onChange={this.changeFile} />
				</div>
				<div className="bottom-box">
					<Button
						onClick={this.onClickImportContact}
						className="add-contact"
						label="Import"
						padding="12px 35px"
						disabled={file === null}
					/>
				</div>
			</div>
		</Modal>
		<ContentModal className="import-second" showModal={showImportModal === 1} closeModal={this.closeImportModal} width="1136px" padding="0px">
			<div className="modalHeader">
				<h2>Identify Fields</h2>
				<div className="closeBtn" onClick={this.closeImportModal} />
			</div>
			<div className="import-second-content">
				<div className="column-titles">
					<CheckBox label="Column Titles" handleCheckboxChange={this.toggleCheckbox} isChecked={isHaveTitles} />
				</div>
				<div className="import-table">
					{!isHaveTitles && <div className="header-select">
						{headerKey.length !== 0 && headerKey.map((e, i ) => {
							return (
								<Select
									className="select-column"
									options={optionDonations}
									onChange={e => this.onSelectFieldHeader(i, e)}
									placeholder="Select"
									isClearable={false}
									isSearchable={false}
									menuContainerStyle={{ zIndex: 1000 }}
									styles={selectStyles}
									components={{ DropdownIndicator }}
									key={i}
								/>
							)
						})}
					</div>}
					<div className={`header ${isHaveTitles ? 'have-title' : ''}`}>
						{ headerKey.length !== 0 && headerKey.map((e, i ) => {
							return (
								<span className={`header-title ${i !== headerKey.length -1 ? 'border-right' : ''} ${e.key === "" ? 'empty' : ''}`} key={i}>{e.label}</span>
							)
						}) }
					</div>
					<div className="import-body">
						{ csvShowArray.length > 0 && csvShowArray.map((e, i) => {
							return (
								<div className="content-row" key={i}>
									{e.length > 0 && e.map((d, j) => {
										return(
											<div className={`content-column ${j !== e.length - 1 ? 'border-right' : ''} ${headerKey[j] && headerKey[j].value ?'active' : ''}`} key={j}>{d}</div>
										)
									})}
								</div>
							)
						}) }
					</div>
				</div>
				<div className="action-buttons">
					<Button padding="8px 24px" label="Back" onClick={this.onClickImporBack} />
					<Button padding="8px 24px" label="Next" onClick={this.onClickImportNext} />
				</div>
			</div>
		</ContentModal>
		<Modal className="import-third" title="Finish Import" showModal={showImportModal === 2} closeModal={this.closeImportModal} width="450px">
			<div className="content">
				<div className="third-title">Find Duplicate Using:</div>
				<div className="third-content">
					<CheckBox label="Full Name" handleCheckboxChange={this.toggleNameCheck} isChecked={isFullNameCheck} />
					<CheckBox label="Email" handleCheckboxChange={this.toggleEmailCheck} isChecked={isEmailCheck} />
					<CheckBox label="Phone" handleCheckboxChange={this.togglePhoneCheck} isChecked={isPhoneCheck} />
				</div>
				<div className="action-buttons">
					<Button padding="8px 24px" label="Back" onClick={this.onClickImporBack} />
					<Button padding="8px 24px" label="Save" onClick={this.onClickSaveArray} />
				</div>
			</div>
		</Modal>
      </div>
      
    )
  }

}

const mapStateToProps = state => ({
	authUser: state.authentication.user
})

const mapDispatchToProps = {
  unreadProjects,
  toggleNotification,
  uploadDonationList,
  getDonationListToNonprofit
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DonationHeader)