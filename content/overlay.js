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
		var clipboard = require("sdk/clipboard"),
			clipboardValue = clipboard.get();
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
		};
		
		 win.openDialog(chromeURL, 'SideBySide',
                       features, windowVars);
	};
	
	
	
}).apply(extensions.SideBySide);
