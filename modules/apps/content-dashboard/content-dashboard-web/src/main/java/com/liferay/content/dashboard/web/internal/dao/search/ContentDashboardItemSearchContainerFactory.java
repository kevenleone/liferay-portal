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

package com.liferay.content.dashboard.web.internal.dao.search;

import com.liferay.content.dashboard.web.internal.item.ContentDashboardItem;
import com.liferay.content.dashboard.web.internal.item.ContentDashboardItemFactory;
import com.liferay.content.dashboard.web.internal.item.ContentDashboardItemFactoryTracker;
import com.liferay.content.dashboard.web.internal.search.ContentDashboardSearcher;
import com.liferay.portal.kernel.dao.search.SearchContainer;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.portlet.PortletURLUtil;
import com.liferay.portal.kernel.search.Field;
import com.liferay.portal.kernel.search.Hits;
import com.liferay.portal.kernel.search.Indexer;
import com.liferay.portal.kernel.search.SearchContext;
import com.liferay.portal.kernel.search.SearchContextFactory;
import com.liferay.portal.kernel.search.SearchResult;
import com.liferay.portal.kernel.search.SearchResultUtil;
import com.liferay.portal.kernel.search.Sort;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.portal.kernel.workflow.WorkflowConstants;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.portlet.PortletException;
import javax.portlet.PortletURL;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

/**
 * @author Cristina González
 */
public class ContentDashboardItemSearchContainerFactory {

	public static ContentDashboardItemSearchContainerFactory getInstance(
		ContentDashboardItemFactoryTracker contentDashboardItemFactoryTracker,
		Portal portal, RenderRequest renderRequest,
		RenderResponse renderResponse) {

		return new ContentDashboardItemSearchContainerFactory(
			contentDashboardItemFactoryTracker, portal, renderRequest,
			renderResponse);
	}

	public SearchContainer<ContentDashboardItem<?>> create()
		throws PortletException {

		PortletURL portletURL = PortletURLUtil.clone(
			_renderResponse.createRenderURL(), _renderResponse);

		SearchContainer<ContentDashboardItem<?>> searchContainer =
			new SearchContainer<>(
				_renderRequest, portletURL, null, "there-is-no-content");

		String orderByCol = ParamUtil.getString(
			_renderRequest, "orderByCol", "title");

		searchContainer.setOrderByCol(orderByCol);

		String orderByType = ParamUtil.getString(
			_renderRequest, "orderByType", "asc");

		searchContainer.setOrderByType(orderByType);

		Hits hits = _getHits(
			orderByCol, orderByType, _portal.getLocale(_renderRequest),
			searchContainer.getEnd(), searchContainer.getStart());

		searchContainer.setResults(
			_getContentDashboardItems(hits, _portal.getLocale(_renderRequest)));
		searchContainer.setTotal(hits.getLength());

		return searchContainer;
	}

	private ContentDashboardItemSearchContainerFactory(
		ContentDashboardItemFactoryTracker contentDashboardItemFactoryTracker,
		Portal portal, RenderRequest renderRequest,
		RenderResponse renderResponse) {

		_contentDashboardItemFactoryTracker =
			contentDashboardItemFactoryTracker;
		_portal = portal;
		_renderRequest = renderRequest;
		_renderResponse = renderResponse;
	}

	private List<ContentDashboardItem<?>> _getContentDashboardItems(
		Hits hits, Locale locale) {

		List<SearchResult> searchResults = SearchResultUtil.getSearchResults(
			hits, locale);

		Stream<SearchResult> stream = searchResults.stream();

		return stream.map(
			this::_toContentDashboardItemOptional
		).filter(
			optional -> optional.isPresent()
		).map(
			Optional::get
		).collect(
			Collectors.toList()
		);
	}

	private Hits _getHits(
			String orderByCol, String orderByType, Locale locale, int end,
			int start)
		throws PortletException {

		Indexer<?> indexer = ContentDashboardSearcher.getInstance(
			_contentDashboardItemFactoryTracker.getClassNames());

		SearchContext searchContext = SearchContextFactory.getInstance(
			_portal.getHttpServletRequest(_renderRequest));

		searchContext.setAttribute("latest", Boolean.TRUE);
		searchContext.setAttribute("status", WorkflowConstants.STATUS_ANY);
		searchContext.setEnd(end);
		searchContext.setGroupIds(null);
		searchContext.setKeywords(
			ParamUtil.getString(_renderRequest, "keywords"));
		searchContext.setSorts(_getSort(orderByCol, orderByType, locale));
		searchContext.setStart(start);

		try {
			return indexer.search(searchContext);
		}
		catch (PortalException portalException) {
			throw new PortletException(portalException);
		}
	}

	private Sort _getSort(
		String orderByCol, String orderByType, Locale locale) {

		boolean orderByAsc = false;

		if (orderByType.equals("asc")) {
			orderByAsc = true;
		}

		if (orderByCol.equals("title")) {
			String sortFieldName = Field.getSortableFieldName(
				"localized_title_".concat(LocaleUtil.toLanguageId(locale)));

			return new Sort(sortFieldName, Sort.STRING_TYPE, !orderByAsc);
		}

		return new Sort(Field.MODIFIED_DATE, Sort.LONG_TYPE, !orderByAsc);
	}

	private Optional<ContentDashboardItem<?>> _toContentDashboardItemOptional(
		ContentDashboardItemFactory<?> contentDashboardItemFactory,
		SearchResult searchResult) {

		try {
			return Optional.of(
				contentDashboardItemFactory.create(searchResult.getClassPK()));
		}
		catch (PortalException portalException) {
			_log.error(portalException, portalException);

			return Optional.empty();
		}
	}

	private Optional<ContentDashboardItem<?>> _toContentDashboardItemOptional(
		SearchResult searchResult) {

		Optional<ContentDashboardItemFactory<?>>
			contentDashboardItemFactoryOptional =
				_contentDashboardItemFactoryTracker.
					getContentDashboardItemFactoryOptional(
						searchResult.getClassName());

		return contentDashboardItemFactoryOptional.map(
			contentDashboardItemFactory -> _toContentDashboardItemOptional(
				contentDashboardItemFactory, searchResult)
		).orElse(
			Optional.empty()
		);
	}

	private static final Log _log = LogFactoryUtil.getLog(
		ContentDashboardItemSearchContainerFactory.class);

	private final ContentDashboardItemFactoryTracker
		_contentDashboardItemFactoryTracker;
	private final Portal _portal;
	private final RenderRequest _renderRequest;
	private final RenderResponse _renderResponse;

}