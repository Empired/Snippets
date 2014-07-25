var paylord = paylord || {};
paylord.colourPicker = paylord.colourPicker || {};

paylord.colourPicker.invertColour = function(hexTripletColor) {
    var color = hexTripletColor;
    //color = color.substring(1);           // remove #
    color = parseInt(color, 16);          // convert to integer
    color = 0xFFFFFF ^ color;             // invert three bytes
    color = color.toString(16);           // convert to hex
    color = ("000000" + color).slice(-6); // pad with leading zeros
    //color = "#" + color;                  // prepend #
    return color;
}

paylord.colourPicker.hexToRgb = function(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

paylord.colourPicker.colourViewTemplate = function(ctx) {
	var colour = ctx.CurrentItem[ctx.CurrentFieldSchema.Name];
	if (colour == "") {
		colour = "353535";
	}
	
	if (colour[0] == "#") {
		colour = colour.substring(1);
	}
	
	var rgb = paylord.colourPicker.hexToRgb(colour);
	var title = "";
	title = "R:" + rgb.r + " G: " + rgb.g + " B:" + rgb.b;
	
	var fontColour = paylord.colourPicker.invertColour(colour);
			
	
	var ret = "<div title='" + title + "' style='background-color: #" + colour + ";color:#" + fontColour + ";padding: 0px 5px;'>" + colour + "</div>";
	return ret;
}

paylord.colourPicker.getFieldValue = function (fieldName) {
	var elId = "paylord-" + fieldName;
	var el = document.getElementById(elId);
	var value = el.value;
	if (value[0] == "#") {
		return value.substring(1);
	} else {
		return value;
	}
}

paylord.colourPicker.colourEditTemplate = function(ctx) {
	var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx); 
	formCtx.registerGetValueCallback(formCtx.fieldName, paylord.colourPicker.getFieldValue.bind(null, formCtx.fieldName));
	var elId = "paylord-" + formCtx.fieldName;
	
	var colour = ctx.CurrentItem[ctx.CurrentFieldSchema.Name];
	if (colour == "") {
		colour = "#353535";
	}
	var ret = "<input id='" + elId + "' class='color' value='" + colour + "'>";
	return ret;
};
(function () {
	var colourCtx = {};
	colourCtx.Templates = {};
	colourCtx.Templates.Fields = {
		"Colour": {
			"View": paylord.colourPicker.colourViewTemplate,
			"DisplayForm": paylord.colourPicker.colourViewTemplate,
			"EditForm": paylord.colourPicker.colourEditTemplate,
			"NewForm": paylord.colourPicker.colourEditTemplate
		}
	};
	
	SPClientTemplates.TemplateManager.RegisterTemplateOverrides(colourCtx);

})();

