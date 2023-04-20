var vertices = [];
var indices = defaultIndices;
var articulatedModel = defaultModel;
var colors = [];
var normals = [];
var texcoords = [];
var translation = [0, 0, 0];
var rotation = [0, 0, 0];
var scale = [1, 1, 1];
var projectionMode = "orthographic";
var partSelected = "";
var shadingEnabled = false;
var useTexture = false;
var textureOption = 0;
var textureEnabled = false;
var animationActive = false;
var reqAnime = null;
var cameraAngleRadians = degToRad(0);
var cameraRadius = 20;
var cameraTarget = [0, 0, 0];
var cameraPosition = [0, 0, 5];
var listObject = [];
var parentChildLookup = {};

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
var textureImage = gl.getUniformLocation(program, "u_texture");
var colorUniformLocation = gl.getUniformLocation(program, "u_color");
var colorAttributeLocation = gl.getAttribLocation(program, "a_color");
var matrixLocation = gl.getUniformLocation(program, "u_matrix");
var normalLocation = gl.getAttribLocation(program, "a_normal");
var worldInverseTransposeLocation = gl.getUniformLocation(program, "u_worldInverseTranspose");
var reverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection");
var useLightingLocation = gl.getUniformLocation(program, "u_useLighting");
var useTextureLocation = gl.getUniformLocation(program, "u_useTexture");
var useTextureOption1 = gl.getUniformLocation(program, "u_textureOption1");
var useTextureOption = gl.getUniformLocation(program, "u_textureOption");

var projectionLocation = gl.getUniformLocation(program, "u_projection");
var viewLocation = gl.getUniformLocation(program, "u_view");
var worldLocation = gl.getUniformLocation(program, "u_world");
var textureEnvirontment = gl.getUniformLocation(program, "u_env_texture");
var worldCameraPositionLocation = gl.getUniformLocation(program, "u_worldCameraPosition");

// Set viewport
gl.viewport(0, 0, canvas.width, canvas.height);

document.getElementById("textureImage").onclick = function () {
  textureOption = 0;
  drawScene();
};
document.getElementById("textureEnvirontment").onclick = function () {
  textureOption = 1;
  drawScene();
};
document.getElementById("textureBump").onclick = function () {
  textureOption = 2;
  drawScene();
};

const updateAngleX = () => {
  var angleX = document.getElementById("angleX").value;
  rotation[0] = angleX;
  document.getElementById("angleX-value").innerHTML = angleX;
  changeObjectSelected();
};

const updateAngleY = () => {
  var angleY = document.getElementById("angleY").value;
  rotation[1] = angleY;
  document.getElementById("angleY-value").innerHTML = angleY;
  changeObjectSelected();
};

const updateAngleZ = () => {
  var angleZ = document.getElementById("angleZ").value;
  rotation[2] = angleZ;
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
  
  var normalBuffer = gl.createBuffer();
  var normal = getVectorNormals(vertice);
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
  gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(normalLocation);

  gl.uniform1i(useLightingLocation, shadingEnabled);
  gl.uniform1i(useTextureLocation, useTexture);
  gl.uniform1i(useTextureOption1, textureOption);
  gl.uniform1i(useTextureOption, textureOption);

  if (textureOption == 0){
    gl.uniform1i(textureImage, 0);
    gl.uniform1i(textureEnvirontment, 1);
  } 
  else if (textureOption == 1){
    gl.uniform1i(textureImage, 1);
    gl.uniform1i(textureEnvirontment, 0);
  }

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
        rotation: [0, 0, 0],
        animation: point.animation,
      })
      texcoordsSorted.push(textCoordination)
      colorSorted.push(tmpColor);
      vertexSorted.push(position);
    }
  texcoords = texcoordsSorted;
  vertices = vertexSorted;
  colors = colorSorted;
  parentChildLookup = articulatedModel.tree;
  listObject[0].centerObject = setCenterPosition();
  deleteOptionPart();
  addOptionPart();
  resetDefault();
  generateTreeButtonsRecursive(parentChildLookup, 1);
  drawScene();
}

function generateTreeButtonsRecursive(object, depth) {
  const container = document.getElementById("scrollable-container");
  const button = document.createElement("button");
  button.innerHTML = object.root;
  button.setAttribute("id", object.root);
  button.setAttribute("class", "tree-button");
  button.setAttribute("onclick", "selectPart(this.id)");
  button.style.marginLeft = depth * 15 + "px";
  container.appendChild(button);
  if (object.child.length > 0) {
    for(let j = 0; j < object.child.length; j++) {
      generateTreeButtonsRecursive(object.child[j], depth + 1);
    }
  }
}

