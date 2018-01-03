'use strict'
const randomstring = require("randomstring");
const flatten = require('flat')


function createLayer (args) {
	return {
		"name":args.name || "layer",
		"type":  args.type || "Layer",
		"x": args.x || 100,
	    "y": args.y || 100,
	    "width": args.width || 250,
	    "height": args.height || 250,
	    "color": args.color || "#359DD9"
	}
}

function ignoreKey(noflylist,key){
	return noflylist.indexOf(key) >= 0
}

function renderChildren(object) {
	if(object) {
		if(object.hasOwnProperty("children")) {
			var children = object.children;
			for (var i = children.length - 1; i >= 0; i--) {
				children[i]["parent"] = object.name
				return renderSingle(children[i]);
			}
		}
		else return "";
	}
	else return "";
}

function renderSingle(object) {
	var string = "\n";
	string = string + object.name + " = new " + object.type + "\n"
	for(var key in object) {
	  // We check if this key exists in the obj
	  if (object.hasOwnProperty(key) && ( key != "name" || key != "type" )) {
	    // someKey is only the KEY (string)! Use it to get the obj:
	    if(!ignoreKey(["name","type","children"], key)) {
	   		string = string + "\t"+key + ": " + object[key+""] + "\n";
	    }
	  }
	}
	return string + "" + renderChildren(object);
}

function packagePage(pagename,object) {
	var flat = flatten(object);
	var wrapper = "\nwindow."+pagename+" = { \n";
	for(var key in flat) {
		if(flat.hasOwnProperty(key))
		{
			if(key.indexOf("name") != -1) {
				wrapper = wrapper+ "\t"+flat[key]+": "+flat[key]+"\n"
			}
		}
	}
	wrapper = wrapper + "}\n"
	return 	wrapper;
}

function render(pagename,object) {
	var finalstring = "";
	finalstring = renderSingle(object);
	return finalstring + "\n" + packagePage(pagename,object);
}

module.exports =  {
    render: render
};