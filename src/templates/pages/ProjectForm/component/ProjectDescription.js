import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';

import { toggleNotification } from '../../../../actions/notificationActions'

class ProjectDescription extends Component {

	constructor(props) {
		super(props);

		this.supportPhotoCount = 5;
		
		let supportPhotoFileArr = [];
		for (let i = 0; i < this.supportPhotoCount; i++) {
			supportPhotoFileArr.push(null);
		}

		let supportPhotoUrlArr = [];
		for (let i = 0; i < this.supportPhotoCount; i++) {
			supportPhotoUrlArr.push(null);
		}

		this.state = {
			title: this.props.title || '',
			description: this.props.description || '',
			file: null,
			urlData: this.props.urlData || '',
			supportPhotoFileArr: this.props.supportPhotoFileArr || supportPhotoFileArr,
			supportPhotoUrlArr: this.props.supportPhotoUrlArr || supportPhotoUrlArr
		};

		this.previewRef = React.createRef();

		this.supportPhotoRefArr = [];
		for (let i = 0; i < this.supportPhotoCount; i++) {
			this.supportPhotoRefArr.push(React.createRef());
		}
	}

	inputHelper = key => ({ target }) =>
		this.setState({ [key]: target.value }, () => {
			this.props.getData &&
				this.props.getData({
					title: this.state.title,
					description: this.state.description,
					file: this.state.file
				})
		})

	changeFile = e => {
		if (e.target.files.length === 0)
			return;
		if (
			e.target.files[0].type !== 'image/jpeg' &&
			e.target.files[0].type !== 'image/png'
		) {
			this.props.dispatch(
				toggleNotification({
					isOpen: true,
					resend: false,
					firstTitle: 'Error',
					secondTitle: 'You can only upload image files',
					buttonText: 'Ok'
				})
			)
		} else {
			if (
				e.target.files[0] &&
				e.target.files[0].size / 1024 / 1024 <= 10
			) {
				this.setState({ file: e.target.files[0] });
				this.props.getData &&
					this.props.getData({
						file: e.target.files[0]
					});

				if (e.target.files[0]) {
					let reader = new FileReader()
					reader.onload = event => {
						this.setState({ urlData: event.target.result })
					}
					reader.readAsDataURL(e.target.files[0]);
				} else {
					this.setState({ urlData: null });
				}
			} else {
				this.props.dispatch(
					toggleNotification({
						isOpen: true,
						resend: false,
						firstTitle: 'Error',
						secondTitle: 'Photo should be up to 10mb',
						buttonText: 'Ok'
					})
				);
			}
		}
	}

	openSelectFile = () => {
		this.previewRef.current.click();
	}

	changeSupportPhotoFile = index => e => {
		if (e.target.files.length === 0)
			return;

		let { supportPhotoFileArr, supportPhotoUrlArr } = this.state;
		let fileObj = e.target.files[0];

		if (
			e.target.files[0].type !== 'image/jpeg' &&
			e.target.files[0].type !== 'image/png'
		) {
			this.props.dispatch(
				toggleNotification({
					isOpen: true,
					resend: false,
					firstTitle: 'Error',
					secondTitle: 'You can only upload image files',
					buttonText: 'Ok'
				})
			)
		} else {
			if (
				e.target.files[0] &&
				e.target.files[0].size / 1024 / 1024 <= 10
			) {
				let cloneSupportPhotoFileArr = [ ...supportPhotoFileArr ];
				cloneSupportPhotoFileArr[index] = fileObj;

				this.setState({
					supportPhotoFileArr: cloneSupportPhotoFileArr
				});

				this.props.getData &&
					this.props.getData({
						supportPhotoFileArr: cloneSupportPhotoFileArr
					});

				let cloneSupportPhotoUrlArr = [ ...supportPhotoUrlArr ];

				if (fileObj) {
					let reader = new FileReader();
					reader.onload = event => {
						cloneSupportPhotoUrlArr[index] = event.target.result;
						this.setState({ supportPhotoUrlArr: cloneSupportPhotoUrlArr });
					}
					reader.readAsDataURL(fileObj);
				} else {
					cloneSupportPhotoUrlArr[index] = null;
					this.setState({ supportPhotoUrlArr: cloneSupportPhotoUrlArr });
				}
			} else {
				this.props.dispatch(
					toggleNotification({
						isOpen: true,
						resend: false,
						firstTitle: 'Error',
						secondTitle: 'Photo should be up to 10mb',
						buttonText: 'Ok'
					})
				);
			}
		}
	}

	openSelectSupportPhoto = (index) => {
		this.supportPhotoRefArr[index].current.click();
	}

