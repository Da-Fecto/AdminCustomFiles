<?php namespace ProcessWire;

/**
 * Admin Custom Files (ProcessWire 3.x)
 *
 * This module enables you to add custom scripts and files to the admin.
 *
 * Admin Custom Files
 * Copyright (C) 2016|2017 by Martijn Geerts
 * Licensed under GNU/GPL v2, see LICENSE.TXT
 *
 */
class AdminCustomFilesUpgrade extends AdminCustomFiles {

	/**
	 * Construct
	 *
	 * @param AdminCustomFiles $acf
	 */
	public function __construct(AdminCustomFiles $acf) {
		$this->set('acf', $acf);
	}

	/**
	 * Returns processes array
	 *
	 * @param array $processes
	 * @return void
	 */
	private function getProcesses($processes) {
		if (is_array($processes)) return $processes;
		return array();
	}

	/**
	 * Converts old string dependency to array based
	 *
	 * @param string
	 * @return array
	 */
	private function convertDependencies($string, $filesFolder) {
		$array = array();

		if (is_array($string)) {
			$this->set('uptodate', true);
			return $string;
		} else if (is_array(json_decode($string))) {
			$this->set('uptodate', true);
			return json_decode($string);
		} else if (is_string($string) && empty($string)) {
			return $array;
		}

		$lines = array_map('trim', explode(PHP_EOL, $string));
		$baseFolder = $this->wire('config')->urls->templates;

		foreach($lines as $line) {
			list($process, $file) = strpos($line, " ") !== false
				? explode(" ", $line)
				: array("", $line);

			if (strpos($file, $filesFolder) !== false) {
				$file = $baseFolder . $file;
			}

			$array[] = array(
				"process" => $process,
				"file" => $file,
			);
		}
		return $array;
	}

	/**
	 * Undocumented function
	 *
	 * @return void
	 */
	public function execute() {
		/** @var Modules */
		$modules = $this->wire('modules');
		/** @var Modules */
		$config = $this->wire('config');
		/** @var array */
		$modConfig = $modules->getConfig($this->acf);

		$message = $this->_("Config already up-to-date.");

		if (!isset($modConfig['files_folder'])) {
			$this->message($message);
			return false;
		}

		if (isset($modConfig['files'])) {
			$this->message($message);
			return false;
		}

		$folder = trim($modConfig['files_folder'], '/') . '/';
		$dependencies = $this->convertDependencies($modConfig['dependencies'], $folder);

		$newConfig = array(
			"folder" => $folder,
			"processes" => $this->getProcesses($modConfig['process_filter']),
			"theme" => isset($modConfig['theme_files']) ? $modConfig['theme_files'] : "",
			"js_config" => isset($modConfig['js_config']) ? $modConfig['js_config'] : "",
			"js_config_class" => "AcfConfigLegacy",
			"dependencies" => $dependencies,
		);
		$modules->saveConfig($this->acf, array()); // Clear all
		$modules->saveConfig($this->acf, $newConfig);
	}
}