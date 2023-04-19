var vertexShaderSource = `
attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec4 a_color;
attribute vec2 a_texcoord;

uniform mat4 u_matrix;
uniform vec2 u_resolution;
uniform mat4 u_worldInverseTranspose;
uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_world;

varying vec3 v_normal;
varying vec2 v_texcoord;
varying vec4 v_color;
varying vec3 v_worldPosition;
varying vec3 v_worldNormal;

uniform int u_textureOption1;

void main() {
  if (u_textureOption1 == 0){
    gl_Position = u_matrix * a_position;
    v_normal = mat3(u_worldInverseTranspose) * a_normal;
    v_color = a_color;
    v_texcoord = a_texcoord;
  } 
  else if (u_textureOption1 == 1){
    //gl_Position = u_projection * u_view * u_world * a_position;
    gl_Position = u_matrix * a_position;
    v_worldPosition = (u_worldInverseTranspose * a_position).xyz;
    v_worldNormal = mat3(u_worldInverseTranspose) * a_normal;
    v_color = a_color;
  } 
  else {
    gl_Position = u_matrix * a_position;
    v_normal = mat3(u_worldInverseTranspose) * a_normal;
    v_color = a_color;
    v_texcoord = a_texcoord;
  }
}
`;

var fragmentShaderSource = `
precision highp float;
varying vec4 v_color;
varying vec3 v_normal;
varying vec2 v_texcoord;
varying vec3 v_worldPosition;
varying vec3 v_worldNormal;

uniform sampler2D u_texture;
uniform samplerCube u_env_texture;
uniform vec3 u_reverseLightDirection;
uniform bool u_useLighting;
uniform bool u_useTexture;
uniform int u_textureOption;
uniform vec3 u_worldCameraPosition;

void main() {
  if (u_useTexture) {
    if(u_textureOption == 0){
      gl_FragColor = texture2D(u_texture, v_texcoord);
    } 
    else if(u_textureOption == 1){
      vec3 worldNormal = normalize(v_worldNormal);
      vec3 eyeToSurfaceDir = normalize(v_worldPosition - u_worldCameraPosition);
      vec3 direction = reflect(eyeToSurfaceDir,v_normal);
      gl_FragColor = textureCube(u_env_texture, direction);
    } 
    else {
      gl_FragColor = v_color;
    }
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