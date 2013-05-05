function ModelLoader(scene) {
	this.scene = scene;
	
	this.totalObjects = 0;
	this.loadedObjects = 0;
	this.onProggress = null;

	this.objects = [];
	this.geometries = [];
	this.textures = [];
	
	this.objectLoaded = function() {
		this.loadedObjects++;
		if(this.onProggress!=null) {
			this.onProggress(this.loadedObjects,this.totalObjects);
		}
	}
	
	this.load = function(params) {
		var loader = new THREE.JSONLoader();
		var modelLoader = this;
		modelLoader.totalObjects++;
		
		if(params.texture!=null) { 
    		modelLoader.totalObjects++;
    	}
    	var textureCallBack = function() {
    		modelLoader.objectLoaded();
    	}
		var callback = function( geometry ) {
			var texture;
			var material;
			
			if(params.texture!=null) { 
    			texture = THREE.ImageUtils.loadTexture( params.texture,null,textureCallBack);
    		}
    		
			var material = new THREE["Mesh" + params.material + "Material"]( { color:params.color, map:texture ,shading:THREE.SmoothShading, blending:THREE.AdditiveBlending } ); 
			var mesh = new THREE.Mesh( geometry, material );
			
			
			if(params.inverse) {
				mesh.geometry.dynamic = true
				mesh.geometry.__dirtyVertices = true;
				mesh.geometry.__dirtyNormals = true;
		
				mesh.flipSided = true;
		
				for(var i = 0; i<mesh.geometry.faces.length; i++) {
					mesh.geometry.faces[i].normal.x = -1*mesh.geometry.faces[i].normal.x;
					mesh.geometry.faces[i].normal.y = -1*mesh.geometry.faces[i].normal.y;
					mesh.geometry.faces[i].normal.z = -1*mesh.geometry.faces[i].normal.z;
				}
				mesh.geometry.computeVertexNormals();
				mesh.geometry.computeFaceNormals();
			}
			
			mesh.name = params.name;
			
			if(params.autoAdd==null || params.autoAdd==true) {
				modelLoader.scene.add(mesh);
			}
			
			modelLoader.objects.push(mesh);  
			modelLoader.objectLoaded();   
			
			if(params.name == null) {
				mesh.name = params.model;
			}else{
				mesh.name = params.name;
			}
		}
		loader.load( params.model, callback);
	}
	this.loadGeometry = function(params) {
		var loader = new THREE.JSONLoader();
		var modelLoader = this;
		modelLoader.totalObjects++;
		var callback = function( geometry ) {
			modelLoader.geometries.push({geometry:geometry,name:params.name});
			modelLoader.objectLoaded();
		}
		loader.load( params.model, callback);
	}
	this.loadTexture = function(params) {
		this.totalObjects++;
    	var textureCallBack = function() {
    		modelLoader.objectLoaded();
    	}
		this.textures.push({texture:THREE.ImageUtils.loadTexture( params.texture,null,textureCallBack),name:params.name});
	}
	this.get = function(name) {
		for(var i=0; i<this.objects.length; i++) {
			if(this.objects[i].name == name) {
				return this.objects[i];
			}
		}
		return null;
	}
	this.getGeometry = function(name) {
		for(var i=0; i<this.geometries.length; i++) {
			if(this.geometries[i].name == name) {
				return this.geometries[i].geometry;
			}
		}
		return null;
	}
	this.getTexture = function(name) {
		for(var i=0; i<this.textures.length; i++) {
			if(this.textures[i].name == name) {
				return this.textures[i].texture;
			}
		}
		return null;
	}
}