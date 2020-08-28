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

import {PagesVisitor} from 'dynamic-data-mapping-form-renderer';
import {fetch} from 'frontend-js-web';

import {EVENT_TYPES} from '../actions/eventTypes.es';

const formatDataRecord = (languageId, pages) => {
	const dataRecordValues = {};

	const visitor = new PagesVisitor(pages);

	const setDataRecord = ({
		fieldName,
		localizable,
		localizedValue,
		repeatable,
		type,
		value,
		visible,
	}) => {
		if (type === 'fieldset') {
			return;
		}
		let _value = value;

		if (!visible) {
			_value = '';
		}

		if (localizable) {
			if (!dataRecordValues[fieldName]) {
				dataRecordValues[fieldName] = {
					...localizedValue,
					[languageId]: [],
				};
			}

			if (repeatable) {
				dataRecordValues[fieldName][languageId].push(_value || '');
			}
			else {
				dataRecordValues[fieldName] = {
					...localizedValue,
					[languageId]: _value,
				};
			}

			Object.keys(dataRecordValues[fieldName]).forEach((key) => {
				dataRecordValues[fieldName][key] =
					dataRecordValues[fieldName][languageId];
			});
		}
		else {
			dataRecordValues[fieldName] = _value;
		}
	};

	visitor.mapFields(
		(field) => {
			setDataRecord(field);
		},
		true,
		true
	);

	return dataRecordValues;
};

export default function appBuilderLanguageUpdate({
	ddmStructureLayoutId,
	nextEditingLanguageId,
	pages,
	portletNamespace,
}) {
	return (dispatch) => {
		const newDataRecordValues = formatDataRecord(
			nextEditingLanguageId,
			pages
		);

		fetch(
			`/o/data-engine/v2.0/data-layouts/${ddmStructureLayoutId}/context`,
			{
				body: JSON.stringify({
					dataRecordValues: newDataRecordValues,
					namespace: portletNamespace,
					pathThemeImages: themeDisplay.getPathThemeImages(),
					readOnly: false,
				}),
				headers: {
					'Accept-Language': nextEditingLanguageId.replace('_', '-'),
					'Content-Type': 'application/json',
				},
				method: 'POST',
			}
		)
			.then((response) => response.json())
			.then(({pages}) => {
				dispatch({
					payload: {
						editingLanguageId: nextEditingLanguageId,
						pages,
					},
					type: EVENT_TYPES.ALL,
				});

				dispatch({
					payload: newDataRecordValues,
					type: EVENT_TYPES.UPDATE_DATA_RECORD_VALUES,
				});
			});
	};
}
