import React, { Component } from 'react'
import { connect } from 'react-redux'

import { NavLink } from 'react-router-dom'

import { push } from 'react-router-redux'

import ReactPlayer from 'react-player'
import EmojiMartPicker from 'emoji-mart-picker'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { getPostById, getPostLike, commentPost, sharePost } from '../../../actions/post'

import Label from '../../common/Label'
import UserAvatar from '../../common/userComponents/userAvatar'
import Comments from '../../common/PostCard/Comments'

import { signIn } from '../../common/authModals/modalTypes'

class Post extends Component {

    state = {
        text : '',
        file: null,
        parent: null,
        isLike: null,
        likeCount: 0
    }

    componentDidMount() {
        let { postId } = this.props.match.params;

        this.props.getPostById({ _id: postId, isDetailPage: true });
    }

    componentWillReceiveProps(nextProps) {
        let { isLike } = this.state;

        if (nextProps.currentPost) {
            const currentPost = nextProps.currentPost;
            if (currentPost.isLike !== isLike) {
                this.setState({
                    isLike: currentPost.isLike,
                    likeCount: currentPost.likeCount
                });
            }
        }
    }

    onClickSupport() {
        const { currentPost } = this.props;
        if (!currentPost) {
            return;
        }

        const { user, project } = this.props.currentPost;

        if (!user || !project)
            return;

        this.props.push(`/${user._id}/project/${project._id}`);
    }

    addEmoji = e => {  
        let emojiPic = String.fromCodePoint(`0x${e.unified}`)

        let start = this.commentRef.selectionStart,
             end = this.commentRef.selectionEnd;

        this.setState(
        {
            text: this.state.text.substring(0, start) + emojiPic +  this.state.text.substring(end)
        },
        () => {
            this.commentRef.focus();
            this.commentRef.selectionStart = this.commentRef.selectionEnd = start + 1
        });
    }

