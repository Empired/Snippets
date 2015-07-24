// To set the JSLink property on a site column
// Paste this into the console in dev tools of a browser
// Need to be logged in to SharePoint as site collection admin
// Works on O365
var context = new SP.ClientContext.get_current();
var web = context.get_web();
var field = web.get_availableFields().getByTitle("My Site Column");
context.load(field);
context.executeQueryAsync(function(){
	field.set_jsLink("~sitecollection/Style Library/custom/MyJSLink.js");
	field.updateAndPushChanges(true);
	context.executeQueryAsync(function(){
		var jsl = field.get_jsLink();
		console.log(jsl);
	});
});
