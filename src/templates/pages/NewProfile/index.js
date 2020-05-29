import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Slider from 'react-slick';

// import { Hints } from 'intro.js-react';
import numeral from 'numeral';

import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Geocode from 'react-geocode';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import queryString from 'query-string';

import { history } from '../../../store';

import Modal from '../../common/Modal';
import Card from '../../common/Card';
import Button from '../../common/Button';
import UserAvatar from '../../common/userComponents/userAvatar';
import { signUp } from '../../common/authModals/modalTypes'

import { getUserProfile, unfollowThisUser, followThisUser } from '../../../actions/followsAction';
import { uploadProfilePicture, deleteProfilePicture, setIsClaimed } from '../../../actions/user';

import { NONPROFIT, DONOR, COMMUNITY } from '../../../helpers/userRoles';
import { DONATION, PICKUP, VOLUNTEER } from '../../../helpers/projectTypes';
import { ACCEPT, PENDING } from '../../../helpers/followStatus';

import { signIn } from '../../../templates/common/authModals/modalTypes';

import MissionForm from './MissionForm';
import MediaList from './MediaList';
import PostList from '../Post/PostList';
import UserDetailInfo from './UserDetailInfo';
import FinancialInfo from './FinancialInfo';
import MobileInfo from './MobileInfo';

import DonateForm from './DonateForm';
import PickupForm from './PickupForm';
import VolunteerForm from './VolunteerForm';
import ClaimModal from './ClaimModal';
import MyGive from './MyGive';
import AboutMe from './AboutMe';

import PostForm from '../Post/PostForm';

Geocode.setApiKey(process.env.GEOCODE_API_KEY);

const PrevArrow = props => {
	const { /*className, style,*/ onClick } = props;
	return (
        <div className="controls prevNextControl prevControl" onClick={onClick}>
            <button className="prev nonprofit-scroll-prev"><i className="icon-lg-arrow-left"></i></button>
        </div>
		// <div
		// 	className={className}
		// 	style={{ ...style, width: 30, height: 30, backgroundImage: "url(/images/ui-icon/project/prev-arrow-btn.svg)" }}
		// 	onClick={onClick}
		// />
	);
}

const NextArrow = props => {
	const { /*className, style,*/ onClick } = props;
	return (
        <div className="controls prevNextControl nextControl" onClick={onClick}>
            <button className="next nonprofit-scroll-next"><i className="icon-lg-arrow-right"></i></button>
        </div>
		// <div
		// 	className={className}
		// 	style={{ ...style, width: 30, height: 30, backgroundImage: "url(/images/ui-icon/project/next-arrow-btn.svg)" }}
		// 	onClick={onClick}
		// />
	);
}

class NewProfile extends Component {

    state = {
		isOther: false,
		user: {},
		showNeedVerifyModal: false,
		showAddPostModal: false,
		showClaimModal: false,
		curUserId: null,
		selTab: 0,
		selPledgeTab: 0,
		pledgeAmount: 0,
		pledgeType: 0,
		showToggle: false,
		showHelpMenu: false,
		showDonorStats: false,
		showGiveForm: -1,
		isLocked : false,
		showFollowMessage: false,
		showHints: true,
		claimResult: "",
		showClaimResult: false,
		basicHints : [
			{
				id: 1,
				element: '.hint-about-me',
				hint: 'Info is where information about your nonprofit, its goals, mission, current contributions, and donor reviews of your organization will be.',
				hintPosition: 'middle-right'
			},
			{
				id: 2,
				element: '.hint-profile-image',
				hint: "Change your organization's background image here!",
				hintPosition: 'middle-middle'
			},
			{
				id: 3,
				element: '.hint-my-giving',
				hint: 'My Giving is where you’ll be able to keep track and access all of your giving stats from volunteer hours to your donation history!',
				hintPosition: 'bottom-left'
			},
			{
				id: 4,
				element: '.hint-my-project',
				hint: "Projects is where you're able to manage all your projects as well as create volunteer opportunities, donation projects, and PickUp requests for supplies you need!",
				hintPosition: 'bottom-left'
			},
			{
                id: 12,
                element: '.hint-receipt',
                hint: "View receipts of all the donations you've made and save donation you made offline by adding screenshots so we can confirm",
                hintPosition: 'middle-left'
            },
            {
                id: 13,
                element: '.hint-recurring',
                hint: 'Manage your recurring donations here, update increase or cancel donation',
                hintPosition: 'middle-left'
            }
		],
		hints: [
        ],
        donorAddressCity: '',
        donorAddressState: '',
        mobileDonorId: null,
        viewReceiptInfo: {}
	}

	constructor(props) {
		super(props)
		this.previewRef = React.createRef()
    }

    static getDerivedStateFromProps(props, state) {
		const currUsId = props.match.params.id
		const myID = props.userId
		state.isOther = !(currUsId === myID)

		if (state.isOther) {
            state.user = props.otherUser
		} else {
            state.user = props.user
			if (state.user) {
				state.hints = state.basicHints.filter(e => {
					if (e.id === 2) {
						if (state.user.role === NONPROFIT) {
							e.hint = "Change your organization's background image here!";
						} else if (state.user.role !== NONPROFIT) {
							e.hint = "Change your donor's background image here!";
						}
					}
					if (state.user.role === NONPROFIT && e.id === 3)
						return false
					if (state.user.role !== NONPROFIT && e.id === 4)
						return false
					if (state.user.role !== NONPROFIT && e.id === 1)
						return false
					if (!state.user.hints.includes(e.id))
						return e;

					return false;
				})
			}
        }
        
        if (state.user) {
            state.user.projectsCount = props.otherUser.projectsCount;
        }

        state.curUserId = currUsId;
        
		return state;
	}

