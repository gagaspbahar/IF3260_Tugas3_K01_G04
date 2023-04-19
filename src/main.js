var vertices = [];
var indices = defaultIndices;
var articulatedModel = defaultModel;
var colors = [];
var normals = [];
var texcoords = [];
var translation = [0, 0, 0];
var rotation = [degToRad(0), degToRad(0), degToRad(0)];
var scale = [1, 1, 1];
var projectionMode = "orthographic";
var partSelected = "";
var shadingEnabled = false;
var useTexture = false;
var textureEnabled = false;
var animationActive = false;
var rotateX = 0;
var rotateY = 0;
var rotateZ = 0;
var rotateAxis = 0;
var reqAnime = null;
var cameraAngleRadians = degToRad(0);
var cameraRadius = 20;
var cameraTarget = [0, 0, 0];
var cameraPosition = [0, 0, 5];
var centerPosition = [0, 0, 0];
var centerObject = [];
var numObject = 0;
var listObject = [];

var lightDirection = [0.5, 0.7, -1];

var fieldOfView = (60 * Math.PI) / 180; // in radians
var zNear = 1;
var zFar = 2000;
var left = -10;
var right = 10;
var bottom = -10;
var topFov = 10;
var near = -100;
var far = 100;
var up = [0, 1, 0];


// Initialize the WebGL context
var canvas = document.querySelector("#gl-canvas");
var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
if (!gl) {
  alert("WebGL not available");
}
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

// Create, upload, and compile the shaders
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

// Link the two shaders above into a program
var program = createProgram(gl, vertexShader, fragmentShader);

gl.useProgram(program);

var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
var texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");
var textureUniformLocation = gl.getUniformLocation(program, "u_texture");
var colorUniformLocation = gl.getUniformLocation(program, "u_color");
var colorAttributeLocation = gl.getAttribLocation(program, "a_color");
var matrixLocation = gl.getUniformLocation(program, "u_matrix");
var normalLocation = gl.getAttribLocation(program, "a_normal");
var worldInverseTransposeLocation = gl.getUniformLocation(program, "u_worldInverseTranspose");
var reverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection");
var useLightingLocation = gl.getUniformLocation(program, "u_useLighting");
var useTextureLocation = gl.getUniformLocation(program, "u_useTexture");

// Set viewport
gl.viewport(0, 0, canvas.width, canvas.height);

const updateAngleX = () => {
  var angleX = document.getElementById("angleX").value;
  rotation[0] = degToRad(angleX);
  document.getElementById("angleX-value").innerHTML = angleX;
  changeObjectSelected();
};

const updateAngleY = () => {
  var angleY = document.getElementById("angleY").value;
  rotation[1] = degToRad(angleY);
  document.getElementById("angleY-value").innerHTML = angleY;
  changeObjectSelected();
};

const updateAngleZ = () => {
  var angleZ = document.getElementById("angleZ").value;
  rotation[2] = degToRad(angleZ);
  document.getElementById("angleZ-value").innerHTML = angleZ;
  changeObjectSelected();
};

const updateScaleX = () => {
  var scaleX = document.getElementById("scaleX").value;
  scale[0] = scaleX;
  document.getElementById("scaleX-value").innerHTML = scaleX;
  changeObjectSelected();
};

const updateScaleY = () => {
  var scaleY = document.getElementById("scaleY").value;
  scale[1] = scaleY;
  document.getElementById("scaleY-value").innerHTML = scaleY;
  changeObjectSelected();
};

const updateScaleZ = () => {
  var scaleZ = document.getElementById("scaleZ").value;
  scale[2] = scaleZ;
  document.getElementById("scaleZ-value").innerHTML = scaleZ;
  changeObjectSelected();
};

const updateTranslateX = () => {
  var translateX = parseFloat(document.getElementById("translateX").value);
  translation[0] = translateX;
  document.getElementById("translateX-value").innerHTML = translateX;
  changeObjectSelected();
};

const updateTranslateY = () => {
  var translateY = parseFloat(document.getElementById("translateY").value);
  translation[1] = translateY;
  document.getElementById("translateY-value").innerHTML = translateY;
  changeObjectSelected();
};

