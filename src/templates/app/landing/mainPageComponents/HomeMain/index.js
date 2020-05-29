import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { getUserList, clearUserList } from '../../../../../actions/user';
import { togglePreloader } from '../../../../../actions/preloader';

import UserAvatar from '../../../../common/userComponents/userAvatar';

class HomeMain extends Component {
    
    state = {
        searchKeyword: '',
        showSearchDialog: false,
        openSearch: false,
        skip: 0,
        limit: 10
    }

    allSearchClicked = false;

    constructor(props) {
        super(props);

        this.onBodyClickHandler = this.onBodyClickHandler.bind(this);
        this.scrollingSearchBody = this.scrollingSearchBody.bind(this);
    }

    componentDidMount() {
        document.querySelector('html').scrollTop = 0;

        document.addEventListener('mousedown', this.onBodyClickHandler);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onBodyClickHandler);

        this.removeSearchBodyScrollingHandler();
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

    scrollUp() {
        if (document.body.clientWidth < 768) {
            window.scrollTo({
                top: 0,
                // behavior: 'smooth'
            });
            document.body.classList.remove("no-scrollbar");
        }
    }

    scrollDown() {
        if (document.body.clientWidth < 768) {
            window.scrollTo({
                top: 380,
                // behavior: 'smooth'
            });
            document.body.classList.add("no-scrollbar");
        }
    }

    onBodyClickHandler = e => {
		if (this.allSearchClicked) {
			this.allSearchClicked = false;
			return;
		}

        if (this.state.showSearchDialog) {
            this.setState({
                showSearchDialog: false
            }, () => {
                this.scrollUp();
                
                setTimeout(() => {
                    this.removeSearchBodyScrollingHandler();
                }, 100);
            });
        }
    }
    
    onClickAllSearch = (e) => {
		this.allSearchClicked = true;

		e.stopPropagation();

		this.setState({ search: "", skip: 0 }, () => {
			this.getData();
		})
    }
    
    closeSearch = () => {
		this.setState({
            showSearchDialog: false, openSearch : false, search: ""
        }, () => {
            this.scrollUp();

            setTimeout(() => {
                this.removeSearchBodyScrollingHandler();
            }, 100);
        });
	}

    onChangeSearchKeyword = e => {
        this.scrollDown();
        
        this.setState({
            searchKeyword: e.target.value,
            skip: 0
        }, () => {
            this.getData();
        });
    }

    getData = () => {
        let { skip, limit } = this.state;

		this.props.getUserList({
            skip: skip,
            limit: limit,
            companyName: this.state.searchKeyword,
            role: 3, 
            sortBy: 'companyName',
            sortDirection: -1
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
            }, 100);
        });
    }
    
    onGoProfile = (userId) => {
        this.props.togglePreloader({ show: true, actionName: '' });

		this.setState({
            searchKeyword: "",
            showSearchDialog: false
        }, () => {
            this.scrollUp();
            
            setTimeout(() => {
                this.props.clearUserList();
                this.props.push(`/${userId}`);
                this.props.togglePreloader({ show: false, actionName: '' });
            }, 50);
		})
    }
    
    currentPos = document.querySelector('.search-body') ? document.querySelector('.search-body').scrollTop : 0;
    scrollingSearchBody = () => {
        let { skip, limit, searchKeyword } = this.state;
        const { userList } = this.props;

        const searchBodyElem = document.querySelector('.search-body');
        if (!searchBodyElem)
            return;

        if (searchBodyElem.scrollHeight - 150 < searchBodyElem.scrollTop + searchBodyElem.clientHeight && skip <= userList.length) {
            this.props.getUserList({
                skip: skip,
                limit: limit,
                companyName: searchKeyword,
                role: 3, 
                sortBy: 'companyName',
                sortDirection: -1
            });

            this.setState({
                skip: skip + limit
            });
        }

        this.currentPos = searchBodyElem.scrollTop;
    }

    render() {
        const { searchKeyword, showSearchDialog } = this.state;
        const { userList } = this.props;

        return (
            <div className="home-main" style={{ backgroundImage: `url("/images/ui-icon/back/home-back.jpg")` }}>
                <div className="cn">
                    <div className="home-main__content">
                        <h1 className="h1 home-main__title">
                            Rethink Giving
                        </h1>
                        <p className="home-main__desc">We are a social, giving platform that connects you to the communities and causes you care about. Donate, Volunteer & Request pickups!</p>
                        <div className="searchBox">
                            <input className="searchInput" type="text" value={searchKeyword} onChange={this.onChangeSearchKeyword} placeholder="Search for nonprofits …" />
                            <img className="searchIcon" src="/images/ui-icon/landing/search-icon.svg" alt="search-icon" />
                            { showSearchDialog &&
								<div className="search-result main-font">
									<div className="all-result" onMouseDown={(e) => this.onClickAllSearch(e)}>
										<span className="_label">All results</span>
										<img className="_img" src="/images/ui-icon/dropdown.svg" alt="icon" />
									</div>
									<div className="search-body">
										{ userList && userList.length !== 0 && 
											userList.map((e, i) => {
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
									</div>								
								</div>
							}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => ({
    userList: state.user.userList,
    guestCharityList: state.user.guestCharityList
})

const mapDispatchToProps = {
    getUserList,
    clearUserList,
    push,
    togglePreloader
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeMain);