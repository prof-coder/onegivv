import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

// import HeaderMenu from '../headerMenu'
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { getMyProfile } from '../../../actions/authActions';

// import Button from '../Button'
import { history } from '../../../store';
import { NONPROFIT } from '../../../helpers/userRoles';
import { getSearchByType, clearSearchByType } from '../../../actions/search';
import { sendShowInviteNonprofitDialogMsg, sendHideInviteNonprofitDialogMsg, getActiveProjectType } from '../../../actions/global';
import { inviteNonprofit } from '../../../actions/user';

import { signIn, signUp } from '../authModals/modalTypes';
import InviteNonprofitModal from '../InviteNonprofitModal';
// import Modal from '../../common/Modal';

import HeaderMenu from '../headerMenu';
// import MobileMenu from '../../app/landing/mainPageComponents/MobileMenu';
import NewMobileMenu from '../../app/landing/mainPageComponents/NewMobileMenu';

import UserAvatar from '../userComponents/userAvatar';

class MainHeader extends Component {

	state = {
		search: "",
		showSearchDialog: false,
		openSearch: false,
		isHome: false,
		showTopMenu: false,
		notificationShow: false,
		currentMenu: 'home',
		skip: 0,
		limit: 0,
		showInviteModal: false
	}

	allSearchClicked = false;

	constructor(props) {
		super(props);

		this.onMouseEnterOfMenu = this.onMouseEnterOfMenu.bind(this);
		this.onCloseMobileMenu = this.onCloseMobileMenu.bind(this);
		this.onBodyClickHandler = this.onBodyClickHandler.bind(this);
	}

	componentDidMount() {
		this.props.isAuth && this.props.getMyProfile();

		document.addEventListener('mousedown', this.onBodyClickHandler);
	}

	componentWillUnmount() {
        document.removeEventListener('mousedown', this.onBodyClickHandler);

        this.removeSearchBodyScrollingHandler();
	}
	
	componentWillReceiveProps(nextProps) {
		if (nextProps.showInviteNonprofitModal) {
			this.setState({
				showInviteModal: nextProps.showInviteNonprofitModal
			});

			this.props.sendHideInviteNonprofitDialogMsg();
		}
	}

	addSearchBodyScrollingHandler() {
        const searchBodyElem = document.querySelector('.search-body');
        if (searchBodyElem) {
            searchBodyElem.addEventListener('wheel', this.scrollingSearchBody, false);
            searchBodyElem.addEventListener('touchstart', this.scrollingSearchBody, false);
        }
    }

    removeSearchBodyScrollingHandler() {
        const searchBodyElem = document.querySelector('.search-body');
        if (searchBodyElem) {
            searchBodyElem.removeEventListener('wheel', this.scrollingSearchBody, false);
            searchBodyElem.removeEventListener('touchstart', this.scrollingSearchBody, false);
        }
    }

	onBodyClickHandler = e => {
		if (this.allSearchClicked) {
			this.allSearchClicked = false;
			return;
		}

		this.setState({
			showSearchDialog: false
		}, () => {
			document.body.classList.remove("no-scrollbar");
			setTimeout(() => {
                this.removeSearchBodyScrollingHandler();
			}, 200);
		});
	}

	onClickAllSearch = (e) => {
		this.allSearchClicked = true;

		e.stopPropagation();

		this.setState({ search: "" }, () => {
			this.getData();
		})
	}

	onClickSearchIcon = (e) => {
		e.stopPropagation();

		this.getData();
	}

	closeSearch = () => {
		this.setState({
			showSearchDialog: false, openSearch : false, search: ""
		}, () => {
			document.body.classList.remove("no-scrollbar");
			setTimeout(() => {
                this.removeSearchBodyScrollingHandler();
            }, 200);
		});
	}

	handleChange = (e) => {
		document.body.classList.add("no-scrollbar");
		this.setState({skip: 0, search: e.target.value}, () => {
			this.setState({
                skip: 0,
                limit: 10
            }, () => {
                this.getData();
            });
		})
	}

