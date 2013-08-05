(function() {
	function Initialize(response) {
		var rewriter = document['dns-override.rewriter'] = new Object;
		rewriter.isEnabled = response;
		if (rewriter.isEnabled)
			chrome.runtime.sendMessage({action: "get_aliases"},SetAliases);
	}

	function SetAliases(response) {
		var rewriter = document['dns-override.rewriter'];
		rewriter.aliases = response;
		Rewrite();
	}

	function Rewrite() {
		var rewriter = document['dns-override.rewriter'];
		var aliases = rewriter.aliases;
		
		function RewriteCurrentHref(index, elem) {
			for (var i=0; i<aliases.length; i++)
				if (aliases[i].enabled)
					$(elem).attr("href", $(elem).attr("href").replace(aliases[i].host, aliases[i].alias));
		};

		function RewriteCurrentSrc(index, elem) {
			for (var i=0; i<aliases.length; i++)
				if (aliases[i].enabled)
					$(elem).attr("src", $(elem).attr("src").replace(aliases[i].host, aliases[i].alias));
		};

		$("[href]").each(RewriteCurrentHref);
		$("[src]").each(RewriteCurrentSrc);
	}

	Log("Sending message to background... ");
	chrome.runtime.sendMessage({action : "init"}, Initialize);
})();



