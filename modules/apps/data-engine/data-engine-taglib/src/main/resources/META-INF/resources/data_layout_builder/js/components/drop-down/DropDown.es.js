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

import {ClayButtonWithIcon} from '@clayui/button';
import ClayDropDown, {Align} from '@clayui/drop-down';
import ClayPopover from '@clayui/popover';
import React, {useState} from 'react';

const {Item, ItemList} = ClayDropDown;

export default ({actions, disabled}) => {
	const [active, setActive] = useState(false);
	const [showPopover, setShowPopover] = useState(false);

	const DropdownButton = (
		<ClayButtonWithIcon
		className="page-link"
			disabled={disabled}
			displayType="unstyled"
			spritemap
			symbol="ellipsis-v"
		/>
	);

	if (actions.length === 0) {
		return DropdownButton;
	}

	const onSelectItem = (event, action) => {
		event.preventDefault();

		if (typeof action.action === 'function') {
			action.action();
		}

		setActive(false);
	};

	const togglePopopover = (event, show) => {
		event.stopPropagation();
		event.persist();
		setShowPopover(show);
	};

	return (
		<ClayDropDown
			active={active}
			alignmentPosition={Align.RightCenter}
			className="dropdown-action"
			onActiveChange={(item) => setActive(item)}
			trigger={DropdownButton}
		>
			<ItemList>
				{actions.map((action, index) => {
					const Action = () => (
						<Item
							key={index}
							onClick={(event) => onSelectItem(event, action)}
						>
							{action.name}
						</Item>
					);

					if (action.popover) {
						const {alignPosition, body, header} = action.popover;

						return (
							<ClayPopover
								alignPosition={alignPosition}
								header={header}
								show={showPopover}
								trigger={
									<div
										onMouseOut={(e) =>
											togglePopopover(e, false)
										}
										onMouseOver={(e) =>
											togglePopopover(e, true)
										}
									>
										<Action />
									</div>
								}
							>
								{body}
							</ClayPopover>
						);
					}

					return <Action key={index} />;
				})}
			</ItemList>
		</ClayDropDown>
	);
};
