var paylord = paylord || {};
paylord.harveyBalls = paylord.harveyBalls || {};
paylord.harveyBalls.viewFieldTemplate = function(ctx) {
	var unicodeBalls = ["&#9675;", "&#9684;", "&#9681;", "&#9685;", "&#9679;"];
	var balls = ["harvey", "upper-right", "harvey half-right", "three-quarters", "harvey black"];
	var ball = ctx.CurrentItem[ctx.CurrentFieldSchema.Name];
	if (ball == "") {
		ball = 0;
	}
	
	var ret = "";
	switch (ball) {
		case "1":
			ret = "<div class='harvey'><div class='" + balls[ball] + "'><i></i></div></div>";
			break;
		case "3":
			ret = "<div class='harvey black'><div class='" + balls[ball] + "'><i></i></div></div>";
			break;
		default:
			ret = "<div class='" + balls[ball] + "'><i></i></div>";
			break;
	};
	//var ret = balls[ball];
	return ret;
};

(function () {

	var inlineCss = ".harvey{position:relative;border:1px solid #000;width:1em;height:1em;border-radius:0.5em;overflow:hidden;background-color:#fff;float:left;margin:0px}.half-right{background-image:linear-gradient(right,#000,#000 50.0%,#fff 50.0%);background-image:-webkit-linear-gradient(right,#000,#000 50.0%,#fff 50.0%);background-image:-moz-linear-gradient(right,#000,#000 50.0%,#fff 50.0%);background-image:-o-linear-gradient(right,#000,#000 50.0%,#fff 50.0%);background-image:-ms-linear-gradient(right,#000,#000 50.0%,#fff 50.0%)}.half-left{background-image:linear-gradient(left,#000,#000 50.0%,#fff 50.0%);background-image:-webkit-linear-gradient(left,#000,#000 50.0%,#fff 50.0%);background-image:-moz-linear-gradient(left,#000,#000 50.0%,#fff 50.0%);background-image:-o-linear-gradient(left,#000,#000 50.0%,#fff 50.0%);background-image:-ms-linear-gradient(left,#000,#000 50.0%,#fff 50.0%)}.half-top{background-image:linear-gradient(top,#000,#000 50.0%,#fff 50.0%);background-image:-webkit-linear-gradient(top,#000,#000 50.0%,#fff 50.0%);background-image:-moz-linear-gradient(top,#000,#000 50.0%,#fff 50.0%);background-image:-o-linear-gradient(top,#000,#000 50.0%,#fff 50.0%);background-image:-ms-linear-gradient(top,#000,#000 50.0%,#fff 50.0%)}.half-bottom{background-image:linear-gradient(bottom,#000,#000 50.0%,#fff 50.0%);background-image:-webkit-linear-gradient(bottom,#000,#000 50.0%,#fff 50.0%);background-image:-moz-linear-gradient(bottom,#000,#000 50.0%,#fff 50.0%);background-image:-o-linear-gradient(bottom,#000,#000 50.0%,#fff 50.0%);background-image:-ms-linear-gradient(bottom,#000,#000 50.0%,#fff 50.0%)}.upper-right{position:absolute;right:0;width:0.5em;height:0.5em;background-color:#000}.upper-left{position:absolute;width:0.5em;height:0.5em;background-color:#000}.three-quarters{position:absolute;width:0.5em;height:0.5em;background-color:#FFF}.black{background-color:#000}.white{background-color:#FFF}";
	
	var head = document.head || document.getElementsByTagName('head')[0];
	var style = document.createElement('style');
	style.type = 'text/css';
	if (style.styleSheet) {
		style.styleSheet.cssText = inlineCss;
	} else {
		style.appendChild(document.createTextNode(inlineCss));
	}
	head.appendChild(style);	
	
	var fieldCtx = {};
	fieldCtx.Templates = {};
	fieldCtx.Templates.Fields = {
		"HarveyBalls": {
			"View": paylord.harveyBalls.viewFieldTemplate,
			"DisplayForm": paylord.harveyBalls.viewFieldTemplate
		}
	};
	
	SPClientTemplates.TemplateManager.RegisterTemplateOverrides(fieldCtx);

})();