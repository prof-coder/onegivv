import {
    GET_DONATE_LIST,
    CANCEL_RECEIPT,
    UPDATE_RECEIPT,
    GET_NONPROFIT_TOTAL_DONATION,
    GET_DONATION_LIST_TO_NONPROFIT,
    GET_DONATION_LIST_TO_PROJECT,
    UPLOAD_DONATION_LIST,
    GET_RECURRING_LIST_TO_NONPROFIT
} from './types'

export const getDonateList = data => ({
    type: GET_DONATE_LIST, data
})

export const cancelReceipt = data => ({
    type: CANCEL_RECEIPT,
    data
})

export const updateReceipt = data => ({
    type: UPDATE_RECEIPT,
    data
})

export const getNonprofitTotalDonation = data => ({
    type: GET_NONPROFIT_TOTAL_DONATION,
    data
})

export const getDonationListToNonprofit = data => ({
    type: GET_DONATION_LIST_TO_NONPROFIT,
    data
})

export const getDonationListToProject = data => ({
    type: GET_DONATION_LIST_TO_PROJECT,
    data
})

export const uploadDonationList = data => ({
    type: UPLOAD_DONATION_LIST,
    ...data
})

export const getRecurringListToNonprofit = data => ({
    type: GET_RECURRING_LIST_TO_NONPROFIT,
    data
})