/* definitions */
var cart = [];
var selected_template = "click on a template to select";
var selected_dataset = "click on a dataset to select";

// backend urls
var baseUrl = "/labell";
var createTemplateUrl = baseUrl+"/create_template";
var createDatasetUrl = baseUrl+"/create_dataset";

// error messages
var templateNameRequired = "please specify a valid template name";
var cartIsEmpty = "please add atleast one item to your cart";
var datasetNameRequired = "please specify a valid dataset name";
var datasetFolderRequired = "please specify a valid folder to pick from";


/* html variables */
// buttons
var pointButton = document.getElementById("point");
var lineButton = document.getElementById("line");
var polygonButton = document.getElementById("polygon");
var createTemplateButton = document.getElementById("create_template");
var createDatasetButton = document.getElementById("create_dataset");

// inputs
var pointNameInput = document.getElementById("point_name");
var lineNameInput = document.getElementById("line_name");
var polygonNameInput = document.getElementById("polygon_name");
var templateNameInput = document.getElementById("template_name");
var datasetNameInput = document.getElementById("dataset_name");
var datasetFolderInput = document.getElementById("dataset_folder");

// display
var cartDisplay = document.getElementById("cart");
var selectedTemplateDisplay = document.getElementById("selected_template");
var selectedDatasetDisplay = document.getElementById("selected_dataset");
var templateListDisplay = document.getElementById("template_list");
var datasetListDisplay = document.getElementById("dataset_list");

// form elements
var selectedTemplateFormInput = document.getElementById("template_input");
var selectedDatasetFormInput = document.getElementById("dataset_input");



/* general functions */
function createLabelElementJson(name, type) {

    var element = {
        "name": name,
        "type": type
    };

    return element;
}

function createCart(value, index, array) {

    var li_node = document.createElement("li");
    li_node.append(value.name + "   --->   "+value.type);
    cartDisplay.appendChild(li_node);
}

function updateCartDisplay() {
    cartDisplay.innerHTML = "";
    cart.forEach(createCart);
}

var addPointToCart = function() {
    var name = pointNameInput.value;
    if(name=="") return;
    pointNameInput.value = "";
    cart.push(createLabelElementJson(name, "POINT"));
    updateCartDisplay();
}

var addLineToCart = function() {
    var name = lineNameInput.value;
    if(name=="") return;
    lineNameInput.value = "";
    cart.push(createLabelElementJson(name, "LINE"));
    updateCartDisplay();
}

var addPolygonToCart = function() {
    var name = polygonNameInput.value;
    if(name=="") return;
    polygonNameInput.value = "";
    cart.push(createLabelElementJson(name, "POLYGON"));
    updateCartDisplay();
}

/* html elemental controls */
pointButton.addEventListener("click", addPointToCart);
lineButton.addEventListener("click", addLineToCart);
polygonButton.addEventListener("click", addPolygonToCart);

// template selection
templateListDisplay.addEventListener("click", function(e) {
    if (e.target && e.target.nodeName == "LI") {
        selectedTemplateDisplay.innerHTML = e.target.id;
        selectedTemplateFormInput.value = e.target.id;
    }
});

// dataset selection
datasetListDisplay.addEventListener("click", function(e) {
    if (e.target && e.target.nodeName == "LI") {
        selectedDatasetDisplay.innerHTML = e.target.id;
        selectedDatasetFormInput.value = e.target.id;
    }
});


/* backend requests and responses */
// create template
createTemplateButton.addEventListener("click", function() {

    var template_name = templateNameInput.value;

    // validations
    if(template_name==""){ alert(templateNameRequired); return; }
    if(cart.length == 0){alert(cartIsEmpty); return;}

    // TO-DO, alert, refresh upon success and alert on failure
    $.post(createTemplateUrl, {
        name: template_name,
        data: JSON.stringify(cart)
    },
    function(response) {
                alert(response);
                location.reload();
            }
    );
});

// create dataset
createDatasetButton.addEventListener("click", function() {

    var dataset_name = datasetNameInput.value;
    var dataset_folder = datasetFolderInput.value;

    // validations
    if(dataset_name == ""){alert(datasetNameRequired); return;}
    if(dataset_folder == ""){alert(datasetFolderRequired); return;}

    // TO-DO, alert, refresh upon success and alert on failure
    $.post(createDatasetUrl, {
        name: dataset_name,
        folder: dataset_folder
    },
    function(response) {
                alert(response);
                location.reload();
            }
    );
});