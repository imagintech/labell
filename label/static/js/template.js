
		var cart = [];
		var selected_template = "click on a template to select";
		var selected_dataset = "click on a dataset to select";

		function createLabelElementJson(name, type){

			var element = {
					"name" : name,
					"type" : type
			};

			return element;
		}

		document.getElementById("point").addEventListener("click", function(){
			var pointName = document.getElementById("point_name").value;
			document.getElementById("point_name").value = "";
  			cart.push(createLabelElementJson(pointName, "POINT"));

  			var cartDisplay =  document.getElementById("cart");

  			function createCart(value, index, array){

  				var li_node = document.createElement("li");
  				li_node.append(value.name);
  				cartDisplay.appendChild(li_node);
  			}

  			cartDisplay.innerHTML = "";
  			cart.forEach(createCart);
});

		 document.getElementById("line").addEventListener("click", function(){
			var pointName = document.getElementById("line_name").value;
			document.getElementById("line_name").value = "";
  			cart.push(createLabelElementJson(pointName, "LINE"));

  			var cartDisplay =  document.getElementById("cart");

  			function createCart(value, index, array){

  				var li_node = document.createElement("li");
  				li_node.append(value.name);
  				cartDisplay.appendChild(li_node);
  			}

  			cartDisplay.innerHTML = "";
  			cart.forEach(createCart);
});

		 document.getElementById("polygon").addEventListener("click", function(){
			var pointName = document.getElementById("polygon_name").value;
			document.getElementById("polygon_name").value = "";
  			cart.push(createLabelElementJson(pointName, "POLYGON"));

  			var cartDisplay =  document.getElementById("cart");

  			function createCart(value, index, array){

  				var li_node = document.createElement("li");
  				li_node.append(value.name);
  				cartDisplay.appendChild(li_node);
  			}

  			cartDisplay.innerHTML = "";
  			cart.forEach(createCart);
});

		 document.getElementById("create_template").addEventListener("click", function(){

		 	var template_name = document.getElementById("template_name").value;

		 	$.post("/create_template",
		 		{
		 			name: template_name,
		 			data: JSON.stringify(cart)
		 		}
		 			);
});

		 // create dataset

		 document.getElementById("create_dataset").addEventListener("click", function(){

		 	var dataset_name = document.getElementById("dataset_name").value;
		 	var dataset_folder = document.getElementById("dataset_folder").value;

		 	$.post("/create_dataset",
		 		{
		 			name: dataset_name,
		 			folder: dataset_folder
		 		}
		 			);
});
		 // template selection

		 document.getElementById("template_list").addEventListener("click", function(e){
		 	if(e.target && e.target.nodeName == "LI"){
		 		selected_template = e.target.id;
		 		document.getElementById("selected_template").innerHTML = selected_template;
		 	}
		 });

		 // dataset selection

		 document.getElementById("dataset_list").addEventListener("click", function(e){
		 	if(e.target && e.target.nodeName == "LI"){
		 		selected_dataset = e.target.id;
		 		document.getElementById("selected_dataset").innerHTML = selected_dataset;
		 		document.getElementById("selected_folder").innerHTML = e.target.getAttribute("data-value");
		 	}
		 });

		 // go to label page (start labelling)

		 document.getElementById("start_label").addEventListener("click", function(){

		 	$.post("/label",
		 		{
		 			template: selected_template,
		 			dataset: selected_dataset
		 		}
		 			);
		 });

