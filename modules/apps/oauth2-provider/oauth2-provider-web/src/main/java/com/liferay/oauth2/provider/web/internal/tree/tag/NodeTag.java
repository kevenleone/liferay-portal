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

package com.liferay.oauth2.provider.web.internal.tree.tag;

import java.io.IOException;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.JspTag;
import javax.servlet.jsp.tagext.SimpleTagSupport;

/**
 * @author Carlos Sierra Andrés
 */
public class NodeTag extends SimpleTagSupport {

	@Override
	public void doTag() throws IOException, JspException {
		JspTag jspTag = findAncestorWithClass(this, TreeTag.class);

		if (jspTag instanceof TreeTag) {
			TreeTag treeTag = (TreeTag)jspTag;

			treeTag.setNodeJspFragment(getJspBody());
		}
		else {
			throw new IllegalStateException(
				"Node must be used inside a tree tag");
		}
	}

}