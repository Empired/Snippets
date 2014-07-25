var paylord = paylord || {};
paylord.kpi = paylord.kpi || {};

paylord.kpi.viewFieldTemplate = function(ctx) {
	var kpi = ctx.CurrentItem[ctx.CurrentFieldSchema.Name];
	var suffix = "";
	if (kpi == "Green") {
		suffix = "0.gif";
	} else if (kpi == "Red") {
		suffix = "2.gif";
	} else {
		suffix = "1.gif";
	}
	var ret = "<img src='/_layouts/images/kpidefault-" + suffix + "' title='" + kpi + "' />";
	return ret;
};

(function () {
	var fieldCtx = {};
	fieldCtx.Templates = {};
	fieldCtx.Templates.Fields = {
		"kpiIcon": {
			"View": paylord.kpi.viewFieldTemplate,
			"DisplayForm": paylord.kpi.viewFieldTemplate
		}
	};
	
	SPClientTemplates.TemplateManager.RegisterTemplateOverrides(fieldCtx);

})();