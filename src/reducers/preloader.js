import { PRELOADER_TOGGLE } from '../actions/types'
// import { routerActions } from 'react-router-redux/lib/actions'

const initialState = {
	show: true,
	actionName: ''
}

export default (state = initialState, action) => {
	if (action.type === PRELOADER_TOGGLE) {
		if (
			state.actionName === action.payload.actionName &&
			action.payload.show === false
		) {
			return {
				...state,
				show: action.payload.show,
				actionName: action.payload.actionName,
				count: action.payload.count,
				users: action.payload.users,
				hasResponseErr: action.payload.hasResponseErr,
				errCode: action.payload.errCode,
				errMsg: action.payload.errMsg,
				profileInfo: action.payload.profileInfo
			}
		} else if (action.payload.show === true) {
			return {
				...state,
				show: action.payload.show,
				actionName: action.payload.actionName,
				count: action.payload.count,
				users: action.payload.users
			}
		}
	}

	return state
}
