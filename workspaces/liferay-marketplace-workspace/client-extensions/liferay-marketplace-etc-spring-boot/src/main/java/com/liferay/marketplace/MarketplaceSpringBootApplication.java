/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.marketplace;

import com.liferay.client.extension.util.spring.boot.ClientExtensionUtilSpringBootComponentScan;

import com.liferay.client.extension.util.spring.boot.LiferayOAuth2Util;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.oauth2.client.AuthorizedClientServiceOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.core.OAuth2AccessToken;

/**
 * @author Raymond Augé
 * @author Gregory Amerson
 * @author Brian Wing Shun Chan
 */
@Import(ClientExtensionUtilSpringBootComponentScan.class)
@SpringBootApplication
public class MarketplaceSpringBootApplication {

	public static void main(String[] args) {
		SpringApplication.run(MarketplaceSpringBootApplication.class, args);
	}

//	@Bean
//	public OAuth2AccessToken getOAuth2AccessToken(
//			AuthorizedClientServiceOAuth2AuthorizedClientManager
//					authorizedClientServiceOAuth2AuthorizedClientManager) {
//
//		String headlessServerExternalReferenceCode =
//			"liferay-marketplace-etc-spring-boot-oauth-application-headless-" +
//				"server";
//
//		return LiferayOAuth2Util.getOAuth2AccessToken(
//				authorizedClientServiceOAuth2AuthorizedClientManager,
//				headlessServerExternalReferenceCode);
//	}


}