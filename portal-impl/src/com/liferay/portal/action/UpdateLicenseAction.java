/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.portal.action;

import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.license.util.LicenseManagerUtil;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.auth.AuthTokenUtil;
import com.liferay.portal.kernel.servlet.ServletResponseUtil;
import com.liferay.portal.kernel.util.Constants;
import com.liferay.portal.kernel.util.ContentTypes;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.struts.Action;
import com.liferay.portal.struts.model.ActionForward;
import com.liferay.portal.struts.model.ActionMapping;
import com.liferay.portal.util.LicenseUtil;
import com.liferay.portlet.admin.util.OmniadminUtil;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author Amos Fong
 */
public class UpdateLicenseAction implements Action {

	@Override
	public ActionForward execute(
			ActionMapping actionMapping, HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse)
		throws Exception {

		if (Objects.equals(httpServletRequest.getMethod(), "GET")) {
			return actionMapping.getActionForward("portal.license");
		}

		if (_isCSRFTokenValid(httpServletRequest, httpServletResponse) &&
			_isOmniAdmin(httpServletRequest)) {

			LicenseUtil.registerOrder(httpServletRequest);

			String cmd = ParamUtil.getString(httpServletRequest, Constants.CMD);

			String clusterNodeId = ParamUtil.getString(
				httpServletRequest, "clusterNodeId");

			if (cmd.equals("licenseProperties")) {
				httpServletResponse.setContentType(
					ContentTypes.APPLICATION_JSON);

				ServletResponseUtil.write(
					httpServletResponse, _getLicenseProperties(clusterNodeId));

				return null;
			}
			else if (cmd.equals("serverInfo")) {
				httpServletResponse.setContentType(
					ContentTypes.APPLICATION_JSON);

				ServletResponseUtil.write(
					httpServletResponse, _getServerInfo(clusterNodeId));

				return null;
			}

			return actionMapping.getActionForward("portal.license");
		}

		httpServletResponse.sendRedirect(
			PortalUtil.getPathContext() + "/c/portal/layout");

		return null;
	}

	private String _getLicenseProperties(String clusterNodeId) {
		List<Map<String, String>> licenseProperties =
			LicenseManagerUtil.getClusterLicenseProperties(clusterNodeId);

		if (licenseProperties == null) {
			return StringPool.BLANK;
		}

		JSONArray jsonArray = JSONFactoryUtil.createJSONArray();

		for (Map<String, String> propertiesMap : licenseProperties) {
			JSONObject jsonObject = JSONFactoryUtil.createJSONObject();

			for (Map.Entry<String, String> entry : propertiesMap.entrySet()) {
				jsonObject.put(entry.getKey(), entry.getValue());
			}

			jsonArray.put(jsonObject);
		}

		return jsonArray.toString();
	}

	private String _getServerInfo(String clusterNodeId) throws Exception {
		Map<String, String> serverInfo = LicenseUtil.getClusterServerInfo(
			clusterNodeId);

		JSONObject jsonObject = JSONFactoryUtil.createJSONObject();

		if (serverInfo != null) {
			for (Map.Entry<String, String> entry : serverInfo.entrySet()) {
				jsonObject.put(entry.getKey(), entry.getValue());
			}
		}

		return jsonObject.toString();
	}

	private boolean _isCSRFTokenValid(
			HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse)
		throws Exception {

		try {
			AuthTokenUtil.checkCSRFToken(
				httpServletRequest, LicenseUtil.class.getName());

			return true;
		}
		catch (PortalException portalException) {
			_log.error(
				"Invalid authentication token received", portalException);

			PortalUtil.sendError(
				HttpServletResponse.SC_UNAUTHORIZED, portalException,
				httpServletRequest, httpServletResponse);
		}

		return false;
	}

	private boolean _isOmniAdmin(HttpServletRequest httpServletRequest) {
		User user = null;

		try {
			user = PortalUtil.getUser(httpServletRequest);
		}
		catch (Exception exception) {
			if (_log.isDebugEnabled()) {
				_log.debug(exception);
			}
		}

		if ((user != null) && OmniadminUtil.isOmniadmin(user)) {
			return true;
		}

		return false;
	}

	private static final Log _log = LogFactoryUtil.getLog(
		UpdateLicenseAction.class);

}