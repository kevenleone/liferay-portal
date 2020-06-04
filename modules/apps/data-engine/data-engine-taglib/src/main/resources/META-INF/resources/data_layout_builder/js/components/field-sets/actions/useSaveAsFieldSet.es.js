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

import {useContext} from 'react';

import AppContext from '../../../AppContext.es';
import {UPDATE_FIELDSETS} from '../../../actions.es';
import DataLayoutBuilderContext from '../../../data-layout-builder/DataLayoutBuilderContext.es';
import {updateItem} from '../../../utils/client.es';
import {errorToast, successToast} from '../../../utils/toast.es';

export default ({
	childrenContext,
	defaultLanguageId,
	fieldSet,
	otherProps: {DataLayout},
}) => {
	const [dataLayoutBuilder] = useContext(DataLayoutBuilderContext);
	const [{dataDefinition, fieldSets}, dispatch] = useContext(AppContext);
	const {state: childrenState} = childrenContext;

	return (name) => {
		const {
			dataDefinition: {dataDefinitionFields},
			dataLayout: {dataLayoutPages},
		} = childrenState;

		fieldSet.dataDefinitionFields = dataDefinitionFields;
		fieldSet.defaultDataLayout.dataLayoutPages = dataLayoutPages; 

		const updatedFieldSets = fieldSets.map((field) => {
			if (name === field.name[defaultLanguageId]) {
				return fieldSet;
			}

			return field;
		});

		dispatch({
			payload: {
				fieldSets: updatedFieldSets,
			},
			type: UPDATE_FIELDSETS,
		});

		const nestedFields = dataDefinitionFields.map((ddField) =>
			DataLayout.getDDMFormField(
				childrenState.dataDefinition,
				ddField.name
			)
		);

		const {name: fieldName} = dataDefinition.dataDefinitionFields.find(
			({label}) => label[defaultLanguageId] === name
		);

		const rows = dataLayoutPages[0].dataLayoutRows.map(
			({dataLayoutColumns}) => {
				return {
					columns: dataLayoutColumns.map(
						({columnSize: size, fieldNames: fields}) => ({
							fields,
							size,
						})
					),
				};
			}
		);

		dataLayoutBuilder.dispatch('fieldEdited', {
			fieldName,
			propertyName: 'nestedFields',
			propertyValue: nestedFields,
		});

		dataLayoutBuilder.dispatch('fieldEdited', {
			fieldName,
			propertyName: 'rows',
			propertyValue: rows,
		});

		updateItem(
			`/o/data-engine/v2.0/data-definitions/${fieldSet.id}`,
			fieldSet
		)
			.then(() => {
				successToast(Liferay.Language.get('fieldset-saved'));
			})
			.catch(({message}) => errorToast(message));
	};
};
