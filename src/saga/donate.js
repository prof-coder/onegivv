import { put, takeLatest, call } from "redux-saga/effects";
import axios from "../helpers/axiosApi";
import getErrorText from "../helpers/serverErrors";
import { store } from "../store";

import {
  NOTIFICATION_TOGGLE,
  GET_DONATE_LIST,
  SET_DONATE_LIST,
  PRELOADER_TOGGLE,
  CANCEL_RECEIPT,
  UPDATE_RECEIPT,
  SET_DONOR_GIVE_INFO,
  SET_RECURRING_LIST,
  GET_NONPROFIT_TOTAL_DONATION,
  SET_NONPROFIT_TOTAL_DONATION,
  GET_DONATION_LIST_TO_NONPROFIT,
  SET_DONATION_LIST_TO_NONPROFIT,
  GET_DONATION_LIST_TO_PROJECT,
  SET_DONATION_LIST_TO_PROJECT,
  UPLOAD_DONATION_LIST,
  GET_RECURRING_LIST_TO_NONPROFIT
} from "../actions/types";

function errorHandler(error) {
  return {
    type: NOTIFICATION_TOGGLE,
    payload: {
      isOpen: true,
      resend: false,
      firstTitle: "Error",
      secondTitle: getErrorText(error),
      buttonText: "Ok"
    }
  };
}

function* getDonateList({ data }) {
  let {
    donateList
  } = store.getState().donate;
  try {
    yield put({
      type: PRELOADER_TOGGLE,
      payload: { show: true, actionName: "getDonateList" }
    });

    let res = yield call(
      axios.get,
      `/donate?skip=${data.skip}&limit=${data.limit}`
    );
    let donateArray = [];
    donateArray = [...donateList];
    res.data.forEach(e => {
      if (donateArray.findIndex(i => i._id === e._id) === -1) {
        donateArray.push(e);
      }
    });
    yield put({
      type: SET_DONATE_LIST,
      donateList: donateArray
    });
  } catch (error) {
    yield put(errorHandler(error));
  } finally {
    yield put({
      type: PRELOADER_TOGGLE,
      payload: { show: false, actionName: "getDonateList" }
    });
    data.cb && data.cb();
  }
}

function* cancelReceipt({ data }) {
  let {
    recurringList
  } = store.getState().give;

  let {
    donorGiveInfo
  } = store.getState().user;

  let notifyData = {};
  try {
    yield call(axios.delete, `/donate/${data._id}`);

    notifyData = {
      firstTitle: "Success",
      secondTitle: "Receipt successfully canceld!"
    };

    let decreaseAmount = 0;

    if (recurringList && recurringList.length > 0) {
      let newDonates = [];
      newDonates = recurringList[0].donates.filter(e => {
        if (e._id !== data._id)
          return true;

        decreaseAmount = e.amount;

        return false;
      });

      let giveArray = [...recurringList];
      giveArray[0] = { ...giveArray[0], donates: newDonates };

      let newDonorGiveInfo = { ...donorGiveInfo, donate: donorGiveInfo.donate - decreaseAmount };
      yield put({
        type: SET_DONOR_GIVE_INFO,
        donorGiveInfo: newDonorGiveInfo
      });

      yield put({
        type: SET_RECURRING_LIST,
        recurringList: giveArray
      });
    }
  } catch (error) {
    yield put(errorHandler(error));
  } finally {
    yield put({
      type: NOTIFICATION_TOGGLE,
      payload: {
        ...notifyData,
        isOpen: true,
        resend: false,
        buttonText: "Ok"
      }
    });
  }
}

function* updateReceipt({ data }) {
  let {
    recurringList
  } = store.getState().give;

  let {
    donorGiveInfo
  } = store.getState().user;

  let notifyData = {};
  try {
    yield call(axios.patch, `/donate/${data._id}`, {
      amount: data.amount
    });

    notifyData = {
      firstTitle: "Success",
      secondTitle: "Receipt successfully updated!"
    };

    let decreaseAmount = 0;
    if (recurringList && recurringList.length > 0) {
      let newDonates = [];
      newDonates = recurringList[0].donates.map(e => {
        if (e._id === data._id) {
          decreaseAmount = e.amount;
          return { ...e, amount: data.amount };
        } else {
          return { ...e };
        }
      });

      let giveArray = [...recurringList];
      giveArray[0] = { ...giveArray[0], donates: newDonates };

      let newDonorGiveInfo = { ...donorGiveInfo, donate: donorGiveInfo.donate - decreaseAmount + data.amount };
      yield put({
        type: SET_DONOR_GIVE_INFO,
        donorGiveInfo: newDonorGiveInfo
      });

      yield put({
        type: SET_RECURRING_LIST,
        recurringList: giveArray
      });
    }
  } catch (error) {
    yield put(errorHandler(error));
  } finally {
    yield put({
      type: NOTIFICATION_TOGGLE,
      payload: {
        ...notifyData,
        isOpen: true,
        resend: false,
        buttonText: "Ok"
      }
    });
  }
}

