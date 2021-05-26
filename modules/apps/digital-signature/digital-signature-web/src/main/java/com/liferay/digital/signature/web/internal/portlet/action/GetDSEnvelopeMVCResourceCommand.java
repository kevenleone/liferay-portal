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

package com.liferay.digital.signature.web.internal.portlet.action;

import com.liferay.digital.signature.constants.DigitalSignaturePortletKeys;
import com.liferay.digital.signature.manager.DSEnvelopeManager;
import com.liferay.digital.signature.model.DSEnvelope;
import com.liferay.document.library.kernel.service.DLAppLocalService;
import com.liferay.document.library.kernel.util.PDFProcessorUtil;
import com.liferay.document.library.util.DLURLHelperUtil;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.portlet.JSONPortletResponseUtil;
import com.liferay.portal.kernel.portlet.bridges.mvc.BaseMVCResourceCommand;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCResourceCommand;
import com.liferay.portal.kernel.repository.model.FileEntry;
import com.liferay.portal.kernel.repository.model.FileVersion;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.WebKeys;

import javax.portlet.ResourceRequest;
import javax.portlet.ResourceResponse;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Keven Leone
 */
@Component(
	immediate = true,
	property = {
		"javax.portlet.name=" + DigitalSignaturePortletKeys.DIGITAL_SIGNATURE,
		"mvc.command.name=/digital_signature/get_ds_envelope"
	},
	service = MVCResourceCommand.class
)
public class GetDSEnvelopeMVCResourceCommand extends BaseMVCResourceCommand {

	@Override
	protected void doServeResource(
			ResourceRequest resourceRequest, ResourceResponse resourceResponse)
		throws Exception {

		String envelopeId = ParamUtil.getString(resourceRequest, "envelopeId");

		ThemeDisplay themeDisplay = (ThemeDisplay)resourceRequest.getAttribute(
			WebKeys.THEME_DISPLAY);

		JSONObject responseObject = JSONUtil.put("envelopeId", envelopeId);

		try {
			DSEnvelope dsEnvelope = _dsEnvelopeManager.getDSEnvelope(
				themeDisplay.getCompanyId(), themeDisplay.getCompanyGroupId(), envelopeId);

			JSONObject jsonObject = _dsEnvelopeManager.toJSONObject(dsEnvelope);

			responseObject.put("envelope", jsonObject);

			System.out.println("Found Envelope: " + jsonObject.toString());
		}
		catch (Exception e) {
			System.out.println("Envelope not found");
		}

		JSONObject fileEntryDetails = this._getFileEntryDetails(themeDisplay);

		responseObject.put("fileEntryDetails", fileEntryDetails);

		JSONPortletResponseUtil.writeJSON(
			resourceRequest, resourceResponse, responseObject);
	}

	private JSONObject _getFileEntryDetails(ThemeDisplay themeDisplay)
		throws PortalException {

		long fileEntryId = 39970;

		FileEntry fileEntry = _dlAppLocalService.getFileEntry(fileEntryId);

		FileVersion fileVersion = fileEntry.getFileVersion();

		String previewFileURL = DLURLHelperUtil.getPreviewURL(
			fileEntry, fileVersion, themeDisplay, "&previewFileIndex=");

		int previewFileCount = PDFProcessorUtil.getPreviewFileCount(
			fileVersion);

		return JSONUtil.put(
			"initialPage", 1
		).put(
			"previewFileCount", previewFileCount
		).put(
			"previewFileURL", previewFileURL
		);
	}

	@Reference
	private DLAppLocalService _dlAppLocalService;

	@Reference
	private DSEnvelopeManager _dsEnvelopeManager;

}