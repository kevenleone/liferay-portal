/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.oauth2.provider.service.test;

import com.liferay.arquillian.extension.junit.bridge.junit.Arquillian;
import com.liferay.oauth2.provider.constants.GrantType;
import com.liferay.oauth2.provider.constants.OAuth2ApplicationConstants;
import com.liferay.oauth2.provider.exception.DuplicateOAuth2ApplicationExternalReferenceCodeException;
import com.liferay.oauth2.provider.model.OAuth2Application;
import com.liferay.oauth2.provider.service.OAuth2ApplicationLocalService;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.test.rule.AggregateTestRule;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.kernel.test.util.TestPropsValues;
import com.liferay.portal.test.rule.Inject;
import com.liferay.portal.test.rule.LiferayIntegrationTestRule;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * @author Keven Leone
 */
@RunWith(Arquillian.class)
public class OAuth2ApplicationLocalServiceExternalReferenceCodeTest {

	@ClassRule
	@Rule
	public static final AggregateTestRule aggregateTestRule =
		new LiferayIntegrationTestRule();

	@Before
	public void setUp() throws Exception {
		_user = TestPropsValues.getUser();

		_oAuth2Applications = new ArrayList<>();
	}

	@After
	public void tearDown() throws Exception {
		for (OAuth2Application oAuth2Application : _oAuth2Applications) {
			_oAuth2ApplicationLocalService.deleteOAuth2Application(
				oAuth2Application.getOAuth2ApplicationId());
		}
	}

	@Test
	public void testFetchOAuth2ApplicationByExternalReferenceCode()
		throws Exception {

		OAuth2Application oAuth2Application = _addOAuth2Application();

		String externalReferenceCode = RandomTestUtil.randomString();

		_oAuth2ApplicationLocalService.updateExternalReferenceCode(
			oAuth2Application.getOAuth2ApplicationId(), externalReferenceCode);

		OAuth2Application fetchedOAuth2Application =
			_oAuth2ApplicationLocalService.
				fetchOAuth2ApplicationByExternalReferenceCode(
					externalReferenceCode, _user.getCompanyId());

		Assert.assertNotNull(fetchedOAuth2Application);
		Assert.assertEquals(
			oAuth2Application.getOAuth2ApplicationId(),
			fetchedOAuth2Application.getOAuth2ApplicationId());
	}

	@Test
	public void testFetchOAuth2ApplicationByExternalReferenceCodeReturnsNullForNonexistent()
		throws Exception {

		OAuth2Application oAuth2Application =
			_oAuth2ApplicationLocalService.
				fetchOAuth2ApplicationByExternalReferenceCode(
					"nonexistent-erc-" + RandomTestUtil.randomString(),
					_user.getCompanyId());

		Assert.assertNull(oAuth2Application);
	}

	@Test
	public void testUpdateExternalReferenceCode() throws Exception {
		OAuth2Application oAuth2Application = _addOAuth2Application();

		String externalReferenceCode = RandomTestUtil.randomString();

		Assert.assertNotEquals(
			externalReferenceCode,
			oAuth2Application.getExternalReferenceCode());

		oAuth2Application =
			_oAuth2ApplicationLocalService.updateExternalReferenceCode(
				oAuth2Application.getOAuth2ApplicationId(),
				externalReferenceCode);

		Assert.assertEquals(
			externalReferenceCode,
			oAuth2Application.getExternalReferenceCode());
	}

	@Test(
		expected = DuplicateOAuth2ApplicationExternalReferenceCodeException.class
	)
	public void testUpdateExternalReferenceCodeDuplicate() throws Exception {
		OAuth2Application oAuth2Application1 = _addOAuth2Application();
		OAuth2Application oAuth2Application2 = _addOAuth2Application();

		String externalReferenceCode = RandomTestUtil.randomString();

		_oAuth2ApplicationLocalService.updateExternalReferenceCode(
			oAuth2Application1.getOAuth2ApplicationId(), externalReferenceCode);

		_oAuth2ApplicationLocalService.updateExternalReferenceCode(
			oAuth2Application2.getOAuth2ApplicationId(), externalReferenceCode);
	}

	@Test
	public void testUpdateExternalReferenceCodeToBlank() throws Exception {
		OAuth2Application oAuth2Application = _addOAuth2Application();

		String externalReferenceCode = RandomTestUtil.randomString();

		_oAuth2ApplicationLocalService.updateExternalReferenceCode(
			oAuth2Application.getOAuth2ApplicationId(), externalReferenceCode);

		oAuth2Application =
			_oAuth2ApplicationLocalService.updateExternalReferenceCode(
				oAuth2Application.getOAuth2ApplicationId(), "");

		Assert.assertEquals("", oAuth2Application.getExternalReferenceCode());
	}

	@Test
	public void testUpdateExternalReferenceCodeWithSameValue()
		throws Exception {

		OAuth2Application oAuth2Application = _addOAuth2Application();

		String externalReferenceCode = RandomTestUtil.randomString();

		oAuth2Application =
			_oAuth2ApplicationLocalService.updateExternalReferenceCode(
				oAuth2Application.getOAuth2ApplicationId(),
				externalReferenceCode);

		OAuth2Application updatedOAuth2Application =
			_oAuth2ApplicationLocalService.updateExternalReferenceCode(
				oAuth2Application.getOAuth2ApplicationId(),
				externalReferenceCode);

		Assert.assertEquals(
			externalReferenceCode,
			updatedOAuth2Application.getExternalReferenceCode());
	}

	private OAuth2Application _addOAuth2Application() throws Exception {
		OAuth2Application oAuth2Application =
			_oAuth2ApplicationLocalService.addOAuth2Application(
				_user.getCompanyId(), _user.getUserId(), _user.getFullName(),
				Arrays.asList(GrantType.CLIENT_CREDENTIALS),
				OAuth2ApplicationConstants.APPLICATION_TYPE_USER,
				"client_secret_post", _user.getUserId(),
				RandomTestUtil.randomString(), 0, RandomTestUtil.randomString(),
				"", Collections.emptyList(), "http://localhost:8080", 0, "",
				RandomTestUtil.randomString(), "", Collections.emptyList(),
				false, Collections.emptyList(), false, new ServiceContext());

		_oAuth2Applications.add(oAuth2Application);

		return oAuth2Application;
	}

	@Inject
	private OAuth2ApplicationLocalService _oAuth2ApplicationLocalService;

	private ArrayList<OAuth2Application> _oAuth2Applications;
	private User _user;

}