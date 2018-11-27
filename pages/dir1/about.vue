<script src="../../../../../../Volumes/台电酷闪/myobject/html/customJsPlugs/testPlug.js"></script>
<template>
  <section>
    <div>
      <div>
        demo1:
        <div id="container" class="container"></div>
      </div>
    </div>
  </section>
</template>

<script>
  import * as THREE from 'three'
  import * as Stats from 'stats-js'
  const ThreeBSP = require('three-js-csg/index')(THREE);
  const OrbitControlsLibrary = require('three-orbit-controls');
  const OrbitControls = OrbitControlsLibrary(THREE);
  import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader'

  export default {
    data () {
      return {
        container:null,
        three: '',
        camera: null,
        scene: null,
        renderer: null,
        light:null,
        mesh: null,
        cube:null,
        plane:null,
        sphere:null,
        spotLight:null,
        stats: null,
        axes:null,
        plane:null,
        wall:null,
        wallLeft:null,
        door:null,
        controls:null,
        gui:null,
        dummy:null,
        door_state:true,
        objects:[],
        groupPlane:null
      }
    },
    created() {
      this.dummy = new THREE.Object3D();//仿制品
    },
    methods:{
      init(){
        this.initContainer();
        this.initScene();
        this.initCamera();
        this.initStats();
        this.initLight();
        this.initAxes();
        //this.initPlane();
        this.initCustomPlane();
        this.initControl();
        //绘制正方体
        //this.addCube();
        this.addWall();
        //this.addDoor();
        this.addWallAfter();
        this.addWallLeft();
        this.addWallRight();

        //this.addObjFile();
        //this.addObjFileOther('bangongzhuo1.mtl','bangongzhuo1.obj',this.groupPlane.position.x+5,-this.groupPlane.position.y,0,0.02);
        //this.addObjFileOther('bangongzhuo1.mtl','bangongzhuo1.obj',this.groupPlane.position.x+5,-this.groupPlane.position.y,0+8,0.02);
        //this.addObjFileOther('bangongzhuo1.mtl','bangongzhuo1.obj',this.groupPlane.position.x+5,-this.groupPlane.position.y,0+16,0.02);
        //this.addObjFileOther('bangongzhuo1.mtl','bangongzhuo1.obj',this.groupPlane.position.x+5,-this.groupPlane.position.y,0-8,0.02);
        //this.addObjFileOther('bangongzhuo1.mtl','bangongzhuo1.obj',this.groupPlane.position.x+5,-this.groupPlane.position.y,0-16,0.02);

        //this.addObjFileOther('jiedaichu.mtl','jiedaichu.obj',-this.groupPlane.position.x-10,-this.groupPlane.position.y,0-9,0.06,{arrow:'y',value:0.5,tag:'-'});

        //this.addObjFileOther('file.mtl','file.obj',-this.groupPlane.position.x-3,-this.groupPlane.position.y+5,0,0.4,{arrow:'y',value:0.5,tag:'-'},'#ffffff');

        //this.addObjFileChuanglian('chuanglian.mtl','chuanglian.obj',0+0.5,-this.groupPlane.position.y,this.groupPlane.position.z+1,{x:0.027,y:0.003,z:0.001});

        this.renderer.render(this.scene, this.camera);

        /*this.renderer.render(this.scene, this.camera)
        this.scene.add(this.mesh);*/
        //监听键盘按键
        //window.addEventListener("click", this.onkeyDown, false);
      },
      initContainer(){
        this.container = document.getElementById('container');
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        //this.renderer.setSize(container.clientWidth, container.clientHeight)
        this.renderer.setSize(container.offsetWidth,container.offsetHeight);
        this.container.appendChild(this.renderer.domElement)
        this.renderer.setClearColor(0xffffff,1.0);
        //监听键盘按键
        this.container.addEventListener("click", this.onkeyDown, false);
      },
      initCamera: function () {
        let _self = this;
        this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 10000);
        //this.camera.position.z = 1;
        this.camera.position.x=0;
        this.camera.position.y=50;
        this.camera.position.z=110;
        this.camera.lookAt(this.scene.position);//将相机快门的位置设置为场景的位置
      },
      initControl(){
        this.controls = new OrbitControls(this.camera);// 初始化控制器
        this.controls.target.set(0,0,0);// 设置控制器的焦点，使控制器围绕这个焦点进行旋转
        this.controls.minDistance = 80;// 设置移动的最短距离（默认为零）
        this.controls.maxDistance = 400;// 设置移动的最长距离（默认为无穷）
        this.controls.maxPolarAngle = Math.PI / 3;//绕垂直轨道的距离（范围是0-Math.PI,默认为Math.PI）
        this.controls.minPolarAngle = Math.PI / 3;//绕垂直轨道的距离（范围是0-Math.PI,默认为Math.PI）
        this.controls.update();// 照相机转动时，必须更新该控制器
        this.controls.addEventListener("change", () =>
          this.addTouchListener()
        );
      },
      initScene(){
        this.scene = new THREE.Scene();
      },
      initStats(){
        this.stats = new Stats();
        this.stats.setMode(0); // 0: fps, 1: ms
        // 将stats的界面对应左上角
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '20px';
        document.getElementById('container').appendChild( this.stats.domElement );
      },
      initAxes(){
        //生成一个坐标轴，辅助线，坐标轴的参数
        this.axes=new THREE.AxisHelper(20);
        this.scene.add(this.axes)
      },
      initPlane(){
        //生成一个平面
        let planeGeometry=new THREE.PlaneGeometry(80,50,20,20);//注意参数
        //生成一个材质，设置材质的颜色，同时显示线框
        var planeMaterial=new THREE.MeshLambertMaterial({color:0xdddddd,wireframe:true});
        //生成一个网格，将平面和材质放在一个网格中，组合在一起，组成一个物体
        let plane=new THREE.Mesh(planeGeometry,planeMaterial);
        plane.rotation.x=-0.5*Math.PI;
        plane.position.x=5;
        plane.position.y=-5;
        plane.position.z=0;
        plane.receiveShadow=true;//平面进行接受阴影
        this.plane = plane;
        this.scene.add(this.plane);
      },
      initCustomPlane(){
        //plane1.rotation.x=-0.5*Math.PI;//将平面沿着x轴进行旋转
        var mesh = null;
        this.groupPlane = new THREE.Group();
        for(var i=0;i<20;i++){
          for(var j=0;j<10;j++){
            let cubeGeometry=new THREE.CubeGeometry(5,2,5);
            let planeMaterial=new THREE.MeshLambertMaterial(i%2==0 ? {color: 0xdddddd} : {color: 0xffffff});
            mesh=new THREE.Mesh(cubeGeometry,planeMaterial);
            mesh.position.set(i*5,3,j*5);
            mesh.castShadow=true;//需要阴影，方块进行投射阴影
            //this.scene.add(mesh);
            this.groupPlane.add(mesh);
          }
        }
        //this.camera.position.x =  45
        //group.position.x = 45;
        const box = new THREE.Box3();
        let center = box.expandByObject(this.groupPlane).max;
        let boxCenter = box.getCenter(center);
        //通过传入的object3D对象来返回当前模型的最小大小，值可以使一个mesh也可以使group
        this.groupPlane.position.set(-boxCenter.x,-boxCenter.y,-boxCenter.z);
        this.scene.add(this.groupPlane);
      },
      initLight(){
        let spotLight=new THREE.SpotLight(0xffffff);
        spotLight.position.set(0,180,100);
        spotLight.castShadow=true;
        this.scene.add(spotLight);
      },
      initGui(){
        const gui = new dat.GUI() // gui监测器
        gui.add('speed', 0, 0.5)
        gui.domElement.style = 'position:absolute;top:0px;right:0px;z-index:9999;';
        gui.open();
        this.gui = gui;
        //this.scene.add(this.gui);
      },
      addCube() {//立方体
        let cubeGeometry=new THREE.CubeGeometry(10,10,10);
        let planeMaterial=new THREE.MeshLambertMaterial({color: 0xdddddd});
        this.cube=new THREE.Mesh(cubeGeometry,planeMaterial);
        //plane1.rotation.x=-0.5*Math.PI;//将平面沿着x轴进行旋转
        this.cube.position.x=0;
        this.cube.position.y=0;
        this.cube.position.z=0;
        this.cube.castShadow=true;//需要阴影，方块进行投射阴影
        this.cube.name = 'cube';
        this.scene.add(this.cube);
      },
      addWall(){//模拟一面墙
        let cubeGeometry=new THREE.CubeGeometry(-this.groupPlane.position.x*2,10,1);
        let planeMaterial=new THREE.MeshLambertMaterial({color: 0xdddddd,wireframe: false});
        this.wall=new THREE.Mesh(cubeGeometry,planeMaterial);
        this.wall.position.x=0;
        this.wall.position.y=-this.groupPlane.position.y+3;
        this.wall.position.z=-this.groupPlane.position.z;
        this.wall.name = 'mainWall';

        let cubeGeometry1 = new THREE.BoxGeometry(5,8,1);
        let planeMaterial1 = new THREE.MeshBasicMaterial({
          flatShading: true,
          color : 0x58ACFA,
          opacity: 0.5,
          transparent : true
        });
        let cube = new THREE.Mesh(cubeGeometry1, planeMaterial1);
        cube.position.x = 0;
        cube.position.y = -this.groupPlane.position.y+3;
        cube.position.z = -this.groupPlane.position.z;
        cube.name='door'

        var sphere1BSP = new ThreeBSP(this.wall);
        var cube2BSP = new ThreeBSP(cube);

        this.subtractMesh(cube2BSP,sphere1BSP);

        this.scene.add(cube);
        //this.scene.add(this.wall);
      },
      addWallAfter(){//模拟一面墙
        let cubeGeometry=new THREE.CubeGeometry(-this.groupPlane.position.x*2,10,1);
        let planeMaterial=new THREE.MeshLambertMaterial({color: 0xdddddd,wireframe: false,transparent : true,opacity: 0.9});
        this.wall=new THREE.Mesh(cubeGeometry,planeMaterial);
        this.wall.position.x=0;
        this.wall.position.y=-this.groupPlane.position.y+3;
        this.wall.position.z=this.groupPlane.position.z;
        //this.scene.add(this.wall);

        let cubeGeometry1 = new THREE.BoxGeometry(-this.groupPlane.position.x*2-30,6,1);
        let planeMaterial1 = new THREE.MeshBasicMaterial({
          flatShading: true,
          color : 0x58ACFA,
          opacity: 0.5,
          transparent : true
        });
        let cube = new THREE.Mesh(cubeGeometry1, planeMaterial1);
        cube.position.x = 0;
        cube.position.y = -this.groupPlane.position.y+3;
        cube.position.z = this.groupPlane.position.z;

        var sphere1BSP = new ThreeBSP(this.wall);
        var cube2BSP = new ThreeBSP(cube);

        this.subtractMesh(cube2BSP,sphere1BSP);

        this.scene.add(cube);

        /*var wallGroup = new THREE.Group();
        wallGroup.add(this.wall);
        wallGroup.add(cube);
        this.scene.add(wallGroup);*/
      },
      addWallLeft(){//模拟一面墙
        let cubeGeometry=new THREE.CubeGeometry(1,10,45);
        let planeMaterial=new THREE.MeshLambertMaterial({color: 0xdddddd,wireframe: false});
        this.wall=new THREE.Mesh(cubeGeometry,planeMaterial);
        this.wall.position.x=-this.groupPlane.position.x;
        this.wall.position.y=-this.groupPlane.position.y+3;
        this.wall.position.z=0;
        this.scene.add(this.wall);
      },
      addWallRight(){//模拟一面墙
        let cubeGeometry=new THREE.CubeGeometry(1,10,45);
        let planeMaterial=new THREE.MeshLambertMaterial({color: 0xdddddd,wireframe: false});
        this.wall=new THREE.Mesh(cubeGeometry,planeMaterial);
        this.wall.position.x=this.groupPlane.position.x;
        this.wall.position.y=-this.groupPlane.position.y+3;
        this.wall.position.z=0;
        this.scene.add(this.wall);
      },
      addDoor(){
        var _self = this;
        var door = new THREE.BoxGeometry(5, 8, 1);
        // 创建门材料
        var doorMaterial = new THREE.MeshBasicMaterial();
        //var door_cube = new THREE.Mesh( door,doorMaterial);
        var door_cube = new THREE.Mesh( door);
        // 设置门位置
        door_cube.position.x = 0;
        door_cube.position.y = -this.groupPlane.position.y+3;
        door_cube.position.z = -this.groupPlane.position.z;
        door_cube.name = 'doorWall';
        //door_cube.rotation.y += 0.5*Math.PI;

        var sphere1BSP = new ThreeBSP(this.wall);
        var cube2BSP = new ThreeBSP(door_cube);

        this.subtractMesh(cube2BSP,sphere1BSP);

        //为墙面安装门,右门
        /*var loader = new THREE.TextureLoader();
        loader.load(require('../../assets/door_right.png'), function(texture) {
          var doorgeometry = new THREE.BoxGeometry(5, 8, 1);
          var doormaterial = new THREE.MeshBasicMaterial({
            map : texture,
            color : 0xdddddd,
          });
          doormaterial.opacity = 1.0;
          doormaterial.transparent = true;
          var door1 = new THREE.Mesh(doorgeometry, doormaterial);
          door1.position.set(0, -_self.groupPlane.position.y+3, -_self.groupPlane.position.z);
          door1.visible = true;
          door1.name = 'doorMain1';
          var door2 = door1.clone();
          door2.position.set(0, _self.groupPlane.position.y+3, -_self.groupPlane.position.z);
          door2.visible = false;
          door1.name = 'doorMain2';
          _self.dummy.position.set(0, 0, 0);

          _self.dummy.name = 'doorMain';
          _self.dummy.add(door1);
          _self.dummy.add(door2);
          _self.objects.push(door1);
          _self.scene.add(_self.dummy);
        });*/
      },
      addObjFile(){
        var _self = this;
        new MTLLoader().setPath('/obj/').load('huiyizhuo2.mtl', materials => {
          materials.preload();
          new OBJLoader().setPath('/obj/').load('huiyizhuo2.obj', obj => {
            obj.scale.set(0.04,0.04,0.04);
            obj.position.set(0, -this.groupPlane.position.y, 0);
            obj.traverse(function(child) {
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshLambertMaterial({
                  color: 0x888888,
                  side: THREE.DoubleSide
                });
              }
            });

            _self.scene.add(obj);
          });
        })
      },
      addObjFileOther(mtl,obj,x,y,z,size,angre,color){
        var _self = this;
        new MTLLoader().setPath('/obj/').load(mtl, materials => {
          materials.preload();
          new OBJLoader().setPath('/obj/').load(obj, obj => {
            obj.scale.set(size,size,size);
            obj.position.set(x,y,z);
            if(angre){
              if(angre.arrow == 'y' && angre.tag == '-'){
                obj.rotation.y -= 0.5 * Math.PI
              }
              if(angre.arrow == 'x' && angre.tag == '-'){
                obj.rotation.x -= 0.5 * Math.PI
              }
              if(angre.arrow == 'z' && angre.tag == '-'){
                obj.rotation.z -= 0.5 * Math.PI
              }
            }
            obj.traverse(function(child) {
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshLambertMaterial({
                  color: color ? color : 0x888888,
                  side: THREE.DoubleSide
                });
              }
            });
            _self.scene.add(obj);
          });
        })
      },
      addObjFileChuanglian(mtl,obj,x,y,z,size,angre,color){
        var _self = this;
        new MTLLoader().setPath('/obj/').load(mtl, materials => {
          materials.preload();
          new OBJLoader().setPath('/obj/').load(obj, obj => {
            obj.scale.set(size.x,size.y,size.z);
            obj.position.set(x,y,z);
            if(angre){
              if(angre.arrow == 'y' && angre.tag == '-'){
                obj.rotation.y -= 0.5 * Math.PI
              }
              if(angre.arrow == 'x' && angre.tag == '-'){
                obj.rotation.x -= 0.5 * Math.PI
              }
              if(angre.arrow == 'z' && angre.tag == '-'){
                obj.rotation.z -= 0.5 * Math.PI
              }
            }
            obj.traverse(function(child) {
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshLambertMaterial({
                  color: color ? color : 0x888888,
                  side: THREE.DoubleSide
                });
              }
            });
            _self.scene.add(obj);
          });
        })
      },
      animate: function () {
        this.cube.rotation.x += 0
        this.cube.rotation.y += 0.01
        //this.camera.position.x =this.camera.position.x +0.001;//相机移动
        //this.mesh.position.x += 0.003;//物体移动
        this.renderer.render(this.scene, this.camera)
        this.stats.update();
        requestAnimationFrame(this.animate)
      },
      onkeyDown(event) {
        let object = [];
        event.preventDefault();
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();

        //mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        //mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        mouse.x = ( (event.clientX - this.container.getBoundingClientRect().left) / this.container.offsetWidth ) * 2 - 1;
        mouse.y = - ( (event.clientY - this.container.getBoundingClientRect().top) / this.container.offsetHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, this.camera );
        var intersects = raycaster.intersectObjects( this.scene.children );

        console.log(intersects);

        for ( var i = 0; i < intersects.length; i++ ) {
          //intersects[ 0 ].object.material.color.set( 0xff0000 );
          if(intersects[ 0 ].object.name=='door'){
            if (this.door_state) {
              intersects[ 0 ].object.rotation.y += 0.5 * Math.PI;
              this.door_state = false;
            } else {
              intersects[ 0 ].object.rotation.y -= 0.5 * Math.PI;
              this.door_state = true;
            }
          }
        }


        //将所有的相交的模型的颜色设置为红色，如果只需要将第一个触发事件，那就数组的第一个模型改变颜色即可
        for ( var i = 0; i < object.length; i++ ) {
          if(object[i].name == 'cube'){
            console.log(this.scene.getObjectByName('cube1'));
          }

          if(object[i].children.length > 0){
            /*for(var j=0;j<object[i].children.length;j++){
              if(object[i].children[j].name == 'doorMain1'){
                /!*if (this.door_state) {
                  this.dummy.rotation.y += 0.5 * Math.PI;
                  this.door_state = false;
                } else {
                  this.dummy.rotation.y -= 0.5 * Math.PI;
                  this.door_state = true;
                }*!/
                if(object[i].children[j].visible == false){
                  this.scene.getObjectByName('doorMain2').rotation.y = 0.5 * Math.PI;
                  this.scene.getObjectByName('doorMain1').visible = false;
                  this.scene.getObjectByName('doorMain2').visible = true;
                }
                this.addTouchListener();
              }
              if(object[i].children[j].name == 'doorMain2'){
                if(object[i].children[j].visible == true){
                  this.scene.getObjectByName('doorMain2').rotation.y -= 0.5 * Math.PI;
                  this.scene.getObjectByName('doorMain1').visible = true;
                  this.scene.getObjectByName('doorMain2').visible = false;
                }
                this.addTouchListener();
              }
            }*/
          }
        }
      },
      subtractMesh(meshDoor,meshWall){
        //平行x轴横墙面4减去与meshHDoor门重叠部分
        var subtract_bsp = meshWall.subtract( meshDoor );
        var result = subtract_bsp.toMesh(new THREE.MeshBasicMaterial({
          flatShading: true,
          color:0xaaaaaa
        }));
        //result.geometry.computeFaceNormals();
        //result.geometry.computeVertexNormals();
        this.scene.add( result );
      },
      addTouchListener() {
        //this.controls.update();
        this.renderer.render(this.scene, this.camera)
      }
    },
    mounted () {
      let _self = this;
      this.init();
      //this.animate();
    }
  }
</script>

<style scoped>
  .container {
    width: 100%;
    height: 500px;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
</style>

