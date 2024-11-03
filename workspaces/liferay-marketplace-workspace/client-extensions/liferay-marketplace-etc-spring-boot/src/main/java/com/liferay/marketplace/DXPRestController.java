package com.liferay.marketplace;

import com.liferay.client.extension.util.spring.boot.BaseRestController;
import com.liferay.headless.commerce.admin.order.client.dto.v1_0.Order;
import com.liferay.headless.commerce.admin.order.client.pagination.Page;
import com.liferay.headless.commerce.admin.order.client.pagination.Pagination;
import com.liferay.headless.commerce.admin.order.client.resource.v1_0.OrderResource;
import com.liferay.marketplace.service.MarketplaceService;

import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * @author Keven Leone
 */
@RequestMapping("/dxp")
@RestController
public class DXPRestController extends BaseRestController {

	@PostMapping("connect")
	public String connect(@RequestBody String json) throws Exception {
		JSONObject jsonObject = new JSONObject(json);

		return post(
			_marketplaceService.getAuthorization(),
			new JSONObject(
			).put(
				"company", jsonObject.getString("companyId")
			).put(
				"r_accountToOAuth2Server_accountEntryId",
				jsonObject.getLong("accountId")
			).put(
				"r_userToOAuth2Server_userId", jsonObject.getString("userId")
			).put(
				"origin", jsonObject.getString("origin")
			).toString(),
			"/o/c/oauth2servercontrollers");
	}

	@DeleteMapping("disconnect/{uuid}")
	public void disconnect(@PathVariable("uuid") String uuid) throws Exception {
		delete(
			_marketplaceService.getAuthorization(), "",
			"/o/c/oauth2servercontrollers/by-external-reference-code/" + uuid);
	}

	public JSONObject getOAuth2ServerController(String uuid) throws Exception {
		JSONObject oAuth2ServerJSONObject = new JSONObject(
			get(
				_marketplaceService.getAuthorization(),
				"/o/c/oauth2servercontrollers/by-external-reference-code/" +
					uuid));

		System.out.println(oAuth2ServerJSONObject);

		return oAuth2ServerJSONObject;
	}

	@GetMapping("orders")
	public Page<Order> getOrders(@RequestParam("uuid") String uuid)
		throws Exception {

		JSONObject jsonObject = getOAuth2ServerController(uuid);

		long accountId = jsonObject.getLong(
			"r_accountToOAuth2Server_accountEntryId");

		String search = "";
		String filter = "(accountId/any(x:(x eq " + accountId + " )))";
		String sort = "";

		OrderResource orderResource = _marketplaceService.getOrderResource();

		return orderResource.getOrdersPage(
			search, filter, Pagination.of(1, 50), sort);
	}

	@Autowired
	private MarketplaceService _marketplaceService;

}