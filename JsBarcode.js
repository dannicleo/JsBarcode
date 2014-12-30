(function(){
	
	JsBarcode = function(image, content, options) {
		
		var merge = function(m1, m2) {
			var newMerge = {};
			for (var k in m1) {
				newMerge[k] = m1[k];
			}
			for (var k in m2) {
				newMerge[k] = m2[k];
			}
			return newMerge;
		};
	
		//Merge the user options with the default
		options = merge(JsBarcode.defaults, options);

		//Create the canvas where the barcode will be drawn on
		// Check if the given image is already a canvas
		var canvas = image;

		// check if it is a jQuery selection
		if (image instanceof jQuery) {
			// get the DOM element of the selection
			canvas = image.get(0);
			// check if DOM element is a canvas, otherwise it will be probably an image so create a canvas
			if (!(canvas instanceof HTMLCanvasElement)) {
				canvas = document.createElement('canvas');
			}
		} else if (!(image instanceof HTMLCanvasElement)) {
			// there is no jQuery selection so just check if DOM element is a canvas, otherwise it will be probably
			// an image so create a canvas
			canvas = document.createElement('canvas');
		}

		//Abort if the browser does not support HTML5canvas
		if (!canvas.getContext) {
			return image;
		}
		
		var encoder = new window[options.format](content);
		
		//Abort if the barcode format does not support the content
		if(!encoder.valid()){
			return this;
		}
		
		//Encode the content
		var binary = encoder.encoded();
		
		var _drawBarcodeText = function (text) {
					var x, y;

					y = options.height;

					ctx.font = options.fontSize + "px "+options.font;
					ctx.textBaseline = "bottom";
					ctx.textBaseline = 'top';

					if(options.textAlign == "left"){
						x = options.quite;
						ctx.textAlign = 'left';
					}
					else if(options.textAlign == "right"){
						x = canvas.width - options.quite;
						ctx.textAlign = 'right';
					}
					else{ //All other center
						x = canvas.width / 2;
						ctx.textAlign = 'center';
					}

					ctx.fillText(text, x, y);
				}
		
		//Get the canvas context
		var ctx	= canvas.getContext("2d");
		
		//Set the width and height of the barcode
		canvas.width = binary.length*options.width+2*options.quite;
		canvas.height = options.height + (options.displayValue ? options.fontSize : 0);
		
		//Paint the canvas
		ctx.clearRect(0,0,canvas.width,canvas.height);
		if(options.backgroundColor){
			ctx.fillStyle = options.backgroundColor;
			ctx.fillRect(0,0,canvas.width,canvas.height);
		}
		
		//Creates the barcode out of the encoded binary
		ctx.fillStyle = options.lineColor;
		for(var i=0;i<binary.length;i++){
			var x = i*options.width+options.quite;
			if(binary[i] == "1"){
				ctx.fillRect(x,0,options.width,options.height);
			}			
		}
		
		if(options.displayValue){
			_drawBarcodeText(content);
		}
		
		//Grab the dataUri from the canvas
		uri = canvas.toDataURL('image/png');

		// check if given image is a jQuery selection
		if (image instanceof jQuery) {
			// check if the given image was a canvas, if not set the source attribute of the image
			if (!(image.get(0) instanceof HTMLCanvasElement)) {
				//Put the data uri into the image
				return image.attr("src", uri);
			}
		} else if (!(image instanceof HTMLCanvasElement)) {
			// There is no jQuery selection so just check if the given image was a canvas, if not set the source attr
			image.setAttribute("src", uri);
		}

	};
	
	JsBarcode.defaults = {
		width:	2,
		height:	100,
		quite: 10,
		format:	"CODE128",
		displayValue: false,
		font:"Monospaced",
		textAlign:"center",
		fontSize: 12,
		backgroundColor:"",
		lineColor:"#000"
	};

	$.fn.JsBarcode = function(content, options){
		JsBarcode(this, content, options);
		return this;
	};

})(jQuery);