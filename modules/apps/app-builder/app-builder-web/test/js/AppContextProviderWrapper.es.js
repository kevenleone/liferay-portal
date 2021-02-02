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

import {AppContextProvider} from 'data-engine-js-components-web/js/AppContext.es';
import {createMemoryHistory} from 'history';
import React from 'react';
import {HashRouter} from 'react-router-dom';

export default ({
	children,
	appContext = {},
	history = createMemoryHistory(),
}) => {
	return (
		<AppContextProvider {...appContext}>
			<div className="tools-control-group">
				<div className="control-menu-level-1-heading" />
			</div>

			<HashRouter>{React.cloneElement(children, {history})}</HashRouter>
		</AppContextProvider>
	);
};
