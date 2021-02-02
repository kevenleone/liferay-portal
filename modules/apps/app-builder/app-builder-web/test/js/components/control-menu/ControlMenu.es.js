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

import {cleanup, render} from '@testing-library/react';
import {AppContext} from 'data-engine-js-components-web/js/AppContext.es';
import React from 'react';
import {HashRouter} from 'react-router-dom';

import ControlMenu from '../../../../src/main/resources/META-INF/resources/js/components/control-menu/ControlMenu.es';

describe('ControlMenu', () => {
	afterEach(() => {
		cleanup();
		jest.restoreAllMocks();
	});

	it('renders InlineControlMenu for a standalone deployment', () => {
		const context = {
			appDeploymentType: 'standalone',
			controlMenuElementId: 'standalone',
		};

		const props = {
			backURL: '../',
			title: 'title',
		};

		const {baseElement, queryByText} = render(
			<>
				<div id="standalone"></div>
				<HashRouter>
					<AppContext.Provider value={context}>
						<ControlMenu {...props} />
					</AppContext.Provider>
				</HashRouter>
			</>
		);

		const {title} = props;

		expect(queryByText(title)).toBeTruthy();
		expect(document.title).toBe(title);
		expect(
			baseElement.querySelector('.app-builder-control-menu.standalone')
		).toBeTruthy();
	});

	it('renders InlineControlMenu for a widget deployment', () => {
		const context = {
			appDeploymentType: 'widget',
		};

		const props = {
			backURL: 'https://liferay.com/',
			title: 'title',
		};

		const {baseElement, queryByText} = render(
			<HashRouter>
				<AppContext.Provider value={context}>
					<ControlMenu {...props} />
				</AppContext.Provider>
			</HashRouter>
		);

		const {title} = props;

		expect(queryByText(title)).toBeTruthy();
		expect(document.title).toBe(title);
		expect(
			baseElement.querySelector('.app-builder-control-menu.widget')
		).toBeTruthy();
		expect(baseElement.querySelector('a').href).toBe(props.backURL);
	});

	it('renders PortalControlMenu', () => {
		const context = {
			appDeploymentType: 'control-menu',
		};

		const props = {
			backURL: '../../',
			title: 'title',
		};

		const {queryByText} = render(
			<HashRouter>
				<AppContext.Provider value={context}>
					<div className="tools-control-group">
						<div className="control-menu-level-1-heading"></div>
						<div className="sites-control-group">
							<div className="control-menu-nav"></div>
						</div>
					</div>
					<ControlMenu {...props} />
				</AppContext.Provider>
			</HashRouter>
		);

		expect(queryByText(props.title)).toBeTruthy();
	});
});