	getData = () => {
		let { skip, limit, search } = this.state;

		this.props.getSearchByType({
            type: 0,
            skip: skip,
            limit: limit,
            search: search
		});
		
		let prevShowSearchDialog = this.state.showSearchDialog;

		this.setState({
			showSearchDialog: true,
			skip: skip + limit
		}, () => {
			setTimeout(() => {
                if (!prevShowSearchDialog) {
                    this.addSearchBodyScrollingHandler();
                }
            }, 500);
		});
	}

	currentPos = document.querySelector('.search-body') ? document.querySelector('.search-body').scrollTop : 0;
    scrollingSearchBody = () => {
        let { skip, limit, search } = this.state;
        const { searchResults } = this.props;

        const searchBodyElem = document.querySelector('.search-body');
        if (!searchBodyElem)
            return;

		let listLength = 0;
		if (searchResults && searchResults.user && searchResults.user.length)
			listLength += searchResults.user.length;
		if (searchResults && searchResults.project && searchResults.project.length)
			listLength += searchResults.project.length;

        if (searchBodyElem.scrollHeight - 150 < searchBodyElem.scrollTop + searchBodyElem.clientHeight && skip <= listLength) {
            this.props.getSearchByType({
                type: 1,
				skip: skip,
				limit: limit,
				search: search
            });

            this.setState({
                skip: skip + limit
            });
        }

        this.currentPos = searchBodyElem.scrollTop;
    }

    handleKeyPress = (event) => {
	}

	onGoProfile = (userId) => {
		this.setState({search: "", showSearchDialog: false}, () => {
			document.body.classList.remove("no-scrollbar");
			setTimeout(() => {
                this.removeSearchBodyScrollingHandler();
			}, 200);
			
			this.props.clearSearchByType();
			this.props.push(`/${userId}`);
		})
	}

	onGoProject = (userId, projectId) => {
		this.setState({search: "", showSearchDialog: false}, () => {
			document.body.classList.remove("no-scrollbar");
			setTimeout(() => {
                this.removeSearchBodyScrollingHandler();
			}, 200);

			this.props.clearSearchByType();
			this.props.push(`/${userId}/project/${projectId}`);
		})
	}

	onExpandSearch = () => {
		this.setState({openSearch: true}, () => {
			let input = document.querySelector(".searchInput");
			input.focus();
		})
	}

	onMouseEnterOfMenu = e => {
		e.stopPropagation();

		this.setState({ showTopMenu: !this.state.showTopMenu, notificationShow: false });

		const appCon = document.querySelector('.app');
		if (appCon && appCon.classList)
			appCon.classList.toggle('open-sidemenu')
	}

	onClickSearch = e => {
		this.setState({ showTopMenu: false, notificationShow: false });

		const appCon = document.querySelector('.app');
		if (appCon && appCon.classList)
			appCon.classList.toggle('open-sidemenu')
			
		this.props.push(`/m-search`);
	}

	onCloseMobileMenu = e => {
		if (e)
			e.stopPropagation();

		this.setState({ showTopMenu: false, notificationShow: false });
	}

	closeInviteModal = e => {
		this.setState({ showInviteModal: false })
	}

	onClickInviteNonProfit = inviteName => {
		this.props.inviteNonprofit(inviteName);
	}

