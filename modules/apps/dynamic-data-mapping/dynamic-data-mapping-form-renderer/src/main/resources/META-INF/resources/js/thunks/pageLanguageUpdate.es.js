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
		value,
		visible,
	}) => {
		let _value = value;

		if (!visible) {
			_value = '';
		}

		if (localizable) {
			if (!dataRecordValues[fieldName]) {
				dataRecordValues[fieldName] = {
					...{
						[languageId]: [],
					},
					...localizedValue,
				};
			}

			if (repeatable) {
				const value = _value || localizedValue[languageId];
				const isSameArray = (a, b) =>
					JSON.stringify(a) === JSON.stringify(b);
				if (Array.isArray(dataRecordValues[fieldName][languageId])) {
					if (
						Array.isArray(value) &&
						isSameArray(
							dataRecordValues[fieldName][languageId],
							value
						)
					) {
						return;
					}
					dataRecordValues[fieldName][languageId].push(value);
				}
				else {
					dataRecordValues[fieldName] = {
						...dataRecordValues[fieldName],
						[languageId]: [value],
					};
				}
			}
			else {
				dataRecordValues[fieldName] = {
					...localizedValue,
					[languageId]: _value,
				};
			}
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

const getDataRecordValues = ({
	nextEditingLanguageId,
	pages,
	preserveValue,
	prevDataRecordValues,
	prevEditingLanguageId,
}) => {
	if (preserveValue) {
		return formatDataRecord(nextEditingLanguageId, pages);
	}

	const dataRecordValues = formatDataRecord(prevEditingLanguageId, pages);
	const newDataRecordValues = {...prevDataRecordValues};

	Object.keys(dataRecordValues).forEach((key) => {
		if (newDataRecordValues[key]) {
			newDataRecordValues[key][prevEditingLanguageId] =
				dataRecordValues[key][prevEditingLanguageId];
		}
		else {
			newDataRecordValues[key] = dataRecordValues[key];
		}
	});

	return newDataRecordValues;
};

export default function pageLanguageUpdate({
	ddmStructureLayoutId,
	nextEditingLanguageId,
	pages,
	portletNamespace,
	preserveValue,
	prevDataRecordValues,
	prevEditingLanguageId,
}) {
	return (dispatch) => {
		const newDataRecordValues = getDataRecordValues({
			nextEditingLanguageId,
			pages,
			preserveValue,
			prevDataRecordValues,
			prevEditingLanguageId,
		});

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
				const visitor = new PagesVisitor(pages);
				const newPages = visitor.mapFields(
					(field) => {
						if (!field.localizedValue) {
							field.localizedValue = {};
						}
						if (newDataRecordValues[field.fieldName]) {
							field.localizedValue = {
								...newDataRecordValues[field.fieldName],
							};
						}

						return field;
					},
					true,
					true
				);

				dispatch({
					payload: {
						editingLanguageId: nextEditingLanguageId,
						pages: newPages,
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
