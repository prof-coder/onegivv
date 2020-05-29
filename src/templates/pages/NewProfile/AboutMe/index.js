import React, { Component } from 'react';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import parseAddress from 'parse-address-string';

import Card from '../../../common/Card';
import Button from '../../../common/Button';

import { changeProfileInfo } from '../../../../actions/setting';
import { togglePreloader } from '../../../../actions/preloader'

class AboutMe extends Component {

    state = {
        city: "",
        state: "",
        isShowAboutme: false,
        isShowHometown: false,
        isShowEmail: false
    }

    componentDidMount() {
        const { user } = this.props;
        let thisObj = this;

        parseAddress(user.donorAddress, (err, as) => {
            if (!err) {
                thisObj.setState({
                    city: as.city,
                    state: as.state
                });
            }
        });

        this.setState({
            isShowAboutme: user.isShowAboutme,
            isShowHometown: user.isShowHometown,
            isShowEmail: user.isShowEmail
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.preloader.actionName === 'changingProfile' && nextProps.preloader.show === false && nextProps.preloader.hasResponseErr === false) {
            let updatedUserInfo = nextProps.preloader.profileInfo;
            if (!updatedUserInfo)
                return;

            this.setState({
                isShowAboutme: updatedUserInfo.isShowAboutme,
                isShowHometown: updatedUserInfo.isShowHometown,
                isShowEmail: updatedUserInfo.isShowEmail
            });
		}
    }

    onToggleShowAboutme = e => {
        const { user } = this.props;
        if (!user)
            return;

        this.props.changeProfileInfo({
            _id: user._id,
            isShowAboutme: !this.state.isShowAboutme
        })
    }

    onToggleShowHometown = e => {
        const { user } = this.props;
        if (!user)
            return;

        this.props.changeProfileInfo({
            _id: user._id,
            isShowHometown: !this.state.isShowHometown
        })
    }

    onToggleShowEmail = e => {
        const { user } = this.props;
        if (!user)
            return;

        this.props.changeProfileInfo({
            _id: user._id,
            isShowEmail: !this.state.isShowEmail
        })
    }

    render() {
        const { city, state, isShowAboutme, isShowHometown, isShowEmail } = this.state;
        const { logined, user, isDetail } = this.props;

        return (
            <section className="aboutMeSection">
                { isDetail &&
                    <div className="detailBody">
                        <Card className="aboutMeBody desktop">
                            <div className="leftFlexBody">
                                <p className="title">About me</p>
                                <p className="desc">
                                    { ( !user.aboutUs && logined && logined._id === user._id)
                                        ? 'Write something about yourself, why do you give? ' 
                                        : user.aboutUs }
                                </p>
                            </div>
                            { logined && logined._id === user._id &&
                                <div className="buttons">
                                    <Button
                                        label={isShowAboutme ? 'Remove' : 'Add'}
                                        padding="8px 30px"
                                        fontSize="18px"
                                        inverse
                                        onClick={this.onToggleShowAboutme} />
                                </div>
                            }
                            { logined && logined._id === user._id &&
                                <div className="rightFlexBody">
                                    <NavLink
                                        to={`/${user._id}/setting`}>
                                        <span onClick={this.toggleSubmenu}>
                                            Edit
                                        </span>          
                                    </NavLink>
                                </div>
                            }
                            { logined && logined._id === user._id &&
                                <div className="showStatusBody">
                                    { isShowAboutme && <img src="/images/ui-icon/profile/show-status-icon.svg" alt="hide-status-icon" /> }
                                    { !isShowAboutme && <img src="/images/ui-icon/profile/hide-status-icon.svg" alt="hide-status-icon" /> }
                                    <p>Show on profile</p>
                                </div>
                            }
                        </Card>

                        <Card className="aboutMeBody mobile">
                            <div className="flexBody">
                                <div className="leftFlexBody mobile">
                                    <p className="title">About me</p>
                                </div>
                                { logined && logined._id === user._id &&
                                    <div className="buttons">
                                        <Button
                                            label={isShowAboutme ? 'Remove' : 'Add'}
                                            padding="8px 30px"
                                            fontSize="18px"
                                            inverse
                                            className="mobile"
                                            onClick={this.onToggleShowAboutme} />
                                    </div>
                                }
                                { logined && logined._id === user._id &&
                                    <div className="rightFlexBody">
                                        <NavLink
                                            to={`/${user._id}/setting`}>
                                            <span onClick={this.toggleSubmenu}>
                                                <img src="/images/ui-icon/profile/pencil-icon.svg" alt="pencil-icon" />
                                            </span>          
                                        </NavLink>
                                    </div>
                                }
                                { logined && logined._id === user._id &&
                                    <div className="showStatusBody mobile">
                                        { isShowAboutme && <img src="/images/ui-icon/profile/show-status-icon.svg" alt="hide-status-icon" /> }
                                        { !isShowAboutme && <img src="/images/ui-icon/profile/hide-status-icon.svg" alt="hide-status-icon" /> }
                                        <p>Show on profile</p>
                                    </div>
                                }
                            </div>
                            <div>
                                <p className="desc">
                                    { ( !user.aboutUs && logined && logined._id === user._id)
                                        ? 'Write something about yourself, why do you give? ' 
                                        : user.aboutUs }
                                </p>
                            </div>
                        </Card>

                        <Card className="homeTownBody desktop">
                            <div className="leftFlexBody">
                                <p className="title">Hometown</p>
                                <p className="desc">{city}, {state}</p>
                            </div>
                            { logined && logined._id === user._id &&
                                <div className="buttons">
                                    <Button
                                        label={isShowHometown ? 'Remove' : 'Add'}
                                        padding="8px 30px"
                                        fontSize="18px"
                                        inverse
                                        onClick={this.onToggleShowHometown} />
                                </div>
                            }
                            { logined && logined._id === user._id &&
                                <div className="rightFlexBody">
                                    <NavLink
                                        to={`/${user._id}/setting`}>
                                        <span onClick={this.toggleSubmenu}>
                                            Edit
                                        </span>          
                                    </NavLink>
                                </div>
                            }
                            { logined && logined._id === user._id &&
                                <div className="showStatusBody">
                                    { isShowHometown && <img src="/images/ui-icon/profile/show-status-icon.svg" alt="hide-status-icon" /> }
                                    { !isShowHometown && <img src="/images/ui-icon/profile/hide-status-icon.svg" alt="hide-status-icon" /> }
                                    <p>Show on profile</p>
                                </div>
                            }
                        </Card>

                        <Card className="aboutMeBody mobile">
                            <div className="flexBody">
                                <div className="leftFlexBody mobile">
                                    <p className="title">Hometown</p>
                                </div>
                                { logined && logined._id === user._id &&
                                    <div className="buttons">
                                        <Button
                                            label={isShowHometown ? 'Remove' : 'Add'}
                                            padding="8px 30px"
                                            fontSize="18px"
                                            inverse
                                            className="mobile"
                                            onClick={this.onToggleShowHometown} />
                                    </div>
                                }
                                { logined && logined._id === user._id &&
                                    <div className="rightFlexBody">
                                        <NavLink
                                            to={`/${user._id}/setting`}>
                                            <span onClick={this.toggleSubmenu}>
                                                <img src="/images/ui-icon/profile/pencil-icon.svg" alt="pencil-icon" />
                                            </span>          
                                        </NavLink>
                                    </div>
                                }
                                { logined && logined._id === user._id &&
                                    <div className="showStatusBody mobile">
                                        { isShowHometown && <img src="/images/ui-icon/profile/show-status-icon.svg" alt="hide-status-icon" /> }
                                        { !isShowHometown && <img src="/images/ui-icon/profile/hide-status-icon.svg" alt="hide-status-icon" /> }
                                        <p>Show on profile</p>
                                    </div>
                                }
                            </div>
                            <div>
                                <p className="desc">{city}, {state}</p>
                            </div>
                        </Card>

                        <Card className="emailBody desktop">
                            <div className="leftFlexBody">
                                <p className="title">Email</p>
                                <p className="desc">{user.email}</p>
                            </div>
                            { logined && logined._id === user._id &&
                                <div className="buttons">
                                    <Button
                                        label={isShowEmail ? 'Remove' : 'Add'}
                                        padding="8px 30px"
                                        fontSize="18px"
                                        inverse
                                        onClick={this.onToggleShowEmail} />
                                </div>
                            }
                            { logined && logined._id === user._id &&
                                <div className="rightFlexBody">
                                    <NavLink
                                        to={`/${user._id}/setting`}>
                                        <span onClick={this.toggleSubmenu}>
                                            Edit
                                        </span>          
                                    </NavLink>
                                </div>
                            }
                            { logined && logined._id === user._id &&
                                <div className="showStatusBody">
                                    { isShowEmail && <img src="/images/ui-icon/profile/show-status-icon.svg" alt="hide-status-icon" /> }
                                    { !isShowEmail && <img src="/images/ui-icon/profile/hide-status-icon.svg" alt="hide-status-icon" /> }
                                    <p>Show on profile</p>
                                </div>
                            }
                        </Card>

                        <Card className="aboutMeBody mobile">
                            <div className="flexBody">
                                <div className="leftFlexBody mobile">
                                    <p className="title">Email</p>
                                </div>
                                { logined && logined._id === user._id &&
                                    <div className="buttons">
                                        <Button
                                            label={isShowEmail ? 'Remove' : 'Add'}
                                            padding="8px 30px"
                                            fontSize="18px"
                                            inverse
                                            className="mobile"
                                            onClick={this.onToggleShowEmail} />
                                    </div>
                                }
                                { logined && logined._id === user._id &&
                                    <div className="rightFlexBody">
                                        <NavLink
                                            to={`/${user._id}/setting`}>
                                            <span onClick={this.toggleSubmenu}>
                                                <img src="/images/ui-icon/profile/pencil-icon.svg" alt="pencil-icon" />
                                            </span>          
                                        </NavLink>
                                    </div>
                                }
                                { logined && logined._id === user._id &&
                                    <div className="showStatusBody mobile">
                                        { isShowEmail && <img src="/images/ui-icon/profile/show-status-icon.svg" alt="hide-status-icon" /> }
                                        { !isShowEmail && <img src="/images/ui-icon/profile/hide-status-icon.svg" alt="hide-status-icon" /> }
                                        <p>Show on profile</p>
                                    </div>
                                }
                            </div>
                            <div>
                                <p className="desc">{user.email}</p>
                            </div>
                        </Card>

                    </div>
                }
                { !isDetail &&
                    <div className="detailBody">
                        <Card className="detailCard">
                            <div className="headerBody">
                                <p className="title">About Me</p>
                                { isShowAboutme &&
                                    <p className="desc">
                                        { ( !user.aboutUs && logined && logined._id === user._id)
                                            ? 'Write something about yourself, why do you give? ' 
                                            : user.aboutUs }
                                    </p>
                                }
                            </div>
                            <div className="homeTownBody">
                                <p className="title">Hometown</p>
                                { isShowHometown && <p className="desc">{city}, {state}</p> }
                            </div>
                            <div className="emailBody">
                                <p className="title">Email</p>
                                { isShowEmail && <p className="desc">{user.email}</p> }
                            </div>
                        </Card>
                    </div>
                }
            </section>
        )
    }
}

const mapStateToProps = state => ({
    logined: state.authentication.user,
    preloader: state.preloader,
})

const mapDispatchToProps = {
    changeProfileInfo,
    togglePreloader
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AboutMe)