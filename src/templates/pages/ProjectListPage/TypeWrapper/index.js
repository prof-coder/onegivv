import React, { Component } from 'react'

import { connect } from 'react-redux'

class TypeWrapper extends Component {

    constructor(props) {
        super(props);

        this.doReloadList = this.doReloadList.bind(this);
    }

    componentWillReceiveProps(nextProps) {        
        if (nextProps.currentProjectType) {
            this.doReloadList(nextProps.currentProjectType.data);
        }
    }

    doReloadList = projectType => {
        this.props.reloadList(projectType);
    }

    render() {
        const { user, isDiscoverPage, projectTypes, donorProjectTypes, inputHelper, activeType } = this.props;

        return (
            <div className="typeWrapper" padding="0">
                { user && !isDiscoverPage && projectTypes.map((e, i) =>
                    <div
                        key={`type-${i}`}
                        className={`wrapper ${activeType === e.index && 'active'} ${e.index === -1 && 'hint-all'}`}
                        onClick={inputHelper('activeType', e.index)}>
                        <span className="label">{e.label}</span>
                    </div>
                )}
                { isDiscoverPage && donorProjectTypes.map((e, i) =>
                    <div
                        key={`type-${i}`}
                        className={`wrapper ${activeType ===
                            e.index && 'active'}`}
                        onClick={inputHelper('activeType', e.index)}>
                        <span className="label">{e.label}</span>
                    </div>
                )}
            </div>
        )
    }

}

const mapStateToProps = ({ globalReducer }) => ({
	currentProjectType: globalReducer.activeProjectType
})

export default connect(
	mapStateToProps,
	null
)(TypeWrapper)