const updateTranslateZ = () => {
  var translateZ = parseFloat(document.getElementById("translateZ").value);
  translation[2] = translateZ;
  document.getElementById("translateZ-value").innerHTML = translateZ;
  changeObjectSelected();
};

const updateCameraX = () => {
  var cameraX = parseFloat(document.getElementById("cameraX").value);
  cameraPosition[0] = cameraX;
  document.getElementById("cameraX-value").innerHTML = cameraX;
  drawScene();
}

const updateCameraY = () => {
  var cameraY = parseFloat(document.getElementById("cameraY").value);
  cameraPosition[1] = cameraY;
  document.getElementById("cameraY-value").innerHTML = cameraY;
  drawScene();
}

const updateCameraZ = () => {
  var cameraZ = parseFloat(document.getElementById("cameraZ").value);
  cameraPosition[2] = cameraZ;
  document.getElementById("cameraZ-value").innerHTML = cameraZ;
  drawScene();
}

const updateCameraRadius = () => {
  var cameraRadiusTemp = parseFloat(document.getElementById("cameraRadius").value);
  cameraRadius = cameraRadiusTemp;
  document.getElementById("cameraRadius-value").innerHTML = cameraRadius;
  drawScene();
}

const updateProjectionMode = () => {
  projectionMode = document.getElementById("projection-type").value;
  drawScene();
};

const toggleShading = () => {
  shadingEnabled = !shadingEnabled;
  var text = shadingEnabled ? "On" : "Off";
  document.getElementById("shading-label").innerHTML = text;
  drawScene();
};

const toggleTexture = () => {
  useTexture = !useTexture;
  var text = useTexture ? "On" : "Off";
  document.getElementById("texture-label").innerHTML = text;
  drawScene();
};

const toggleAnimation = () => {
  animationActive = !animationActive;
  var text = animationActive ? "On" : "Off";
  document.getElementById("animation-label").innerHTML = text;
  drawScene();
};

const rotateToX = () => {
  rotateAxis = 0;
};

const rotateToY = () => {
  rotateAxis = 1;
};

const rotateToZ = () => {
  rotateAxis = 2;
};

function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

function requestCORSIfNotSameOrigin(img, url) {
  if ((new URL(url, window.location.href)).origin !== window.location.origin) {
    img.crossOrigin = "";
  }
}

function render(vertice, color, texcoord) {

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertice), gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionAttributeLocation);
  var faceColors = [];
  for (var j = 0; j < color.length; ++j) {
    const c = color[j];
    for (var i = 0; i < 4; ++i) {
      faceColors = faceColors.concat(c);
    }
  }

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(faceColors), gl.STATIC_DRAW);
  gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(colorAttributeLocation);

  var textcoordBuffer= gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoord), gl.STATIC_DRAW);
  gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(texcoordAttributeLocation);
  
  // test texture
//  loadTexture("./noodles.jpg")
  
  var normalBuffer = gl.createBuffer();
  var normal = getVectorNormals(vertice);
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
  gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(normalLocation);

  gl.uniform1i(useLightingLocation, shadingEnabled);
  gl.uniform1i(textureUniformLocation, 0);
  gl.uniform1i(useTextureLocation, useTexture);

  const indicesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );
}

function loadModel() {
  let vertice = articulatedModel.points;
  let vertexSorted = [];
  let colorSorted = [];
  let texcoordsSorted = [];
  let centerObjectSorted = [];
  centerObjectSorted.push(setCenterPosition())
    for (let i = 0; i < articulatedModel.edge.length; i++) {
      let point = articulatedModel.edge[i];
      let textCoordination = articulatedModel.edge[i].textcoord;
      let listPoint = []
      let tmpColor = [];
      let position = [];
      for (let j = 0; j < point.topology.length; j++) {
        for (let k = 0; k < 4; k++) {
          position = position.concat(vertice[point.topology[j][k]]);
          listPoint.push(vertice[point.topology[j][k]])
        }
        tmpColor.push(point.color[j]);
      }
      listObject.push({
        part : point.part,
        vertice : position,
        color : tmpColor,
        textcoord : textCoordination,
        centerObject : setCenterObject(listPoint),
        translation : [0,0,0],
        scale: [1,1,1],
        rotation: [degToRad(0), degToRad(0), degToRad(0)]
      })
      
      texcoordsSorted.push(textCoordination)
      colorSorted.push(tmpColor);
      vertexSorted.push(position);
    }
  texcoords = texcoordsSorted;
  vertices = vertexSorted;
  colors = colorSorted;
  setCenterPosition();
  deleteOptionPart();
  addOptionPart();
  drawScene();
}

