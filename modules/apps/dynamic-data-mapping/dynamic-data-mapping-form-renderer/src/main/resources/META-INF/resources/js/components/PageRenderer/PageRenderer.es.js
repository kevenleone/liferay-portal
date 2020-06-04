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

import * as FormSupport from '../FormRenderer/FormSupport.es';

import './MultiPagesRenderer.soy';

import './PaginatedPageRenderer.soy';

import './SimplePageRenderer.soy';

import './TabbedPageRenderer.soy';

import './WizardPageRenderer.soy';

import 'clay-button';

import 'clay-tooltip';

import 'clay-dropdown';

import templates from './PageRenderer.soy';

import 'clay-modal';
import core from 'metal';
import Component from 'metal-component';
import dom from 'metal-dom';
import Soy from 'metal-soy';
import {Config} from 'metal-state';

import '../SuccessPage/SuccessPagePaginationItem.soy';

import '../SuccessPage/SuccessPageRenderer.soy';

import '../SuccessPage/SuccessPageWizardItem.soy';
import {setValue} from '../../util/i18n.es';

class PageRenderer extends Component {
	getPage(page) {
		const {editingLanguageId} = this;

		if (core.isObject(page.description)) {
			page = {
				...page,
				description: page.description[editingLanguageId],
			};
		}
		if (core.isObject(page.title)) {
			page = {
				...page,
				title: page.title[editingLanguageId],
			};
		}

		return page;
	}

	isEmptyPage({rows}) {
		let empty = false;

		if (!rows || !rows.length) {
			empty = true;
		}
		else {
			empty = !rows.some(({columns}) => {
				let hasFields = true;

				if (!columns) {
					hasFields = false;
				}
				else {
					hasFields = columns.some((column) => column.fields.length);
				}

				return hasFields;
			});
		}

		return empty;
	}

	prepareStateForRender(states) {
		if (states.view === 'fieldSets') {
			this._updateSuccessPage({
				body: '',
				enabled: false,
				title: '',
			});
		}

		return {
			...states,
			empty: this.isEmptyPage(states.page),
			page: this.getPage(states.page),
			pageSettingsItems: this._pageSettingsItems(states.pages),
			pageSuccessSettingsItems: this._pageSuccessSettingsItems(
				states.pages
			),
		};
	}

	_addPage(pageIndex) {
		const {dispatch} = this.context;

		dispatch('pageAdded', {
			pageIndex,
		});
	}

	_addSuccessPage() {
		const {dispatch} = this.context;
		const {pages} = this;

		this._updateSuccessPage({
			body: Liferay.Language.get(
				'your-information-was-successfully-received-thank-you-for-filling-out-the-form'
			),
			enabled: true,
			title: Liferay.Language.get('thank-you'),
		});

		dispatch('activePageUpdated', pages.length);
	}

	_deletePage() {
		const {dispatch} = this.context;

		dispatch('pageDeleted', this.pageIndex);
	}

	_deleteSuccessPage() {
		const {dispatch} = this.context;
		const {pages} = this;

		this._updateSuccessPage({
			enabled: false,
		});

		dispatch('activePageUpdated', pages.length - 1);
	}

	_resetPage(pageIndex) {
		const {dispatch} = this.context;

		dispatch('pageReset', {
			pageIndex,
		});
	}

	_handleAddPageClicked() {
		const {pageIndex} = this;

		this._addPage(pageIndex);
	}

	_handleAddSuccessPageClicked() {
		const {pageIndex} = this;

		this._addSuccessPage(pageIndex);
	}

	_handleDropdownItemClicked({data}) {
		const {pageIndex, successPageSettings} = this;
		const {settingsItem} = data.item;

		this.setState({
			dropdownExpanded: false,
		});

		if (settingsItem === 'reset-page') {
			this._resetPage(pageIndex);
		}
		else if (settingsItem === 'remove-page') {
			if (
				successPageSettings.enabled &&
				pageIndex == this.pages.length - 1
			) {
				this._deleteSuccessPage();
			}
			else {
				this._deletePage();
			}
		}
	}

