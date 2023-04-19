texcoordtemp = [
    // select the top left image
    0   , 0  ,
    0   , 0.5,
    0.25, 0  ,
    0   , 0.5,
    0.25, 0.5,
    0.25, 0  ,
    // select the top middle image
    0.25, 0  ,
    0.5 , 0  ,
    0.25, 0.5,
    0.25, 0.5,
    0.5 , 0  ,
    0.5 , 0.5,
    // select to top right image
    0.5 , 0  ,
    0.5 , 0.5,
    0.75, 0  ,
    0.5 , 0.5,
    0.75, 0.5,
    0.75, 0  ,
    // select the bottom left image
    0   , 0.5,
    0.25, 0.5,
    0   , 1  ,
    0   , 1  ,
    0.25, 0.5,
    0.25, 1  ,
    // select the bottom middle image
    0.25, 0.5,
    0.25, 1  ,
    0.5 , 0.5,
    0.25, 1  ,
    0.5 , 1  ,
    0.5 , 0.5,
    // select the bottom right image
    0.5 , 0.5,
    0.75, 0.5,
    0.5 , 1  ,
    0.5 , 1  ,
    0.75, 0.5,
    0.75, 1  ,
    ]

const defaultModel = {
    "points":[
        [-1.2, 0, 1.5],
        [-1.2, 5, 1.5],
        [-1.2, 0, -1],
        [-1.2, 5, -1],
        [0.6, 0, 1.5],
        [0.6, 5, 1.5],
        [0.6, 0, -1],
        [0.6, 5, -1],
        [0.5, 0, 1.5],
        [0.5, -5, 1.5],
        [0.5, 0, 0.25],
        [0.5, -5, 0.25],
        [-1.3, 0, 1.5],
        [-1.3, -5, 1.5],
        [-1.3, 0, 0.25],
        [-1.3, -5, 0.25],
        [0.5, -5, 0.24],
        [0.5, -0.001, 0.24],
        [0.5, -5, -1],
        [0.5, -0.001, -1],
        [-1.3, -0.001, -1],
        [-1.3, -5, -1],
        [-1.3, -0.001, 0.24],
        [-1.3, -5, 0.24],
        [-1.2, 0, 1.51],
        [-1.2, 0, 2.8],
        [0.6, 0, 1.51],
        [0.6, 0, 2.8],
        [-1.2, 5, 1.51],
        [-1.2, 5, 2.8],
        [0.6, 5, 1.51],
        [0.6, 5, 2.8],
        [-1.2, 0, -1],
        [-1.2, 0, -2.3],
        [0.6, 0, -1],
        [0.6, 0, -2.3],
        [-1.2, 5, -1],
        [-1.2, 5, -2.3],
        [0.6, 5, -1],
        [0.6, 5, -2.3],
        [-1.45, 5.01, 1.6],
        [-1.45, 8, 1.6],
        [-1.45, 5.01, -1.1],
        [-1.45, 8, -1.1],
        [0.85, 5.01, 1.6],
        [0.85, 8, 1.6],
        [0.85, 5.01, -1.1],
        [0.85, 8, -1.1],
        [-1.2, 0, -1],
        [-1.2, 5, -1],
        [0.6, 0, -1],
        [0.6, 5, -1],
        [0.6, 0, 1.5],
        [0.6, 5, 1.5],
        [-1.2, 5, 1.5],
        [-1.2, 0, 1.5],
        [-1.2, 0, -1],
        [0.6, 0, -1],
        [0.6, 0, 1.5],
        [-1.2, 0, 1.5],
        [0.6, 5, -1],
        [-1.2, 5, -1],
        [-1.2, 5, 1.5],
        [0.6, 5, 1.5],
        [0.5, 0, 0.25],
        [0.5, -5, 0.25],
        [-1.3, 0, 0.25],
        [-1.3, -5, 0.25],
        [-1.3, 0, 1.5],
        [-1.3, -5, 1.5],
        [0.5, -5, 1.5],
        [0.5, 0, 1.5],
        [0.5, 0, 0.25],
        [-1.3, 0, 0.25],
        [-1.3, 0, 1.5],
        [0.5, 0, 1.5],
        [-1.3, -5, 0.25],
        [0.5, -5, 0.25],
        [0.5, -5, 1.5],
        [-1.3, -5, 1.5],
        [0.5, -0.001, 0.24],
        [0.5, -5, 0.24],
        [-1.3, -0.001, 0.24],
        [-1.3, -5, 0.24],
        [-1.3, -0.001, -1],
        [-1.3, -5, -1],
        [0.5, -5, -1],
        [0.5, -0.001, -1],
        [0.5, -0.001, 0.24],
        [-1.3, -0.001, 0.24],
        [-1.3, -0.001, -1],
        [0.5, -0.001, -1],
        [-1.3, -5, 0.24],
        [0.5, -5, 0.24],
        [0.5, -5, -1],
        [-1.3, -5, -1],
        [0.6, 0, 1.51],
        [0.6, 0, 2.8],
        [0.6, 5, 1.51],
        [0.6, 5, 2.8],
        [-1.2, 5, 1.51],
        [-1.2, 5, 2.8],
        [-1.2, 0, 2.8],
        [-1.2, 0, 1.51],
        [0.6, 0, 1.51],
        [0.6, 5, 1.51],
        [-1.2, 5, 1.51],
        [-1.2, 0, 1.51],
        [0.6, 5, 2.8],
        [0.6, 0, 2.8],
        [-1.2, 0, 2.8],
        [-1.2, 5, 2.8],
        [0.6, 0, -1],
        [0.6, 0, -2.3],
        [0.6, 5, -1],
        [0.6, 5, -2.3],
        [-1.2, 5, -1],
        [-1.2, 5, -2.3],
        [-1.2, 0, -2.3],
        [-1.2, 0, -1],
        [0.6, 0, -1],
        [0.6, 5, -1],
        [-1.2, 5, -1],
        [-1.2, 0, -1],
        [0.6, 5, -2.3],
        [0.6, 0, -2.3],
        [-1.2, 0, -2.3],
        [-1.2, 5, -2.3],
        [-1.45, 5.01, -1.1],
        [-1.45, 8, -1.1],
        [0.85, 5.01, -1.1],
        [0.85, 8, -1.1],
        [0.85, 5.01, 1.6],
        [0.85, 8, 1.6],
        [-1.45, 8, 1.6],
        [-1.45, 5.01, 1.6],
        [-1.45, 5.01, -1.1],
        [0.85, 5.01, -1.1],
        [0.85, 5.01, 1.6],
        [-1.45, 5.01, 1.6],
        [0.85, 8, -1.1],
        [-1.45, 8, -1.1],
        [-1.45, 8, 1.6],
        [0.85, 8, 1.6]
    ],
    "edge":[
        {
            "parts": "body",
            "topology": [
                [0, 1, 3, 2],
                [48, 49, 7, 6],
                [50, 51, 5, 4],
                [52, 53, 54, 55],
                [56, 57, 58, 59],
                [60, 61, 62, 63]
            ],
            "color":[
                [1.0,0.0,0.0,1.0],
                [1.0,0.0,0.0,1.0],    
                [1.0,0.0,0.0,1.0],
                [1.0,0.0,0.0,1.0],
                [1.0,0.0,0.0,1.0],
                [1.0,0.0,0.0,1.0]
            ], "textcoord": texcoordtemp,
        },
        {
            "parts": "right leg",
            "topology": [
                [8, 9, 11, 10],
                [64, 65, 15, 14],
                [66, 67, 13, 12],
                [68, 69, 70, 71],
                [72, 73, 74, 75],
                [76, 77, 78, 79]
            ],
            "color":[
                [0.0,1.0,0.0,1.0],
                [0.0,1.0,0.0,1.0],
                [0.0,1.0,0.0,1.0],
                [0.0,1.0,0.0,1.0],
                [0.0,1.0,0.0,1.0],
                [0.0,1.0,0.0,1.0]
            ], "textcoord": texcoordtemp,
        },
        {
            "parts": "left leg",
            "topology": [
                [16, 17, 19, 18],
                [80, 81, 23, 22],
                [82, 83, 21, 20],
                [84, 85, 86, 87],
                [88, 89, 90, 91],
                [92, 93, 94, 95]
            ], 
            "color":[
                [0.0,0.0,1.0,1.0],
                [0.0,0.0,1.0,1.0],
                [0.0,0.0,1.0,1.0],
                [0.0,0.0,1.0,1.0],
                [0.0,0.0,1.0,1.0],
                [0.0,0.0,1.0,1.0]
            ],"textcoord": texcoordtemp,
        },
        {
            "parts": "right arm",
            "topology": [
                [24, 25, 27, 26],
                [96, 97, 31, 30],
                [98, 99, 29, 28],
                [100, 101, 102, 103],
                [104, 105, 106, 107],
                [108, 109, 110, 111]
            ],
            "color":[
                [1.0,1.0,1.0,1.0],
                [1.0,1.0,1.0,1.0],
                [1.0,1.0,1.0,1.0],
                [1.0,1.0,1.0,1.0],
                [1.0,1.0,1.0,1.0],
                [1.0,1.0,1.0,1.0]
            ],"textcoord": texcoordtemp,
        },
        {
            "parts": "left arm",
            "topology": [
                [32, 33, 35, 34],
                [112, 113, 39, 38],
                [114, 115, 37, 36],
                [116, 117, 118, 119],
                [120, 121, 122, 123],
                [124, 125, 126, 127]
            ],
            "color":[
                [1.0,1.0,0.0,1.0],
                [1.0,1.0,0.0,1.0],
                [1.0,1.0,0.0,1.0],
                [1.0,1.0,0.0,1.0],
                [1.0,1.0,0.0,1.0],
                [1.0,1.0,0.0,1.0]
            ],"textcoord": texcoordtemp,
        },
        {
            "parts": "head",
            "topology": [
                [40, 41, 43, 42],
                [128, 129, 47, 46],
                [130, 131, 45, 44],
                [132, 133, 134, 135],
                [136, 137, 138, 139],
                [140, 141, 142, 143]
            ],
            "color":[
                [1.0,0.0,1.0,1.0],
                [1.0,0.0,1.0,1.0],
                [1.0,0.0,1.0,1.0],
                [1.0,0.0,1.0,1.0],
                [1.0,0.0,1.0,1.0],
                [1.0,0.0,1.0,1.0]
            ],"textcoord": texcoordtemp,
        },
    ]};


