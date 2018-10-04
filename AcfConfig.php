<?php namespace ProcessWire;

use \DirectoryIterator;

abstract class AcfConfig extends WireData implements Module {

	/** @var AdminCustomFiles $adminCustomFiles */
	protected $adminCustomFiles = null;

	/** @var Page $adminCustomFiles */
	protected $editPage = null;

	/** @var Page $adminCustomFiles */
	protected $editTemplate = null;

	private function setFromPageEditor() {
		/** @var Process */
		$process = $this->process;
		if ($process instanceof WirePageEditor && method_exists($process, 'getPage')) {
			$this->editPage = $process->getPage();
			// Some classes extending WirePageEditor do not have a template like
			$this->editTemplate = $this->editPage->template
				? $this->editPage->template
				: new Template();;
		}
	}

	/**
	 * Constructs the abstract base class
	 *
	 * @param AdminCustomFiles $acf
	 */
	public function __construct(AdminCustomFiles $acf) {
		$this->adminCustomFiles = $acf;
		$this->editPage = new NullPage();
		$this->editTemplate = new Template();
		$this->setFromPageEditor();
	}

	public function setConfigJS() {
		/** @var Config */
		$config = $this->wire('config');
		$array = $this->jsConfig();

		if (!is_array($array)) {
			$subject = $this->className() . "::jsConfig()";
			$this->error(sprintf($this->_('%1$s should return an “array”, %2$s given.'), $subject, gettype($array)), true);
			$this->warning($this->_('Setting $config->js->AdminCustomFiles skipped.'));
			return false;
		}

		/** Sets adminCustomFiles to config.js  */
		$config->js($this->adminCustomFiles->className(), $array);
	}

	/**
	 * Ready
	 *
	 * The descending AcfConfig module can overwrite this method when it is
	 * desirable. We call this method when AcfConfig is ready. (All reuired
	 * properties are set)
	 *
	 * @var AdminCustomFiles $this->adminCustomFiles
	 * @var Page|User|NullPage $this->editPage
	 * @var Template $this->editTemplate (see: $this->setFromPageEditor)
	 * @return void
	 */
	public function ready() {}

	/**
	 * Javascript Config
	 *
	 * The descending AcfConfig module should return an array that is ready to
	 * be used in $this->wire('config')->js('AdminCustomFiles', $array);
	 *
	 * This is an abstract method that descending AcfConfig module classes are
	 * required to implement.
	 *
	 * @return array
	 */
	abstract function jsConfig();
}