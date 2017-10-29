/**
 * Admin Custom Files (ProcessWire 3.x)
 *
 * This module enables you to add custom scripts and files to the admin.
 *
 * Admin Custom Files
 * Copyright (C) 2016 by Martijn Geerts
 * Licensed under GNU/GPL v2, see LICENSE.TXT
 *
 */
var ghostMessages = (function () {

	"use strict";

	var messageObject = {
			title: "",
			flagNames: "warning",
			icon: "exclamation-circle",
			html: ""
		};

	/**
	 * Ghost message
	 *
	 * (Yeah I know it"s buggy, but what the hack it"s for demo purpose only)
	 *
	 * @prop mixed messages String or Plain array
	 *
	 */
	function ghostMessage(message) {
		messageObject.title = message;
		Notifications.add(messageObject);
		Notifications.render();
		// fix possible bug Notifications.js
		setTimeout(function() {
			Notifications.runtime.shift();
		}, 300);
	}

	/**
	 * Init Notification (Ghost message)
	 *
	 * Hit Notifications.init() when System Notifications is not installed.
	 *
	 */
	function enableGhostMessages() {
		if (typeof Notifications !== "object") {
			return true;
		}

		// When System Notifications is installed ProcessWire takes over
		if ($("#NotificationMenu").length) {
			messageObject = $.extend(messageObject, Notifications.options);
			messageObject.icon = Notifications.options.iconWarning;
			return true;
		}

		// additional markup ghosts
		$("body").append("<div id='NotificationMenu' class='NotificationMenu'>" +
			"<ul id='NotificationList' class='NotificationList'></ul>" +
		"</div>" +
		"<ul id='NotificationGhosts' class='NotificationGhosts NotificationGhostsRight CustomGhost'></ul>");

		// additional markup Quantity
		$("#masthead").append("<div id='NotificationBug' class='NotificationBug qty0' data-qty='0'>" +
			"<span class='qty fa fa-fw'>$qty</span>" +
			"<i class='NotificationSpinner fa fa-fw fa-spin fa-spinner'></i>" +
		"</div>");

		Notifications.init({updateDelay: 10000000000000000000 });
		Notifications.updating = true;
	}

	return {
		init: enableGhostMessages,
		message: ghostMessage
	};

}());


$(function () {
	ghostMessages.init();
});
