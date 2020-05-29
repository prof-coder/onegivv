import React, { Component } from 'react';
import { connect } from 'react-redux';

import DropdownTreeSelect from 'react-dropdown-tree-select';

import { getAllCategories, getAllInterests, getHierarchyInterests } from '../../../../actions/global';

class CategoryList extends Component {

    state = {
        selectedCategoryInfo: {},
        showToggleMenu: false,
        toggleMenuPosLeft: 0,
        toggleMenuPosTop: 0,
        interestArr: []
    }

    constructor(props) {
        super(props);

        this.onClickCategory = this.onClickCategory.bind(this);
        this.closeToggleMenu = this.closeToggleMenu.bind(this);
    }

    componentDidMount() {
        this.props.getAllCategories();
    }

    onClickCategory = (categoryInfo) => e => {
        let left = 0, top = 0;
        if (e && e.currentTarget && e.currentTarget.offsetLeft && e.currentTarget.offsetTop && e.currentTarget.clientHeight) {
            left = e.currentTarget.offsetLeft;
            top = e.currentTarget.offsetTop + e.currentTarget.clientHeight;
        }
        
        this.setState({
            showToggleMenu: true,
            toggleMenuPosLeft: left + 'px',
            toggleMenuPosTop: top + 'px',
            selectedCategoryInfo: {
                _id: categoryInfo._id,
                title: categoryInfo.title
            }
        }, () => {
            this.props.getAllInterests({
                parentId: categoryInfo._id
            });

            this.props.getHierarchyInterests({
                parentId: categoryInfo._id
            })
        });
    }

    componentWillReceiveProps(nextProps) {
        // let { selectedCategoryInfo } = this.state;

        // let index = -1;
        // index = nextProps.interests.findIndex(e => e._id === selectedCategoryInfo._id);
        // if (index === -1) {
        //     let cloneInterestArr = [...nextProps.interests];
        //     cloneInterestArr.unshift(selectedCategoryInfo);
        //     this.setState({
        //         interestArr: cloneInterestArr
        //     });
        // } else {
        //     this.setState({
        //         interestArr: nextProps.interests
        //     });
        // }

        if (!nextProps.hierarchyInterests)
			return;

        let allHierarchyInterests = nextProps.hierarchyInterests.map(e => {
			return e;
		});
		allHierarchyInterests.forEach(e => {
			if (e._id) e.value = e._id;
			if (e.title) e.label = e.title;

			if (e.children && Array.isArray(e.children)) {
				e.children.forEach(e1 => {
					if (e1._id) e1.value = e1._id;
					if (e1.title) e1.label = e1.title;

					if (e1.children && Array.isArray(e1.children)) {
						e1.children.forEach(e2 => {
							if (e2._id) e2.value = e2._id;
							if (e2.title) e2.label = e2.title;
						});
					}
				});
			}
        });
        
        this.setState({
            interestArr: allHierarchyInterests
        });
    }

    closeToggleMenu = e => {
        if (e)
            e.stopPropagation();
        
        this.setState({
            showToggleMenu: false
        });
    }

    onChange = (currentNode, selectedNodes) => {
        let selectedInterests = [];
		selectedInterests = selectedNodes.map(e => {
			return e;
        });

        if (selectedInterests.length === 0)
            return;
        
        this.props.onClickEachInterest(this.state.selectedCategoryInfo, selectedInterests[0]);
	}
	
	onAction = ({ action, node }) => {
		console.log(`onAction:: [${action}]`, node)
	}
	
	onNodeToggle = currentNode => {
		// console.log('onNodeToggle::', currentNode)
    }
    
    render() {
        let { showToggleMenu, toggleMenuPosLeft, toggleMenuPosTop, interestArr } = this.state;
        const { categories } = this.props;
        
        return (
            <section className="categoryListSection">
                <div className="categoryList">
                    { categories && categories.length > 0 && categories.map((category, i) => (
                        <div key={`category_` + category._id} className="eachCategory" onClick={this.onClickCategory(category)}>
                            <img src={category.thumbImage} alt="" />
                            <p>{category.title}</p>
                        </div>
                    )) }
                </div>
                
                <div className={`toggleMenu ${showToggleMenu ? 'open' : ''}`} style={{left: toggleMenuPosLeft, top: toggleMenuPosTop}}>
                    <div className="header text-right" onClick={this.closeToggleMenu}>
                        <img src="/images/ui-icon/discovery/dropdown-icon.svg" alt="dropdown-icon" />
                    </div>
                    {/* { interestArr && interestArr.length > 0 && interestArr.map((interest, i) => (
                        <div key={`interest_` + interest._id} className="submenu">
                            <span className="_label" onClick={onClickEachInterest(selectedCategoryInfo, interest)}>{interest.title}</span>
                        </div>
                    )) } */}

                    { interestArr && interestArr.length > 0 &&
                        <DropdownTreeSelect
                            data={interestArr}
                            onChange={this.onChange}
                            onAction={this.onAction}
                            mode="radioSelect"
                            showDropdown="always"
                            onNodeToggle={this.onNodeToggle} />
                    }
                </div>
            </section>
        )
    }

}

const mapStateToProps = state => ({
    categories: state.globalReducer.categories,
    interests: state.globalReducer.interests,
    hierarchyInterests: state.globalReducer.hierarchyInterests
})

const mapDispatchToProps = {
    getAllCategories,
    getAllInterests,
    getHierarchyInterests
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryList)