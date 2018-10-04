<?php namespace ProcessWire;

/**
 * AcfConfigLegacy (AcfConfig module)
 *
 * Admin Custom Files (ProcessWire 3.x)
 * Copyright (C) 2018 by Martijn Geerts
 * Licensed under GNU/GPL v2, see LICENSE.TXT
 *
 */
class AcfConfigDefault extends AcfConfig implements Module {
	/**
	 * Required jsConfig method
	 *
	 * @return array
	 */
	public function jsConfig() {
		$user = $this->wire('user');
		$config = $this->wire('config');
		$process = $this->wire('process');

		$array = array(
			'host' => $config->httpHost,
			'process' => $process->className(),
			'adminTheme' => $this->adminCustomFiles->getThemeName(),
			'user' => array(),
			'roles' => array(),
			'permissions' => array(),
		);

		foreach($user->template->fieldgroup as $field) {
			$value = $user->get($field->name);
			$array['user'][$field->name] = $field->type->___exportValue($user, $field, $value);
		}

		foreach ($user->roles as $role) {
			$array['roles'][] = $role->name;
			foreach ($role->permissions->each(['name', 'title']) as $arrayrray) {
				$array['permissions'][$arrayrray['name']] = $arrayrray['title'];
			}
		}

		if ($process instanceof ProcessPageEdit) {
			$page = $process->getPage();
			$array['template'] = $page->template->name;

			$fields = array();
			foreach ($page->template->fields as $field) $fields[$field->name] = $field->data;
			$array['fields'] = $fields;

			$array['page'] = array(
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
		}

		return $array;
	}
}