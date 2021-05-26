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
import ClayCard from '@clayui/card';
import {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import React, {useEffect, useMemo, useState} from 'react';

const CardItem = ({fileEntryTitle, fileEntryURL}) => {
	return (
		<ClayCard horizontal>
			<ClayCard.Body>
				<div className="card-col-content card-col-gutters">
					<h4 className="text-truncate" title={fileEntryTitle}>
						{fileEntryTitle}
					</h4>
				</div>

				<div className="card-col-field">
					<a download={fileEntryTitle} href={fileEntryURL}>
						<ClayIcon symbol="download" />
					</a>
				</div>
			</ClayCard.Body>
		</ClayCard>
	);
};

const getValue = (value) => {
	if (!value) {
		return '';
	}

	if (typeof value === 'string') {
		return value;
	}

	return JSON.stringify(value);
};

function transformFileEntryProperties({fileEntryTitle, fileEntryURL, value}) {
	if (value && typeof value === 'string') {
		try {
			const fileEntry = JSON.parse(value);

			fileEntryTitle = fileEntry.title;

			if (fileEntry.url) {
				fileEntryURL = fileEntry.url;
			}
		}
		catch (e) {
			console.warn('Unable to parse JSON', value);
		}
	}

	return value ? [fileEntryTitle, fileEntryURL] : [];
}

const DocumentLibrary = ({
	editingLanguageId,
	fileEntryTitle = '',
	fileEntryURL = '',
	id,
	message,
	name,
	onClearButtonClicked,
	onSelectButtonClicked,
	placeholder,
	readOnly,
	value,
}) => {
	const [transformedFileEntryTitle, transformedFileEntryURL] = useMemo(
		() =>
			transformFileEntryProperties({
				fileEntryTitle,
				fileEntryURL,
				value,
			}),
		[fileEntryTitle, fileEntryURL, value]
	);

	return (
		<div className="liferay-ddm-form-field-document-library">
			{transformedFileEntryURL && readOnly ? (
				<CardItem
					fileEntryTitle={transformedFileEntryTitle}
					fileEntryURL={transformedFileEntryURL}
				/>
			) : (
				<ClayInput.Group>
					<ClayInput.GroupItem prepend>
						<ClayInput
							aria-label={Liferay.Language.get('file')}
							className="bg-light field"
							dir={Liferay.Language.direction[editingLanguageId]}
							disabled={readOnly}
							id={`${name}inputFile`}
							lang={editingLanguageId}
							onClick={onSelectButtonClicked}
							value={transformedFileEntryTitle || ''}
						/>
					</ClayInput.GroupItem>

					<ClayInput.GroupItem append shrink>
						<ClayButton
							className="select-button"
							disabled={readOnly}
							displayType="secondary"
							onClick={onSelectButtonClicked}
						>
							<span className="lfr-btn-label">
								{Liferay.Language.get('select')}
							</span>
						</ClayButton>
					</ClayInput.GroupItem>

					{transformedFileEntryTitle && (
						<ClayInput.GroupItem shrink>
							<ClayButton
								aria-label={Liferay.Language.get(
									'unselect-file'
								)}
								displayType="secondary"
								onClick={onClearButtonClicked}
								type="button"
							>
								{Liferay.Language.get('clear')}
							</ClayButton>
						</ClayInput.GroupItem>
					)}
				</ClayInput.Group>
			)}

			<ClayInput
				id={id}
				name={name}
				placeholder={placeholder}
				type="hidden"
				value={getValue(value)}
			/>

			{message && <div className="form-feedback-item">{message}</div>}
		</div>
	);
};

const Main = ({
	editingLanguageId,
	fileEntryTitle,
	fileEntryURL,
	id,
	itemSelectorURL,
	message,
	name,
	onChange,
	placeholder,
	portletNamespace,
	value = '{}',
}) => {
	const [currentValue, setCurrentValue] = useState(value);

	useEffect(() => {
		setCurrentValue(value);
	}, [value]);

	const handleFieldChanged = (selectedItem) => {
		if (selectedItem?.value) {
			setCurrentValue(selectedItem.value);

			onChange(selectedItem, selectedItem.value);
		}
	};

	const handleSelectButtonClicked = ({portletNamespace}) => {
		Liferay.Util.openSelectionModal({
			onSelect: handleFieldChanged,
			selectEventName: `${portletNamespace}selectDocumentLibrary`,
			url: itemSelectorURL,
		});
	};

	return (
		<DocumentLibrary
			editingLanguageId={editingLanguageId}
			fileEntryTitle={fileEntryTitle}
			fileEntryURL={fileEntryURL}
			id={id}
			message={message}
			name={name}
			onClearButtonClicked={(event) => {
				setCurrentValue(null);

				onChange(event, '{}');
			}}
			onSelectButtonClicked={() =>
				handleSelectButtonClicked({
					itemSelectorURL,
					portletNamespace,
				})
			}
			placeholder={placeholder}
			value={currentValue || ''}
		/>
	);
};

export default Main;
