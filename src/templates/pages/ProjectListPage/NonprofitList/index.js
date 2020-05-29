import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { getUserList, clearUserList/*, getGuestCharityList, addGuestCharities*/, addGuestCharitiesFromCSV } from '../../../../actions/user';
import { togglePreloader } from '../../../../actions/preloader';
import Placeholder from '../../../common/noContentPlaceholder';

import CharityForm from '../CharityForm';

class NonprofitList extends Component {

    state = {
        skip: 0,
        limit: 5,
        pageNum: 1,
        fetchUserList: true,
        fetchGuestUserList: false
    }

    componentDidMount() {
        this._mounted = true;

        let { skip, limit } = this.state;
        const { title, location, interests } = this.props;
        
        let selectedInterests = [];
        if (interests && interests.length > 0) {
            if (interests[0].value) {
                selectedInterests = interests.map(e => e.value);
            } else {
                selectedInterests = interests.map(e => e);
            }
        }

        this.props.getUserList({
            skip, limit,
            companyName: title,
            location: location,
            interests: selectedInterests,
            role: 3,
            sortBy: 'isApproved',
            sortDirection: -1
        });

        this.setState({
            skip: skip + limit
        });

        document.addEventListener('wheel', this.scrolling, false);
        document.addEventListener('touchstart', this.scrolling, false);

        // this.props.addGuestCharitiesFromCSV();
    }

    componentWillUnmount() {
        this._mounted = false;

        this.props.clearUserList();
    }

    componentWillReceiveProps(nextProps) {
        let { limit } = this.state;
        // const { title } = this.props;

        if (nextProps.title !== this.props.title || 
            nextProps.location !== this.props.location ||
            nextProps.interests !== this.props.interests) {
            
            let selectedInterests = [];
            if (nextProps.interests && nextProps.interests.length > 0) {
                if (nextProps.interests[0].value) {
                    selectedInterests = nextProps.interests.map(e => e.value);
                } else {
                    selectedInterests = nextProps.interests.map(e => e);
                }
            }

            let newSkip = 0;
            this.props.getUserList({
                newSkip, limit, 
                companyName: nextProps.title, 
                location: nextProps.location, 
                interests: selectedInterests,
                role: 3, 
                sortBy: 'isApproved', 
                sortDirection: -1,
                type: 'all'
            });
    
            this.setState({
                skip: limit
            });
        }
        if (nextProps.preloader.actionName === 'fetchingUserList') {
			if (nextProps.preloader.show === false) {
                if (nextProps.preloader.count < this.state.limit) {
                    // this.props.getGuestCharityList({
                    //     pageNum: 1,
                    //     pageSize: limit,
                    //     companyName: title
                    // });

                    // this.setState({
                    //     pageNum: 2,
                    //     fetchUserList: false,
                    //     fetchGuestUserList: true
                    // });
                }
			}
        }
        if (nextProps.preloader.actionName === 'fetchingGuestUserList') {
			if (nextProps.preloader.show === false) {
                // this.props.addGuestCharities(nextProps.preloader.users);
            }
		}
    }

    currentPos = window.scrollY;
	scrolling = () => {
        let { skip, limit/*, pageNum*/ } = this.state;
        const { userList, title, location, interests, activeType } = this.props;

        if (activeType >= 0 || activeType === -2 || activeType === -4)
            return;

        let selectedInterests = [];
        if (interests && interests.length > 0) {
            if (interests[0].value) {
                selectedInterests = interests.map(e => e.value);
            } else {
                selectedInterests = interests.map(e => e);
            }
        }
        
        if (document.body.clientHeight - 500 < window.scrollY + window.innerHeight && skip <= userList.length) {
            if (this._mounted) {
                if (this.state.fetchUserList) {
                    this.props.getUserList({
                        skip, limit, companyName: title, location: location, interests: selectedInterests, role: 3, sortBy: 'isApproved', sortDirection: -1
                    });

                    this.setState({
                        skip: skip + limit
                    });
                } else if (this.state.fetchGuestUserList) {
                    // this.props.getGuestCharityList({
                    //     pageNum: pageNum,
                    //     pageSize: limit,
                    //     companyName: title
                    // });

                    // this.setState({
                    //     pageNum: pageNum + 1,
                    //     skip: skip + limit
                    // });
                }
            }
        }

		this.currentPos = window.scrollY;
	}

    render() {
        const { userList, onCharityClick, activeType } = this.props;

        if (activeType === -2) {
            return (null);
        }
        
        return (
            <section className="nonprofitListSection">
                <div className="nonprofitList">
                    { userList && userList.length > 0 && userList.map((e, i) => (
                        <Fragment key={e._id}>
                            <CharityForm user={e} onUserClick={(event) => onCharityClick(e, event)} />
                        </Fragment>
                    )) }
                </div>
                { userList && userList.length === 0 &&
                    <Placeholder
                        titleMain={`There are currently no charities found`}
                    />
                }
            </section>
        )
    }

}

const mapStateToProps = state => ({
    userList: state.user.userList,
    preloader: state.preloader
})

const mapDispatchToProps = {
    getUserList,
    clearUserList,
    togglePreloader,
    // getGuestCharityList,
    // addGuestCharities,
    addGuestCharitiesFromCSV
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NonprofitList);