	render() {
		const { title, description, file, urlData, supportPhotoFileArr, supportPhotoUrlArr } = this.state;
		const { disabled } = this.props;

		return (
			<div className="project-information">
				<div
					className="file-wrapper image-action animation-click-effect"
					onClick={this.openSelectFile}>
					<img
						src={
							urlData
								? urlData
								: '/images/ui-icon/mini-images.svg'
						}
						atl="img-icon"
						className={`icon ${file || urlData ? 'full' : 'fix'}`}
						alt="icon"
					/>
					{ file || urlData ? (
						''
					) : (
						<span className="main-font text">
							Upload Cover Photo
						</span>
					)}
					<input
						type="file"
						ref={this.previewRef}
						onChange={this.changeFile}
						accept="image/*"
						id="projectFileCreate"
						disabled={disabled}
					/>
					<span className="globalErrorHandler" />
				</div>

				<div className="separator-25" />
				<div className="title-input">
					<span className="label main-font">Project Title:</span>
					<input
						className="main-font control"
						type="text"
						id="projectTitleCreate"
						placeholder="Project Title"
						onChange={this.inputHelper('title')}
						value={title}
						disabled={disabled}
					/>
					<span className="globalErrorHandler" />
				</div>

				<div className="separator-25" />
				<div className="description-input">
					<span className="label main-font">
						Project description:
					</span>
					<Textarea
						className="main-font control description"
						defaultValue={description}
						style={{ minHeight: 48 }}
						placeholder="Describe your project here"
						id="projectDescriptionCreate"
						onChange={this.inputHelper('description')}
						disabled={disabled}
					/>
					<span className="globalErrorHandler" />
				</div>
				
				<div className="separator-25" />
				<div className="supportPhotoBody">
					<div className="bigPhotoBody">
						<div className="file-wrapper image-action animation-click-effect"
							onClick={e => this.openSelectSupportPhoto(0)}>
							<img
								src={
									supportPhotoUrlArr[0]
										? supportPhotoUrlArr[0]
										: '/images/ui-icon/mini-images.svg'
								}
								atl="img-icon"
								className={`icon ${supportPhotoFileArr[0] || supportPhotoUrlArr[0] ? 'full' : 'fix'}`}
								alt="icon"
							/>
							{ supportPhotoFileArr[0] || supportPhotoUrlArr[0] ? (
								''
							) : (
								<span className="main-font text">
									Support Photo
								</span>
							)}
							<input
								type="file"
								ref={this.supportPhotoRefArr[0]}
								onChange={this.changeSupportPhotoFile(0)}
								accept="image/*"
								id="supportPhotoFile_0"
								disabled={disabled}
							/>
							<span className="globalErrorHandler" />
						</div>
					</div>
					<div className="smallPhotosBody">
						<div className="leftBody">
							<div className="file-wrapper image-action animation-click-effect"
								onClick={e => this.openSelectSupportPhoto(1)}>
								<img
									src={
										supportPhotoUrlArr[1]
											? supportPhotoUrlArr[1]
											: '/images/ui-icon/mini-images.svg'
									}
									atl="img-icon"
									className={`icon ${supportPhotoFileArr[1] || supportPhotoUrlArr[1] ? 'full' : 'fix'}`}
									alt="icon"
								/>
								{ supportPhotoFileArr[1] || supportPhotoUrlArr[1] ? (
									''
								) : (
									<span className="main-font text">
										Support Photo
									</span>
								)}
								<input
									type="file"
									ref={this.supportPhotoRefArr[1]}
									onChange={this.changeSupportPhotoFile(1)}
									accept="image/*"
									id="supportPhotoFile_1"
									disabled={disabled}
								/>
								<span className="globalErrorHandler" />
							</div>
							<div className="file-wrapper image-action animation-click-effect"
								onClick={e => this.openSelectSupportPhoto(2)}>
								<img
									src={
										supportPhotoUrlArr[2]
											? supportPhotoUrlArr[2]
											: '/images/ui-icon/mini-images.svg'
									}
									atl="img-icon"
									className={`icon ${supportPhotoFileArr[2] || supportPhotoUrlArr[2] ? 'full' : 'fix'}`}
									alt="icon"
								/>
								{ supportPhotoFileArr[2] || supportPhotoUrlArr[2] ? (
									''
								) : (
									<span className="main-font text">
										Support Photo
									</span>
								)}
								<input
									type="file"
									ref={this.supportPhotoRefArr[2]}
									onChange={this.changeSupportPhotoFile(2)}
									accept="image/*"
									id="supportPhotoFile_2"
									disabled={disabled}
								/>
								<span className="globalErrorHandler" />
							</div>
						</div>
						<div className="rightBody">
							<div className="file-wrapper image-action animation-click-effect"
								onClick={e => this.openSelectSupportPhoto(3)}>
								<img
									src={
										supportPhotoUrlArr[3]
											? supportPhotoUrlArr[3]
											: '/images/ui-icon/mini-images.svg'
									}
									atl="img-icon"
									className={`icon ${supportPhotoFileArr[3] || supportPhotoUrlArr[3] ? 'full' : 'fix'}`}
									alt="icon"
								/>
								{ supportPhotoFileArr[3] || supportPhotoUrlArr[3] ? (
									''
								) : (
									<span className="main-font text">
										Support Photo
									</span>
								)}
								<input
									type="file"
									ref={this.supportPhotoRefArr[3]}
									onChange={this.changeSupportPhotoFile(3)}
									accept="image/*"
									id="supportPhotoFile_3"
									disabled={disabled}
								/>
								<span className="globalErrorHandler" />
							</div>
							<div className="file-wrapper image-action animation-click-effect"
								onClick={e => this.openSelectSupportPhoto(4)}>
								<img
									src={
										supportPhotoUrlArr[4]
											? supportPhotoUrlArr[4]
											: '/images/ui-icon/mini-images.svg'
									}
									atl="img-icon"
									className={`icon ${supportPhotoFileArr[4] || supportPhotoUrlArr[4] ? 'full' : 'fix'}`}
									alt="icon"
								/>
								{ supportPhotoFileArr[4] || supportPhotoUrlArr[4] ? (
									''
								) : (
									<span className="main-font text">
										Support Photo
									</span>
								)}
								<input
									type="file"
									ref={this.supportPhotoRefArr[4]}
									onChange={this.changeSupportPhotoFile(4)}
									accept="image/*"
									id="supportPhotoFile_4"
									disabled={disabled}
								/>
								<span className="globalErrorHandler" />
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default ProjectDescription
