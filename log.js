document['dns-override.debugEnabled'] = true;

function Log(message)
{
	if (document['dns-override.debugEnabled'])
		console.log("Chrome DNS: " + message);
}