    handleChange = (e) => {
        this.setState({ text: e.target.value })
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.props.comment(this.props._id, this.state.parent, this.state.text, this.state.file)
            this.setState({text: "", file: null, parent: null});
        }
    }

    onSendComment = e => {
        const { currentPost } = this.props;
        if (!currentPost)
            return;

        let { text, file, parent } = this.state;

        this.props.commentPost({
            id: currentPost._id,
            text: text,
            file: file,
            parent: parent
        })

        this.setState({ text: "", file: null, parent: null });
    }

    onClickComment = (parent) => {
        if (this.props.authUser) {
            this.setState({ parent: parent }, () => {
                this.commentRef.focus();
            })
        }
    }

    onClickShare = (e) => {
        e.stopPropagation();

        const { authUser, currentPost } = this.props;

        if (!currentPost)
            return;
        
        let selectedUserId = null;
        let { curUserId } = this.props.match.params;
        if (curUserId && curUserId !== 1 && curUserId !== "1") {
            selectedUserId = curUserId;
        } else if (authUser) {
            selectedUserId = authUser._id;
        }

        if (authUser) {
            this.props.sharePost({
                id: currentPost._id,
                isShared: (currentPost.sharer && authUser._id === currentPost.sharer._id && currentPost.isShared),
                userId: selectedUserId,
                isDetailPage: true
            });
        } else {
            this.props.push(`?modal=${signIn}`);
        }
    }

    onClickLike = (e) => {
        e.stopPropagation();

        const { authUser, currentPost } = this.props;

        if (!currentPost)
            return;

        if (authUser) {
            this.props.getPostLike({
                id: currentPost._id,
                isLike: currentPost.isLike,
                isDetailPage: true
            });
        } else {
            this.props.push(`?modal=${signIn}`);
        }
    }

    render() {
        const { text, parent, isLike, likeCount } = this.state;
        const { currentPost, authUser } = this.props;
        if (!currentPost) {
            return (null);
        }

        const { user, isShared, sharer, title, content, 
                medias, project, createdAt,
                commentCount, comment_list, original, isSharedOriginalPost } = currentPost;
        
        return (
            <section className="postDetailSection">
                <div className="postCard post">
                    <div className="post-main">
                        <div className="post-header">
                            <NavLink
                                to={`/${user && user._id}`}
                                onClick={e => e.stopPropagation()}>
                                <div className="info-wrapper">
                                    { !isShared && 
                                        <UserAvatar
                                            imgUserType={user.role}
                                            imgUser={user.avatar}
                                            userId={user._id}
                                            size={60}
                                        />
                                    }
                                    { !isShared &&
                                        <Label
                                            name = { user.companyName || user.firstName + " " + user.lastName }
                                            date = { createdAt }
                                            address = { user.address } isApproved = { user.isApproved } role = { user.role }
                                        />
                                    }
                                    { isShared && sharer && 
                                        <div className="sharerOtherAvatar">
                                            <UserAvatar
                                                imgUserType={sharer.role}
                                                imgUser={sharer.avatar}
                                                userId={sharer._id}
                                                isSharer={true}
                                                isSelf={false}
                                                size={60}
                                            />
                                            <UserAvatar
                                                imgUserType={user.role}
                                                imgUser={user.avatar}
                                                userId={user._id}
                                                isSharer={false}
                                                isSelf={true}
                                            />
                                            <Label
                                                isSharer={true}
                                                sharerName={ sharer.companyName || sharer.firstName + " " + sharer.lastName }
                                                name={ user.companyName || user.firstName + " " + user.lastName }
                                                date={ createdAt }
                                                address={ user.address } isApproved = { user.isApproved } role = { user.role }
                                            />
                                        </div>
                                    }
                                </div>
                            </NavLink>
                        </div>

                        { title && (
                            <p
                                className="_title main-font">
                                {title}
                            </p>
                        )}
                        { content && (<section className="description">
                            <p className="text">{content}</p>
                        </section>) }

                        { medias && medias.length !== 0 && 
                            <div className="post-preview">
                                { medias[0].type === 1 &&
                                    <section className="project-preview">
                                        <img src={medias[0].url} className="preview" alt="" />
                                        { project &&
                                            <div className={`type-project type-${project.projectType}`}>
                                                <img
                                                    className="type"
                                                    src={`/images/ui-icon/${this.selectType(
                                                        project.projectType
                                                    )}`}
                                                    alt="type"
                                                />
                                            </div>
                                        }
                                    </section> 
                                }
                                { medias[0].type === 2 && 
                                    <ReactPlayer className="preview-video" url={medias[0].url} controls width="100%" height="100%" />
                                }
                            </div>
                        }
                        <section className="postBottom">
                            {/* <div className="statusBody">
                                <div className="likeBody">
                                    <img src="/images/ui-icon/profile/like_label_icon.svg" alt="" />
                                    <span>{likeCount} Likes</span>
                                </div>
                                <div className="commentBody">
                                    <img src="/images/ui-icon/profile/comment_label_icon.svg" alt="" />
                                    <span>{commentCount} Comments</span>
                                </div>
                            </div> */}
                            <div className="actionBody">
                                { project && 
                                    <div className="socialButton">
                                        <span className="support" onClick={(e) => { e.stopPropagation(); this.onClickSupport(); }}>Support</span>
                                        <img className="supportIcon" src="/images/ui-icon/post/right-arrow-icon.svg" alt="right-arrow-icon" />
                                    </div>
                                }
                                <div className="socialButton heart" onClick={(e) => this.onClickLike(e)}>
                                    { isLike && <img src="/images/ui-icon/profile/like_label_icon.svg" alt="" /> }
                                    { !isLike && <img src="/images/ui-icon/profile/like_icon.svg" alt="" /> }
                                    <span>{likeCount} Likes</span>
                                </div>
                                <div className="socialButton" onClick={() => this.onClickComment(null)}>
                                    <img src="/images/ui-icon/profile/comment_icon.svg" alt="" />
                                    <span>{commentCount} Comments</span>
                                </div>
                                { (authUser && authUser._id !== user._id && !original) && !(isSharedOriginalPost && !isShared) &&
                                    <div className="socialButton share" onClick={(e) => this.onClickShare(e)}>
                                        <span>{ (sharer && authUser._id === sharer._id && isShared) ? 'Unshare' : 'Share' }</span>
                                        <img className="shareIcon" src="/images/ui-icon/profile/share-icon.svg" alt="share-icon" />
                                    </div>
                                }
                            </div>
                        </section>
                    </div>
                    <div className="post-comment active">
                        { comment_list.length !== 0 &&
                            <div className="post-comment-list">
                                <p className="main-font comment-title">Comments</p>
                                <Comments comments={comment_list} onComment={this.onClickComment} parent={parent}/>
                            </div>
                        }

                        { authUser &&
                            <div className="leave-comment">
                                <div className="comment-wrapper">
                                    <UserAvatar
                                        imgUserType={authUser.role}
                                        imgUser={authUser.avatar}
                                        userId={authUser._id}
                                        size={32}
                                    />
                                    <div className="comment-input">
                                        <input value={text} className="_input" type="text"  placeholder="Leave a Comment" ref={ref => this.commentRef = ref} onChange={this.handleChange}  onKeyPress={this.handleKeyPress}/>
                                        {/* <button className="comment-button camera-button" onClick={this.openSelectFile}>
                                            <FontAwesomeIcon icon="image" />
                                        </button> */}
                                        <input
                                            type="file"
                                            ref={this.previewRef}
                                            onChange={this.changeFile}
                                            accept="image/*"
                                            id="projectFileCreate"
                                        />
                                        <EmojiMartPicker set="google" onChange={this.addEmoji} >
                                            <button className="comment-button emoji-button">
                                                <FontAwesomeIcon icon="smile-wink" />
                                            </button>
                                        </EmojiMartPicker>
                                    </div>
                                    <img className="btn-comment" src="/images/ui-icon/icon-send.svg" alt="" onClick={this.onSendComment} />
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </section>
        )
    }

}

const mapStateToProps = state => ({
    userId: state.authentication.userId,
    authUser: state.authentication.user,
    currentPost: state.post.currentPost,
    editPost: state.post.editPost
})

const mapDispatchToProps = {
    getPostById,
    getPostLike,
    commentPost,
    sharePost,
    push
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Post)