function setCenterObject(position) {
  let center = [0, 0, 0];
  for (let i = 0; i < position.length; i++) {
    center[0] += position[i][0];
    center[1] += position[i][1];
    center[2] += position[i][2];
  }
  center[0] /= position.length;
  center[1] /= position.length;
  center[2] /= position.length;
  return center;
}

function setCenterPosition() {
  let center = [0, 0, 0];
  for (let i = 0; i < articulatedModel.points.length; i++) {
    center[0] += articulatedModel.points[i][0];
    center[1] += articulatedModel.points[i][1];
    center[2] += articulatedModel.points[i][2];
  }
  center[0] /= articulatedModel.points.length;
  center[1] /= articulatedModel.points.length;
  center[2] /= articulatedModel.points.length;
  centerPosition = center;
}


function onChange(event) {
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event) {
  articulatedModel = JSON.parse(event.target.result);
  loadModel();
}

document.getElementById("load").addEventListener("change", onChange);

function drawScene() {
  if (reqAnime) {
    cancelAnimationFrame(reqAnime);
  }
  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw a rectangle
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  for (let i = 0; i < listObject.length; i++) {
    var objectSelected = listObject[i];
    var center = (partSelected != listObject[i].part) || i==0 ? centerPosition : objectSelected.centerObject;
    var count = objectSelected.vertice.length / 2;
    render(objectSelected.vertice, objectSelected.color, objectSelected.textcoord);
    var matrix = m4.identity();

    var cameraMatrix = m4.identity();
    var zoom = cameraRadius / 20;
    cameraMatrix = m4.lookAt(cameraPosition, cameraTarget, up, zoom);
    
    var viewMatrix = m4.inverse(cameraMatrix);
    var projectionMatrix = m4.identity();

    if (projectionMode == "orthographic") {
      projectionMatrix = m4.orthographic(left, right, bottom, topFov, near, far);
    } else if (projectionMode == "perspective") {
      projectionMatrix = m4.perspective(fieldOfView, aspect, zNear, zFar);
    } else if (projectionMode == "oblique") {
      projectionMatrix = m4.oblique(left, right, bottom, topFov, near, far, 45, 45);
    }

    matrix = m4.translate(
      matrix,
      objectSelected.translation[0],
      objectSelected.translation[1],
      objectSelected.translation[2]
      );
    matrix = m4.scale(matrix, objectSelected.scale[0], objectSelected.scale[1], objectSelected.scale[2]);

    matrix = m4.translate(matrix, center[0], center[1], center[2])
    matrix = m4.xRotate(matrix, objectSelected.rotation[0]);
    matrix = m4.yRotate(matrix, objectSelected.rotation[1]);
    matrix = m4.zRotate(matrix, objectSelected.rotation[2]);
    matrix = m4.translate(matrix, -center[0], -center[1], -center[2])

    matrix = m4.multiply(viewMatrix, matrix);
    matrix = m4.multiply(projectionMatrix, matrix);

    var worldMatrix = matrix;
    var worldInverseMatrix = m4.inverse(worldMatrix);
    var worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix);


    gl.uniformMatrix4fv(matrixLocation, false, matrix);
    gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix);
    gl.uniform3fv(reverseLightDirectionLocation, normalize(lightDirection));
    gl.drawElements(this.gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
  }
  if (animationActive) {
    if (rotateAxis == 0) {
      if (rotateX == 360 ) {
        rotateX = 0;
      }
      rotateX+=1;
      rotation[0] = degToRad(rotateX);
    }
    else if (rotateAxis == 1) {
      if (rotateY == 360 ) {
        rotateY = 0;
      }
      rotateY+=1;
      rotation[1] = degToRad(rotateY);
    }
    else {
      if (rotateZ == 360 ) {
        rotateZ = 0;
      }
      rotateZ+=1;
      rotation[2] = degToRad(rotateZ);
    }
    reqAnime = requestAnimationFrame(drawScene);
}
}