    componentDidMount() {
        const { isAuth, user } = this.props;
		if (isAuth) {
            let roleText = '';
			switch (+user.role) {
				case 3:
					roleText = 'nonprofit';
					break;
				case 4:
					roleText = 'donor';
					break;
				case 5:
					roleText = 'student';
					break;
				case 6:
					roleText = 'sub account';
					break;
				case 7:
					roleText = 'community';
					break;
				case 8:
					roleText = 'sub admin';
					break;
				default:
					roleText = '';
					break;
            }
            
			window.Intercom('boot', {
				app_id: 'q4hnc1xx',
				email: user.email,
				user_id: user._id,
                created_at: 1234567890,
                UserRole: roleText
			});
		} else {
			window.Intercom('boot', {
				app_id: 'q4hnc1xx'
			});
        }

        const searchParams = queryString.parse(this.props.location.search);
		if (searchParams.immediateDonation) {
            setTimeout(() => {
                this.setState({
                    showHelpMenu: false,
                    showGiveForm: DONATION
                });
            }, 200);
        }
        if (searchParams.mobileDonorId) {
            this.setState({
                mobileDonorId: searchParams.mobileDonorId
            });
        }
        
		this._mounted = true;
        this.props.dispatch(getUserProfile(this.props.match.params.id));
        
        if (!this.props.user)
            return;

        let address = this.props.user.donorAddress;
        
        geocodeByAddress(address)
			.then(results => getLatLng(results[0]))
			.then(({ lng, lat }) => {
                Geocode.fromLatLng(lat, lng).then(
                    response => {
                        const address_components = response.results[0].address_components;
                        for (let i = 0; i < address_components.length; i++) {
                            const each_address = address_components[i];
                            for (const key in each_address) {
                                if (key === 'types') {
                                    if (each_address[key].includes('locality') && each_address[key].includes('political')) {
                                        this.setState({ donorAddressCity: each_address.long_name });
                                    } else if (each_address[key].includes('administrative_area_level_1') && each_address[key].includes('political')) {
                                        this.setState({ donorAddressState: each_address.long_name });
                                    }
                                }
                            }
                        }
                    },
                    error => {
                        console.log('geocode error!'); console.error(error);
                    }
                );
            });
        
        if (user.role === NONPROFIT && user.isGuest) {
            this.setState({
                selTab: 2
            });
        }

        if (searchParams.viewReceipt) {
            this.setState({
                viewReceiptInfo: {
                    viewReceipt: true,
                    nonprofitId: searchParams.nonprofitId,
                    nonprofitName: searchParams.nonprofitName
                }
            }, () => {
                this.toggleDonorStats();
            });
        }
    }

    componentWillUnmount() {
		this._mounted = false
	}

    openSelectFile = isOther => e => {
		if (!isOther && (this.props.isAuth || this.state.mobileDonorId))
			this.previewRef.current.click();
    }

    toggleSubmenu = e => {
		if (e)
			e.stopPropagation();

        this.setState({showToggle: true})
    }

    leaveMouseoutOfMenu = e => {
		if (e)
			e.stopPropagation();

		this.setState({showToggle: false});
    }

    deleteProfilePicture = e => {
		this.props.dispatch(deleteProfilePicture());
	}

    toggleHelMenu = e => {
		if (e)
			e.stopPropagation();

		this.setState({showHelpMenu: true});
	}

	closeHelpMenu = e => {
		if (e)
			e.stopPropagation();

		this.setState({showHelpMenu: false});
    }

    onClickGive = type => e => {
        if (type === VOLUNTEER || type === PICKUP) {
            if (!this.props.isAuth) {
                this.props.history.push(`?modal=${signUp}`);
                return;
            }
        }
		this.setState({ showHelpMenu: false, showGiveForm: type });
    }

    onClickMessage = e => {
		if (this.state.user.followingStatus === ACCEPT) {
			this.props.history.push(`/${this.props.userId}/chats?other=${this.state.user._id}`);
		} else {
			this.setState({showFollowMessage: true});
		}
	}

    changeFile = e => {
		if (e && e.target && e.target.files && e.target.files.length === 0)
			return;

        if (e.target.files[0].type !== 'image/jpeg' &&
            e.target.files[0].type !== 'image/png'
		) {
			this.props.toggleNotification({
				isOpen: true,
				resend: false,
				firstTitle: 'Error',
				secondTitle: 'You can only upload image files',
				buttonText: 'Ok'
			});
		} else {
			if (e.target.files[0] &&
				e.target.files[0].size / 1024 / 1024 <= 10
			) {
				this.props.dispatch(uploadProfilePicture({file: e.target.files[0]}));
				this.previewRef.current.value = "";
				this.setState({showToggle: false});
			} else {
				this.props.toggleNotification({
                    isOpen: true,
                    resend: false,
                    firstTitle: 'Error',
                    secondTitle: 'Photo should be up to 10mb',
                    buttonText: 'Ok'
                });
			}
		}
    }

    setPrettyNumbers = number => {
		let format,
			leng = ('' + number).length

		if (leng === 0) {
			format = '0'
		} else if (leng <= 3 && leng !== 0) {
			format = numeral(number).format('0a')
		} else if (leng === 4) {
			format = numeral(number).format('0.0aa')
		} else if (leng === 5) {
			format = numeral(number).format('0.0a')
		} else if (leng === 6) {
			format = numeral(number).format('0a')
		} else if (leng === 7) {
			format = numeral(number).format('0.0aa')
		} else if (leng >= 8) {
			format = numeral(number).format('0.0a')
		}

		return format.toUpperCase()
    }

    toggleDonorStats = e => {
        if (!this.props.isAuth)
            return;

		const { user } = this.state;
		if (!user.isLocked) {
			if (e)
				e.stopPropagation();

            this.setState({ showDonorStats: !this.state.showDonorStats });
            
            var myGivingBodys = document.getElementsByClassName("myGivingSection");
            if (myGivingBodys && myGivingBodys.length > 0) {
                var myGivingBody = myGivingBodys[0];

                window.scrollTo({
                    top: myGivingBody.offsetTop,
                    behavior: 'smooth'
                });
            }
		}
    }

    unfollowUser = userId => {
		this.props.dispatch(unfollowThisUser(userId, false))
	}

	followUser = userId => {
		this.props.dispatch(followThisUser(userId))
    }

    showAddPost = e => {
		this.setState({showAddPostModal : true});
	}

	closeAddPost = e => {
		this.setState({showAddPostModal: false});
	}

    selectTab = tab => {
		let { user } = this.state;
		if (!user.isLocked)
			this.setState({
				showDonorStats: false,
				selTab: tab
			});
    }

    selectPledgeTab = tab => {
		let { user } = this.state;
		if (!user.isLocked)
			this.setState({
				showDonorStats: false,
				selPledgeTab: tab
			});
    }

    selectPledgeAmount = amount => {
    	let { user } = this.state;
		if (!user.isLocked)
			this.setState({
				pledgeAmount: amount
			});
    }

    selectPledgeType = type => {
    	let { user } = this.state;
		if (!user.isLocked)
			this.setState({
				pledgeType: type
			});
    }

    discover = e => {
        e.preventDefault();
        history.push(`/discovery`);
    }

    claim = e => {
		e.preventDefault();
		this.setState({ showClaimModal: true });
	}

	closeClaimModal = e => {
		this.setState({ showClaimModal: false });
    }

