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

import {
	DataLayoutBuilderActions,
	DataLayoutVisitor,
	DragTypes,
	FieldTypeList,
} from 'data-engine-taglib';
import React, {useContext} from 'react';

import useDoubleClick from '../../hooks/useDoubleClick.es';
import {findFieldByName} from '../../utils/findFieldByName.es';
import DataLayoutBuilderContext from './DataLayoutBuilderInstanceContext.es';
import FormViewContext from './FormViewContext.es';
import useDeleteDefinitionField from './useDeleteDefinitionField.es';
import useDeleteDefinitionFieldModal from './useDeleteDefinitionFieldModal.es';

const getFieldTypes = ({
	dataDefinition,
	dataLayout,
	editingLanguageId,
	fieldTypes,
	focusedCustomObjectField,
}) => {
	const dataDefinitionFields = [];
	const {dataLayoutPages} = dataLayout;
	const {dataDefinitionFields: fields} = dataDefinition;

	const setDefinitionField = (
		{
			customProperties: {ddmStructureId},
			fieldType,
			label,
			name,
			nestedDataDefinitionFields = [],
		},
		nested
	) => {
		if (fieldType === 'section') {
			return;
		}

		const fieldTypeSettings = fieldTypes.find(({name}) => {
			return name === fieldType;
		});

		if (label[editingLanguageId]) {
			label = label[editingLanguageId];
		}
		else {
			label = label[Liferay.ThemeDisplay.getDefaultLanguageId()];
		}

		const isFieldSet = ddmStructureId && fieldType === 'fieldset';

		const FieldTypeLabel = isFieldSet
			? Liferay.Language.get('fieldset')
			: fieldTypeSettings.label;

		const dataDefintionField = {
			active: name === focusedCustomObjectField.name,
			className: nested
				? 'custom-object-field-children'
				: 'custom-object-field',
			description: `${FieldTypeLabel} ${
				nestedDataDefinitionFields.length
					? `- ${
							nestedDataDefinitionFields.length
					  } ${Liferay.Language.get('fields')}`
					: ''
			}`,
			disabled: DataLayoutVisitor.containsField(dataLayoutPages, name),
			dragAlignment: 'right',
			dragType: DragTypes.DRAG_DATA_DEFINITION_FIELD,
			icon: fieldTypeSettings.icon,
			isFieldSet,
			label,
			name,
			nestedDataDefinitionFields: nestedDataDefinitionFields.map(
				(nestedField) => setDefinitionField(nestedField, true)
			),
		};

		if (nested) {
			return dataDefintionField;
		}
		dataDefinitionFields.push(dataDefintionField);
	};

	fields.forEach((fieldType) => {
		setDefinitionField(fieldType);
	});

	return dataDefinitionFields;
};

export default ({keywords}) => {
	const [dataLayoutBuilder] = useContext(DataLayoutBuilderContext);
	const [state, dispatch] = useContext(FormViewContext);
	const {dataDefinition} = state;
	const {dataDefinitionFields} = dataDefinition;
	const fieldTypes = getFieldTypes(state);
	const onClick = ({name}) => {
		const dataDefinitionField = findFieldByName(dataDefinitionFields, name);

		dispatch({
			payload: {dataDefinitionField},
			type: DataLayoutBuilderActions.UPDATE_FOCUSED_CUSTOM_OBJECT_FIELD,
		});
	};
	const onDoubleClick = ({name}) => {
		const {activePage, pages} = dataLayoutBuilder.getStore();
		const indexes = {
			columnIndex: 0,
			pageIndex: activePage,
			rowIndex: pages[activePage].rows.length,
		};

		const definitionField = dataDefinitionFields.find(
			({name: fieldName}) => name === fieldName
		);
		if (definitionField.fieldType === 'fieldset') {
			const {en_US: label} = definitionField.label;
			const fieldSet =
				state.fieldSets.find(({name}) => name.en_US === label) ||
				definitionField;

			dataLayoutBuilder.dispatch(
				'fieldSetAdded',
				DataLayoutBuilderActions.dropFieldSet({
					dataLayoutBuilder,
					fieldName: name,
					fieldSet,
					indexes,
					parentFieldName: undefined,
					useFieldName: name,
				})
			);

			return;
		}

		dataLayoutBuilder.dispatch(
			'fieldAdded',
			DataLayoutBuilderActions.dropCustomObjectField({
				addedToPlaceholder: true,
				dataDefinition,
				dataDefinitionFieldName: name,
				dataLayoutBuilder,
				indexes,
			})
		);
	};

	const [handleOnClick, handleOnDoubleClick] = useDoubleClick(
		onClick,
		onDoubleClick
	);

	const deleteField = useDeleteDefinitionField({dataLayoutBuilder});

	const onDeleteDefinitionField = useDeleteDefinitionFieldModal((event) =>
		deleteField(event)
	);

	return (
		<FieldTypeList
			deleteLabel={Liferay.Language.get('delete-from-object')}
			fieldTypes={fieldTypes}
			keywords={keywords}
			onClick={handleOnClick}
			onDelete={(fieldName) =>
				onDeleteDefinitionField({activePage: 0, fieldName})
			}
			onDoubleClick={handleOnDoubleClick}
		/>
	);
};
