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

$(function () {

	"use strict";

	var dependencies = (function ($) {

		var input = $("#Inputfield_dependencies").get(0),
			data = input.value ? JSON.parse(input.value) : [],
			headers = JSON.parse(input.dataset.headers),
			messages = JSON.parse(input.dataset.messages),
			inputs = {
				select: $("<select><option></option></select>"),
				file: $("<input>"),
				button: $("<button class='ui-button ui-widget ui-corner-all'><i class='fa fa-plus'></i></button>")
			},
			$table = $("<table class='inputter'>"),
			$thead = $("<thead>"),
			$tbody = $("<tbody>"),
			$ul = $("<ul class='files'></ul>");


		/**
		 * Interact with the user for dependencies
		 *
		 *
		 *
		 */
		function message(message) {

			// See ghostMessages.js in drop-ins
			if (typeof ghostMessages === "object") {
				ghostMessages.message(message, "warning");
			} else {
				alert(message);
			}

			inputs.file.effect("highlight", { color: "rgba(255, 0, 0, 0.1)" }, 100);
		}

		/**
		 * Add file
		 *
		 * @param string file Absolute url
		 * @param boolean exists File exists
		 *
		 */
		function addFile(path, exists, file) {
			var insert = true,
				process = inputs.select.val(),
				item = {
				"process": process,
				"file": file
			};

			$.each(data, function (index, old) {
				if (old.file === item.file && old.process === item.process) {
					insert = false;
					return false;
				}
			});

			if (insert && exists) {
				buildFileListItem(item);
				data.push(item);
				input.value = JSON.stringify(data);
				inputs.select.val("");
				inputs.file.val("");
			} else {
				return message(messages.notfound);
			}
		}

		/**
		 * Remove file
		 *
		 */
		function removeFile() {
			var $li = $(this).closest("li");

			$.each(data, function (index, item) {
				if ($li.data("process") === item.process && $li.data("file") === item.file) {
					data.splice(index, 1);
					input.value = JSON.stringify(data);
					$li.remove();
				}
			});
		}

		/**
		 * Sort files
		 *
		 * Executed by jQuery sortable.stop
		 *
		 */
		function sortFiles () {
			data = [];
			$("li", this).each(function () {
				data.push({
					"process": $(this).data("process"),
					"file":  $(this).data("file")
				});
			});
			input.value = JSON.stringify(data);
		}

		function fileNotFound(file, exists, $li) {
			if (exists) {
				$(".file-not-found", $li).remove();
			} else {
				$(".url", $li).append("<span class='file-not-found'>" + messages.filenotfound + "</span>");
			}
			$li.toggleClass("not-found", !exists);
		}

		/**
		 * Fires callback with 3 properties
		 *
		 * @param string file
		 * @param mixed jQuery object or string
		 * @param function callback
		 *
		 */
		function fileExists(file, $item, callback) {
			$.ajax({
				type: "HEAD",
				url: file,
				async: true,
				complete: function(jqXHR) {
					callback(file, jqXHR.status === 200, $item);
				}
			});
		}

		/**
		 * Does the file exists? (Using AJAX)
		 *
		 * @param Event event
		 *
		 */
		function buildUrl (event) {
			event.preventDefault();

			var file = inputs.file.val(),
				ext = file.indexOf(".") > -1 ? file.split(".").pop() : false;

			// yeah right
			if (!file || file.length < 4) {
				return message(messages.toshort);
			}

			// We need .js or .css
			if (!ext) {
				return message(messages.noext);
			}

			// We need .js or .css
			if (ext !== "js" && ext !== "css") {
				return message(messages.wrongext);
			}
			var path;
			// Is the file relative?
			if (file.indexOf("/") !== 0) {
				path = input.dataset.path + file;
			} else {
				path = file;
			}

			fileExists(path, file, addFile);
		}

		/**
		 * Build list item
		 *
		 * @param item object Object with propertie process & file
		 *
		 */
		function buildFileListItem(item) {
			var $label =
				"<span class='process' style='width: " + $("td:first", $table).width() + "px'>" + item.process + "</span> " +
				"<span class='url'>" + item.file + "</span>" +
				"<span class='icons'>" +
					"<i class='fa fa-trash delete'></i>" +
				"</span>",

				$li = $("<li>", {
				"data-process": item.process,
				"data-file": item.file
			}).html($label).appendTo($ul);

			fileExists(item.file, $li, fileNotFound);

			$(".delete", $li).on("click", removeFile);
		}

		/**
		 * Build the Inputter
		 *
		 */
		function buildInputter() {
			$.each(inputs, function (key, $el) {

				var label = headers.hasOwnProperty(key) ? headers[key] : "",
					$th = $("<th>" + (key !== "button" ? label : "") + "</th>"),
					$td = $("<td>");

				// Select
				if (key === "select") {
					$(".Inputfield_processes option").each(function () {
						$el.append("<option value='" + this.value + "'>" + this.value + "</option>");
					});

				} else if (key === "button") {
					$el.append(label);
				}

				$td.append($el);
				$thead.append($th);
				$tbody.append($td);
			});

			// Insert inputter
			$table.append($thead);
			$table.append($tbody);
			$table.insertBefore(input);

			// Add styles
			inputs.select.closest("td").width(inputs.select.width() + 16);
			inputs.button.closest("td").width(inputs.button.width() + 16);

			// Add Events
			inputs.button.on("click", buildUrl);
		}


		/**
		 * Build the Inputter
		 *
		 * @param data Array with objects
		 *
		 */
		function buildFileList() {
		var i = 0;

			for(i = 0; i < data.length; i+=1) {
				buildFileListItem(data[i]);
			}

			// Insert List
			$ul.insertBefore($table);

			// Add Events
			$ul.sortable({
				revert: 50,
				stop: sortFiles
			});
		}

		/**
		 * Initialize the Module
		 *
		 */
		function initialize() {
			buildInputter();
			buildFileList();
		}

		return {
			init: initialize
		};

	}(jQuery));

	dependencies.init();
});
