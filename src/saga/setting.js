import { put, takeLatest, call } from 'redux-saga/effects'
import delay from '@redux-saga/delay-p'

import axios from '../helpers/axiosApi'
import getErrorText from '../helpers/serverErrors'
import {
	NOTIFICATION_TOGGLE,
	PRELOADER_TOGGLE,
	CHANGE_EMAIL_SETTING,
	CHANGE_PASSWORD_SETTING,
	SET_UP_AVATAR_URL_TO_USER,
	CHANGE_AVATAR_SETTING,
	CHANGE_STUDENT_SETTING,
	CHANGE_NONPROFIT_SETTING,
	UPDATE_AUTH_NONPROFIT,
	UPDATE_AUTH_DONOR,
	UPDATE_AUTH_STUDENT,
	CHANGE_DONOR_SETTING,
	CHANGE_PRIVACY_SETTING,
	UPDATE_NONPROFIT_STATUS,
	SET_VERIFY_STEP,
	CHANGE_PROFILE_INFO
} from '../actions/types'

function errorHandler(error) {
	return {
		type: NOTIFICATION_TOGGLE,
		payload: {
			isOpen: true,
			resend: false,
			firstTitle: 'Error',
			secondTitle: getErrorText(error),
			buttonText: 'Ok'
		}
	}
}


function* changePasswordSetting({ password, newPassword }) {
	let hasResponseErr = false;
	let errCode = 400;
	let errMsg = '';

	try {
		yield put({
            type: PRELOADER_TOGGLE,
            payload: { show: true, actionName: 'changingPassword' }
		});
		
		yield call(axios.patch, `/user/change-password`, {
			password,
			newPassword
		})

		// let data = {
		// 	firstTitle: 'Success',
		// 	secondTitle: 'Updated successfully'
		// }
	} catch (error) {
		hasResponseErr = true;
		errCode = error.response.status;
		// data = {
		// 	firstTitle: 'Error',
		// 	secondTitle: getErrorText(error)
		// }
	} finally {
		// yield put({
		// 	type: NOTIFICATION_TOGGLE,
		// 	payload: {
		// 		...data,
		// 		isOpen: true,
		// 		resend: false,
		// 		buttonText: 'Ok'
		// 	}
		// });
		yield put({
            type: PRELOADER_TOGGLE,
            payload: { show: false, actionName: 'changingPassword', hasResponseErr: hasResponseErr, errCode: errCode, errMsg: errMsg  }
		});
	}
}

function* changeEmailSetting({ email, password }) {
	let data = {}
	try {
		yield call(axios.post, `/user/reset-email`, { email, password })

		data = {
			firstTitle: 'Success',
			secondTitle: 'Updated successfully'
		}
	} catch (error) {
		data = {
			firstTitle: 'Error',
			secondTitle: getErrorText(error)
		}
	} finally {
		yield put({
			type: NOTIFICATION_TOGGLE,
			payload: {
				...data,
				isOpen: true,
				resend: false,
				buttonText: 'Ok'
			}
		})
	}
}

function* changeAvatarSetting({ avatar }) {
	let data = {}
	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'changeAvatarSetting' }
		})

		const formData = new FormData()
		formData.append('avatar', avatar)
		const config = {
			headers: {
				'content-type': 'multipart/form-data'
			}
		}
		let res = yield call(axios.post, `/user/avatar`, formData, config)
		
		data = {
			firstTitle: 'Success',
			secondTitle: 'Updated successfully'
		}
		yield put({
			type: SET_UP_AVATAR_URL_TO_USER,
			payload: res.data.path
		})
	} catch (error) {
		data = {
			firstTitle: 'Error',
			secondTitle: getErrorText(error)
		}
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'changeAvatarSetting' }
		})

		yield put({
			type: NOTIFICATION_TOGGLE,
			payload: {
				...data,
				isOpen: true,
				resend: false,
				buttonText: 'Ok'
			}
		})
	}
}

function* changeNonprofitSetting({
	userID,
	ein,
	billingAddress,
	address,
	companyName,
	role
}) {
	let data = {};

	try {		
		yield call(axios.patch, `/user/${userID}`, {
			ein,
			billingAddress,
			address,
			companyName,
			role
		})

		yield put({
			type: UPDATE_AUTH_NONPROFIT,
			payload: {
				ein,
				billingAddress,
				address,
				companyName
			}
		})
		data = {
			firstTitle: 'Success',
			secondTitle: 'Updated successfully'
		}
	} catch (error) {
		data = {
			firstTitle: 'Error',
			secondTitle: getErrorText(error)
		}
	} finally {
		yield put({
			type: NOTIFICATION_TOGGLE,
			payload: {
				...data,
				isOpen: true,
				resend: false,
				buttonText: 'Ok'
			}
		})
	}
}

