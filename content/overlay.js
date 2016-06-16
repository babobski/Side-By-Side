/**
 * Namespaces
 */
if (typeof(extensions) === 'undefined') extensions = {};
if (typeof(extensions.SideBySide) === 'undefined') extensions.SideBySide = {
	version: '1.0'
};

(function() {
	
    var $       	= require("ko/dom"),
		notify		= require("notify/notify"),
		clipboard 	= require("sdk/clipboard"),
		self		= this;
	
	/**
	 * COMPARE FILES
	 * Compare 2 files Side By Side
	 */
	this.compareFiles = function(){
		
		self._selectDiffFilesWindow();
	};
	
	/**
	 * COMPARE WITH CLIPBOARD
	 * Compare current buffer with clipboard
	 */
	this.compareWithClipoard = function(){
		var clipboardValue = clipboard.get();
			var d = ko.views.manager.currentView.document || ko.views.manager.currentView.koDoc,
			file = d.file,
			buffer = d.buffer,
			path = (file) ? file.URI : null;
			
			if (!buffer) {
				return false;
			}
			
			self._openDiffWindow(clipboardValue, buffer, 'Clipboard', path);
			
	};
	
	/**
	 * COMPARE WITH FILE ON DISK
	 * Compare current buffer with file on disk
	 */
	this.compareWithDisk = function(){
		var d = ko.views.manager.currentView.document || ko.views.manager.currentView.koDoc,
		file = d.file,
		buffer = d.buffer,
		path = (file) ? file.URI : null,
		diskContent = '';
		
		if (!file) {
			return false;
		}
		
		diskContent = self._readFile(path);
		
		self._openDiffWindow(buffer, diskContent, 'Current buffer', path);
		
	};
	
	/**
	 * Select files for file diff
	 */
	this._selectDiffFilesWindow = function(){
		
		var features = "chrome,titlebar,toolbar,centerscreen,resizable";
		var windowVars = {
			ko: ko,
			overlay: self,
			notify: notify,
		};
		window.openDialog('chrome://SideBySide/content/selectDiffFiles.xul', "sideBySide", features, windowVars);
	};
	
	/**
	 * Open the diff window
	 */
	this._openDiffWindow = function(diff01, diff02, title01, title02){
		var win = Components.classes['@mozilla.org/appshell/window-mediator;1']
		.getService(Components.interfaces.nsIWindowMediator)
		.getMostRecentWindow(null);
		var chromeURL = 'chrome://SideBySide/content/diffWindow.html';
		var features = "chrome,titlebar,toolbar,centerscreen,resizable";
		var windowVars = {
			ko: ko,
			overlay: self,
			diff01: diff01,
			diff02: diff02,
			title01: title01 === 'Clipboard' ? title01 : ko.uriparse.displayPath(title01),
			title02: ko.uriparse.displayPath(title02),
			clipboard: clipboard,
		};
		
		 win.openDialog(chromeURL, 'SideBySide',
                       features, windowVars);
	};
	
	/**
	 * Open the diff window
	 */
	this._openAdvancedDiffWindow = function(diff01, diff02){
		var win = Components.classes['@mozilla.org/appshell/window-mediator;1']
		.getService(Components.interfaces.nsIWindowMediator)
		.getMostRecentWindow(null);
		var chromeURL = 'chrome://SideBySide/content/advancedDiff.html';
		var features = "chrome,titlebar,toolbar,centerscreen,resizable, alwaysRaised";
		var windowVars = {
			ko: ko,
			overlay: self,
			diff01: diff01,
			diff02: diff02,
			clipboard: clipboard,
		};
		
		 win.openDialog(chromeURL, 'SideBySideAdv',
                       features, windowVars);
	};
	
	this._readFile = function(filepath) {

		var reader = Components.classes["@activestate.com/koFileEx;1"]
			.createInstance(Components.interfaces.koIFileEx),
			placeholder;

		reader.path = filepath;

		try {
			reader.open("r");
			placeholder = reader.readfile();
			reader.close();
			
			return placeholder;

		} catch (e) {
			alert('DIFF ERROR: Reading file: ' + filepath);
		}

		return false;
	};
	
	
	
}).apply(extensions.SideBySide);