	render() {
		const { search, showTopMenu, currentMenu, showSearchDialog, showInviteModal } = this.state;
		let { isAuth, user, searchResults, isHome, isScrollDown } = this.props;

		return (
			<header id="masthead" className={(isHome && !isScrollDown) ? 'header' : 'header fixed'}>
				<div className="header-top">
					<div className="cn">
						<div className={`header-top__logo ${isAuth ? 'loggedIn' : ''}`}>
							<div className="hidden">OneGivv</div>
							<div className="logo">
								<img 
									src="/images/ui-icon/logo.png"
									alt="logo"
									onClick={() => {
										this.setState({
											currentMenu: 'home'
										});
										(isAuth && user.role === NONPROFIT) ? 
											history.push(`/${user._id}/dashboard`) 
											: (isAuth && user.role !== NONPROFIT) ? history.push(`/${user._id}/news-feed`) : history.push('/')
									}}
								/>
							</div>
						</div>
						<nav className={`main-mnu hidden-md ${isAuth ? 'loggedIn' : ''}`}>
							<ul>
								{ !isAuth &&
									<li className={`menu-item ${currentMenu === 'home' ? 'current-menu-item' : ''}`}>
										<NavLink to={`/`} onClick={e => {
											e.stopPropagation();
											this.setState({
												currentMenu: 'home'
											});
										}}>
											<span>Home</span>
										</NavLink>
									</li>
								}
								{ !isAuth &&
									<li className={`menu-item ${currentMenu === 'nonprofit' ? 'current-menu-item' : ''}`}>
										<NavLink to={`/nonProfit`} onClick={e => {
											e.stopPropagation();
											this.setState({
												currentMenu: 'nonprofit'
											});
										}}>
											<span>Nonprofit</span>
										</NavLink>
									</li>
								}
								{ !isAuth &&
									<li className={`menu-item menu-item-has-children ${(currentMenu === 'learn' || currentMenu === 'about') ? 'current-menu-item' : ''}`}>
										<NavLink to={`/learn`} onClick={e => {
											e.stopPropagation();
											this.setState({
												currentMenu: 'learn'
											});
										}}>
											<span>Learn more</span>
										</NavLink>
										<ul className="sub-menu">
											<li className={`menu-item ${currentMenu === 'learn' ? 'current-menu-item' : ''}`}>
												<NavLink to={`/learn`} onClick={e => {
													e.stopPropagation();
													this.setState({
														currentMenu: 'learn'
													});
												}}>
													<span>Learn more</span>
												</NavLink>
											</li>
											<li className={`menu-item ${currentMenu === 'about' ? 'current-menu-item' : ''}`}>
												<NavLink to={`/about`} onClick={e => {
													e.stopPropagation();
													this.setState({
														currentMenu: 'about'
													});
												}}>
													<span>About Us</span>
												</NavLink>
											</li>
										</ul>
									</li>
								}
								<li className={`menu-item discovery-link ${currentMenu === 'discovery' ? 'current-menu-item' : ''} ${isAuth ? 'loggedInDiscoveryMenu' : ''}`}>
									<NavLink exact to="/discovery"
										onClick={e => {
											e.stopPropagation();											
											this.setState({ currentMenu: 'discovery' });
											this.props.push('/discovery');
										}}
									>
										<span>Discover</span>
										{ isAuth && <img src="/images/ui-icon/dropdown-arrow.svg" alt="dropdown-arrow" /> }
									</NavLink>
									<ul className={`sub-menu ${isAuth ? 'smallWidth' : ''}`}>
										<li className={`menu-item ${currentMenu === 'discovery_charity' ? 'current-menu-item' : ''}`}>
											<NavLink to={`/discovery?type=-1`} onClick={e => {
												e.stopPropagation();
												this.setState({
													currentMenu: 'discovery_charity'
												});

												this.props.getActiveProjectType(-1);
											}}>
												<span>Charity</span>
											</NavLink>
										</li>
										<li className={`menu-item ${currentMenu === 'discovery_volunteer' ? 'current-menu-item' : ''}`}>
											<NavLink to={`/discovery?type=0`} onClick={e => {
												e.stopPropagation();
												this.setState({
													currentMenu: 'discovery_volunteer'
												});

												this.props.getActiveProjectType(0);
											}}>
												<span>Volunteer</span>
											</NavLink>
										</li>
										<li className={`menu-item ${currentMenu === 'discovery_donate' ? 'current-menu-item' : ''}`}>
											<NavLink to={`/discovery?type=1`} onClick={e => {
												e.stopPropagation();
												this.setState({
													currentMenu: 'discovery_donate'
												});

												this.props.getActiveProjectType(1);
											}}>
												<span>Donate</span>
											</NavLink>
										</li>
										<li className={`menu-item ${currentMenu === 'discovery_pickup' ? 'current-menu-item' : ''}`}>
											<NavLink to={`/discovery?type=2`} onClick={e => {
												e.stopPropagation();
												this.setState({
													currentMenu: 'discovery_pickup'
												});

												this.props.getActiveProjectType(2);
											}}>
												<span>PickUp</span>
											</NavLink>
										</li>
										<li className={`menu-item current-menu-item`}>
											<NavLink to={`/discovery?type=-1`} onClick={e => {
												if (e) {
													e.stopPropagation();
													e.preventDefault();
												}
												
												this.setState({
													showInviteModal: true
												});
											}}>
												<span>Invite Nonprofit</span>
											</NavLink>
										</li>
									</ul>
								</li>
								{ !isAuth &&
									<li className={`menu-item ${currentMenu === 'blog' ? 'current-menu-item' : ''}`}>
										<NavLink
											to = {`/`}
											onClick = {e => {
												e.preventDefault();
												e.stopPropagation();

												this.setState({
													currentMenu: 'blog'
												});

												const win = window.open('https://medium.com/onegivv', '_blank');
												win.focus();
											}}>
												<span>Blog</span>
										</NavLink>
									</li>
								}
							</ul>
						</nav>

						<div className={`searchWrapper`}>
							<div className="search hidden-sm">
								<input
									type="search"
									className="search-field"
									placeholder="Search …"
									value={search}
									onChange={this.handleChange}
									onKeyPress={this.handleKeyPress}
									autoComplete="off"
									name="s"
									title="" />
								<button className="btn btn--search">
									<span className="icon-search"></span>
								</button>
							</div>

							{ showSearchDialog &&
								<div className="search-result main-font">
									<div className="all-result" onMouseDown={(e) => this.onClickAllSearch(e)}>
										<span className="_label">All results</span>
										<img className="_img" src="/images/ui-icon/dropdown.svg" alt="icon" />
									</div>
									<div className="search-body">
										{ searchResults.user.length !== 0 && <div className="group-label">People</div> }
										{ searchResults.user.length !== 0 && 
											searchResults.user.map((e, i) => {
												return (
													<div className="info-wrapper" key={e._id} onMouseDown={() =>this.onGoProfile(e._id) }>
														<UserAvatar
															imgUserType={e.role}
															imgUser={e.avatar}
															userId={e._id}
															size={40}
														/>
														<span className="label-name">{e.companyName || e.firstName + ' ' + e.lastName}</span>
													</div>
												)
											})										
										}
										{ searchResults.project.length !== 0 && <div className="group-label">Projects</div> }
										{ searchResults.project.length !== 0 && 
											searchResults.project.map((e, i) => {
												return (
													<div className="info-wrapper" key={e._id} onMouseDown={() => this.onGoProject(e.user._id, e._id)}>
														<UserAvatar
															imgUserType={e.user.role}
															imgUser={e.user.avatar}
															userId={e.user._id}
															size={40}
														/>
														<span className="label-name">{e.title}</span>
													</div>
												)
											})
										}
									</div>								
								</div>
							}
						</div>
						
						{ !isAuth &&
							<div>
								<div className={`btn btn--brdr btn--brdr-b log-in hidden-sm`} 
									onClick={e => history.push(`?modal=${signIn}`)}>
									Log in
								</div>
								<div className="btn btn--brdr btn--brdr-b sign-up hidden-sm" onClick={e => history.push(`?modal=${signUp}`)}>
									Signup
								</div>
								<div className="mobile-toggle">
									<span className={`toggle-mnu ${showTopMenu ? 'on' : ''}`} onClick={this.onMouseEnterOfMenu}>
										<span></span>
									</span>
								</div>
							</div>
						}
						
						{ isAuth &&
							<HeaderMenu isHome={isHome} isScrollDown={isScrollDown} />
						}

						{ !isAuth &&
							<NewMobileMenu 
								isAuth={isAuth} 
								user={user}
								showSideMenubar={showTopMenu}
								searchValue={search}
								onClickSearch={this.onClickSearch}
								onCloseMobileMenu={this.onMouseEnterOfMenu}
							/>
						}
					</div>
				</div>
				<InviteNonprofitModal
					showInviteModal={showInviteModal} 
					closeInviteModal={this.closeInviteModal}
					inviteNonprofit={this.onClickInviteNonProfit} />
			</header>
		)
	}
}

const mapStateToProps = ({ authentication, search, globalReducer }) => ({
	user: authentication.user,
	isAuth: authentication.isAuth,
	searchResults: search.searchResults,
	showInviteNonprofitModal: globalReducer.showInviteModal
})

const mapDispatchToProps = {
	getMyProfile,
	push,
	getSearchByType,
	clearSearchByType,
	inviteNonprofit,
	sendShowInviteNonprofitDialogMsg,
	sendHideInviteNonprofitDialogMsg,
	getActiveProjectType
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MainHeader)