function* changeStudentSetting({ userID, firstName, lastName, birthday, donorAddress, aboutUs, role }) {
	let data = {}
	try {
		yield call(axios.patch, `/user/${userID}`, {
			firstName,
			lastName,
			birthDate: birthday, 
			donorAddress, 
			aboutUs,
			role
		})

		yield put({
			type: UPDATE_AUTH_STUDENT,
			payload: {
				firstName,
				lastName,
				birthday, 
				donorAddress, 
				aboutUs
			}
		})
		data = {
			firstTitle: 'Success',
			secondTitle: 'Updated successfully'
		}
	} catch (error) {
		data = {
			firstTitle: 'Error',
			secondTitle: getErrorText(error)
		}
	} finally {
		yield put({
			type: NOTIFICATION_TOGGLE,
			payload: {
				...data,
				isOpen: true,
				resend: false,
				buttonText: 'Ok'
			}
		})
	}
}

function* changeDonorSetting({ userID, firstName, lastName, birthday, donorAddress, aboutUs, role }) {
	let data = {}
	try {
		yield call(axios.patch, `/user/${userID}`, {
			firstName,
			lastName,
			birthDate: birthday, 
			donorAddress, 
			aboutUs,
			role
		})

		yield put({
			type: UPDATE_AUTH_DONOR,
			payload: {
				firstName,
				lastName,
				birthday, 
				donorAddress, 
				aboutUs
			}
		})
		data = {
			firstTitle: 'Success',
			secondTitle: 'Updated successfully'
		}
	} catch (error) {
		data = {
			firstTitle: 'Error',
			secondTitle: getErrorText(error)
		}
	} finally {
		yield put({
			type: NOTIFICATION_TOGGLE,
			payload: {
				...data,
				isOpen: true,
				resend: false,
				buttonText: 'Ok'
			}
		})
	}
}

function* changePrivacySetting({data}) {
	const { nextStep } = data;
	
	try{
		yield call(axios.post, `/user/${data._id}/privacy`, data);
		yield put({
			type: UPDATE_NONPROFIT_STATUS,
			data: data
		})
		yield put({
			type: SET_VERIFY_STEP,
			step: nextStep
		})
	} catch(error) {
		yield put(errorHandler(error))
	} finally {
		data.cb && data.cb()
	}
}

function* changeProfileInfo({data}) {
	let hasResponseErr = false;
	let updatedProfile = {};
	let notifyData = {};

	try {
		yield put({
            type: PRELOADER_TOGGLE,
            payload: { show: true, actionName: 'changingProfile' }
		});

		let res = yield call(axios.post, `/user/${data._id}/profile`, data);
		
		if (res && res.data) {
			updatedProfile = res.data;
		}

		notifyData = {
			firstTitle: 'Success',
			secondTitle: 'Updated successfully'
		};

		if (typeof(data.isShowAboutme) !== "undefined") {
			if (updatedProfile.isShowAboutme) {
				notifyData.secondTitle = 'Your About me is now on your profile';
			} else {
				notifyData.secondTitle = 'Your About me is now removed from your profile';
			}
		} else if (typeof(data.isShowHometown) !== "undefined") {
			if (updatedProfile.isShowHometown) {
				notifyData.secondTitle = 'Your Hometown is now on your profile';
			} else {
				notifyData.secondTitle = 'Your Hometown is now removed from your profile';
			}
		} else if (typeof(data.isShowEmail) !== "undefined") {
			if (updatedProfile.isShowEmail) {
				notifyData.secondTitle = 'Your Email is now on your profile';
			} else {
				notifyData.secondTitle = 'Your Email is now removed from your profile';
			}
		}

		yield put({
			type: UPDATE_AUTH_NONPROFIT,
			payload: {
				isShowAboutme: updatedProfile.isShowAboutme,
				isShowHometown: updatedProfile.isShowHometown,
				isShowEmail: updatedProfile.isShowEmail
			}
		})
	} catch(error) {
		hasResponseErr = true;
		yield put(errorHandler(error))
	} finally {
		yield put({
			type: NOTIFICATION_TOGGLE,
			payload: {
				...notifyData,
				isOpen: true,
				resend: false,
				buttonText: 'Ok'
			}
		})

		yield delay(2000);

		yield put({
			type: NOTIFICATION_TOGGLE,
			payload: {
				isOpen: false
			}
		});

		yield put({
            type: PRELOADER_TOGGLE,
            payload: { show: false, actionName: 'changingProfile', hasResponseErr: hasResponseErr, profileInfo: updatedProfile }
		})
		
		data.cb && data.cb()
	}
}

export function* setting() {
	yield takeLatest(CHANGE_DONOR_SETTING, changeDonorSetting)
	yield takeLatest(CHANGE_STUDENT_SETTING, changeStudentSetting)
	yield takeLatest(CHANGE_NONPROFIT_SETTING, changeNonprofitSetting)
	yield takeLatest(CHANGE_EMAIL_SETTING, changeEmailSetting)
	yield takeLatest(CHANGE_PASSWORD_SETTING, changePasswordSetting)
	yield takeLatest(CHANGE_AVATAR_SETTING, changeAvatarSetting)
	yield takeLatest(CHANGE_PRIVACY_SETTING, changePrivacySetting)
	yield takeLatest(CHANGE_PROFILE_INFO, changeProfileInfo)
}
