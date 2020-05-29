import { 
	SET_SCHOOLS,
	SET_SINGLE_SCHOOL,
	SET_INTERESTS,
	SET_HIERARCHY_INTERESTS,
	SET_CATEGORIES,
	SET_NOTIFICATION_LIST,
	SET_UNREAD_NOTIFY,
	RECEIVE_SHOW_INVITE_NONPROFIT_DIALOG_MSG,
	RECEIVE_HIDE_INVITE_NONPROFIT_DIALOG_MSG,
	SET_ACTIVE_PROJECT_TYPE
 } from '../actions/types'

const initialState = {
	schools: [],
	singleSchool: {},
	interests: [],
	notifications: [],
	pendingFriends: [],
	unreadNotify: 0,
	showInviteModal: false,
	activeProjectType: -1
}

export default (state = initialState, action) => {

	if (action.type === SET_SCHOOLS) {
		return {
			...state,
			schools: action.schools
		}
	}

	if (action.type === SET_SINGLE_SCHOOL) {
		if (action.skip === 0) {
			return {
				...state,
				singleSchool: action.singleSchool
			}
		} else {
			let singleSchool = state.singleSchool
			if (action.singleSchool.students) {
				singleSchool.students = [
					...singleSchool.students,
					...action.singleSchool.students
				]
			}
			return {
				...state,
				singleSchool
			}
		}
	}

	if (action.type === SET_INTERESTS) {
		return {
			...state,
			interests: action.interests
		}
	}

	if (action.type === SET_HIERARCHY_INTERESTS) {
		return {
			...state,
			hierarchyInterests: action.interests
		}
	}

	if (action.type === SET_CATEGORIES) {
		return {
			...state,
			categories: action.categories
		}
	}

	if (action.type === SET_NOTIFICATION_LIST) {
		return {
			...state,
			notifications: action.notifications,
			newNotifications: action.newNotifications,
			viewedNotifications: action.viewedNotifications,
			pendingFriends: action.pendings,
			unreadNotify: action.unreadNotify
		}
	}

	if (action.type === SET_UNREAD_NOTIFY) {
		return {
			...state,
			unreadNotify: action.unreadNotify
		}
	}

	if (action.type === RECEIVE_SHOW_INVITE_NONPROFIT_DIALOG_MSG) {
		return {
			...state,
			showInviteModal: true
		}
	}

	if (action.type === RECEIVE_HIDE_INVITE_NONPROFIT_DIALOG_MSG) {
		return {
			...state,
			showInviteModal: false
		}
	}

	if (action.type === SET_ACTIVE_PROJECT_TYPE) {
		return {
			...state,
			activeProjectType: action.activeProjectType
		}
	}

	return state
}