	_handleFieldBlurred(event) {
		this.emit('fieldBlurred', event);
	}

	_handleFieldClicked(event) {
		const {delegateTarget} = event;
		const {fieldName} = delegateTarget.dataset;

		event.stopPropagation();

		this.emit('fieldClicked', {
			...FormSupport.getIndexes(dom.closest(delegateTarget, '.col-ddm')),
			fieldName,
			originalEvent: event,
		});
	}

	_handleFieldEdited(event) {
		this.emit('fieldEdited', event);
	}

	_handleFieldFocused(event) {
		this.emit('fieldFocused', event);
	}

	_handleMovePageDownClicked() {
		const {pageIndex} = this;
		const {dispatch} = this.context;

		dispatch('pagesSwapped', {
			firstIndex: pageIndex,
			secondIndex: pageIndex + 1,
		});
	}

	_handleMovePageUpClicked() {
		const {pageIndex} = this;
		const {dispatch} = this.context;

		dispatch('pagesSwapped', {
			firstIndex: pageIndex,
			secondIndex: pageIndex - 1,
		});
	}

	_pageSettingsItems(pages) {
		const {successPageSettings} = this;
		const pageSettingsItems = [
			{
				label: Liferay.Language.get('reset-page'),
				settingsItem: 'reset-page',
			},
		];

		if (
			(successPageSettings.enabled && pages.length > 2) ||
			(pages.length > 1 && !successPageSettings.enabled)
		) {
			pageSettingsItems.push({
				label: Liferay.Language.get('remove-page'),
				settingsItem: 'remove-page',
			});
		}

		return pageSettingsItems;
	}

	_pageSuccessSettingsItems() {
		const pageSuccessSettingsItems = [
			{
				label: Liferay.Language.get('remove-success-page'),
				settingsItem: 'remove-page',
			},
		];

		return pageSuccessSettingsItems;
	}

	_updateSuccessPage({body = '', enabled, title = ''}) {
		const {dispatch} = this.context;
		const {editingLanguageId} = this;
		const successPageSettings = {
			body: {},
			enabled,
			title: {},
		};

		setValue(successPageSettings, editingLanguageId, 'body', body);
		setValue(successPageSettings, editingLanguageId, 'title', title);

		dispatch('successPageChanged', successPageSettings);
	}
}

PageRenderer.STATE = {

	/**
	 * @instance
	 * @memberof FormPage
	 * @type {?number}
	 */

	activePage: Config.number().value(0),

	/**
	 * @instance
	 * @memberof FormPage
	 * @type {?number}
	 */

	dropdownExpanded: Config.bool().value(false),

	/**
	 * @instance
	 * @memberof FormPage
	 * @type {?boolean}
	 */
	editable: Config.bool().value(false),

	/**
	 * @default []
	 * @instance
	 * @memberof FormRenderer
	 * @type {?array<object>}
	 */

	page: Config.object(),

	/**
	 * @default 1
	 * @instance
	 * @memberof FormPage
	 * @type {?number}
	 */

	pageIndex: Config.number().value(0),

	/**
	 * @default 1
	 * @instance
	 * @memberof FormPage
	 * @type {?number}
	 */

	pageSettingsItems: Config.array(),

	/**
	 * @default 1
	 * @instance
	 * @memberof FormPage
	 * @type {?number}
	 */

	pageSuccessSettingsItems: Config.array(),

	/**
	 * @default undefined
	 * @instance
	 * @memberof FormRenderer
	 * @type {!string}
	 */

	spritemap: Config.string().required(),

	strings: Config.object().value({
		'add-success-page': Liferay.Language.get('add-success-page'),
		'move-page-down': Liferay.Language.get('move-page-down'),
		'move-page-up': Liferay.Language.get('move-page-up'),
		'new-page': Liferay.Language.get('new-page'),
		'page-options': Liferay.Language.get('page-options'),
		'success-page': Liferay.Language.get('success-page'),
	}),

	successPageSettings: Config.shapeOf({
		body: Config.object(),
		enabled: Config.bool(),
		title: Config.object(),
	}).value({}),
};

Soy.register(PageRenderer, templates);

export default PageRenderer;
