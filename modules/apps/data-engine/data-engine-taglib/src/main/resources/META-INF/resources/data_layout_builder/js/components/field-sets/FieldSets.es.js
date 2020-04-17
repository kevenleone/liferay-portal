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

import ClayButton from '@clayui/button';
import React, {useContext, useState} from 'react';

import AppContext from '../../AppContext.es';
import {DRAG_FIELDSET} from '../../drag-and-drop/dragTypes.es';
import {containsFieldSet} from '../../utils/dataDefinition.es';
import FieldType from '../field-types/FieldType.es';
import FieldSetsModal from './FieldSetsModal.es';

export default function FieldSets() {
	const [{dataDefinition, fieldSets}] = useContext(AppContext);
	const [fieldSetState, setFieldSetState] = useState({
		fieldSet: null,
		isVisible: false,
	});

	const toggleFieldSet = fieldSet => {
		setFieldSetState({
			fieldSet,
			isVisible: !fieldSetState.isVisible,
		});
	};

	return (
		<>
			<ClayButton
				block
				displayType="secondary"
				onClick={() => toggleFieldSet()}
			>
				{Liferay.Language.get('add-fieldset')}
			</ClayButton>
			<div className="mt-3">
				{fieldSets.map(fieldSet => {
					const dropDownActions = [
						{
							action: () => toggleFieldSet(fieldSet),
							name: Liferay.Language.get('edit'),
						},
						{
							action: () => {
								const confirmed = confirm(
									Liferay.Language.get(
										'are-you-sure-you-want-to-delete-this'
									)
								);

								if (confirmed) {
									alert('Removeu');
								}
							},
							name: Liferay.Language.get('delete'),
						},
					];

					return (
						<FieldType
							actions={dropDownActions}
							description={`${
								fieldSet.dataDefinitionFields.length
							} ${Liferay.Language.get('fields')}`}
							disabled={
								fieldSet.disabled ||
								containsFieldSet(dataDefinition, fieldSet.id)
							}
							dragType={DRAG_FIELDSET}
							fieldSet={fieldSet}
							icon="forms"
							key={fieldSet.dataDefinitionKey}
							label={fieldSet.name[themeDisplay.getLanguageId()]}
						/>
					);
				})}
			</div>
			<FieldSetsModal
				fieldSet={fieldSetState.fieldSet}
				isVisible={fieldSetState.isVisible}
				onClose={() => toggleFieldSet()}
			/>
		</>
	);
}
