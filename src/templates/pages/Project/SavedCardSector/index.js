import React, { Component } from 'react';

import Card from '../../../common/Card';

class SavedCardSector extends Component {

    componentDidMount() {

    }

    render() {
        const { cardInfo, onClickSavedCard } = this.props;

        return (
            <div className="savedCardBody" onClick={onClickSavedCard}>
                <Card padding="10px">
                    { cardInfo.isChecked &&
                        <div className="checkedIconBody">
                            <img alt="check-mark" src="/images/ui-icon/check_mark.svg" />
                        </div>
                    }
                    <div className="flexBody">
                        <p className="title">Card Holder's Name</p>
                        <p className="desc">{cardInfo.cardHolderName}</p>
                    </div>
                    <div className="flexBody">
                        <p className="title">Card Number</p>
                        <p className="desc"></p>
                    </div>
                    <div className="flexBody">
                        <p className="title">Postal Code</p>
                        <p className="desc">{cardInfo.cardZip}</p>
                    </div>
                </Card>
            </div>
        )
    }

}

export default SavedCardSector