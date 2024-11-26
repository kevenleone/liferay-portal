/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.headless.marketplace.admin.api.internal.resource.v1_0;

import com.liferay.headless.marketplace.admin.api.resource.v1_0.MarketplaceResource;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ServiceScope;

/**
 * @author Keven Leone
 */
@Component(
	properties = "OSGI-INF/liferay/rest/v1_0/marketplace.properties",
	scope = ServiceScope.PROTOTYPE, service = MarketplaceResource.class
)
public class MarketplaceResourceImpl extends BaseMarketplaceResourceImpl {

	@Override
	public void postConnect() {
		System.out.println("Hi");
	}

}