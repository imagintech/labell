var canvas = document.getElementById('image');
canvas.width = 800;
canvas.height = 600;

// urls
var baseUrl = "/labell";
var saveImageUrl = baseUrl+"/save_image";
var nextImageUrl = baseUrl+"/next_image";

var templateDisplay = document.getElementById("templateDisplay");
var undoButton = document.getElementById("undoButton");
var nextButton = document.getElementById("nextButton");
var saveButton = document.getElementById("saveButton");
var saveAndNextButton = document.getElementById("saveAndNextButton");
var imageNameDisplay = document.getElementById("imgName");

var image = new Image;

// definitions
function Point(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
}

var colors = ["#ff2626", "#008000", "#FF00FF", "#0000FF", "#800000", "#FF8C00"];

window.onload = function() {

    var ctx = canvas.getContext('2d');
    trackTransforms(ctx);

    // getting data from html
    var template = $('#templateStore').data().template;
    console.log(template);
    var structure = template.structure;
    console.log(structure);

    // variables to track state
    var structure_index = 0;
    var structure_total = structure.length;
    var color_index = 0;
    console.log(structure_total);
    var isSaved = false;
    var isSaveAndNext = false;
    var isNewImage = true;

    // storing labelled data
    var labelled_data = []

    updateTemplateDisplay();

    function stateZero() {
        structure_index = 0;
        color_index = 0;
        labelled_data = [];
    }

    function pointSelected(mypoint) {

        if (structure_index < structure_total) {
            var current_structure = structure[structure_index];
            console.log(current_structure.type);
            if (current_structure.type == "POINT") {
                console.log("have to add this point");
                labelled_data.push(mypoint);
                structure_index++;
                console.log(labelled_data);
                redraw();
                updateTemplateDisplay();
            }
        }
    }

    function updateTemplateDisplay() {

        templateDisplay.innerHTML = "";
        for (var i = 0; i < structure_total; i++) {

            var li_node = document.createElement("li");
            li_node.append(structure[i].name +" --> "+structure[i].type);
            li_node.style.opacity = 0.7;

            // this is labeled element
            if (i < structure_index) {
                li_node.style.color = labelled_data[i].color;
            }

            templateDisplay.appendChild(li_node);
        }
    }

    function drawPoint(mypoint) {

        ctx.fillStyle = mypoint.color;
        ctx.beginPath();
        ctx.arc(mypoint.x, mypoint.y, 3, 0, Math.PI * 2, true);
        ctx.fill();
    }

    function redraw() {

        // Clear the entire canvas
        var p1 = ctx.transformedPoint(0, 0);
        var p2 = ctx.transformedPoint(canvas.width, canvas.height);
        ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

        if (!isNewImage) ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!isNewImage) ctx.restore();
        isNewImage = false;

        ctx.drawImage(image, 0, 0);

        // draw the labelled items
        for (var i = 0; i < structure_index; i++) {
            var struct = structure[i];
            var label = labelled_data[i];
            if (struct.type == "POINT") {
                drawPoint(label);
            }
        }
    }

    redraw();

    var lastX = canvas.width / 2,
        lastY = canvas.height / 2;

    var dragStart, dragged;

    canvas.addEventListener('mousedown', function(evt) {
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragStart = ctx.transformedPoint(lastX, lastY);
        dragged = false;
    }, false);

    canvas.addEventListener('mousemove', function(evt) {
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragged = true;
        if (dragStart) {
            var pt = ctx.transformedPoint(lastX, lastY);
            ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
            redraw();
        }
    }, false);

    canvas.addEventListener('mouseup', function(evt) {
        if (!dragged) {
            if (evt.shiftKey) {
                // console.log("clicked at : "+ dragStart.x + ", "+ dragStart.y);
                var clickedPoint = new Point(dragStart.x, dragStart.y, colors[color_index % colors.length]);
                color_index++;
                pointSelected(clickedPoint);
            } else {
                zoom(evt.altKey ? -1 : 1);
            }
        }
        dragStart = null;
    }, false);

    var scaleFactor = 1.1;

    var zoom = function(clicks) {
        var pt = ctx.transformedPoint(lastX, lastY);
        ctx.translate(pt.x, pt.y);
        var factor = Math.pow(scaleFactor, clicks);
        ctx.scale(factor, factor);
        ctx.translate(-pt.x, -pt.y);
        redraw();
    }

    var handleScroll = function(evt) {
        var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
        if (delta) zoom(delta);
        return evt.preventDefault() && false;
    };

    canvas.addEventListener('DOMMouseScroll', handleScroll, false);
    canvas.addEventListener('mousewheel', handleScroll, false);


    // general logic

    var imload = function() {
        // reset canvas state to remove transformations of previous image
        isNewImage = true;
        redraw();
        updateTemplateDisplay();
    }

    var saveFunction = function() {

        // validate the labelled data
        if(labelled_data.length != structure_total){alert("please label all entities");return;}

        // save the data
        saveImage();

        // update state
        isSaved = true;

    }

    var nextFunction = function() {

        // alert to save current image in case
        if(!isSaved){alert("please save current labelling");return;}

        // change the image
        getNextImage();

        // reset state to 0
        stateZero();

        // update the UI
        isSaved = false;
    }

    var saveAndNextFunction = function(){

        // call save function
        isSaveAndNext = true;
        saveFunction();
    }

    var undoFunction = function() {

        // reset state by one step
        structure_index > 0 ? structure_index-- : 0;
        color_index > 0 ? color_index-- : 0;
        labelled_data.pop();

        redraw();
        updateTemplateDisplay();
    }

    undoButton.addEventListener("click", undoFunction);
    nextButton.addEventListener("click", nextFunction);
    saveButton.addEventListener("click", saveFunction);
    saveAndNextButton.addEventListener("click", saveAndNextFunction);

    function saveImage() {

        $.post(saveImageUrl, {
                url: image.src,
                data: JSON.stringify(labelled_data)
            },
            function(response) {
                alert(response);
                if(isSaveAndNext) nextFunction();
                isSaveAndNext = false;
            }
        );
    }

    function updateImageDetails(){
            var fullPath = image.src;
            var filename = fullPath.replace(/^.*[\\\/]/, '');
            imageNameDisplay.innerHTML = filename;
    }

    function getNextImage() {

        $.post(nextImageUrl, {},
            function(response) {
                image.onload = imload;
                image.src = response;
                console.log(image.src);
                updateImageDetails();
            }
        );
    }

    getNextImage(); // to get started
};

