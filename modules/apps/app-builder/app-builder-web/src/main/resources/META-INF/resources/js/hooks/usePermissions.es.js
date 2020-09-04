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

import React, {useContext} from 'react';

import {
	ACTIONS,
	PermissionsContext,
} from '../pages/entry/PermissionsContext.es';

export default function usePermissions() {
	const actionIds = useContext(PermissionsContext);

	return {
		add: actionIds.includes(ACTIONS.ADD_DATA_RECORD),
		delete: actionIds.includes(ACTIONS.DELETE_DATA_RECORD),
		update: actionIds.includes(ACTIONS.UPDATE_DATA_RECORD),
		view: actionIds.includes(ACTIONS.VIEW_DATA_RECORD),
	};
}

export function withPermissions(Component, permissions) {
	return (props) => {
		const userPermissions = usePermissions();

		const hasPermissions = permissions.every(
			(permission) => userPermissions?.[permission]
		);

		return hasPermissions ? (
			<Component {...props} permissions={userPermissions} />
		) : (
			<span>User have not permissions to view entries</span>
		);
	};
}
