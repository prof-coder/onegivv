import {
    SET_DONATE_LIST,
    SET_NONPROFIT_TOTAL_DONATION,
    SET_DONATION_LIST_TO_NONPROFIT,
    SET_DONATION_LIST_TO_PROJECT,
    SET_RECURRING_LIST_TO_NONPROFIT
} from '../actions/types'

const initState = {
    donateList: [],
    nonprofitTotalDonation: 0,
    donationListToNonprofit: [],
    donationListToProject: [],
    recurringListToNonprofit: []
}

export default function(state = initState, action) {

    if (action.type === SET_DONATE_LIST){
        return {
            ...state,
            donateList: action.donateList
        }
    } else if (action.type === SET_NONPROFIT_TOTAL_DONATION) {
        return {
            ...state,
            nonprofitTotalDonation: action.nonprofitTotalDonation
        }
    } else if (action.type === SET_DONATION_LIST_TO_NONPROFIT) {
        return {
            ...state,
            donationListToNonprofit: action.donationListToNonprofit
        }
    } else if (action.type === SET_DONATION_LIST_TO_PROJECT) {
        return {
            ...state,
            donationListToProject: action.donationListToProject
        }
    } else if (action.type === SET_RECURRING_LIST_TO_NONPROFIT) {
        return {
            ...state,
            recurringListToNonprofit: action.recurringListToNonprofit
        }
    } 

    return state
    
}