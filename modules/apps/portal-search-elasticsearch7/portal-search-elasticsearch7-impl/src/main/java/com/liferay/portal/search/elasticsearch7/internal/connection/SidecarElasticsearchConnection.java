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

import com.liferay.petra.string.CharPool;
import com.liferay.portal.search.elasticsearch7.configuration.RESTClientLoggerLevel;
import com.liferay.portal.search.elasticsearch7.internal.sidecar.Sidecar;
import com.liferay.portal.search.elasticsearch7.internal.util.SearchLogHelperUtil;

import org.elasticsearch.client.RestHighLevelClient;

/**
 * @author Tina Tian
 */
public class SidecarElasticsearchConnection
	extends BaseElasticsearchConnection {

	public SidecarElasticsearchConnection(
		RESTClientLoggerLevel restClientLoggerLevel, Sidecar sidecar) {

		_restClientLogLevel = restClientLoggerLevel;
		_sidecar = sidecar;
	}

	@Override
	public void close() {
		super.close();

		_sidecar.stop();
	}

	@Override
	public void connect() {
		_sidecar.start();

		super.connect();
	}

	@Override
	public String getConnectionId() {
		return String.valueOf(OperationMode.EMBEDDED);
	}

	@Override
	public OperationMode getOperationMode() {
		return OperationMode.EMBEDDED;
	}

	@Override
	public boolean isActive() {
		return true;
	}

	@Override
	protected RestHighLevelClient createRestHighLevelClient() {
		SearchLogHelperUtil.setRESTClientLoggerLevel(_restClientLogLevel);

		return RestHighLevelClientFactory.builder(
		).hostName(
			"localhost"
		).portRange(
			getHttpPort(_sidecar.getNetworkHostAddress())
		).scheme(
			"http"
		).build(
		).getRestHighLevelClientOptional(
		).get();
	}

	protected String getHttpPort(String address) {
		return address.substring(address.indexOf(CharPool.COLON) + 1);
	}

	private final RESTClientLoggerLevel _restClientLogLevel;
	private final Sidecar _sidecar;

}