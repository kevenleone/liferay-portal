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

package com.liferay.portal.search.elasticsearch7.internal.sidecar;

import com.liferay.petra.process.ProcessExecutor;
import com.liferay.portal.search.elasticsearch7.configuration.ElasticsearchConfiguration;
import com.liferay.portal.search.elasticsearch7.internal.cluster.ClusterSettingsContext;
import com.liferay.portal.search.elasticsearch7.internal.connection.ElasticsearchInstancePaths;
import com.liferay.portal.search.elasticsearch7.settings.SettingsContributor;

import java.util.Collection;
import java.util.Collections;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

/**
 * @author Adam Brandizzi
 */
public class SidecarTest {

	@Before
	public void setUp() {
		MockitoAnnotations.initMocks(this);
	}

	@Test
	public void testEmbeddedHttpPort() {
		mockEmbeddedHttpPort(4400);

		Sidecar sidecar = createSidecarWithHttpPort(null);

		Assert.assertEquals("4400-4400", sidecar.getHttpPort());
	}

	@Test
	public void testHasDefaultHttpPort() {
		Sidecar sidecar = createSidecarWithHttpPort(null);

		Assert.assertNotNull(sidecar.getHttpPort());
	}

	@Test
	public void testHttpPortParameter() {
		Sidecar sidecar = createSidecarWithHttpPort("2000-2099");

		Assert.assertEquals("2000-2099", sidecar.getHttpPort());
	}

	@Test
	public void testHttpPortParameterHasPrecedenceOverSidecarHttpPort() {
		mockSidecarHttpPort("3100-3199");

		Sidecar sidecar = createSidecarWithHttpPort("2000-2099");

		Assert.assertEquals("2000-2099", sidecar.getHttpPort());
	}

	@Test
	public void testSidecarHttpPort() {
		mockSidecarHttpPort("3100-3199");

		Sidecar sidecar = createSidecarWithHttpPort(null);

		Assert.assertEquals("3100-3199", sidecar.getHttpPort());
	}

	@Test
	public void testSidecarHttpPortHasPrecedenceOverEmbeddedHttpPort() {
		mockEmbeddedHttpPort(4400);
		mockSidecarHttpPort("3100-3199");

		Sidecar sidecar = createSidecarWithHttpPort(null);

		Assert.assertEquals("3100-3199", sidecar.getHttpPort());
	}

	protected Sidecar createSidecarWithHttpPort(String httpPort) {
		return new Sidecar(
			clusterSettingsContext, elasticsearchConfiguration,
			elasticsearchInstancePaths, httpPort, processExecutor,
			processExecutorPaths, settingsContributors);
	}

	protected void mockEmbeddedHttpPort(int embeddedHttpPort) {
		Mockito.when(
			elasticsearchConfiguration.embeddedHttpPort()
		).thenReturn(
			embeddedHttpPort
		);
	}

	protected void mockSidecarHttpPort(String sidecarHttpPort) {
		Mockito.when(
			elasticsearchConfiguration.sidecarHttpPort()
		).thenReturn(
			sidecarHttpPort
		);
	}

	@Mock
	protected ClusterSettingsContext clusterSettingsContext;

	@Mock
	protected ElasticsearchConfiguration elasticsearchConfiguration;

	@Mock
	protected ElasticsearchInstancePaths elasticsearchInstancePaths;

	@Mock
	protected ProcessExecutor processExecutor;

	@Mock
	protected ProcessExecutorPaths processExecutorPaths;

	protected Collection<SettingsContributor> settingsContributors =
		Collections.emptyList();

}