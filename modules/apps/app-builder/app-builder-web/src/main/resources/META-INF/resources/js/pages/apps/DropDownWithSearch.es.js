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

import ClayDropDown, {Align} from '@clayui/drop-down';
import React, {createContext, useContext, useState} from 'react';

export const DropDownContext = createContext();

const DropDownWithSearch = ({
	children,
	error,
	isEmpty,
	isLoading,
	stateProps: {emptyProps, errorProps, loadingProps},
	trigger,
	visible = true,
	...restProps
}) => {
	const [active, setActive] = useState(false);
	const [query, setQuery] = useState('');

	return (
		<DropDownContext.Provider value={{query, setActive, setQuery}}>
			<ClayDropDown
				{...restProps}
				active={active && visible}
				alignmentPosition={Align.BottomLeft}
				menuElementAttrs={{
					className: 'select-dropdown-menu',
					onClick: (event) => {
						event.stopPropagation();
					},
				}}
				onActiveChange={setActive}
				trigger={trigger}
			>
				{<Search disabled={isEmpty} />}

				{isLoading && <LoadingState {...loadingProps} />}

				{error && (
					<EmptyState
						className="error-state-dropdown-menu"
						{...errorProps}
					/>
				)}

				{!isLoading && !error && isEmpty && (
					<EmptyState
						className="empty-state-dropdown-menu"
						{...emptyProps}
					/>
				)}

				{children}
			</ClayDropDown>
		</DropDownContext.Provider>
	);
};

const EmptyState = ({children, className, label}) => {
	return (
		<div className={className}>
			<label className="font-weight-light text-secondary">{label}</label>

			{children}
		</div>
	);
};

const Items = ({
	emptyResultMessage,
	items = [],
	namePropertyKey = 'name',
	onSelect,
}) => {
	const {query, setActive} = useContext(DropDownContext);
	const treatedQuery = query
		.toLowerCase()
		.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');

	const getTranslatedName = ({
		defaultLanguageId = themeDisplay.getLanguageId(),
		[namePropertyKey]: name,
	}) => {
		return typeof name === 'object'
			? name[themeDisplay.getLanguageId()] || name[defaultLanguageId]
			: name;
	};

	const itemList = items
		.filter((item) =>
			getTranslatedName(item).toLowerCase().match(treatedQuery)
		)
		.map((item) => ({...item, name: getTranslatedName(item)}));

	const onClick = (event, selectedValue) => {
		event.stopPropagation();

		setActive(false);
		onSelect(selectedValue);
	};

	return (
		<ClayDropDown.ItemList>
			{itemList.length > 0
				? itemList.map((item, index) => (
						<ClayDropDown.Item
							key={index}
							onClick={(event) => onClick(event, item)}
						>
							{item.name}
						</ClayDropDown.Item>
				  ))
				: items.length > 0 && (
						<ClayDropDown.Item>
							<span className="font-weight-light text-secondary">
								{emptyResultMessage}
							</span>
						</ClayDropDown.Item>
				  )}
		</ClayDropDown.ItemList>
	);
};

const LoadingState = ({label}) => (
	<div className="loading-state-dropdown-menu">
		<span aria-hidden="true" className="loading-animation" />

		<label className="font-weight-light text-secondary">{label}</label>
	</div>
);

const Search = ({disabled}) => {
	const {query, setQuery} = useContext(DropDownContext);

	return (
		<ClayDropDown.Search
			disabled={disabled}
			formProps={{onSubmit: (e) => e.preventDefault()}}
			onChange={(event) => setQuery(event.target.value)}
			placeholder={Liferay.Language.get('search')}
			value={query}
		/>
	);
};

DropDownWithSearch.Items = Items;

export default DropDownWithSearch;
