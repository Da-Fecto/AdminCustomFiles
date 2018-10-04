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

var AdminCustomFiles = (function () {
	"use strict";

	var func = {};
	var obj = {};
	var el = {};

	func.tableMarkup = function () {
		var options = "";
		$("#Inputfield_processes option").each(function () {
			options += "<option value='" + this.value + "'>" +
				this.innerHTML +
			"</option>";
		});

		return "<table id='acfTable' class='acfTable'>" +
			"<tr>" +
				"<th>" + obj.text.headers.select + "</th>" +
				"<th id='acfHeader'>" + obj.text.headers.file + "</th>" +
				"<th></th>" +
			"</tr>" +
			"<tr>" +
				"<td>" +
					"<select class='uk-select' id='acfSelect'>" +
						"<option></option>" +
						options +
					"</select>" +
				"</td>" +
				"<td>" +
					"<input class='uk-input acfInput' id='acfInput'>" +
				"</td>" +
				"<td>" +
					"<button class='ui-button ui-widget acfButton' id='acfButton'>" +
						"<i class='fa fa-plus'></i>" +
					"</button>" +
				"</td>" +
			"</tr>" +
		"</table>";
	};

	func.listMarkup = function () {
		return "<ul class='files asmList asmListSortable' id='acfList'></ul>";
	};

	func.itemMarkup = function (process, file) {
		obj.itemWidth = obj.itemWidth || $("td:first", el.table).width();
		return "<li class='asmListItem ui-state-default' data-item='" + JSON.stringify({"process": process, "file": file}) + "'>" +
			"<i class='fa fa-fw fa-arrows asmListItemHandle'></i>" +
			"<div class='asmListItemLabel'>" +
				"<span class='acfLabelProcess' style='width:" + obj.itemWidth + "px'>" + process + "</span>" +
				"<span class='acfLabelFile'>" + file + "</span>" +
			"</div>" +
			"<a href='#' class='asmListItemRemove acfDelete'>" +
				"<i class='fa fa-trash'></i>" +
			"</a>" +
		"</li>";
	};

	func.setData = function () {
		var data = [];
		$("li", el.list).each(function () {
			data.push($(this).data("item"));
		});
		el.input.value = JSON.stringify(data);
	};

	func.itemExists = function (url) {
		var exists = false;
		$.each(JSON.parse(el.input.value), function () {
			if (this.file === url && el.select.value === this.process) {
				exists = true;
				return;
			}

			if (!this.process && this.file === url) {
				exists = true;
				return;
			}
		});
		return exists;
	};

	func.getUrl = function () {
		return el.acfInput.value.indexOf("/") !== 0
			? el.input.dataset.path + el.acfInput.value
			: el.acfInput.value;
	};

	func.addItem = function (process, file) {
		el.select.value = "";
		el.acfInput.value = "";
		el.list.insertAdjacentHTML("beforeend", func.itemMarkup(process, file));
		$(".acfDelete", el.list.lastChild).on("click", func.removeItem);
		func.setData();
	};

	func.addItems = function () {
		$(el.list).sortable({
			revert: 50,
			stop: func.setData,
			axis: "y"
		});
		$.each((el.input.value ? JSON.parse(el.input.value) : []), function () {
			func.addItem(this.process, this.file);
		});

		func.setData();
	};

	func.removeItem = function (event) {
		event.preventDefault();
		$(this).closest("li").remove();
		func.setData();
	};

	func.showError = function (message) {
		$(el.wrap).addClass("InputfieldStateError uk-alert-danger");
		$(el.acfHeader).text(message);
		setTimeout(function () {
			$(el.wrap).removeClass("InputfieldStateError uk-alert-danger");
			$(el.acfHeader).text(obj.text.headers.file);
			$(el.button).removeClass("ui-state-active");
		}, 1000);
	};

	func.ajax = function(jqXHR) {
		if (jqXHR.status === 200) {
			if (el.acfInput.value.indexOf(".js") > -1 || el.acfInput.value.indexOf(".css") > -1) {
				func.addItem(el.select.value, func.getUrl());
				func.setData();
			} else {
				func.showError(obj.text.messages.invalid);
			}
		} else {
			func.showError(obj.text.messages.notfound);
		}
	};

	func.buttonClick = function (event) {
		event.preventDefault();
		var url = func.getUrl();
		var exists = func.itemExists(url);
		if (el.acfInput.value && !exists) {
			$.ajax({
				type: "HEAD",
				url: url,
				async: true,
				complete: func.ajax
			});
		} else if (exists) {
			func.showError(obj.text.messages.exists);
		} else {
			setTimeout(function () {
				$(el.button).removeClass("ui-state-active");
			}, 300);
		}
	};

	func.init = function () {
		el.wrap = document.getElementById("wrap_Inputfield_dependencies");
		el.input = document.getElementById("Inputfield_dependencies");
		obj.text = $(el.input).data();
		el.input.insertAdjacentHTML("beforebegin", func.listMarkup());
		el.input.insertAdjacentHTML("beforebegin", func.tableMarkup()); // including set obj.text
		el.list = document.getElementById("acfList");
		el.table = document.getElementById("acfTable");
		el.acfHeader = document.getElementById("acfHeader");
		el.select = document.getElementById("acfSelect");
		el.acfInput = document.getElementById("acfInput");
		el.button = document.getElementById("acfButton");
		func.addItems();
		el.button.addEventListener("click", func.buttonClick);

		$(el.button).css({
			"height": $(el.acfInput).outerHeight() + "px",
			"line-height": $(el.acfInput).outerHeight() + "px"
		});
	};

	return {
		init: func.init
	};

}());

$(function () {
	"use strict";
	AdminCustomFiles.init();
});