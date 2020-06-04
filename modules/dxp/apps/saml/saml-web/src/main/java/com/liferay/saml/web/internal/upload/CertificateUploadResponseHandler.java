/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 *
 *
 *
 */

package com.liferay.saml.web.internal.upload;

import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.language.LanguageUtil;
import com.liferay.portal.kernel.repository.model.FileEntry;
import com.liferay.portal.kernel.security.auth.PrincipalException;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.upload.UploadPortletRequest;
import com.liferay.portal.kernel.util.ResourceBundleUtil;
import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.upload.UploadResponseHandler;

import java.security.KeyStoreException;
import java.security.cert.CertificateException;

import java.util.ResourceBundle;

import javax.portlet.PortletRequest;

import org.osgi.service.component.annotations.Component;

/**
 * @author Stian Sigvartsen
 */
@Component(immediate = true, service = CertificateUploadResponseHandler.class)
public class CertificateUploadResponseHandler implements UploadResponseHandler {

	@Override
	public JSONObject onFailure(
			PortletRequest portletRequest, PortalException portalException)
		throws PortalException {

		ThemeDisplay themeDisplay = (ThemeDisplay)portletRequest.getAttribute(
			WebKeys.THEME_DISPLAY);

		ResourceBundle resourceBundle = ResourceBundleUtil.getBundle(
			"content.Language", themeDisplay.getLocale(), getClass());

		String errorMessage = StringPool.BLANK;

		if (portalException instanceof PrincipalException) {
			errorMessage = LanguageUtil.format(
				resourceBundle, "you-must-be-an-admin-to-complete-this-action",
				null);
		}
		else if (portalException.getCause() instanceof CertificateException) {
			errorMessage = LanguageUtil.format(
				resourceBundle,
				"there-was-a-problem-reading-one-or-more-certificates-in-the-" +
					"keystore",
				null);
		}
		else if (portalException.getCause() instanceof KeyStoreException) {
			errorMessage = LanguageUtil.format(
				resourceBundle, "the-file-is-not-a-pkcs12-formatted-keystore",
				null);
		}
		else {
			errorMessage = LanguageUtil.format(
				resourceBundle, "an-unexpected-error-occurred", null);
		}

		JSONObject exceptionMessagesJSONObject = JSONUtil.put(
			"message", errorMessage);

		return exceptionMessagesJSONObject.put("status", 499);
	}

	@Override
	public JSONObject onSuccess(
			UploadPortletRequest uploadPortletRequest, FileEntry fileEntry)
		throws PortalException {

		String fileName = uploadPortletRequest.getFileName("file");

		return JSONUtil.put(
			"groupId", fileEntry.getGroupId()
		).put(
			"name", fileEntry.getTitle()
		).put(
			"title", fileName
		).put(
			"uuid", fileEntry.getUuid()
		);
	}

}