function resetComponentTree() {
  const container = document.getElementById("scrollable-container");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function selectPart(part) {
  partSelected = part;
  const componentText = document.getElementById("selected-component");
  componentText.innerHTML = partSelected;
  updateUI();
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
  return center;
}


function onChange(event) {
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event) {
  articulatedModel = JSON.parse(event.target.result);
  listObject = [];
  loadModel();
}

document.getElementById("load").addEventListener("change", onChange);

function drawScene() {
  var body = listObject[0];
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

    if (i==0) {
      matrix = m4.translate(
        matrix,
        body.translation[0],
        body.translation[1],
        body.translation[2]
        );
      matrix = m4.scale(matrix, body.scale[0], body.scale[1], body.scale[2]);
      matrix = m4.translate(matrix, body.centerObject[0], body.centerObject[1], body.centerObject[2])
      matrix = m4.xRotate(matrix, degToRad(body.rotation[0]));
      matrix = m4.yRotate(matrix, degToRad(body.rotation[1]));
      matrix = m4.zRotate(matrix, degToRad(body.rotation[2]));
      matrix = m4.translate(matrix, -body.centerObject[0], -body.centerObject[1], -body.centerObject[2])
  
    }
    else {
      matrix = m4.translate(
        matrix,
        objectSelected.translation[0] + body.translation[0],
        objectSelected.translation[1] + body.translation[1],
        objectSelected.translation[2] + body.translation[2]
        );
      matrix = m4.scale(matrix, body.scale[0], body.scale[1], body.scale[2]);
      matrix = m4.scale(matrix, objectSelected.scale[0], objectSelected.scale[1], objectSelected.scale[2]);
      
      matrix = m4.translate(matrix, body.centerObject[0], body.centerObject[1], body.centerObject[2])
      matrix = m4.xRotate(matrix, degToRad(body.rotation[0]));
      matrix = m4.yRotate(matrix, degToRad(body.rotation[1]));
      matrix = m4.zRotate(matrix, degToRad(body.rotation[2]));
      matrix = m4.translate(matrix, objectSelected.centerObject[0], objectSelected.centerObject[1], objectSelected.centerObject[2])
      matrix = m4.xRotate(matrix, degToRad(objectSelected.rotation[0]));
      matrix = m4.yRotate(matrix, degToRad(objectSelected.rotation[1]));
      matrix = m4.zRotate(matrix, degToRad(objectSelected.rotation[2]));
      matrix = m4.translate(matrix, -objectSelected.centerObject[0], -objectSelected.centerObject[1], -objectSelected.centerObject[2])
      matrix = m4.translate(matrix, -body.centerObject[0], -body.centerObject[1], -body.centerObject[2])
    }

    matrix = m4.multiply(viewMatrix, matrix);
    matrix = m4.multiply(projectionMatrix, matrix);

    var worldMatrix = matrix;
    var worldInverseMatrix = m4.inverse(worldMatrix);

    var modelXRotationRadians = degToRad(0);
    var modelYRotationRadians = degToRad(0);
    var worldMatrix2 = m4.xRotation(modelXRotationRadians);
    worldMatrix2 = m4.yRotate(worldMatrix2, modelYRotationRadians);
    var worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix);


    gl.uniformMatrix4fv(matrixLocation, false, matrix);
    gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix);
    gl.uniform3fv(reverseLightDirectionLocation, normalize(lightDirection));
    //Untuk Environment Texture
    gl.uniformMatrix4fv(projectionLocation, false, projectionMatrix);
    gl.uniformMatrix4fv(viewLocation, false, viewMatrix);
    gl.uniformMatrix4fv(worldLocation, false, worldMatrix2); //Ragu
    gl.uniform3fv(worldCameraPositionLocation, cameraPosition);
    gl.drawElements(this.gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
  }
  
  if (animationActive) {
    listObject.forEach(element => {
      if (element.animation.minAX != element.animation.maxAX) {
        element.rotation[0] += element.animation.incStart;
        if (element.rotation[0] >= element.animation.maxAX || element.rotation[0] <= element.animation.minAX) {
          element.animation.incStart = -element.animation.incStart;
        }
      }
      if (element.animation.minAY != element.animation.maxAY) {
        element.rotation[1] += element.animation.incStart;
        if (element.rotation[1] >= element.animation.maxAY || element.rotation[1] <= element.animation.minAY) {
          element.animation.incStart = -element.animation.incStart;
        }
      }
      if (element.animation.minAZ != element.animation.maxAZ) {
        element.rotation[2] += element.animation.incStart;
        if (element.rotation[2] >= element.animation.maxAZ || element.rotation[2] <= element.animation.minAZ) {
          element.animation.incStart = -element.animation.incStart;
        }
      }
    });
    reqAnime = requestAnimationFrame(drawScene);
  }
}

