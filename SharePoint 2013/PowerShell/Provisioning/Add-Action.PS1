param($siteUrl)

function Execute($siteUrl) {
	$site = Get-SPSite $siteUrl;
	$actions = @();
	foreach($action in $site.UserCustomActions) {
		if ($action.Description -ne "customBranding") {
			continue;
		}
		
		$actions += $action
	}

	foreach($action in $actions) {
		$action.Delete();
	}

	$newAction = $site.UserCustomActions.Add();
	$newAction.Description = "customBranding";
	$newAction.Location = "ScriptLink";
	$newAction.ScriptBlock = @"
        (function () {
            document.write('<script type="text/javascript" src="/Style Library/custom/startup.js">\x3C/script>');
        }());
"@;

	$newAction.Update();
}

Execute $siteUrl;