function radToDeg(r) {
  return r * 180 / Math.PI;
}

function degToRad(d) {
  return d * Math.PI / 180;
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function subtractVectors(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function normalize(v) {
  var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // make sure we don't divide by 0.
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
}

function calculateNormalVector(v0, v1, v2) {
  const u = subtractVectors(v1, v0);
  const v = subtractVectors(v2, v0);
  const normal = cross(u, v);
  const normalized = normalize(normal);
  return normalized;
}

function getVectorNormals(position) {
  const n = position.length;
  var normals = [];
  for (let i = 0; i < n; i += 12){
    const p1 = position.slice(i, i+3);
    const p2 = position.slice(i+3, i+6);
    const p3 = position.slice(i+6, i+9);
    const vec1 = subtractVectors(p2, p1);
    const vec2 = subtractVectors(p3, p1);
    const normalDirection = cross(vec1, vec2);
    const vecNormal  = normalize(normalDirection);
    normals.push(...vecNormal, ...vecNormal, ...vecNormal, ...vecNormal);
  }
  return normals;
}

const defaultIndices = [
  0,  1,  2,      0,  2,  3,    // front
  4,  5,  6,      4,  6,  7,    // back
  8,  9,  10,     8,  10, 11,   // top
  12, 13, 14,     12, 14, 15,   // bottom
  16, 17, 18,     16, 18, 19,   // right
  20, 21, 22,     20, 22, 23,   // left
];

function matrixMultiplication(matrixA, matrixB) {
    const result = [];
    for (let i = 0; i < matrixA.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrixB[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < matrixA[0].length; k++) {
                sum += matrixA[i][k] * matrixB[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function changeModel(model, rotateX, rotateY, rotateZ, centerPositionX, centerPositionY, centerPositionZ, scaleX, scaleY, scaleZ, translateX, translateY, translateZ) {
    let matrixResult = [], mTmp = [];
    var matrix = m4.identity();
    matrix = m4.translate(matrix, translateX, translateY, translateZ);
    matrix = m4.scale(matrix, scaleX, scaleY, scaleZ);
    matrix = m4.translate(matrix, centerPositionX, centerPositionY, centerPositionZ);
    matrix = m4.xyzRotate(matrix, rotateX, rotateY, rotateZ);
    matrix = m4.translate(matrix, -centerPositionX, -centerPositionY, -centerPositionZ);
    for (let i = 0; i < matrix.length; i++) {
        mTmp.push(matrix[i]);
        if (mTmp.length == 4) {
            matrixResult.push(mTmp);
            mTmp = [];
        }
    }
    for (let i = 0; i < model.points.length; i++) {
        let point = model.points[i];
        let matrixModel = [[point[0], point[1], point[2], 1]];
        let result = matrixMultiplication(matrixModel, matrixResult);
        model.points[i] = [result[0][0], result[0][1], result[0][2]];
    }
}

function requestCORSIfNotSameOrigin(img, url) {
    if ((new URL(url, window.location.href)).origin !== window.location.origin) {
      img.crossOrigin = "";
    }
  }
  
  function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
  }