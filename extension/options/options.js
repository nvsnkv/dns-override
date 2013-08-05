rule_template = '<tr class="gen"><td><input type="checkbox" class="toggleAliasEnabled" {{#enabled}}checked{{/enabled}}></td><td><span class="host">{{host}}</span></td><td><span class="alias">{{alias}}</span></td><td><a class="button removeAlias">remove</a></td></tr>';

function UpdateRewriterState(state) {
	Log("Updating rewriter state: " + state)
	chrome.runtime.sendMessage({action : "set_state", state: state});
}

function ToggleRewriterState(callback) {
	chrome.runtime.sendMessage({action : "get_state"}, 	function (response) {
															var state = response;
															state = !state;
															UpdateRewriterState(state);
															callback(state);
														});
}

function UpdateAnchor(state) {
	if (state) 
		$("#isRewriterEnabled").addClass("enabled")
							   .attr("title","Click to disable")
							   .html("Enabled");
	else
		$("#isRewriterEnabled").removeClass("enabled")
							   .attr("title","Click to enable")
							   .html("Disabled");
}

function AddAlias() {
	var host = $("#new_host").val();
	var alias = $("#new_alias").val();

	Log("Storing new alias... ")
	chrome.runtime.sendMessage({action: "save_alias", alias: {host: host, alias:alias, enabled:true}}, UpdateTable);
}

function UpdateTable(response) {
	Log("Response: " + response);
	$(".gen").remove();
	chrome.runtime.sendMessage({action: "get_aliases"}, DrawTable);
}

function DrawTable(aliases) {
	Log("Drawing table... ")
	for (var index in aliases) {
		$("#delimiter").before(Mustache.to_html(rule_template, aliases[index]));
	}

	$(".toggleAliasEnabled").click(ToggleAliasEnabled);
	$(".removeAlias").click(RemoveAlias);
}

function ToggleAliasEnabled() {
	var host = $(this).parents(".gen").find(".host").html();
	Log(host);
	var aliasStr = $(this).parents(".gen").find(".alias").html();
	var alias = {host: host, alias: aliasStr, enabled: $(this).is(":checked")}

	chrome.runtime.sendMessage({action: "update_alias", alias: alias}, UpdateTable);
}

function RemoveAlias() {
	var host = $(this).parents(".gen").find(".host").html();
	chrome.runtime.sendMessage({action: "remove_alias", host: host}, UpdateTable);
}

function ClearAliases() {
	chrome.runtime.sendMessage({action: "remove_aliases"}, UpdateTable);
}

$(	function() {
		$("#isRewriterEnabled").click(function() { ToggleRewriterState(UpdateAnchor); });
		$("#clearAliases").click(ClearAliases);

		$("#addAlias").click(AddAlias);

		chrome.runtime.sendMessage({action : "get_state"},	UpdateAnchor);

		UpdateTable();
	});