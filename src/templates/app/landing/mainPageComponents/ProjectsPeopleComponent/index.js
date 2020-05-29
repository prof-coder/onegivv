import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { push } from 'react-router-redux';
import Slider from 'react-slick';

import {
	getProjectByParams,
	getProjectSubscription,
	clearProjectsList
} from '../../../../../actions/project';
import { getUserList, clearUserList } from '../../../../../actions/user';

import { DONOR } from '../../../../../helpers/userRoles';

import ProjectCard from '../../../../common/ProjectCard';

import CharityForm from '../../../../pages/ProjectListPage/CharityForm';

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

class ProjectsPeopleComponent extends Component {

    state = {
        projectsSkip: 0,
        projectsLimit: 10,
        usersSkip: 0,
        usersLimit: 10,
        shouldClear: true,
        projects: [],
        userList: []
    }

    componentDidMount() {
        this._mounted = true;

        this.getData();
    }

    componentWillUnmount() {
        this._mounted = false;
	}

    componentWillReceiveProps(nextProps) {
        if (nextProps.projects.length !== this.state.projects.length && nextProps.projects.length > 0) {
            this.setState({
                projects: nextProps.projects
            }, () => {
                // setTimeout(() => {
                //     window.renderProjectScroll();
                // }, 1000);
            });
        }
        
        if (nextProps.userList.length !== this.state.userList.length && nextProps.userList.length > 0) {
            this.setState({
                userList: nextProps.userList
            }, () => {
                // setTimeout(() => {
                //     window.renderNonprofitScroll();
                // }, 1000);
            });
        }
    }
    
    getData() {
        let { projectsSkip, projectsLimit, usersSkip, usersLimit } = this.state;

        let params = {
			skip: projectsSkip,
            limit: projectsLimit,
            isWeLove: true
        };
        
        this.props.getProjectByParams(params);

        params = {
            skip: usersSkip,
            limit: usersLimit,
            role: 3,
            isWeLove: true
        }

        this.props.getUserList(params);
    }

    readMore = (id, projectId) => () => {
		this.setState({shouldClear: false}, () => {
            document.querySelector('html').scrollTop = 0;
			this.props.push(`/${id}/project/${projectId}`);
		})
    }
    
    onCharityClick = charityInfo => () => {
		this.setState({shouldClear: false}, () => {
            document.querySelector('html').scrollTop = 0;
            if (charityInfo === null)
                return;

			this.props.push(`/${charityInfo._id}`);
		})
    }
    
