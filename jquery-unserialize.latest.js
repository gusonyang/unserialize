/*
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 */


jQuery.unserialize = function(str){
		var items = str.split('&');
		var ret = "{";
		var arrays = [];
		var index = "";
		for (var i = 0; i < items.length; i++) {
			var parts = items[i].split(/=/);
			//console.log(parts[0], parts[0].indexOf("%5B"),  parts[0].indexOf("["));
			if (parts[0].indexOf("%5B") > -1 || parts[0].indexOf("[") > -1){
				//Array serializado
				index = (parts[0].indexOf("%5B") > -1) ? parts[0].replace("%5B","").replace("%5D","") : parts[0].replace("[","").replace("]","");
				if (arrays[index] === undefined){
					arrays[index] = [];
				}
				arrays[index].push( decodeURIComponent(parts[1].replace(/\+/g," ")));
				
			} else {
				if (parts.length > 1){
					ret += "\""+parts[0] + "\": \"" + decodeURIComponent(parts[1].replace(/\+/g," ")) + "\", ";
				}
			}
			
		};
		
		ret = (ret != "{") ? ret.substr(0,ret.length-2) + "}" : ret + "}";
		//console.log(ret, arrays);
		var ret2 = JSON.parse(ret);
		//proceso los arrays
		for (arr in arrays){
			ret2[arr] = arrays[arr];
		}
		return ret2;
}

jQuery.fn.unserialize = function(parm){
		//If not string, JSON is assumed.
		var items = (typeof parm == "string") ? parm.split('&') : parm;
		if (typeof items !== "object"){
			throw new Error("unserialize: string or JSON object expected.");
		}
		for (var i = 0; i < items.length; i++) {
			var parts = items[i].split(/=/);
			obj = this.find('[name='+ parts[0] +']');
			if (obj.length == 0){
				try{
					obj = this.parent().find('[name='+ parts[0] +']');
				} catch(e){}
			}
			if (typeof obj.attr("type") == "string" && ( obj.attr("type").toLowerCase() == "radio" || obj.attr("type").toLowerCase() == "checkbox")){
				 obj.each(function(index, coso) {
					coso = $(coso);
					if (coso.attr("value") == decodeURIComponent(parts[1].replace(/\+/g," "))){
						 coso.prop("checked",true);
					} else {
						 coso.prop("checked",false);
					}
				 });
			} else {
				 obj.val(decodeURIComponent(parts[1].replace(/\+/g," ")));
			}
		};
		return this;
}