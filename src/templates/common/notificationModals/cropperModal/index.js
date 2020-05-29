import React from 'react'
import AvatarCropper from '../../authModals/components/avatarCropper'

const CropperModal = ({ imageUrl, closeCropper, rotate }) => (
	<div className="CropperModal">
		<AvatarCropper imageUrl={imageUrl} closeCropper={closeCropper} rotate={rotate} />
	</div>
)

export default CropperModal