function resetDefault() {
  resetAllObject();
  resetComponentTree();
  translation = [0,0,0];
  rotation = [0,0,0]
  scale = [1,1,1];
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
  changeModel(newArticulatedModel, listObject);
  let data = JSON.stringify(newArticulatedModel);
  download("model.json", 'text/plain', data);
}

function download(fileName, contentType, content) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
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

function loadEnvironmentTexture(){
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

  const faceInfos = [
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
      url: "./assets/pos-x.jpg",
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      url: "./assets/neg-x.jpg",
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
      url: "./assets/pos-y.jpg",
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      url: "./assets/neg-y.jpg",
    },
    {
      target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
      url: "./assets/pos-z.jpg",
    },
    {
      target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
      url: "./assets/neg-z.jpg",
    },
  ];

  faceInfos.forEach((faceInfo) => {
    const { target, url } = faceInfo;

    // Upload the canvas to the cubemap face.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 512;
    const height = 512;
    const format = gl.RGBA;
    const type = gl.UNSIGNED_BYTE;

    // setup each face so it's immediately renderable
    gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

    // Asynchronously load an image
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
      gl.texImage2D(target, level, internalFormat, format, type, image);
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    };
    image.src = url;
  });
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
}

// if (textureOption == 0){
//   window.onload = loadTexture("./assets/noodles.jpg");
// } else if (textureOption == 1){
//   window.onload = loadEnvironmentTexture();
// }
window.onload = loadEnvironmentTexture();
window.onload = loadTexture("./assets/wood.png");


function addOptionPart() {
  for (var i = 0; i < articulatedModel.edge.length; i++) {
    var option = document.createElement("option");
    option.text = articulatedModel.edge[i].part;
    option.value = articulatedModel.edge[i].part;
    if (i == 0) {
      partSelected = articulatedModel.edge[i].part;
      option.selected = true;
      selectPart(articulatedModel.edge[i].part)
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
    element.rotation = [0,0,0];
    element.scale = [1, 1, 1];
  });
}

function updateChangePart() {
  partSelected = document.getElementById("object-part").value;
  updateUI();
  drawScene();
}

function changeObjectSelected() {
    listObject.forEach(element => {
      if (element.part == partSelected) {
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

function updateUI() {
  listObject.forEach(element => {
    if (element.part == partSelected) {
      document.getElementById("angleX").value = element.rotation[0];
      document.getElementById("angleY").value = element.rotation[1];
      document.getElementById("angleZ").value = element.rotation[2];
      document.getElementById("scaleX").value = element.scale[0];
      document.getElementById("scaleY").value = element.scale[1];
      document.getElementById("scaleZ").value = element.scale[2];
      document.getElementById("translateX").value = element.translation[0];
      document.getElementById("translateY").value = element.translation[1];
      document.getElementById("translateZ").value = element.translation[2];
      document.getElementById("angleX-value").innerHTML = element.rotation[0];
      document.getElementById("angleY-value").innerHTML = element.rotation[1];
      document.getElementById("angleZ-value").innerHTML = element.rotation[2];
      document.getElementById("scaleX-value").innerHTML = element.scale[0];
      document.getElementById("scaleY-value").innerHTML = element.scale[1];
      document.getElementById("scaleZ-value").innerHTML = element.scale[2];
      document.getElementById("translateX-value").innerHTML = element.translation[0];
      document.getElementById("translateY-value").innerHTML = element.translation[1];
      document.getElementById("translateZ-value").innerHTML = element.translation[2];
      translation[0] = element.translation[0];
      translation[1] = element.translation[1];
      translation[2] = element.translation[2];
      rotation[0] = element.rotation[0];
      rotation[1] = element.rotation[1];
      rotation[2] = element.rotation[2];
      scale[0] = element.scale[0];
      scale[1] = element.scale[1];
      scale[2] = element.scale[2];
    }
  });
}

loadModel();