    onClaim = passcode => {
		this.props.dispatch(setIsClaimed({
			userId: this.state.user._id,
			isClaimed: true,
			passcode: passcode,
			cb: data => {
				this.closeClaimModal();
				if (data && data.claimed) {
					this.setState(prevState => ({
						showClaimResult: true,
						claimResult: "Successfully claimed! Please login with passcode!",
						user: {
							...prevState.user,
							isClaimed: true
						}
					}), () => {
						setTimeout(() => {
							history.push(`/`);
						}, 2000);
					});
				} else {
					this.setState({showClaimResult: true, claimResult: "Fail claimed!"});
				}
			}
		}))
    }

    onSupport = e => {
		this.setState({showClaimModal: false}, () => {
			window.Intercom('showNewMessage');
		})
    }

    onClickBack = () => {
		history.goBack();
    }
    
    closeNeedVerifyModal = e => {
		if (e.target.className && ((e.target.className.includes('modal') && e.target.className.includes('open')) ||
			e.target.className.includes('closeBtn'))) {
			this.setState({ showNeedVerifyModal: false });
		}
    }
    
    hideClaimResult = () => {
		this.setState({ showClaimResult: false });
	}

    render() {
        let {
			curUserId,
			user,
			isOther,
			showNeedVerifyModal,
			showAddPostModal,
			selTab,
			selPledgeTab,
			pledgeAmount,
			pledgeType,
			showToggle,
			showHelpMenu,
			showDonorStats,
			showGiveForm,
			showFollowMessage,
			// hints,
			// showHints,
            showClaimModal,
            donorAddressCity,
            donorAddressState,
			showClaimResult,
            claimResult,
            mobileDonorId,
            viewReceiptInfo
        } = this.state;
        
        const { isAuth } = this.props;

        const slickSettings = {
            dots: false,
            arrows: true,
            infinite: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            swipeToSlide: true,
            // centerMode: true,
            // centerPadding: '500px',
            nextArrow: <NextArrow />,
            prevArrow: <PrevArrow />
        };

        return (
            <div className={`newProfileWrapper`}>
                <section className="profileBody">
                    { // isOther &&
						<img className='btn-go-back' src='/images/ui-icon/arrow-left.svg' alt='btn-back' onClick={this.onClickBack} />
					}
                    {/* <Hints
						enabled={showHints}
						hints={hints}
						onClose={this.onCloseHint}
						ref={hints => this.hintRef = hints} /> */}
					<Modal
                        className="zeroBorderRadius"
						showModal={showFollowMessage}
						closeModal={() => this.setState({showFollowMessage: false})}
						title="You must be following this user to message them" />
                    <Card className="myProfilePage" padding="0px">
                        <div className="profileInfo">
                            <div className="headerPicture hintProfileImage">
                                { !user.profilePicture &&
                                    <div className="noPicture" onClick={this.openSelectFile(isOther)}>
                                        <img src="/images/ui-icon/profile/nonprofit-cover-image.svg" alt="" />
                                        <div className="mainPicture">
                                            {/* { isAuth && !isOther &&
                                                <div className="content">
                                                    <img src="/images/ui-icon/icon-image.svg" alt="" />
                                                    <span>Choose photo for background</span>
                                                </div>
                                            } */}
                                        </div>
                                        <div className="gradientOverlay" />
                                    </div>
                                }
                                { user.profilePicture &&
                                    <div className="realPicture">
                                        <img src={user.profilePicture} alt="" />
                                        <div className="gradientOverlay" />
                                        { !isOther &&
                                            <div>
                                                <span className="actionPicture" onClick={this.toggleSubmenu}>
                                                    <FontAwesomeIcon icon="ellipsis-h" />
                                                </span>
                                                <div className={`editMenu ${showToggle ? 'open' : ''}`}>
                                                    <div className="header text-right" onClick={this.leaveMouseoutOfMenu}>
                                                        <FontAwesomeIcon icon="times"/>
                                                    </div>
                                                    <div className="submenu edit"
                                                        onClick={this.openSelectFile(false)}>
                                                        <img src="/images/ui-icon/icon-edit.svg" alt="" />
                                                        <span className="_label">Edit</span>
                                                    </div>
                                                    <div className="submenu trash"
                                                        onClick={this.deleteProfilePicture}>
                                                        <img src="/images/ui-icon/icon-trash.svg" alt="" />
                                                        <span className="_label">Delete</span>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                }
                                <input
                                    type="file"
                                    ref={this.previewRef}
                                    onChange={this.changeFile}
                                    accept="image/*" />
                            </div>
                            <div className="userInfo">
                                <div className="userWrapper">
                                    <UserAvatar
                                        imgUser={user.avatar}
                                        userId={user._id}
                                        size={100}
                                        imgUserType={0} />
                                    <div className="userTitleBody">
                                        { user.companyName
                                            ? user.companyName
                                            : user.firstName
                                                ? user.firstName +
                                                ' ' +
                                                user.lastName
                                                : ''
                                        }
                                        <span className='address'>
                                            <img className='geoLocationIcon' src='/images/ui-icon/profile/icon-geo-location.svg' alt='icon-location' />
                                            <span className="addressText">
                                                { ( user.role !== DONOR && user.address && user.address.city && user.address.state )
                                                    ? user.address.city + ', ' + user.address.state
                                                    : ''
                                                }
                                                { ( user.role === DONOR && (donorAddressCity || donorAddressState) )
                                                    ? donorAddressCity + ', ' + donorAddressState
                                                    : ''
                                                }
                                            </span>
                                        </span>
                                    </div>
                                    { user.isApproved && user.role === NONPROFIT &&
                                        <img alt='' src='/images/ui-icon/check_mark.svg' className='checkMark' />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="userDetailInfo">
                            <div className="infoBody">
                                <div className="eachInfo">
                                    { user.role === NONPROFIT ? (
                                        <NavLink
                                            to={`/${user._id}/projects/current-user?future=true&createdBy=true`}
                                            className="hint-my-project column">
                                            <p className="number">
                                                { user.projectsCount
                                                    ? this.setPrettyNumbers(user.projectsCount)
                                                    : 0 }
                                            </p>
                                            <p className="label">Projects</p>
                                        </NavLink>
                                    ) : (
                                        <div>
                                            <span className="column" onClick={this.toggleDonorStats}>
                                                <p className="number">
                                                    <img src="/images/ui-icon/profile/my-giving-icon.svg" alt="" />
                                                </p>
                                                <p className={`${!isOther ? 'hint-my-giving' : ''} label`}>
                                                    My giving
                                                </p>
                                            </span>
                                            <div className={`blueUnderline ${showDonorStats ? 'show' : ''}`}></div>
                                        </div>
                                    ) }
                                </div>
                                <div className="eachInfo">
                                    { !user.isLocked &&
                                        <NavLink
                                            to={`/${user._id}/connects/followers`}
                                            className="column"
                                            onClick={e => {
                                                if (e) {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                }

                                                if (!isAuth)
                                                    return;

                                                history.push(`/${user._id}/connects/followers`);
                                            }}>
                                            <p className="number">
                                                { user.followersCount
                                                    ? this.setPrettyNumbers(
                                                            user.followersCount
                                                    )
                                                    : 0}
                                            </p>
                                            <p className="label">Followers</p>
                                        </NavLink>
                                    }
                                    { user.isLocked &&
                                        <div className="column">
                                            <p className="number">
                                                { user.followersCount
                                                    ? this.setPrettyNumbers(
                                                            user.followersCount
                                                    )
                                                    : 0}
                                            </p>
                                            <p className="label">Followers</p>
                                        </div>
                                    }
                                </div>
                                <div className="eachInfo">
                                    { !user.isLocked &&
                                        <NavLink
                                            to={`/${user._id}/connects/following`}
                                            className="column"
                                            onClick={e => {
                                                if (e) {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                }

                                                if (!isAuth)
                                                    return;

                                                history.push(`/${user._id}/connects/following`);
                                            }}>
                                            <p className="number">
                                                { user.followingCount
                                                    ? this.setPrettyNumbers(
                                                            user.followingCount
                                                    )
                                                    : 0}
                                            </p>
                                            <p className="label">Following</p>
                                        </NavLink>
                                    }
                                    { user.isLocked &&
                                        <div className="column">
                                            <p className="number">
                                                { user.followingCount
                                                    ? this.setPrettyNumbers(
                                                            user.followingCount
                                                    )
                                                    : 0}
                                            </p>
                                            <p className="label">Following</p>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="middleBody"></div>
                            <div className="actionBody">
                                <div className="buttonGroups">
                                    { isOther &&
                                        <div className="twoButtons">
                                            { user.followingStatus < PENDING && (isAuth || mobileDonorId) &&
                                                <button onClick={() => this.followUser(user._id)}>
                                                    <img className="desktop" src="/images/ui-icon/profile/follow_icon.svg" alt="follow-icon" />
                                                    <img className="mobile" src="/images/ui-icon/profile/follow_icon_inverse.svg" alt="follow-icon" />
                                                    <span>Follow</span>
                                                </button>
                                            }
                                            { user.followingStatus === PENDING && (isAuth || mobileDonorId) &&
                                                <button onClick={() => this.unfollowUser(user._id)}>
                                                    <img className="desktop" src="/images/ui-icon/profile/follow_icon.svg" alt="follow-icon" />
                                                    <img className="mobile" src="/images/ui-icon/profile/follow_icon_inverse.svg" alt="follow-icon" />
                                                    <span>Requested</span>
                                                </button>
                                            }
                                            { user.followingStatus === ACCEPT && (isAuth || mobileDonorId) &&
                                                <button onClick={() => this.unfollowUser(user._id)}>
                                                    <img className="desktop" src="/images/ui-icon/profile/follow_icon.svg" alt="follow-icon" />
                                                    <img className="mobile" src="/images/ui-icon/profile/follow_icon_inverse.svg" alt="follow-icon" />
                                                    <span>Unfollow</span>
                                                </button>
                                            }
                                            { !isAuth && !mobileDonorId &&
                                                <button onClick={() => {history.push(`?modal=${signIn}`)}}>
                                                    <img className="desktop" src="/images/ui-icon/profile/follow_icon.svg" alt="follow-icon" />
                                                    <img className="mobile" src="/images/ui-icon/profile/follow_icon_inverse.svg" alt="follow-icon" />
                                                    <span>Follow</span>
                                                </button>
                                            }
                                            <button onClick={this.onClickMessage}>
                                                <img className="desktop" src="/images/ui-icon/profile/message_icon.svg" alt="message-icon" />
                                                <img className="mobile" src="/images/ui-icon/profile/message_icon_inverse.svg" alt="follow-icon" />
                                                <span>Message</span>
                                            </button>
                                        </div>
                                    }
                                    { (isAuth || mobileDonorId) && !isOther && (
                                        <div className="buttons postBtnBody">
                                            <Button
                                                label="Post"
                                                padding="4px 15px"
                                                fontSize="18px"
                                                inverse
                                                onClick={this.showAddPost} />
                                        </div>
                                    ) }
                                    { isOther && user.isApproved && user.role === NONPROFIT &&
                                        <div className="buttons">
                                            <button onClick={this.toggleHelMenu}>
                                                <img src="/images/ui-icon/profile/ellipsis_icon.svg" alt="ellipsis-icon" />
                                                <span>Give</span>
                                            </button>
                                            <div className={`helpMenu ${showHelpMenu ? 'open' : ''}`}>
                                                <div className="header text-right" onClick={this.closeHelpMenu}>
                                                    <FontAwesomeIcon icon="times"/>
                                                </div>
                                                <div className="submenu" onClick={this.onClickGive(DONATION)}>
                                                    <img src="/images/ui-icon/profile/give_donate_icon.svg" alt="" />
                                                    <span className="_label">Donate</span>
                                                </div>
                                                <div className="submenu" onClick={this.onClickGive(PICKUP)}>
                                                    <img src="/images/ui-icon/profile/give_pickup_icon.svg" alt="" />
                                                    <span className="_label">Request PickUp</span>
                                                </div>
                                                <div className="submenu" onClick={this.onClickGive(VOLUNTEER)}>
                                                    <img src="/images/ui-icon/profile/give_volunteer_icon.svg" alt="" />
                                                    <span className="_label">Volunteer</span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>
                <section className="tabSection">
                    <div className="tabBody">
                        { user.isGuest && user.role === NONPROFIT &&
                            <ul className="tabs">
                                <li className="hint-about-me tabs__tab tab active onlyOne">
                                    { user && user.role === NONPROFIT ? "Info" : "About Me" }
                                </li>
                            </ul>
                        }
                        { !(user.isGuest && user.role === NONPROFIT) &&
                            <ul className="tabs">
                                <li className={`tabs__tab tab ${selTab === 0 ? "active" : ""}`} onClick={() => {this.selectTab(0)}}>Activity</li>
                                <li className={`tabs__tab tab ${selTab === 1 ? "active" : ""}`} onClick={() => {this.selectTab(1)}}>Media</li>
                                <li
                                    className={`${user && user.role === NONPROFIT && "hint-about-me"} tabs__tab tab ${selTab === 2 ? "active" : ""}`}
                                    onClick={() => {this.selectTab(2)}}>
                                    { user && user.role === NONPROFIT ? "Info" : "About Me" }
                                </li>
                                <li className="tabs__presentation-slider" role="presentation"></li>
                            </ul>
                        }
                    </div>
                </section>

                <section className="myGivingSection">
                    { (isAuth || mobileDonorId) && showDonorStats && user.role !== NONPROFIT && <MyGive userInfo={user} viewReceiptInfo={viewReceiptInfo} /> }
                </section>

                <section className="listSection">
                    <div className="listBody desktop">
                        { curUserId && selTab === 0 && 
                            (((isAuth || mobileDonorId) && !user.isLocked) || (!isAuth && !mobileDonorId && !user.isLocked)) && (
                            <PostList match={{ params: {} }} selectedUserId={curUserId} getAll />
                        ) }
                        { curUserId && selTab === 0 && !isAuth && user.role !== NONPROFIT && user.role !== COMMUNITY && user.isLocked && (
                            <section className="locked">
                                <img className="lock-img" src="/images/ui-icon/profile/icon-lock.svg" alt=""/>
                                <div className="separator-20" />
                                <div className="lock-desc">Only logged in users have access to @{user.companyName || (user.firstName + " " + user.lastName)}'s complete profile.</div>
                            </section>
                        ) }
                        { selTab === 0 && isAuth && user && user.role !== NONPROFIT && user.role !== COMMUNITY && user.isLocked &&
                            <section className="locked">
                                <img className="lock-img" src="/images/ui-icon/profile/icon-lock.svg" alt=""/>
                                <div className="separator-20" />
                                <div className="lock-title">This account's profile is protected.</div>
                                <div className="separator-20" />
                                <div className="lock-desc">Only confirmed followers have access to @{user.firstName + " " + user.lastName}'s complete profile. Click the "Follow" button to send a follow request.</div>
                            </section>
                        }
                    </div>
                    <div className="infoBody desktop">
                        { curUserId && selTab === 0 && user.role === NONPROFIT &&
                            <div>
                                <MissionForm user={user} />
                                <Card className="donateFormCard">
                                    <DonateForm selectedUser={user} mobileDonorId={mobileDonorId} />
                                </Card>
                            </div>
                        }
                        { curUserId && selTab === 0 && user.role === DONOR &&
                            <AboutMe user={user} isDetail={false} />
                        }
                        
                        { curUserId && selTab === 0 && user.role === COMMUNITY &&
                            <Card className="nonprofit-about-us" padding="20px 20px">
                                <div className="flexBody">
                                    <img src="/images/ui-icon/profile/community-page-icon.svg" alt="community-page-icon" />
                                    <p className="section-title community-title">Community Page</p>
                                </div>
                                <div className="section-description">{user.aboutUs}</div>
                            </Card>
                        }

                        { curUserId && selTab === 0 && user.role === COMMUNITY &&
                            <Card className="nonprofit-about-us pledge-section" padding="5px">
                                <div className="flexBody">
                                    <img src="/images/proj/3.jpg" className="pledge-cover" alt="pledge-cover" />
                                    <span className="section-title pledge-title">
                                    	Richmond Giving Well
                                    </span>
                                </div>
                                <div className="section-description">
                                	<section className="tabSection">
					                    <div className="tabBody">
				                            <ul className="tabs">
				                            	<li className={`pledge__tab tab ${selPledgeTab === 0 ? "active" : ""}`} onClick={() => {this.selectPledgeTab(0)}}>Info</li>
					                            <li className={`pledge__tab tab ${selPledgeTab === 1 ? "active" : ""}`} onClick={() => {this.selectPledgeTab(1)}}>Nonprofits</li>
					                            <li className={`pledge__tab tab ${selPledgeTab === 2 ? "active" : ""}`} onClick={() => {this.selectPledgeTab(2)}}>Activity</li>
				                            </ul>
					                    </div>
					                </section>
					                <section className="tabContent">
					                	<div className="contentBody">
					                		{ selPledgeTab === 0 && 
					                			<div className="info">
					                				<p>
					                					Donate to a pool of 5 different nonprofits each month and help Richmond as a whole! You can pledge as low as $1 or more to give towards the Well and at the end of each month, 100% of the funds will be shared equally among the month's 5 selected nonprofits!
					                				</p>
					                				<table>
					                					<tbody>
						                					<tr>
						                						<td>
						                							<div className="pledges-data">
						                								<span className="amount">$12,000</span>
						                								<p className="amountMessage">in donations pledged for the month of January</p>
						                								<ul className="stats">
						                									<li>
						                										<span className="num numPledges">300</span><br/>
						                										<span className="item">Pledges</span>
						                									</li>
						                									<li>
						                										<span className="num numShares">280</span><br/>
						                										<span className="item">Shares</span>
						                									</li>
						                									<li>
						                										<span className="num numFollowers">300</span><br/>
						                										<span className="item">Followers</span>
						                									</li>
						                								</ul>
						                							</div>
						                						</td>
						                						<td>
						                							<div className="btn btn--brdr btn--brdr-b pledge-btn" onClick={() => {this.selectPledgeTab(3)}}>
																		Pledge
																	</div>
																	
																	<div className="btn btn--brdr btn--brdr-b" >
																		Share
																	</div>
						                						</td>
						                					</tr>
						                				</tbody>
					                				</table>
					                			</div> 
					                		}
					                		{ selPledgeTab === 1 && 
					                			<div className="nonprofits">
					                				<p className="desc">
					                					Where your money goes <br/>

					                					<span className="highlight">The 5 nonprofits</span> <br/>

					                					These nonprofits are on-the-ground across Richmond, VA helping the community from animal shelters to homelessness!
					                				</p>

					                				<Slider {...slickSettings} className="slider">
				                                        <div>
				                                        	<div className="slide">
				                                        		<img src="/images/proj/3.jpg" className="slider-image" alt="nonprofits" />
				                                        		<p className="name">Making A Difference For You, Inc</p>

				                                        		<p className="desc">
				                                        			To strengthen the Greater Richmond community by providing computer literacy and study skills to underserved youth, adults and active senior citizens, resulting in: increased job readiness.
				                                        		</p>
				                                        	</div>
				                                        </div>

				                                        <div>
				                                        	<div className="slide">
				                                        		<img src="/images/proj/2.jpg" className="slider-image" alt="nonprofits" />
				                                        		<p className="name">Making A Difference For You, Inc</p>

				                                        		<p className="desc">
				                                        			To strengthen the Greater Richmond community by providing computer literacy and study skills to underserved youth, adults and active senior citizens, resulting in: increased job readiness.
				                                        		</p>
				                                        	</div>
				                                        </div>
				                                    </Slider>
					                			</div> 
					                		}
					                		{ selPledgeTab === 2 && 
					                			<div className="activity">
					                				<div className="activity-data">
		                								<span className="amount">$20,050</span>
		                								<p className="amountMessage">in donations pledged for the month of January</p>
		                								<ul className="donations">
		                									<li>
		                										<div className="profileimg">
		                											<img src="/images/avatars/john.jpg" className="profilepic" alt="" />
		                										</div>
		                										<div className="titleSub">
		                											<h3 className="title">For The People</h3>
		                											<span className="subtitle">For the people of Richmond</span>
		                										</div>
		                										<div className="donation"><span>$10</span></div>
		                									</li>
		                									<li>
		                										<div className="profileimg">
		                											<img src="/images/avatars/john.jpg" className="profilepic" alt="" />
		                										</div>
		                										<div className="titleSub">
		                											<h3 className="title">For The People</h3>
		                											<span className="subtitle">For the people of Richmond</span>
		                										</div>
		                										<div className="donation"><span>$10</span></div>
		                									</li>
		                									<li>
		                										<div className="profileimg">
		                											<img src="/images/avatars/john.jpg" className="profilepic" alt="" />
		                										</div>
		                										<div className="titleSub">
		                											<h3 className="title">For The People</h3>
		                											<span className="subtitle">For the people of Richmond</span>
		                										</div>
		                										<div className="donation"><span>$10</span></div>
		                									</li>
		                									<li>
		                										<div className="profileimg">
		                											<img src="/images/avatars/john.jpg" className="profilepic" alt="" />
		                										</div>
		                										<div className="titleSub">
		                											<h3 className="title">For The People</h3>
		                											<span className="subtitle">For the people of Richmond</span>
		                										</div>
		                										<div className="donation"><span>$10</span></div>
		                									</li>
		                								</ul>
		                							</div>
					                			</div> 
					                		}
					                		{ selPledgeTab === 3 && 
					                			<div className="pledge">
					                				<div className="howmuch">
					                					<div className="label">How much?</div> 
					                					<div className="average">On average, people in Richmond give $20.00</div>
					                				</div>
					                				<br/>
					                				<span className="label">Amount</span>
					                				<ul className="amounts">
					                					<li className={`${pledgeAmount === 1 ? "active" : ""}`} onClick={() => {this.selectPledgeAmount(1)}}>$1</li>
					                					<li className={`${pledgeAmount === 5 ? "active" : ""}`} onClick={() => {this.selectPledgeAmount(5)}}>$5</li>
					                					<li className={`${pledgeAmount === 10 ? "active" : ""}`} onClick={() => {this.selectPledgeAmount(10)}}>$10</li>
					                					<li className={`${pledgeAmount === 20 ? "active" : ""}`} onClick={() => {this.selectPledgeAmount(20)}}>$20</li>
					                				</ul>

					                				<section className="tabSection">
									                    <div className="tabBody">
								                            <ul className="tabs">
								                                <li className={`${pledgeType === 0 ? "active" : ""}`} onClick={() => {this.selectPledgeType(0)}}>Give one time</li>
								                                <li className={`${pledgeType === 1 ? "active" : ""}`} onClick={() => {this.selectPledgeType(1)}}>Set up recurring</li> 
								                            </ul>
									                    </div>
									                </section>

									                { pledgeType === 1 && 
									                	<span className="label">Frequency</span>
									                }

									                <div className="pledgeBtn">
										                <span className="btn btn--brdr btn--brdr-b pledge-btn">
															Pledge
														</span>
													</div>
					                			</div>
					                		}
					                	</div>
					                </section>
                                </div>
                            </Card>
						}
                    </div>

                    <div className="infoBody mobile">
                        { curUserId && selTab === 0 && user.role === NONPROFIT &&
                            <MissionForm user={user} />
                        }
                        { curUserId && selTab === 0 && user.role === DONOR &&
                            <AboutMe user={user} />
                        }
                        { curUserId && selTab === 0 && user.role === COMMUNITY &&
                            <Card className="nonprofit-about-us" padding="15px 5px">
                                <div className="flexBody">
                                    <img src="/images/ui-icon/profile/community-page-icon.svg" alt="community-page-icon" />
                                    <p className="section-title community-title">Community Page</p>
                                </div>
                                <div className="section-description">{user.aboutUs}</div>
                            </Card>
                        }
                        { curUserId && selTab === 0 && user.role === COMMUNITY &&
                            <Card className="nonprofit-about-us pledge-section" padding="5px">
                                <div className="flexBody">
                                    <img src="/images/proj/3.jpg" className="pledge-cover" alt="pledge-cover" />
                                    <span className="section-title pledge-title">
                                    	Richmond Giving Well
                                    </span>
                                </div>
                                <div className="section-description">
                                	<section className="tabSection">
					                    <div className="tabBody">
				                            <ul className="tabs">
				                            	<li className={`pledge__tab tab ${selPledgeTab === 0 ? "active" : ""}`} onClick={() => {this.selectPledgeTab(0)}}>Info</li>
					                            <li className={`pledge__tab tab ${selPledgeTab === 1 ? "active" : ""}`} onClick={() => {this.selectPledgeTab(1)}}>Nonprofits</li>
					                            <li className={`pledge__tab tab ${selPledgeTab === 2 ? "active" : ""}`} onClick={() => {this.selectPledgeTab(2)}}>Activity</li>
				                            </ul>
					                    </div>
					                </section>
					                <section className="tabContent">
					                	<div className="contentBody">
					                		{ selPledgeTab === 0 && 
					                			<div className="info">
					                				<p>
					                					Donate to a pool of 5 different nonprofits each month and help Richmond as a whole! You can pledge as low as $1 or more to give towards the Well and at the end of each month, 100% of the funds will be shared equally among the month's 5 selected nonprofits!
					                				</p>
					                				<table>
					                					<tbody>
						                					<tr>
						                						<td>
						                							<div className="pledges-data">
						                								<span className="amount">$12,000</span>
						                								<p className="amountMessage">in donations pledged for the month of January</p>
						                								<ul className="stats">
						                									<li>
						                										<span className="num numPledges">300</span><br/>
						                										<span className="item">Pledges</span>
						                									</li>
						                									<li>
						                										<span className="num numShares">280</span><br/>
						                										<span className="item">Shares</span>
						                									</li>
						                									<li>
						                										<span className="num numFollowers">300</span><br/>
						                										<span className="item">Followers</span>
						                									</li>
						                								</ul>
						                							</div>
						                						</td>
						                						<td>
						                							<div className="btn btn--brdr btn--brdr-b pledge-btn" onClick={() => {this.selectPledgeTab(3)}}>
																		Pledge
																	</div>
																	
																	<div className="btn btn--brdr btn--brdr-b" >
																		Share
																	</div>
						                						</td>
						                					</tr>
						                				</tbody>
					                				</table>
					                			</div> 
					                		}
					                		{ selPledgeTab === 1 && 
					                			<div className="nonprofits">
					                				<p className="desc">
					                					Where your money goes <br/>

					                					<span className="highlight">The 5 nonprofits</span> <br/>

					                					These nonprofits are on-the-ground across Richmond, VA helping the community from animal shelters to homelessness!
					                				</p>

					                				<Slider {...slickSettings} className="slider">
				                                        <div>
				                                        	<div className="slide">
				                                        		<img src="/images/proj/3.jpg" className="slider-image" alt="nonprofits" />
				                                        		<p className="name">Making A Difference For You, Inc</p>

				                                        		<p className="desc">
				                                        			To strengthen the Greater Richmond community by providing computer literacy and study skills to underserved youth, adults and active senior citizens, resulting in: increased job readiness.
				                                        		</p>
				                                        	</div>
				                                        </div>

				                                        <div>
				                                        	<div className="slide">
				                                        		<img src="/images/proj/2.jpg" className="slider-image" alt="nonprofits" />
				                                        		<p className="name">Making A Difference For You, Inc</p>

				                                        		<p className="desc">
				                                        			To strengthen the Greater Richmond community by providing computer literacy and study skills to underserved youth, adults and active senior citizens, resulting in: increased job readiness.
				                                        		</p>
				                                        	</div>
				                                        </div>
				                                    </Slider>
					                			</div> 
					                		}
					                		{ selPledgeTab === 2 && 
					                			<div className="activity">
					                				<div className="activity-data">
		                								<span className="amount">$20,050</span>
		                								<p className="amountMessage">in donations pledged for the month of January</p>
		                								<ul className="donations">
		                									<li>
		                										<div className="profileimg">
		                											<img src="/images/avatars/john.jpg" className="profilepic" alt="" />
		                										</div>
		                										<div className="titleSub">
		                											<h3 className="title">For The People</h3>
		                											<span className="subtitle">For the people of Richmond</span>
		                										</div>
		                										<div className="donation"><span>$10</span></div>
		                									</li>
		                									<li>
		                										<div className="profileimg">
		                											<img src="/images/avatars/john.jpg" className="profilepic" alt="" />
		                										</div>
		                										<div className="titleSub">
		                											<h3 className="title">For The People</h3>
		                											<span className="subtitle">For the people of Richmond</span>
		                										</div>
		                										<div className="donation"><span>$10</span></div>
		                									</li>
		                									<li>
		                										<div className="profileimg">
		                											<img src="/images/avatars/john.jpg" className="profilepic" alt="" />
		                										</div>
		                										<div className="titleSub">
		                											<h3 className="title">For The People</h3>
		                											<span className="subtitle">For the people of Richmond</span>
		                										</div>
		                										<div className="donation"><span>$10</span></div>
		                									</li>
		                									<li>
		                										<div className="profileimg">
		                											<img src="/images/avatars/john.jpg" className="profilepic" alt="" />
		                										</div>
		                										<div className="titleSub">
		                											<h3 className="title">For The People</h3>
		                											<span className="subtitle">For the people of Richmond</span>
		                										</div>
		                										<div className="donation"><span>$10</span></div>
		                									</li>
		                								</ul>
		                							</div>
					                			</div> 
					                		}
					                		{ selPledgeTab === 3 && 
					                			<div className="pledge">
					                				<div className="howmuch">
					                					<div className="label">How much?</div> 
					                					<div className="average">On average, people in Richmond give $20.00</div>
					                				</div>
					                				<br/>
					                				<span className="label">Amount</span>
					                				<ul className="amounts">
					                					<li className={`${pledgeAmount === 1 ? "active" : ""}`} onClick={() => {this.selectPledgeAmount(1)}}>$1</li>
					                					<li className={`${pledgeAmount === 5 ? "active" : ""}`} onClick={() => {this.selectPledgeAmount(5)}}>$5</li>
					                					<li className={`${pledgeAmount === 10 ? "active" : ""}`} onClick={() => {this.selectPledgeAmount(10)}}>$10</li>
					                					<li className={`${pledgeAmount === 20 ? "active" : ""}`} onClick={() => {this.selectPledgeAmount(20)}}>$20</li>
					                				</ul>

					                				<section className="tabSection">
									                    <div className="tabBody">
								                            <ul className="tabs">
								                                <li className={`${pledgeType === 0 ? "active" : ""}`} onClick={() => {this.selectPledgeType(0)}}>Give one time</li>
								                                <li className={`${pledgeType === 1 ? "active" : ""}`} onClick={() => {this.selectPledgeType(1)}}>Set up recurring</li> 
								                            </ul>
									                    </div>
									                </section>

									                { pledgeType === 1 && 
									                	<span className="label">Frequency</span>
									                }

									                <div className="pledgeBtn">
										                <span className="btn btn--brdr btn--brdr-b pledge-btn">
															Pledge
														</span>
													</div>
					                			</div>
					                		}
					                	</div>
					                </section>
                                </div>
                            </Card>
						}
                    </div>
                    <div className="listBody mobile">
                        { curUserId && selTab === 0 && 
                            (((isAuth || mobileDonorId) && !user.isLocked) || (!isAuth && !mobileDonorId && !user.isLocked)) && (
                            <PostList match={{ params: {} }} selectedUserId={curUserId} getAll />
                        ) }
                        { curUserId && selTab === 0 && !isAuth && user.role !== NONPROFIT && user.role !== COMMUNITY && user.isLocked && (
                            <section className="locked">
                                <img className="lock-img" src="/images/ui-icon/profile/icon-lock.svg" alt=""/>
                                <div className="separator-20" />
                                <div className="lock-desc">Only logged in users have access to @{user.companyName || (user.firstName + " " + user.lastName)}'s complete profile.</div>
                            </section>
                        ) }
                        { selTab === 0 && isAuth && user && user.role !== NONPROFIT && user.role !== COMMUNITY && user.isLocked &&
                            <section className="locked">
                                <img className="lock-img" src="/images/ui-icon/profile/icon-lock.svg" alt=""/>
                                <div className="separator-20" />
                                <div className="lock-title">This account's profile is protected.</div>
                                <div className="separator-20" />
                                <div className="lock-desc">Only confirmed followers have access to @{user.firstName + " " + user.lastName}'s complete profile. Click the "Follow" button to send a follow request.</div>
                            </section>
                        }
                    </div>
                </section>

                <section className="mediaSection">
                    { curUserId && selTab === 1 && 
                        (((isAuth || mobileDonorId) && !user.isLocked) || (!isAuth && !mobileDonorId && !user.isLocked)) && (
						<MediaList selectedUserId={curUserId} />
                    ) }
                    { curUserId && selTab === 1 && !isAuth && user.role !== NONPROFIT && user.role !== COMMUNITY && user.isLocked && (
                        <section className="locked">
                            <img className="lock-img" src="/images/ui-icon/profile/icon-lock.svg" alt=""/>
                            <div className="separator-20" />
                            <div className="lock-desc">Only logged in users have access to @{user.companyName || (user.firstName + " " + user.lastName)}'s complete profile.</div>
                        </section>
                    ) }
                    { selTab === 1 && isAuth && user && user.role !== NONPROFIT && user.role !== COMMUNITY && user.isLocked &&
                            <section className="locked">
                                <img className="lock-img" src="/images/ui-icon/profile/icon-lock.svg" alt=""/>
                                <div className="separator-20" />
                                <div className="lock-title">This account's profile is protected.</div>
                                <div className="separator-20" />
                                <div className="lock-desc">Only confirmed followers have access to @{user.firstName + " " + user.lastName}'s complete profile. Click the "Follow" button to send a follow request.</div>
                            </section>
                        }
                </section>

                { curUserId && selTab === 2 && user.role === NONPROFIT &&
                    <section className={`infoSection desktop`}>
                        <div className="detailInfoBody">
                            <UserDetailInfo user={user} />
                        </div>
                        <div className="finacialsBody">
                            <FinancialInfo user={user} />
                        </div>
                    </section>
                }

                { curUserId && selTab === 2 && user.role !== NONPROFIT && user.role !== COMMUNITY && !isAuth && user.isLocked &&
                    <section className="locked">
                        <img className="lock-img" src="/images/ui-icon/profile/icon-lock.svg" alt=""/>
                        <div className="separator-20" />
                        <div className="lock-desc">Only logged in users have access to @{user.companyName || (user.firstName + " " + user.lastName)}'s complete profile.</div>
                    </section>
                }

                { selTab === 2 && isAuth && user && user.role !== NONPROFIT && user.role !== COMMUNITY && user.isLocked &&
                    <section className="locked">
                        <img className="lock-img" src="/images/ui-icon/profile/icon-lock.svg" alt=""/>
                        <div className="separator-20" />
                        <div className="lock-title">This account's profile is protected.</div>
                        <div className="separator-20" />
                        <div className="lock-desc">Only confirmed followers have access to @{user.firstName + " " + user.lastName}'s complete profile. Click the "Follow" button to send a follow request.</div>
                    </section>
                }

                { curUserId && selTab === 2 && user.role === DONOR && isAuth && !user.isLocked &&
                    <section className={`infoSection desktop`}>
                        <AboutMe user={user} isDetail={true} />
                    </section>
                }

                { curUserId && selTab === 2 && user.role === NONPROFIT &&
                    <section className={`infoSection mobile`}>
                        <MobileInfo user={user} />
                    </section>
                }

                { curUserId && selTab === 2 && user.role === DONOR && isAuth && !user.isLocked &&
                    <section className={`infoSection donor mobile`}>
                        <AboutMe user={user} isDetail={true} />
                    </section>
                }

                <section className="modalSection">
                    { showGiveForm === DONATION &&
						<Modal
                            className="donateFormModal"
							showModal={showGiveForm === DONATION}
							closeModal={()=> {this.setState({showGiveForm: -1})}}>
							<DonateForm
                                selectedUser={user}
                                mobileDonorId={mobileDonorId}
								closeModal={()=> {this.setState({showGiveForm: -1})}} />
						</Modal>
					}

					{ showGiveForm === PICKUP &&
						<Modal
                            className="pickupFormModal"
							showModal={showGiveForm === PICKUP}
							closeModal={()=> {this.setState({showGiveForm: -1})}}>
							<PickupForm
								selectedUser={user}
								closeModal={()=> {this.setState({showGiveForm: -1})}} />
						</Modal>
					}

					{ showGiveForm === VOLUNTEER &&
						<Modal
                            className="volunteerFormModal"
							showModal={showGiveForm === VOLUNTEER}
							closeModal={()=> {this.setState({showGiveForm: -1})}}>
							<VolunteerForm
								selectedUser={user}
								closeModal={()=> {this.setState({showGiveForm: -1})}} />
						</Modal>
                    }

                    <Modal title="Please wait until getting fully verified." showModal={showNeedVerifyModal} closeModal={this.closeNeedVerifyModal} />
				    <Modal title={claimResult} showModal={showClaimResult} closeModal={this.hideClaimResult} />

                    <ClaimModal
						onClaim={this.onClaim}
						onSupport={this.onSupport}
						showModal={showClaimModal}
						closeModal={this.closeClaimModal} />

                    { curUserId && selTab === 0 && user.role === NONPROFIT && (!user.isClaimed) && !user.isApproved &&
						<div className="profileDiscoverClaim">
							<div className="iconRow">
								<div>
									<img src="/images/ui-icon/profile/research.svg" alt="research" />
								</div>
								<div>
									<img src="/images/ui-icon/profile/user.svg" alt="user" />
								</div>
							</div>
							<div className="descriptionRow">
								<div>
									<p>This nonprofit isn't verified yet. Discover more!</p>
								</div>
								<div>
									<p>Is this your nonprofit organzation? <br/>Claim your profile for Free!</p>
								</div>
							</div>
							<div className="buttonRow">
								<div>
									<Button className="m-r-5" label="Discover" onClick={this.discover} solid noBorder />
								</div>
								<div>
									<Button className="m-r-5" label="Claim" onClick={this.claim} solid noBorder />
								</div>
							</div>
						</div>
					}

                    { showAddPostModal && (
						<div className={`modal ${showAddPostModal ? 'open' : ''}`} onClick={this.closeAddPost}>
							<div className="modal-content" onClick={(e) => {e.stopPropagation()}}>
								<PostForm match={{params: {} }} hideDialog={this.closeAddPost} />
							</div>
						</div>
                    )}
                </section>
            </div>
        )
    }

}

const mapStateToProps = ({ authentication, follows }) => ({
	user: authentication.user,
	userId: authentication.userId,
	otherUser: follows.userInfo,
	isAuth: authentication.isAuth
})

export default connect(
	mapStateToProps,
	null,
	null,
	{
		pure: false
	}
)(NewProfile)
