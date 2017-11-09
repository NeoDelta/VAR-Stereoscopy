// Class DisplaySurface: Each of the walls of a CAVE.
DisplaySurface = function(orig, uvector, vvector){ // (orig = Vec3, uvector = Vec3, vvector = Vec3)
    
    this.origin = orig; // Vec3 - Origin of the display
    this.u = uvector;   // Vec3 - Horizontal vector
    this.v = vvector;   // Vec3 - Vertical vector

};

// Functions

DisplaySurface.prototype.viewingMatrix = function(eye){
	var mat = new Mat4();
    mat.loadIdentity();
	// ....

	var x2 = new Vec3(this.origin.x, this.origin.y, this.origin.z);
	x2.add(this.u);
	var x3 = new Vec3(this.origin.x, this.origin.y, this.origin.z);
	x3.add(this.v);

	var sub2 = Vec3.subtract(x2, this.origin);
	var sub3 = Vec3.subtract(x3, this.origin);

	var normal = Vec3.cross(sub3, sub2);
	normal.normalize();

	var dist = Vec3.dot(Vec3.subtract(eye, this.origin), normal);
	var displayCenter = Vec3.subtract(eye, normal.mult(dist));

	mat.lookAt(eye, displayCenter, new Vec3(0,0,1));

	console.log(dist);
	console.log(mat);

	return mat;
};

DisplaySurface.prototype.projectionMatrix = function(eye, znear, zfar){
    var mat = new Mat4();
	mat.loadIdentity();
	// ...
	return mat;
};