// image.src = '';

// Adds ctx.getTransform() - returns an SVGMatrix
// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
function trackTransforms(ctx) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    var xform = svg.createSVGMatrix();
    ctx.getTransform = function() {
        return xform;
    };

    var savedTransforms = [];
    var save = ctx.save;
    ctx.save = function() {
        savedTransforms.push(xform.translate(0, 0));
        return save.call(ctx);
    };

    var restore = ctx.restore;
    ctx.restore = function() {
        xform = savedTransforms.pop();
        return restore.call(ctx);
    };

    var scale = ctx.scale;
    ctx.scale = function(sx, sy) {
        xform = xform.scaleNonUniform(sx, sy);
        return scale.call(ctx, sx, sy);
    };

    var rotate = ctx.rotate;
    ctx.rotate = function(radians) {
        xform = xform.rotate(radians * 180 / Math.PI);
        return rotate.call(ctx, radians);
    };

    var translate = ctx.translate;
    ctx.translate = function(dx, dy) {
        xform = xform.translate(dx, dy);
        return translate.call(ctx, dx, dy);
    };

    var transform = ctx.transform;
    ctx.transform = function(a, b, c, d, e, f) {
        var m2 = svg.createSVGMatrix();
        m2.a = a;
        m2.b = b;
        m2.c = c;
        m2.d = d;
        m2.e = e;
        m2.f = f;
        xform = xform.multiply(m2);
        return transform.call(ctx, a, b, c, d, e, f);
    };

    var setTransform = ctx.setTransform;
    ctx.setTransform = function(a, b, c, d, e, f) {
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx, a, b, c, d, e, f);
    };

    var pt = svg.createSVGPoint();
    ctx.transformedPoint = function(x, y) {
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform(xform.inverse());
    }
}