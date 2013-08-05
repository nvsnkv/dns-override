function getAliases() {
    Log("getAliases called.");
    var aliases = localStorage.getItem("dns-override.aliases");
    Log("aliases: " + aliases);
    return (aliases != null) ? JSON.parse(aliases) :  new Array();
}

function setAliases(aliases) {
    Log("setAliases called.");
    Log("aliases: " + aliases);
    localStorage.setItem("dns-override.aliases", JSON.stringify(aliases));
}

function getRewriterState() {
    Log("getRewriterState called.");
    var state = localStorage.getItem("dns-override.state");
    Log("state: " + state);
    return (state != null) ? JSON.parse(state) :  false;
}

function setRewriterState(state) {
    Log("setRewriterState called.");
    Log("state: " + state);
    localStorage.setItem("dns-override.state", JSON.stringify(state));
}

function ToggleIcon(id, state) {
    var iconPath = state ? "img/dns_enabled_38.png" : "img/dns_disabled_38.png";
    var iconText = state ? "[ENABLED] DNS Overrider" : "[DISABLED] DNS Overrider";
    
    function ShowIcon() {
        chrome.pageAction.show(id);
    }

    chrome.pageAction.onClicked.addListener(function(){});    
    chrome.pageAction.setTitle({tabId: id, title: iconText});
    chrome.pageAction.setIcon({tabId: id, path: iconPath}, ShowIcon);
}


function onMessageCallback(message, sender, sendResponse) {
    Log("Receiving messge...");
    if (message.action != null) {
        Log("action: " + message.action);
        switch(message.action) {
            case "init":
                    var state = getRewriterState();
                    ToggleIcon(sender.tab.id, state);
                    sendResponse(state);
                break;

            case "get_aliases": 
                sendResponse(getAliases());
                break;

            case "save_alias": 
                var aliases = getAliases();
                var i=0; 
                    while ((i < aliases.length) && (aliases[i].host != message.alias.host))
                        i++;

                if (i < aliases.length) 
                    aliases[i] = message.alias;
                else
                    aliases.push(message.alias);

                setAliases(aliases);
                sendResponse("OK");
                break;

            case "update_alias":
                var aliases = getAliases();
                var i=0; 
                    while ((i < aliases.length) && (aliases[i].host != message.alias.host))
                        i++;

                var response = "ERR. Nothing to remove";
                if (i < aliases.length) {
                    aliases[i] = message.alias;
                    response = "OK";
                }

                setAliases(aliases);
                sendResponse(response);
                break;

            case "remove_alias":
                var aliases = getAliases();
                var i=0; 
                    while ((i < aliases.length) && (aliases[i].host != message.host))
                        i++;

                var response = "ERR. Nothing to remove";
                if (i < aliases.length) {
                    aliases.splice(i,1);
                    response = "OK";
                }

                setAliases(aliases);
                sendResponse(response);
                break;

            case "remove_aliases":
                setAliases(new Array());
                sendResponse("OK");
                break;

            case "get_state":
                sendResponse(getRewriterState());
                break;

            case "set_state":
                setRewriterState(message.state);
                sendResponse("OK");
                break;

            default:
                Log("Unknown action");
                sendResponse("Unknown action");
        }
        Log("Response sent.");
    }
    Log("Processing completed.");
}

Log("Creating callback... ");
chrome.extension.onMessage.addListener(onMessageCallback);
Log("Callback created.");