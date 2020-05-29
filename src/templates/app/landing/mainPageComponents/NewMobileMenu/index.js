import React, { Component } from 'react';

import { NavLink } from 'react-router-dom';

import { history } from '../../../../../store';

import Button from '../../../../common/Button';
import IconButton from '../../../../common/IconButton';
import SearchBox from '../../../../common/SearchBox';

import { signIn, signUp } from '../../../../common/authModals/modalTypes';

class NewMobileMenu extends Component {

    state = {
        currentMenu: 'home'
    }

    onClickHelp = e => {
		window.Tawk_API.toggle();
	}

    render() {
        const { showSideMenubar, onCloseMobileMenu, onClickSearch } = this.props;

        return (
            <div className={`sideMenubar ${showSideMenubar && 'open'}`}>
                <NavLink exact to="/discovery"
                    onClick={e => {
                        onCloseMobileMenu(e);
                    }}>
                    <Button
                        className="discoveryLink"
                        padding="10px 53px"
                        label="Discover"
                    />
                </NavLink>
                <SearchBox onMouseDown={onClickSearch} />
                <div className="menu-buttons">
                    <div className="auth-buttons">
                        <NavLink
                            to = {`/`}
                            onClick = { e => {
                                e.preventDefault();
                                e.stopPropagation();

                                this.setState({
                                    currentMenu: 'signup'
                                });
                                onCloseMobileMenu(e);
                                history.push(`?modal=${signUp}`);
                            }}>
                                <span>Sign Up</span>
                        </NavLink>
                        <div className="btn-seperator"></div>
                        
                            <NavLink
                                to={`/`}
                                onClick = { e => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    this.setState({
                                        currentMenu: 'login'
                                    });
                                    onCloseMobileMenu(e);
                                    history.push(`?modal=${signIn}`);
                                }}>
                                    <span>Log In</span>
                            </NavLink>
                        
                    </div>
                    <ul className="sidebarMenu">
                        <li>
                            <NavLink
                                to={`/`}
                                className="nav-link"
                                onClick={e => {
                                    this.setState({
                                        currentMenu: 'home'
                                    });
                                    onCloseMobileMenu(e);
                                }}>
                                <IconButton label="Home" icon="/images/ui-icon/icon-home.svg" size="28px" fontSize="14px" />
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to={`/nonProfit`}
                                className="nav-link"
                                onClick={e => {
                                    this.setState({
                                        currentMenu: 'nonprofit'
                                    });
                                    onCloseMobileMenu(e);
                                }}>
                                <IconButton label="Nonprofit" icon="/images/ui-icon/sidemenu/menu_nonprofit.svg" size="28px" fontSize="14px" />
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={`/learn`}
                                className="nav-link"
                                onClick={e => {
                                    this.setState({
                                        currentMenu: 'learn_more'
                                    });
                                    onCloseMobileMenu(e);
                                }}>
                                <IconButton label="Learn More" icon="/images/ui-icon/icon-one.svg" size="28px" fontSize="14px" />
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/about" 
                                className="nav-link"
                                onClick={e => {
                                    this.setState({
                                        currentMenu: 'about_us'
                                    });
                                    onCloseMobileMenu(e);
                                }}>
                                <IconButton label="About Us" icon="/images/ui-icon/icon-one.svg" size="28px" fontSize="14px" />
                            </NavLink>
                        </li>
                        <li>
                            <IconButton 
                                label="Blog" 
                                icon="/images/ui-icon/icon-blog.svg" 
                                size="28px" 
                                fontSize="14px" 
                                onMouseDown={e => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    this.setState({
                                        currentMenu: 'blog'
                                    });
                                    onCloseMobileMenu(e);

                                    const win = window.open('https://medium.com/onegivv', '_blank');
                                    win.focus();
                                }} 
                            />
                        </li>
                        <li className="nav-link">
                            <div className={`icon-button`}>
                                <IconButton 
                                    label="Help" 
                                    icon="/images/ui-icon/icon-help.svg"
                                    size="28px"
                                    fontSize="14px"
                                    onMouseDown={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
    
                                        this.setState({
                                            currentMenu: 'blog'
                                        });
                                        onCloseMobileMenu(e);
    
                                        this.onClickHelp();
                                    }} 
                                />
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

}

export default NewMobileMenu