    render() {
        const { projects, userList, authUser } = this.props;

        let user = {}
        if (!authUser) {
            user = {
                role: DONOR
            };
        } else {
            user = authUser;
        }
        
        const slickSettings = {
            dots: false,
            arrows: true,
            infinite: true,
            lazyLoad: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            swipeToSlide: true,
            // centerMode: true,
            // centerPadding: '500px',
            nextArrow: <NextArrow />,
            prevArrow: <PrevArrow />,
            responsive: [{
                breakpoint: 1440,
                settings: {
                    slidesToShow: 4,
                    centerPadding: '100px',
                }
            }, {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 3,
                    centerPadding: '100px',
                }
            }, {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    centerPadding: '100px',
                }
            }, {
                breakpoint: 769,
                settings: {
                    slidesToShow: 2,
                    centerPadding: '100px',
                }
            }, {
                breakpoint: 425,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '0px',
                }
            }, {
                breakpoint: 350,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '0px',
                }
            }]
        };

        return (
            <section className="projectsPeopleComponent">
                <div className="b-indent b-scroll">
                    <div className="cn">
                        <div className="b-indent-left">
                            <div className="t-group">
                                <div className="t-group">
                                    <h2>Discover, <span>create and engage</span></h2>
                                    <h3 style={{ color: `#000000` }}>OneGivv connects people who want to do good.</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sliderBody">
                        <div className="b-scroll-wrap sliderWrapper">
                            <h3 className="b-scroll__title">Projects We love</h3>
                            <div className="b-scroll-items">
                                <div className="projectSlider">
                                    <Slider {...slickSettings} className="slider">
                                        { projects && projects.length > 0 && projects.map((e, i) => {
                                            return (
                                                <li className="b-scroll__item" key={e._id}>
                                                    <ProjectCard
                                                        {...e}
                                                        user={e && e.user}
                                                        authUser={user}
                                                        readMore = {this.readMore((e && e.user) ? e.user._id : "", (e) ? e._id : "")}
                                                    />
                                                </li>
                                            )
                                        } ) }
                                    </Slider>
                                </div>
                                <div className="btn-group">
                                    <NavLink to={`/discovery`} className="link" onClick={e => e.stopPropagation()}>
                                        Discover more
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                        <div className="b-scroll-wrap sliderWrapper">
                            <h3 className="b-scroll__title">Nonprofits We Love</h3>
                            <div className="b-scroll-items">
                                <div className="charitySlider">
                                    <Slider {...slickSettings} className="slider">
                                        { userList && userList.length > 0 && userList.map((e, i) => {
                                            return (
                                                <li key={e._id}>
                                                    <CharityForm 
                                                        user={e} 
                                                        onUserClick={() => this.onCharityClick(e ? e : null)}
                                                    />
                                                </li>
                                            )
                                        } ) }
                                    </Slider>
                                </div>
                                <div className="btn-group">
                                    <NavLink to={`/discovery`} className="link" onClick={e => e.stopPropagation()}>
                                        Discover more
                                    </NavLink>
                                </div>
                            </div>
                        </div>

                        {/* <div className="b-scroll-wrap">
                            <h3 className="b-scroll__title">Projects We love</h3>
                            <div className="scrollbar project-scrollbar">
                                <div className="handle">
                                    <div className="mousearea"></div>
                                </div>
                            </div>
                            <div className="b-scroll-items project-scroll frame">
                                <ul className="clearfix">
                                    { projects && projects.length > 0 && projects.map((e, i) => (
                                        <li className="b-scroll__item" key={e._id}>
                                            <ProjectCard
                                                {...e}
                                                user={e && e.user}
                                                authUser={user}
                                                readMore = {this.readMore((e && e.user) ? e.user._id : "", (e) ? e._id : "")}
                                            />
                                        </li>
                                    )) }
                                </ul>
                                <div className="btn-group">
                                    <NavLink to={`/discovery`} className="link" onClick={e => e.stopPropagation()}>
                                        Discover more
                                    </NavLink>
                                </div>
                            </div>
                            <div className="controls prevNextControl prevControl">
                                <button className="prev project-scroll-prev"><i className="icon-lg-arrow-left"></i></button>
                            </div>
                            <div className="controls prevNextControl nextControl">
                                <button className="next project-scroll-next"><i className="icon-lg-arrow-right"></i></button>
                            </div>
                        </div>

                        <div className="b-scroll-wrap">
                            <h3 className="b-scroll__title">Nonprofits We Love</h3>
                            <div className="scrollbar nonprofit-scrollbar">
                                <div className="handle">
                                    <div className="mousearea"></div>
                                </div>
                            </div>
                            <div className="b-scroll-items nonprofit-scroll frame">
                                <ul className="clearfix">
                                    { userList && userList.length > 0 && userList.map((e, i) => (
                                        <li className="b-scroll__item" key={e._id}>
                                            <CharityForm 
                                                user={e} 
                                                onUserClick={() => this.onCharityClick(e ? e : null)}
                                            />
                                        </li>
                                    ))}
                                </ul>
                                <div className="btn-group">
                                    <NavLink to={`/discovery`} className="link" onClick={e => e.stopPropagation()}>
                                        Discover more
                                    </NavLink>
                                </div>
                            </div>
                            <div className="controls prevNextControl prevControl">
                                <button className="prev nonprofit-scroll-prev"><i className="icon-lg-arrow-left"></i></button>
                            </div>
                            <div className="controls prevNextControl nextControl">
                                <button className="next nonprofit-scroll-next"><i className="icon-lg-arrow-right"></i></button>
                            </div>
                        </div> */}
                    </div>
                </div>
            </section>
        )
    }

}

const mapStateToProps = state => ({
    projects: state.project.projects,
    userList: state.user.userList,
    authUser: state.authentication.user,
})

const mapDispatchToProps = {
	getProjectByParams,
	getProjectSubscription,
    clearProjectsList,
    getUserList,
    clearUserList,
    push
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProjectsPeopleComponent)