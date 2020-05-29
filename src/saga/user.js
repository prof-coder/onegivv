import { put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';

import axiosApi from '../helpers/axiosApi';
import getErrorText from '../helpers/serverErrors';
import { CANCELLED } from '../helpers/userStatus';

import { store } from '../store';

import {
	SEND_USER_SUBSCRIBE,
	SEND_USER_CONTACT,
	SET_USER_SUBSCRIBE,
	SET_USER_CONTACT,
	NOTIFICATION_TOGGLE,
	CANCEL_VERIFICATION,
	SHOWN_APPROVE_MESSAGE,
	UPDATE_USER_STATUS,
	HIDE_APPROVE_MESSAGE,
	UPLOAD_PROFILE_PICTURE,
	SET_USER_PROFILE_PICTURE,
	DELETE_PROFILE_PICTURE,
	GET_USER_LIST,
	SET_USER_LIST,
	SET_DONOR_AVATAR,
	UPDATE_DONOR_AVATAR,
	UPDATE_FIRST_TIME,
	GET_STRIPE_ACCOUNT_INFO,
	SET_STRIPE_CONNECT_RESULT,
	SUBMIT_REVIEW_PROFILE,
	SET_REVIEW_LIST,
	GET_REIVEW_LIST,
	UPDATE_USER_RATING,
	GET_DONOR_GIVE_INFO,
	SET_DONOR_GIVE_INFO,
	INVITE_NONPROFIT,
	PAYOUT_STRIPE,
	SET_IS_CLAIMED,
	WITHDRAW_AMOUNT,
	GET_COMMUNITY_LIST,
	SET_COMMUNITY_LIST,
	GET_GUEST_CHARITY_LIST,
	// SET_GUEST_CHARITY_LIST,
	ADD_GUEST_CHARITIES,
	PRELOADER_TOGGLE,
	ADD_GUEST_CHARITIES_FROM_CSV
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

function successDialog(title) {
	return {
		type: NOTIFICATION_TOGGLE,
		payload: {
			isOpen: true,
			resend: false,
			buttonText: 'Ok',
			firstTitle: "Success",
			secondTitle: title
		}
	}
}

function* sendUserSubscribe(data) {
	try {
		let subscribe = yield call(axiosApi.post, '/email-subscribe', data)

		yield put({
			type: SET_USER_SUBSCRIBE,
			userSubscribe: {
				status: "success",
				message: subscribe
			}
		})
	} catch (error) {
		yield put({
			type: SET_USER_SUBSCRIBE,
			userSubscribe: {
				status: "error",
				message: error.message
			}
		})
	} finally {

	}
}

function* sendUserContact(data) {
	try {
		yield call(axiosApi.post, '/sendContact', data)
		yield put({
			type: SET_USER_CONTACT,
			userContact: {
				status: "success"
			}
		})
	} catch (error) {
		yield put(errorHandler(error))
		yield put({
			type: SET_USER_CONTACT,
			userContact: {
				status: "error"
			}
		})
	} finally {
	}
}

function* cancelVerification() {
	try {
		yield call(axiosApi.get, `/user/cancelVerification`)
		yield put({
			type: UPDATE_USER_STATUS,
			status: CANCELLED
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* shownApproveMessage() {
	try {
		yield call(axiosApi.get, `/user/shownApproveMessage`)
		yield put({
			type: HIDE_APPROVE_MESSAGE
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* uploadProfilePicture(data) {
	let { file } = data
	delete data.file
	try {
		const formData = new FormData()
		formData.append('profilePicture', file)

		let res = yield call(axiosApi.post, `/user/picture`, formData, {
			headers: {
				'content-type': 'multipart/form-data'
			}
		})
		yield put({
			type: SET_USER_PROFILE_PICTURE,
			picture: res.data.path
		})

	} catch (error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* deleteProfilePicture() {
	try {
		yield call(axiosApi.post, '/user/deletePicture');
		yield put({
			type: SET_USER_PROFILE_PICTURE,
			picture: ''
		})
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* getUserList({data}) {
	let res, { userList } = store.getState().user;

	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, count: 0, actionName: 'fetchingUserList' }
		})

		const halfLimit = data.limit;

		let role = data.role ? `&role=${data.role}`:'';
		let companyName = data.companyName ? `&companyName=${data.companyName}`:'';
		let location = data.location ? `&location=${data.location}`:'';
		let isWeLove = data.isWeLove ? `&isWeLove=${data.isWeLove}`:'';
		let interests = data.interests && data.interests.length > 0 ? `&interests=${data.interests.join()}` : '';
		let sortBy = data.sortBy ? `&sortBy=${data.sortBy}` : '';
        let sortDirection = data.sortDirection ? `&sortDirection=${data.sortDirection}` : '';
		res = yield call(
			axiosApi.get,
			`/user/nonprofit?skip=${data.skip}&limit=${halfLimit}&${role}&${companyName}${isWeLove}${location}${interests}${sortBy}${sortDirection}`
		);
		
		/*const uri = 'https://api.data.charitynavigator.org/v2'; // process.env.CHARITY_NAVIGATOR_DATA_API_URL;
		const app_id = '84038105'; // process.env.CHARITY_NAVIGATOR_DATA_API_APP_KEY;
		const app_key = '308ddad523b5a08ac83c08f919b9caa5'; // process.env.CHARITY_NAVIGATOR_DATA_API_APP_KEY;
		
		let search = data.companyName ? `&search=${data.companyName}`:'';
		let resGuest = yield call(
			axios.get,
			`${uri}/Organizations?app_id=${app_id}&app_key=${app_key}&pageNum=${data.skip + 1}&pageSize=${halfLimit}&${search}`
		);*/
		
		let userArray = [];
		if (!data.type) {
			if (data.skip !== 0) {
				userArray = [...userList];
			}

			res.data.forEach(e => {
				if (userArray.findIndex(i => i._id === e._id) === -1) {
					userArray.push(e);
				}
			});

			// resGuest.data.forEach(e => {
			// 	if (userArray.findIndex(i => i.companyName === e.charityName) === -1) {
			// 		console.log('=====================================');
			// 		console.log(e);
			// 		console.log('');
			// 		console.log('');
			// 		let newGuest = {
			// 			_id: userArray.length + 1,
			// 			role: 3,
			// 			companyName: e.charityName,
			// 			aboutUs: e.mission,
			// 			ein: e.ein,
			// 			isGuest: true
			// 		};

			// 		userArray.push(newGuest);
			// 	}
			// });
		} else if (data.type === 'all') {
			userArray = [...res.data];
		}
		
		yield put({type: SET_USER_LIST, userList: userArray})
	} catch(error) {
		yield put(errorHandler(error))
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, count: (res && res.data ? res.data.length : 0), actionName: 'fetchingUserList' }
		})
		// data.cb && data.cb()
	}
}

function* setDonorAvatar({data}) {
	try{
		yield call(axiosApi.post, `/user/${data._id}/donorAvatar`, data);		
		yield put({type: UPDATE_DONOR_AVATAR, avatar: data.donorAvatar})
	} catch(error) {
		yield put(errorHandler(error))
	} finally {

	}
}

function* updateFirstTime() {
	try{
		yield call(axiosApi.get, `/user/updateFirstTime`);
	} catch(error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* getStripeAccountInfo ({data}) {//connect stripe account
	try{
		const res = yield call(axiosApi.post, `/user/stripe-connect`, data)
		let resStatus = 1

		if(res.data.error) {
			resStatus = 1
		} else {
			resStatus = 2
		}
		yield put({type: SET_STRIPE_CONNECT_RESULT, status: resStatus})
	} catch(error) {
		yield put(errorHandler(error))
	}
}

function* submitReview({data}) {
	let {
		reviewList
	} = store.getState().user
	try{
		const res = yield call(axiosApi.post, `/review`, data)
		let reviewArray = []
		reviewArray = [...reviewList]
		reviewArray.unshift(res.data)
		
		yield put({
			type: SET_REVIEW_LIST,
			reviews: [...reviewArray]
		})

		const newRating = ((data.currentRating * (reviewArray.length - 1) ) + res.data.rating )/ reviewArray.length
		yield put({
			type: UPDATE_USER_RATING,
			rating: newRating
		})
	} catch(error) {
		yield put(errorHandler(error))
	} finally {
		data.cb && data.cb()
	}
}

function* getReviews({data}) {
	try{
		let res = yield call(axiosApi.get, `/review?userId=${data.userId}`)
		yield put({
			type: SET_REVIEW_LIST,
			reviews: res.data
		})
	} catch(error){
		yield put(errorHandler(error))
	} finally {

	}
}

function* getDonorGiveInfo({data}) {
	try {
		let res = yield call(axiosApi.get, `/user/${data._id}/donor_info?userId=${data.userId}`)
		yield put({
			type: SET_DONOR_GIVE_INFO,
			donorGiveInfo: res.data
		})
	} catch(error){
		yield put(errorHandler(error))
	} finally {

	}
}

function* inviteNonprofit({inviteName}) {
	try {
		yield call(axiosApi.post, `/user/invite`, {
			inviteName: inviteName
		})
		yield put(successDialog("Invitation has been sent"))
	} catch(error) {
		yield put(errorHandler(error))
	} finally {

	}
}

function* payoutStripe({data}) {
	let res
	try {
		res = yield call(axiosApi.post, `/user/payout`, data)
	} catch(error) {
		yield put(errorHandler(error))
	} finally {
		data.cb && data.cb(res.data)
	}
}

function* setIsClaimed({ data }) {
	let res
	try {
		res = yield call(axiosApi.post, `/user/${data.userId}/claim`, data)
	} catch(error) {
		yield put(errorHandler(error))
	} finally {
		data.cb && data.cb(res.data)
	}
}

function* withdrawAmount({ data }) {
	try {
		yield call(axiosApi.post, `/give/payout`, {
			amount: data.amount
		})
		yield put(successDialog("Withdrawal succeed"))
	} catch (error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* getCommunityList({data}) {
	// let {
	// 	communityList
	// } = store.getState().user;
	try {
		let interests = data.interests && data.interests.length > 0 ? `&interests=${data.interests.join()}` : '';
		let sortBy = data.sortBy ? `&sortBy=${data.sortBy}` : '';
        let sortDirection = data.sortDirection ? `&sortDirection=${data.sortDirection}` : '';
		let res = yield call(
			axiosApi.get,
			`/communities?skip=${data.skip}&limit=${data.limit}&${interests}${sortBy}${sortDirection}`
		);

		let communityArray = [];
		if (res && res.data && res.data.length === 1 && res.data[0].rows) {
			communityArray = [...res.data[0].rows];
		}
		
		yield put({ type: SET_COMMUNITY_LIST, communityList: communityArray })
	} catch(error) {
		yield put(errorHandler(error))
	} finally {
	}
}

function* getGuestCharityList({data}) {
	let res, { userList } = store.getState().user;

	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, count: 0, users: [], actionName: 'fetchingGuestUserList' }
		})

		const uri = 'https://api.data.charitynavigator.org/v2'; // process.env.CHARITY_NAVIGATOR_DATA_API_URL;
		const app_id = '84038105'; // process.env.CHARITY_NAVIGATOR_DATA_API_APP_KEY;
		const app_key = '308ddad523b5a08ac83c08f919b9caa5'; // process.env.CHARITY_NAVIGATOR_DATA_API_APP_KEY;
		
		let search = data.companyName ? `&search=${data.companyName}`:'';
		res = yield call(
			axios.get,
			`${uri}/Organizations?app_id=${app_id}&app_key=${app_key}&pageNum=${data.pageNum}&pageSize=${data.pageSize}&${search}`
		);
		
		let userArray = [];
		if (!data.type) {
			if (data.skip !== 0) {
				userArray = [...userList];
			}

			res.data.forEach(e => {
				if (userArray.findIndex(i => i.companyName === e.charityName) === -1) {
					let newGuest = {
						_id: userArray.length + 1,
						role: 3,
						companyName: e.charityName,
						aboutUs: e.mission,
						ein: e.ein,
						isGuest: true
					};

					userArray.push(newGuest);
				}
			});
		} else if (data.type === 'all') {
			userArray = [...res.data];
		}
		
		yield put({type: SET_USER_LIST, userList: userArray})
	} catch(error) {
		yield put(errorHandler(error))
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, count: (res && res.data ? res.data.length : 0), users: res.data, actionName: 'fetchingGuestUserList' }
		})
	}
}

function* addGuestCharities({data}) {
	let res, { userList } = store.getState().user;

	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'addingGuestCharities' }
		})

		res = yield call(axiosApi.post, '/user/createGuests', data);

		let userArray = [];
		userArray = [...userList];

		userArray = userArray.map(e => {
			let resUser = res.data.find(resUser => resUser.ein === e.ein);
			if (resUser) {
				return resUser;
			} else {
				return e;
			}
		});

		yield put({ type: SET_USER_LIST, userList: userArray });
	} catch(error) {
		yield put(errorHandler(error))
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'addingGuestCharities' }
		})
	}
}

function* addGuestCharitiesFromCSV({data}) {
	try {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: true, actionName: 'addingGuestCharitiesFromCSV' }
		})

		yield call(axiosApi.get, '/user/createGuestsFromCSV');
	} catch(error) {
		yield put(errorHandler(error))
	} finally {
		yield put({
			type: PRELOADER_TOGGLE,
			payload: { show: false, actionName: 'addingGuestCharitiesFromCSV' }
		})
	}
}

export function* user() {
	yield takeLatest(SEND_USER_SUBSCRIBE, sendUserSubscribe)
	yield takeLatest(SEND_USER_CONTACT, sendUserContact)
	yield takeLatest(CANCEL_VERIFICATION, cancelVerification)
	yield takeLatest(SHOWN_APPROVE_MESSAGE, shownApproveMessage)
	yield takeLatest(UPLOAD_PROFILE_PICTURE, uploadProfilePicture)
	yield takeLatest(DELETE_PROFILE_PICTURE, deleteProfilePicture)
	yield takeLatest(GET_USER_LIST, getUserList)
	yield takeLatest(SET_DONOR_AVATAR, setDonorAvatar)
	yield takeLatest(UPDATE_FIRST_TIME, updateFirstTime)
	yield takeLatest(GET_STRIPE_ACCOUNT_INFO, getStripeAccountInfo)
	yield takeLatest(SUBMIT_REVIEW_PROFILE, submitReview)
	yield takeLatest(GET_REIVEW_LIST, getReviews)
	yield takeLatest(GET_DONOR_GIVE_INFO, getDonorGiveInfo)
	yield takeLatest(INVITE_NONPROFIT, inviteNonprofit)
	yield takeLatest(PAYOUT_STRIPE, payoutStripe)
	yield takeLatest(SET_IS_CLAIMED, setIsClaimed)
	yield takeLatest(WITHDRAW_AMOUNT, withdrawAmount)
	yield takeLatest(GET_COMMUNITY_LIST, getCommunityList)
	yield takeLatest(GET_GUEST_CHARITY_LIST, getGuestCharityList)
	yield takeLatest(ADD_GUEST_CHARITIES, addGuestCharities)
	yield takeLatest(ADD_GUEST_CHARITIES_FROM_CSV, addGuestCharitiesFromCSV)
}
