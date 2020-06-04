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

package com.liferay.content.dashboard.web.internal.item;

import com.liferay.dynamic.data.mapping.model.DDMStructure;
import com.liferay.journal.model.JournalArticle;
import com.liferay.portal.kernel.workflow.WorkflowConstants;

import java.util.Date;
import java.util.Locale;

/**
 * @author Cristina González
 */
public class JournalArticleContentDashboardItem
	implements ContentDashboardItem<JournalArticle> {

	public JournalArticleContentDashboardItem(JournalArticle journalArticle) {
		_journalArticle = journalArticle;
	}

	@Override
	public Date getExpirationDate() {
		return _journalArticle.getExpirationDate();
	}

	@Override
	public Date getModifiedDate() {
		return _journalArticle.getModifiedDate();
	}

	@Override
	public Date getPublishDate() {
		return _journalArticle.getDisplayDate();
	}

	@Override
	public String getStatusLabel(Locale locale) {
		return WorkflowConstants.getStatusLabel(_journalArticle.getStatus());
	}

	@Override
	public String getStatusStyle() {
		return WorkflowConstants.getStatusStyle(_journalArticle.getStatus());
	}

	@Override
	public String getTitle(Locale locale) {
		return _journalArticle.getTitle(locale);
	}

	@Override
	public String getType(Locale locale) {
		DDMStructure ddmStructure = _journalArticle.getDDMStructure();

		return ddmStructure.getName(locale);
	}

	@Override
	public long getUserId() {
		return _journalArticle.getUserId();
	}

	@Override
	public String getUserName() {
		return _journalArticle.getUserName();
	}

	private final JournalArticle _journalArticle;

}