/* eslint-disable no-console */
/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayForm from '@clayui/form';
import React from 'react';

import DocumentLibrary from './DocumentLibrary';

const portletURL =
	'http://localhost:8080/group/guest/~/control_panel/manage/-/select/ddmuserpersonalfolder/_com_liferay_dynamic_data_mapping_form_web_portlet_DDMFormPortlet_selectDocumentLibrary?refererGroupId=20126&_com_liferay_item_selector_web_portlet_ItemSelectorPortlet_0_json=%7B%22desiredItemSelectorReturnTypes%22%3A%22fileentry%22%2C%22folderId%22%3A%2240577%22%2C%22groupId%22%3A%2220126%22%7D&p_p_auth=gABnTE2L';

const FormDocumentLibraryInput = ({portletNamespace}) => {
	return (
		<ClayForm.Group>
			<label>Document Library</label>
			<DocumentLibrary
				itemSelectorURL={portletURL}
				modalTitle={Liferay.Language.get('select-document')}
				onChange={(item) => console.log(item)}
				onClearButtonClicked={() => console.log('onClearButtonClicked')}
				onSelectButtonClicked={() =>
					console.log('onSelectButtonClicked')
				}
				portletNamespace={portletNamespace}
			/>
		</ClayForm.Group>
	);
};

export default FormDocumentLibraryInput;
