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

package com.liferay.portal.search.elasticsearch7.internal.connection;

import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.search.elasticsearch7.configuration.RESTClientLoggerLevel;
import com.liferay.portal.search.elasticsearch7.internal.util.SearchLogHelper;
import com.liferay.portal.search.elasticsearch7.internal.util.SearchLogHelperImpl;
import com.liferay.portal.search.elasticsearch7.internal.util.SearchLogHelperUtil;

import java.util.Map;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

/**
 * @author Adam Brandizzi
 */
public class EmbeddedElasticsearchConnectionLogTest {

	@Before
	public void setUp() {
		MockitoAnnotations.initMocks(this);

		_searchLogHelper = Mockito.spy(new SearchLogHelperImpl());

		SearchLogHelperUtil.setSearchLogHelper(_searchLogHelper);
	}

	@After
	public void tearDown() {
		_elasticsearchConnectionFixture.destroyNode();
	}

	@Test
	public void testLogLevel() throws Exception {
		ElasticsearchConnection elasticsearchConnection =
			createElasticsearchConnectionWithLogLevel(
				RESTClientLoggerLevel.DEBUG);

		elasticsearchConnection.getRestHighLevelClient();

		Mockito.verify(
			_searchLogHelper
		).setRESTClientLoggerLevel(
			RESTClientLoggerLevel.DEBUG
		);
	}

	protected ElasticsearchConnectionFixture
		createElasticsearchConectionFixtureWithLogLevel(
			RESTClientLoggerLevel restClientLoggerLevel) {

		Map<String, Object> properties = HashMapBuilder.<String, Object>put(
			"clusterName", RandomTestUtil.randomString()
		).put(
			"networkHost", "_site_"
		).put(
			"restClientLoggerLevel", restClientLoggerLevel
		).build();

		ElasticsearchConnectionFixture elasticsearchConnectionFixture =
			ElasticsearchConnectionFixture.builder(
			).clusterName(
				EmbeddedElasticsearchConnectionLogTest.class.getSimpleName()
			).elasticsearchConfigurationProperties(
				properties
			).build();

		elasticsearchConnectionFixture.createNode();

		return elasticsearchConnectionFixture;
	}

	protected ElasticsearchConnection createElasticsearchConnectionWithLogLevel(
		RESTClientLoggerLevel restClientLoggerLevel) {

		_elasticsearchConnectionFixture =
			createElasticsearchConectionFixtureWithLogLevel(
				restClientLoggerLevel);

		return _elasticsearchConnectionFixture.createElasticsearchConnection();
	}

	private ElasticsearchConnectionFixture _elasticsearchConnectionFixture;
	private SearchLogHelper _searchLogHelper;

}