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
	//var eye = new Vec3(50, 20, 100);

	/*var x2 = new Vec3(this.origin.x, this.origin.y, this.origin.z);
	x2.add(this.u);
	var x3 = new Vec3(this.origin.x, this.origin.y, this.origin.z);
	x3.add(this.v);

	var sub2 = Vec3.subtract(x2, this.origin);
	var sub3 = Vec3.subtract(x3, this.origin);

	var normal = Vec3.cross(sub3, sub2);
	normal.normalize();

	var dist = Vec3.dot(Vec3.subtract(eye, this.origin), normal);
	var displayCenter = Vec3.subtract(eye, normal.mult(dist));
	*/

	var n = Vec3.cross(this.u,this.v).normalize();
	var vrp = Vec3.subtract(eye,n); 
	mat.lookAt(eye, vrp/*displayCenter*/, new Vec3(0,1,0));
	/*
	//console.log(dist);
	//console.log(mat);
	console.log("viewing",this.origin.x,this.origin.y,this.origin.z);
	console.log("eye",eye.x,eye.y,eye.z);
	console.log(n.x,n.y,n.z);
	console.log(vrp.x,vrp.y,vrp.z);
	for(var i = 0; i < 4; ++i){
		console.log(mat._[i],mat._[i+4],mat._[i+8],mat._[i+12]);
		console.log(" ");
	}
	*/
	return mat;
};



DisplaySurface.prototype.zNearProjection = function(zNear, L, D){
	return zNear*L/D;

}

DisplaySurface.prototype.projectionMatrix = function(eye, znear, zfar){
    var mat = new Mat4();
	mat.loadIdentity();


	//var eye = new Vec3(50, 20, 100);
	//var znear = 0.1;
	//var zfar = 100;


	//normal to the display
	var normal = Vec3.cross(this.u,this.v);



	var topRightCorner = Vec3.add(Vec3.add(this.origin,this.u),this.v);


	//bottom left corner vector
	var bottomLeftVector = Vec3.subtract(this.origin,eye);
	var topRightVector = Vec3.subtract(topRightCorner,eye);



	var L = this.u.copy();
	L = L.negate();
	L = L.project(bottomLeftVector).norm();
	L = -L;
	var B = this.v.copy();
	B = B.negate();
	B = B.project(bottomLeftVector).norm();
	B = -B;
	var R = this.u.copy();
	R = R.project(topRightVector).norm();
	var T = this.v.copy();
	T = T.project(topRightVector).norm();
	var D = normal.copy();
	D = (D.negate().project(bottomLeftVector)).norm();

	var l = this.zNearProjection(znear,L,D);
	var b = this.zNearProjection(znear,B,D);
	var r = this.zNearProjection(znear,R,D);
	var t = this.zNearProjection(znear,T,D);
	mat.frustum(l,r,b,t,znear,zfar);


	/*console.log("proj",this.origin.x,this.origin.y,this.origin.z);
	console.log(l,r,b,t,znear,zfar);
	for(var i = 0; i < 4; ++i){
		console.log(mat._[i],mat._[i+4],mat._[i+8],mat._[i+12]);
		console.log(" ");
	}*/


	return mat;
};