function resetDefault() {
  resetAllObject();
  cameraPosition = [0, 0, 5];
  document.getElementById("angleX").value = 0;
  document.getElementById("angleY").value = 0;
  document.getElementById("angleZ").value = 0;
  document.getElementById("scaleX").value = 1;
  document.getElementById("scaleY").value = 1;
  document.getElementById("scaleZ").value = 1;
  document.getElementById("translateX").value = 0;
  document.getElementById("translateY").value = 0;
  document.getElementById("translateZ").value = 0;
  document.getElementById("cameraX").value = 0;
  document.getElementById("cameraY").value = 0;
  document.getElementById("cameraZ").value = 5;
  document.getElementById("cameraRadius").value = 20;
  document.getElementById("angleX-value").innerHTML = 0;
  document.getElementById("angleY-value").innerHTML = 0;
  document.getElementById("angleZ-value").innerHTML = 0;
  document.getElementById("scaleX-value").innerHTML = 1;
  document.getElementById("scaleY-value").innerHTML = 1;
  document.getElementById("scaleZ-value").innerHTML = 1;
  document.getElementById("translateX-value").innerHTML = 0;
  document.getElementById("translateY-value").innerHTML = 0;
  document.getElementById("translateZ-value").innerHTML = 0;
  document.getElementById("cameraX-value").innerHTML = 0;
  document.getElementById("cameraY-value").innerHTML = 0;
  document.getElementById("cameraZ-value").innerHTML = 5;
  document.getElementById("cameraRadius-value").innerHTML = 20;

  drawScene();
}

function saveModel() {
  var newArticulatedModel = JSON.parse(JSON.stringify(articulatedModel));
  changeModel(newArticulatedModel, rotation[0], rotation[1], rotation[2], centerPosition[0], centerPosition[1], centerPosition[2], scale[0], scale[1], scale[2], translation[0], translation[1], translation[2]);
  let data = JSON.stringify(newArticulatedModel);
  download("model.json", 'text/plain', data);
}

function download(fileName, contentType, content) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createModelURL(file);
  a.download = fileName;
  a.click();
}

function loadTexture(url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

  const image = new Image();
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  requestCORSIfNotSameOrigin(image, url);
  image.src = url;

  return texture;
}

window.onload = loadTexture("./noodles.jpg");
function addOptionPart() {
  for (var i = 0; i < articulatedModel.edge.length; i++) {
    var option = document.createElement("option");
    option.text = articulatedModel.edge[i].part;
    option.value = articulatedModel.edge[i].part;
    if (i == 0) {
      partSelected = articulatedModel.edge[i].part;
      option.selected = true;
    }
    document.getElementById("object-part").appendChild(option);
  }
}

function deleteOptionPart() {
  var optionPart = document.getElementById("object-part");
  while (optionPart.hasChildNodes()) {
    optionPart.removeChild(optionPart.firstChild);
  }
}

function resetAllObject() {
  listObject.forEach(element => {
    element.translation = [0, 0, 0];
    element.rotation = [degToRad(0), degToRad(0), degToRad(0)];
    element.scale = [1, 1, 1];
  });
}

function updateChangePart() {
  partSelected = document.getElementById("object-part").value;
  drawScene();
}

function changeObjectSelected() {
    listObject.forEach(element => {
      if (partSelected == listObject[0].part || element.part == partSelected) {
      element.translation[0] = translation[0];
      element.translation[1] = translation[1];
      element.translation[2] = translation[2];
      element.rotation[0] = rotation[0];
      element.rotation[1] = rotation[1];
      element.rotation[2] = rotation[2];
      element.scale[0] = scale[0];
      element.scale[1] = scale[1];
      element.scale[2] = scale[2];
      }
    });
    drawScene();
}

loadModel();

