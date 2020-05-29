import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
// import Select from 'react-select';

import moment from 'moment';
import Geocode from 'react-geocode';
import DropdownTreeSelect from 'react-dropdown-tree-select';

import MyAutocomplete from '../../common/MyAutocomplete';
import TitleSearch from '../../common/TitleSearch';

import { getHierarchyInterests } from '../../../actions/global';

Geocode.setApiKey(process.env.GEOCODE_API_KEY);

class ProjectFilter extends Component {

	state = {
		interests: [],
		title: "",
		date: moment().subtract(2, 'h'),
		location: '',
		isFilterOpened: false,
		getData: false,
		allHierarchyInterests: [],
		resetSearchFilter: -1
	}

	constructor(props) {
		super(props);

		this.toggleFilter = this.toggleFilter.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		this.props.getHierarchyInterests();

		this.setState({
			title: ''
		});
	}

	componentWillReceiveProps(nextProps) {
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
			allHierarchyInterests: allHierarchyInterests,
		});
		
		if (nextProps.resetSearchFilter !== this.setState.resetSearchFilter) {
			this.setState({
				title: '',
				location: '',
				interests: [],
				resetSearchFilter: nextProps.resetSearchFilter
			});
		}
	}

	inputHelper = (key, val) => () => {
		this.setState({ [key]: val, skip: 0 })
	}

	handleChange = key => target => {
		let value
		if (key === 'title') {
			value = target.title;
			this.props.updateFilterValues({ title: value });
		} else if (key === 'location') {
			this.props.updateFilterValues({ location : target.location.name });
			this.props.updateFilterValues({ coordinates : target.location.geo });
		} else {
			this.props.updateFilterValues({ [key]: target });
		}

		if (key === 'title' || key === 'location') {
			setTimeout(() => {
				this.props.onSearchCharity();
			}, 300);
		}
	}

	toggleFilter = () => {
		this.setState((state) => ({
			isFilterOpened: !state.isFilterOpened
		}));
		
		this.props.toggleFilterPanel(!this.state.isFilterOpened)
	}

	onChange = (currentNode, selectedNodes) => {
		let selectedInterests = [];
		selectedInterests = selectedNodes.map(e => {
			return e.value;
		});

		this.props.updateFilterValues({ interests: selectedInterests });

		setTimeout(() => {
			this.props.onSearchCharity();
		}, 300);
	}
	
	onAction = ({ action, node }) => {
		console.log(`onAction:: [${action}]`, node)
	}
	
	onNodeToggle = currentNode => {
		// console.log('onNodeToggle::', currentNode)
	}

	render() {
		let { title, location, allHierarchyInterests, date, isFilterOpened, getData, resetSearchFilter } = this.state;
		const { isDiscoverPage } = this.props;

		return (
			<div className={`project-filter ${isFilterOpened ? 'open' : ''}`}>
				<div className="card-header isOnlyDesktop">
					<h3 className="main-font">{isDiscoverPage ? "Search" : "Filter"}</h3>
					<div className="separator-15" />
				</div>
				{ !isFilterOpened &&
					<TitleSearch
						update={ this.handleChange("title") }
						inputId="titleField"
						title={ title }
						inputPlaceholder="Project title..."
						className="isOnlyMobile m-t-15"
						disabled={ false }
					/>
				}
				<div className="card-header isOnlyMobile m-t-15" onClick={this.toggleFilter}>
					<h3 className="main-font">{isDiscoverPage ? "Search" : "Filter"}</h3>
					<span className="caret"></span>
					<div className="separator-15" />
				</div>
				<div className="card-body">
					{ !isDiscoverPage && <div className="t_title main-font">Search</div> }
					<TitleSearch
						update={ this.handleChange("title") }
						inputId="titleField"
						title={ title }
						inputPlaceholder="Charity name..."
						disabled={ false }
					/>
					{ !isDiscoverPage && <>

					<p className="t_date main-font">Date</p>
					<div className="input-control-wrapper">
					<DatePicker
						className="control width-250"
						selected={date}
						onChange={this.handleChange('date')}
						dateFormat="dddd, MMMM Do YYYY"
						disabledKeyboardNavigation
					/>
					</div>
					<p className="t_date main-font">Location</p>
					<MyAutocomplete
						key={ getData ? "update-location" : "" }
						update={ this.handleChange("location") }
						errorHandler={
							<span className="globalErrorHandler" />
						}
						inputId="projectLocationField"
						address={ location }
						inputPlaceholder="Address..."
						className="radius"
						disabled={ false }
						resetSearchFilter={resetSearchFilter}
					/>

					<p className="t_interests main-font">Interests</p>
					<div className="Select-menu-outer">
						<DropdownTreeSelect
							data={allHierarchyInterests}
							onChange={this.onChange}
							onAction={this.onAction}
							onNodeToggle={this.onNodeToggle} />
					</div>
					</> }
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	interests: state.globalReducer.interests,
	hierarchyInterests: state.globalReducer.hierarchyInterests
})

const mapDispatchToProps = {
	getHierarchyInterests
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProjectFilter)