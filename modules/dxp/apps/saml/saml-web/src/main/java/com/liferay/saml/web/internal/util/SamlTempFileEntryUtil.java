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

package com.liferay.saml.web.internal.util;

import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.GroupConstants;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.repository.model.FileEntry;
import com.liferay.portal.kernel.service.GroupLocalServiceUtil;
import com.liferay.portal.kernel.util.TempFileEntryUtil;

import java.io.InputStream;

/**
 * @author Stian Sigvartsen
 */
public class SamlTempFileEntryUtil {

	public static final String TEMP_FOLDER_NAME =
		SamlTempFileEntryUtil.class.getName();

	public static final String TEMP_RANDOM_SUFFIX =
		TempFileEntryUtil.TEMP_RANDOM_SUFFIX;

	public static FileEntry addTempFileEntry(
			User user, String sourceFileName, InputStream inputStream,
			String contentType)
		throws PortalException {

		Group group = GroupLocalServiceUtil.fetchGroup(
			user.getCompanyId(), GroupConstants.CONTROL_PANEL);

		return TempFileEntryUtil.addTempFileEntry(
			group.getGroupId(), user.getUserId(),
			TEMP_FOLDER_NAME + "-" + user.getCompanyId(),
			TempFileEntryUtil.getTempFileName(sourceFileName), inputStream,
			contentType);
	}

	public static void deleteTempFileEntry(User user, String tempFileName)
		throws PortalException {

		Group group = GroupLocalServiceUtil.fetchGroup(
			user.getCompanyId(), GroupConstants.CONTROL_PANEL);

		TempFileEntryUtil.deleteTempFileEntry(
			group.getGroupId(), user.getUserId(),
			TEMP_FOLDER_NAME + "-" + user.getCompanyId(), tempFileName);
	}

	public static FileEntry getTempFileEntry(User user, String tempFileName)
		throws PortalException {

		Group group = GroupLocalServiceUtil.fetchGroup(
			user.getCompanyId(), GroupConstants.CONTROL_PANEL);

		return TempFileEntryUtil.getTempFileEntry(
			group.getGroupId(), user.getUserId(),
			TEMP_FOLDER_NAME + "-" + user.getCompanyId(), tempFileName);
	}

}