var vertexShaderSource = `
attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec4 a_color;
attribute vec2 a_texcoord;
uniform mat4 u_matrix;
uniform vec2 u_resolution;
uniform mat4 u_worldInverseTranspose;
varying vec3 v_normal;
varying vec2 v_texcoord;
varying vec4 v_color;

void main() {
  gl_Position = u_matrix * a_position;
  v_normal = mat3(u_worldInverseTranspose) * a_normal;
  v_color = a_color;
  v_texcoord = a_texcoord;
}
`;

var fragmentShaderSource = `
precision mediump float;
varying vec4 v_color;
varying vec3 v_normal;
varying vec2 v_texcoord;
uniform sampler2D u_texture;
uniform vec3 u_reverseLightDirection;
uniform bool u_useLighting;
uniform bool u_useTexture;

void main() {
  if (u_useTexture) {
    gl_FragColor = texture2D(u_texture, v_texcoord);
  }
  else {
    gl_FragColor = v_color;
  }
  if (u_useLighting) {
    vec3 normal = normalize(v_normal);
    float light = dot(normal, u_reverseLightDirection);
    gl_FragColor.rgb *= light;
  }
}`;
 
// Create a shader object, upload the source and compile the shader.
function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
      alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
  }
  return shader;
}

// Create the shader program.
function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.log("Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
      alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
  }
  return program;
}