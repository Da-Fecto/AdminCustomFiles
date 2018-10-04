<?php namespace ProcessWire;

/**
 * AcfConfigLegacy (AcfConfig module)
 *
 * Admin Custom Files (ProcessWire 3.x)
 * Copyright (C) 2018 by Martijn Geerts
 * Licensed under GNU/GPL v2, see LICENSE.TXT
 *
 */
class AcfConfigLegacy extends AcfConfig implements Module {

	/**
	 * Ready (optional)
	 *
	 * - You can use this ready method or leave it out.
	 * - Ready gets called before self::jsConfig
	 */
	public function ready() {}

	/**
	 * Required jsConfig method
	 *
	 * @return array
	 */
	public function jsConfig() {
		/** @var User */
		$user = $this->wire('user');
		/** @var User */
		$config = $this->wire('config');
		/** @var array */
		$roles = explode("|", $user->roles->implode('|', 'name'));

		$process = $this->wire('process');

		$data = array(
			'process' => $process->className(),
			'host' => $config->httpHost,
			'adminTheme' => $this->admin_theme,
			'user' => array(
				'id' => $user->id,
				'name' => $user->name,
				'email' => $user->email,
				'roles' => $roles,
			)
		);

		if ($process->className() == 'ProcessPageEdit') {
			$page = $this->editPage;

			$data['page'] = array(
				'id' => $page->id,
				'name' => $page->name,
				'path' => $page->path,
				'parentID' => $page->parentID,
				'numChildren' => $page->numChildren,
				'created' => $page->created,
				'modified' => $page->modified,
				'createdUser' => $page->createdUser->name,
				'modifiedUser' => $page->modifiedUser->name,
			);
			$data['template'] = $page->template->get('name');

			if ($page->id) {
				$data['fields'] = explode("|", $page->fields->implode('|', 'name'));
			}
		}

		return $data;
	}
}