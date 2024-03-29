// Class Scene: represents the WebGL scene.
GLV.Scene = function(){
    this.meshes = {};    // Contains the meshes of the objects
    this.objects = [];   // Contains objects (each one refers to a mesh)
    this.light = new GLV.Light();
    this.pos = new Vec3(0.0, 0.0, 0.0);
    this.scale = new Vec3(1.0, 1.0, 1.0);
};

GLV.Scene.prototype.init = function init(){
    // Create meshes
    this.meshes["Plane"] = GLV.Mesh.createPlane();
    this.meshes["Base"] = GLV.Mesh.createCube([0.3, 0.3, 0.3, 1.0]);
    this.meshes["Cube"] = GLV.Mesh.createCube([0.4, 0.4, 0.4, 1.0]);
    this.meshes["CubeGreen"] = GLV.Mesh.createCube([0.4, 1.0, 0.4, 1.0]);
    this.meshes["Sphere"] = GLV.Mesh.createSphere(60, 60, [0.7, 0.7, 0.4]);
    this.meshes["EyeL"] = GLV.Mesh.createSphere(10, 10, [0.7, 0.2, 0.2]);
    this.meshes["EyeR"] = GLV.Mesh.createSphere(10, 10, [0.2, 0.2, 0.7]);
    
    // Create objects
    var objs = [
        // [MODEL_NAME, POSITION = [X, Y, Z], SCALE = [X, Y, Z], ROTATION = [theta_deg, phi_deg]]
        [ "Base", [0.0, 0.0, 0.0], [200.0, 10.0, 200.0] ], // Ground
        [ "CubeGreen", [55.0, 10.0, 30.0], [20.0, 10.0, 20.0] ],
        [ "Sphere", [30.0, 30.0, 0.0], [20.0, 20.0, 20.0] ],
		[ "Sphere", [-30.0, 30.0, 0.0], [20.0, 20.0, 20.0] ],
    ];
    for (var i = 0; i < objs.length; ++i){
        var objData = objs[i];
        this.objects[i] = new GLV.Object(objData[0]);
        if (objData[1] instanceof Array) this.objects[i].pos = new Vec3(objData[1]);
        if (objData[2] instanceof Array) this.objects[i].scale = new Vec3(objData[2]);
        if (objData[3] instanceof Array){
            this.objects[i].theta = objData[3][0];
            this.objects[i].phi = objData[3][1];
        }
    }
};

GLV.Scene.prototype.add = function add( obj ){
    this.objects[this.objects.length] = obj;
};

GLV.Scene.prototype.incrScale = function(v){
    this.scale.add(v);
    if (this.scale.x < 0.1 || this.scale.y < 0.1 || this.scale.z < 0.1)
        this.scale.x = this.scale.y = this.scale.z = 0.1;
};

GLV.Scene.prototype.loadObj = function(objStr, mtlStr){
    this.objects = [];
    this.meshes["LoadedObj"] = GLV.Mesh.loadObj(objStr, mtlStr);
    var obj = new GLV.Object("LoadedObj");
    obj.scale = new Vec3(100.0, 100.0, 100.0);
    this.objects[0] = obj;
};

GLV.Scene.prototype.draw = function draw(mvm, pm){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Set global uniforms
    var shaderProg = GLV.ShaderManager.getActiveShader();
    gl.uniform1i(shaderProg.uUseColor, GLV.uiUseColor);
    
    this.light.setUniforms(shaderProg, mvm);
    
    // Apply scene transformations
    mvm.translate(this.pos);
    mvm.scale(this.scale.toArray());
    
    // Draw the objects of the scene
    for (var i = 0; i < this.objects.length; ++i)
        this.objects[i].draw(mvm.copy(), pm.copy());
    
};