function* getNonprofitTotalDonation({ data }) {
  try {
    yield put({
      type: PRELOADER_TOGGLE,
      payload: { show: true, actionName: "getNonprofitTotalDonation" }
    });

    let res = yield call(
      axios.get,
      `/donate/nonprofit/${data._id}`
    );
    yield put({
      type: SET_NONPROFIT_TOTAL_DONATION,
      nonprofitTotalDonation: res.data
    });
  } catch (error) {
    yield put(errorHandler(error));
  } finally {
    yield put({
      type: PRELOADER_TOGGLE,
      payload: { show: false, actionName: "getNonprofitTotalDonation" }
    });
    data.cb && data.cb();
  }
}

function* getDonationListToNonprofit({ data }) {
  try {
    yield put({
      type: PRELOADER_TOGGLE,
      payload: { show: true, actionName: "getDonationListToNonprofit" }
    });

    let postData = {
      ...(data.email) && { "email": data.email }
    }

    let res = yield call(
      axios.post,
      `/donateList/nonprofit/${data._id}?skip=${data.skip}&limit=${data.limit}`,
      postData
    );
    yield put({
      type: SET_DONATION_LIST_TO_NONPROFIT,
      donationListToNonprofit: res.data
    });
  } catch (error) {
    yield put(errorHandler(error));
  } finally {
    yield put({
      type: PRELOADER_TOGGLE,
      payload: { show: false, actionName: "getDonationListToNonprofit" }
    });
    data.cb && data.cb();
  }
}

function* getDonationListToProject({ data }) {
  try {
    yield put({
      type: PRELOADER_TOGGLE,
      payload: { show: true, actionName: "getDonationListToProject" }
    });

    let res = yield call(
      axios.get,
      `/donateList/project/${data._id}?skip=${data.skip}&limit=${data.limit}`
    );
    yield put({
      type: SET_DONATION_LIST_TO_PROJECT,
      donationListToProject: res.data
    });
  } catch (error) {
    yield put(errorHandler(error));
  } finally {
    yield put({
      type: PRELOADER_TOGGLE,
      payload: { show: false, actionName: "getDonationListToProject" }
    });
    data.cb && data.cb();
  }
}

function* uploadDonationList(data) {
  const { array } = data
  try {
      yield call(axios.post, 'donate/csv', {
          donationArray: array
      });
  } catch (error) {
      yield put(errorHandler(error))
  } finally {
      data.cb && data.cb()
  }
}

function* getRecurringListToNonprofit({ data }) {
  try {
    yield put({
      type: PRELOADER_TOGGLE,
      payload: { show: true, actionName: "getDonationListToNonprofit" }
    });

    let res = yield call(
      axios.get,
      `/recurringList/nonprofit/${data._id}?skip=${data.skip}&limit=${data.limit}`
    );
    
    yield put({
      type: SET_DONATION_LIST_TO_NONPROFIT,
      donationListToNonprofit: res.data
    });
  } catch (error) {
    yield put(errorHandler(error));
  } finally {
    yield put({
      type: PRELOADER_TOGGLE,
      payload: { show: false, actionName: "getDonationListToNonprofit" }
    });
    data.cb && data.cb();
  }
}

export function* donate() {
  yield takeLatest(GET_DONATE_LIST, getDonateList);
  yield takeLatest(CANCEL_RECEIPT, cancelReceipt);
  yield takeLatest(UPDATE_RECEIPT, updateReceipt);
  yield takeLatest(GET_NONPROFIT_TOTAL_DONATION, getNonprofitTotalDonation);
  yield takeLatest(GET_DONATION_LIST_TO_NONPROFIT, getDonationListToNonprofit);
  yield takeLatest(GET_DONATION_LIST_TO_PROJECT, getDonationListToProject);
  yield takeLatest(UPLOAD_DONATION_LIST, uploadDonationList);
  yield takeLatest(GET_RECURRING_LIST_TO_NONPROFIT, getRecurringListToNonprofit);
}
