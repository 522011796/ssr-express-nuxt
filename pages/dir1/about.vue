<script src="../../../../../../Volumes/台电酷闪/myobject/html/customJsPlugs/testPlug.js"></script>
<template>
  <section>
    <div>
      <div style="position: relative">
        demo1:
        <div id="container" class="container"></div>
        <div>
          <Modal
            @on-visible-change="closeModel"
            v-model="showPassword"
            :footer-hide="true"
            :closable="false"
            width="180">
            <div>
              <Input v-model="passwordValHidden" placeholder="" size="small" style="" disabled :maxlength="10"  style="margin-bottom:5px;"/>
              <Row style="margin-bottom:5px;">
                <Col span="8" style="text-align: center">
                  <Button @click="clkBtn($event,1)">1</Button>
                </Col>
                <Col span="8" style="text-align: center">
                  <Button @click="clkBtn($event,2)">2</Button>
                </Col>
                <Col span="8" style="text-align: center">
                  <Button @click="clkBtn($event,3)">3</Button>
                </Col>
              </Row>
              <Row style="margin-bottom:5px;">
                <Col span="8" style="text-align: center">
                  <Button @click="clkBtn($event,4)">4</Button>
                </Col>
                <Col span="8" style="text-align: center">
                  <Button @click="clkBtn($event,5)">5</Button>
                </Col>
                <Col span="8" style="text-align: center">
                  <Button @click="clkBtn($event,6)">6</Button>
                </Col>
              </Row>
              <Row style="margin-bottom:5px;">
                <Col span="8" style="text-align: center">
                  <Button @click="clkBtn($event,7)">7</Button>
                </Col>
                <Col span="8" style="text-align: center">
                  <Button @click="clkBtn($event,8)">8</Button>
                </Col>
                <Col span="8" style="text-align: center">
                  <Button @click="clkBtn($event,9)">9</Button>
                </Col>
              </Row>
              <Row style="margin-bottom:5px;">
                <Col span="8" style="text-align: center">
                  <Button @click="clkBtn($event,'x')">x</Button>
                </Col>
                <Col span="8" style="text-align: center">
                  <Button @click="clkBtn($event,0)">0</Button>
                </Col>
                <Col span="8" style="text-align: center">
                  <Button @click="clkBtn($event,'√')">√</Button>
                </Col>
              </Row>
              <Row>
                <Col span="24" style="text-align: center">
                  <Button @click="clkBtn($event,'cancel')">取消</Button>
                </Col>
              </Row>
            </div>
          </Modal>
        </div>
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
  const EffectComposer = require('three-effectcomposer')(THREE);

  var origin = new THREE.Vector3();

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
        groupPlane:null,
        loading:false,
        showPassword:false,
        passwordVal:'',
        passwordValHidden:'',
        rectLight:null,
        lightColor:'#eeeeee',
        intensity:0,
        ambient:0.15,
        lightShow:true
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
        this.initControl();
        this.initStats();
        this.initLight();
        //this.initAxes();
        //this.initPlane();
        this.initCustomPlane();
        //绘制正方体
        //this.addCube();
        this.addWall();
        this.addDoor();
        this.addWallAfter();
        this.addWallLeft();
        this.addWallRight();

        this.addObjFile();
        this.addObjFileOther('bangongzhuo1.mtl','bangongzhuo1.obj',this.groupPlane.position.x+5,-this.groupPlane.position.y,0,0.02,{name:'bangongzhuo1'});
        this.addObjFileOther('bangongzhuo1.mtl','bangongzhuo1.obj',this.groupPlane.position.x+5,-this.groupPlane.position.y,0+8,0.02,{name:'bangongzhuo2'});
        this.addObjFileOther('bangongzhuo1.mtl','bangongzhuo1.obj',this.groupPlane.position.x+5,-this.groupPlane.position.y,0+16,0.02,{name:'bangongzhuo3'});
        this.addObjFileOther('bangongzhuo1.mtl','bangongzhuo1.obj',this.groupPlane.position.x+5,-this.groupPlane.position.y,0-8,0.02,{name:'bangongzhuo4'});
        this.addObjFileOther('bangongzhuo1.mtl','bangongzhuo1.obj',this.groupPlane.position.x+5,-this.groupPlane.position.y,0-16,0.02,{name:'bangongzhuo5'});

        //this.addObjFileOther('light.mtl','light.obj',0,-this.groupPlane.position.y+13,0,0.015,{name:'light-left'},'#ffffff');
        //this.addObjFileOther('light.mtl','light.obj',-this.groupPlane.position.x-10,-this.groupPlane.position.y+13,0,0.015,{name:'light-middle'},'#ffffff');
        //this.addObjFileOther('light.mtl','light.obj',this.groupPlane.position.x+10,-this.groupPlane.position.y+13,0,0.015,{name:'light-right'},'#ffffff');


        this.addObjFileOther('lock.mtl','lock.obj',-1,-this.groupPlane.position.y+1,-this.groupPlane.position.z+1,0.015,{arrow:'y',value:1,tag:'-',name:'lock'});

        this.addObjFileOther('jiedaichu.mtl','jiedaichu.obj',-this.groupPlane.position.x-10,-this.groupPlane.position.y,0-9,0.06,{arrow:'y',value:0.5,tag:'-',name:'jiedaichu'});

        this.addObjFileOther('file.mtl','file.obj',-this.groupPlane.position.x-3,-this.groupPlane.position.y+5,0,0.4,{arrow:'y',value:0.5,tag:'-',name:'jiankong'},'#888888');

        this.addObjFileChuanglian('chuanglian.mtl','chuanglian.obj',0+0.5,-this.groupPlane.position.y,this.groupPlane.position.z+1,{x:0.027,y:0.003,z:0.001},null,'#2d8cf0','chuanglian');

        this.addObjFileOther('switch.mtl','switch.obj',this.groupPlane.position.x+10,-this.groupPlane.position.y+2,this.groupPlane.position.z+1,0.0017,{arrow:'y',value:0.5,tag:'-',name:'switch'},'#f5f5f5');


        this.initLightOther({x:0,y:-this.groupPlane.position.y+18,z:14},{x:1,y:20,z:8},'light1');
        this.initLightOther({x:this.groupPlane.position.x+10,y:-this.groupPlane.position.y+18,z:14},{x:1,y:20,z:8},'light2');
        this.initLightOther({x:-this.groupPlane.position.x-10,y:-this.groupPlane.position.y+18,z:14},{x:1,y:20,z:8},'light3');

        this.initLightOther({x:0,y:-this.groupPlane.position.y+18,z:-14},{x:1,y:20,z:8},'light4');
        this.initLightOther({x:this.groupPlane.position.x+10,y:-this.groupPlane.position.y+18,z:-14},{x:1,y:20,z:8},'light5');
        this.initLightOther({x:-this.groupPlane.position.x-10,y:-this.groupPlane.position.y+18,z:-14},{x:1,y:20,z:8},'light6');

        this.initRenderer();

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
        this.renderer.setClearColor(0x333333,1.0);
        //监听键盘按键
        this.container.addEventListener("click", this.onkeyDown, false);
      },
      initRenderer(){
        this.renderer.render(this.scene, this.camera);
      },
      initCamera: function () {
        let _self = this;
        this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 10000);
        //this.camera.position.z = 1;
        this.camera.position.x=0;
        this.camera.position.y=50;
        this.camera.position.z=70;
        this.camera.lookAt(this.scene.position);//将相机快门的位置设置为场景的位置
      },
      initControl(){
        this.controls = new OrbitControls(this.camera,this.renderer.domElement);// 初始化控制器
        this.controls.target.set(0,0,0);// 设置控制器的焦点，使控制器围绕这个焦点进行旋转
        this.controls.minDistance = 60;// 设置移动的最短距离（默认为零）
        this.controls.maxDistance = 400;// 设置移动的最长距离（默认为无穷）
        //this.controls.maxPolarAngle = Math.PI / 3;//绕垂直轨道的距离（范围是0-Math.PI,默认为Math.PI）
        //this.controls.minPolarAngle = Math.PI / 3;//绕垂直轨道的距离（范围是0-Math.PI,默认为Math.PI）
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
            let planeMaterial=new THREE.MeshStandardMaterial(i%2==0 ? {color: 0xdddddd} : {color: 0xffffff});
            mesh=new THREE.Mesh(cubeGeometry,planeMaterial);
            mesh.position.set(i*5,3,j*5);
            mesh.castShadow=true;//需要阴影，方块进行投射阴影
            mesh.roughness = 1;
            mesh.metalness = 0.8;
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
        let spotLight=new THREE.AmbientLight(0x434343);
        spotLight.position.set(50,100,100);
        spotLight.castShadow=false;
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
      initLightOther(position,size,name){
        var _self = this;
        var ambient = new THREE.AmbientLight( this.lightColor, this.ambient );
        ambient.name = 'ambient';
        this.scene.add( ambient );

        this.rectLight = new THREE.RectAreaLight( this.lightColor, size.x, size.y, size.z );
        this.rectLight.position.set( position.x,position.y,position.z );
        this.rectLight.rotation.x += 0.5 * Math.PI
        //rectLight.rotation.z += 0.3 * Math.PI


        this.rectLight.roughness = 1;
        this.rectLight.metalness = 0;
        this.rectLight.intensity = this.intensity;

        this.rectLight.name = name;

        this.scene.add( this.rectLight );

        var rectLightMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial({ color: this.lightColor }) );
        rectLightMesh.scale.x = this.rectLight.width;
        rectLightMesh.scale.y = this.rectLight.height;
        this.rectLight.add( rectLightMesh );
        var rectLightMeshBack = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { color: 0x222222 } ) );
        rectLightMeshBack.rotation.y = Math.PI;
        rectLightMesh.add( rectLightMeshBack );

        this.initRenderer();
      },
      addCube() {//立方体
        let cubeGeometry=new THREE.BoxBufferGeometry(10,10,15);
        let planeMaterial=new THREE.MeshStandardMaterial({ color: 0xA00000, roughness: 0, metalness: 0 });
        this.cube=new THREE.Mesh(cubeGeometry,planeMaterial);
        //plane1.rotation.x=-0.5*Math.PI;//将平面沿着x轴进行旋转
        this.cube.position.x=0;
        this.cube.position.y=-this.groupPlane.position.y+3;
        this.cube.position.z=0;
        this.cube.name = 'cube';
        this.cube.castShadow = true;
        this.cube.receiveShadow = true;

        this.cube.roughness = 0.9;
        this.cube.metalness = 0.9;

        this.scene.add(this.cube);
        this.initRenderer();
      },
      addWall(){//模拟一面墙
        let _self = this;
        let cubeGeometry=new THREE.CubeGeometry(-this.groupPlane.position.x*2,10,1);
        let planeMaterial=new THREE.MeshLambertMaterial({color: 0xdddddd,wireframe: false});
        this.wall=new THREE.Mesh(cubeGeometry,planeMaterial);
        this.wall.position.x=0;
        this.wall.position.y=-this.groupPlane.position.y+3;
        this.wall.position.z=-this.groupPlane.position.z;
        this.wall.name = 'mainWall';

        /*let cubeGeometry1 = new THREE.BoxGeometry(5,8,1);
        let planeMaterial1 = new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load(require('../../assets/door_right.png'), function(texture) {
            var doorgeometry = new THREE.BoxGeometry(5, 8, 1);
            var doormaterial = new THREE.MeshBasicMaterial({
              map : texture,
              color : 0xdddddd,
            });
            _self.initRenderer();
          }),
          flatShading: true,
          color : 0x58ACFA,
          opacity: 1,
          transparent : true
        });
        let cube = new THREE.Mesh(cubeGeometry1, planeMaterial1);
        cube.position.x = 0;
        cube.position.y = -this.groupPlane.position.y+3;
        cube.position.z = -this.groupPlane.position.z;
        cube.name='door';

        var sphere1BSP = new ThreeBSP(this.wall);
        var cube2BSP = new ThreeBSP(cube);

        this.subtractMesh(cube2BSP,sphere1BSP);

        this.scene.add(cube);*/
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
        let planeMaterial=new THREE.MeshLambertMaterial({color: 0xbbbbbb,wireframe: false});
        this.wall=new THREE.Mesh(cubeGeometry,planeMaterial);
        this.wall.position.x=-this.groupPlane.position.x;
        this.wall.position.y=-this.groupPlane.position.y+3;
        this.wall.position.z=0;
        this.scene.add(this.wall);
      },
      addWallRight(){//模拟一面墙
        let cubeGeometry=new THREE.CubeGeometry(1,10,45);
        let planeMaterial=new THREE.MeshLambertMaterial({color: 0xbbbbbb,wireframe: false});
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
        var loader = new THREE.TextureLoader();
        loader.load(require('../../assets/door_right.png'), function(texture) {
          var doorgeometry = new THREE.BoxGeometry(5, 8, 1);
          var doormaterial = new THREE.MeshBasicMaterial({
            map : texture,
            color : 0xdddddd,
          });
          doormaterial.opacity = 0.5;
          doormaterial.transparent = false;
          var door1 = new THREE.Mesh(doorgeometry, doormaterial);
          door1.position.set(0, 0, 0);
          door1.visible = true;
          door1.name = 'door';
          _self.dummy.position.set(0, -_self.groupPlane.position.y+3, -_self.groupPlane.position.z);

          _self.dummy.name = 'door';
          _self.dummy.add(door1);
          _self.objects.push(door1);
          _self.scene.add(_self.dummy);
        });
      },
      addObjFile(){
        var _self = this;
        new MTLLoader().setPath('/obj/').load('huiyizhuo2.mtl', materials => {
          materials.preload();
          new OBJLoader().setPath('/obj/').load('huiyizhuo2.obj', obj => {
            obj.scale.set(0.05,0.05,0.05);
            obj.position.set(0, -this.groupPlane.position.y, 0);
            obj.name='huiyizhuo';
            obj.traverse(function(child) {
              if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshStandardMaterial({
                  color: 0x666666,
                  side: THREE.DoubleSide,
                  roughness: 0,
                  metalness: 0
                });
              }
            });
            /*obj.roughness = 0.9;
            obj.metalness = 0.9;
            obj.intensity = 0.9;*/

            _self.objects.push(obj);
            _self.scene.add(obj);
            _self.initRenderer();
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
              console.log(angre.value);
              if(angre.arrow == 'y' && angre.tag == '-'){
                obj.rotation.y -= angre.value * Math.PI
              }
              if(angre.arrow == 'x' && angre.tag == '-'){
                obj.rotation.x -= angre.value * Math.PI
              }
              if(angre.arrow == 'z' && angre.tag == '-'){
                obj.rotation.z -= angre.value * Math.PI
              }
            }
            if(angre.name){
              obj.name = angre.name;
            }
            obj.traverse(function(child) {
              if (child instanceof THREE.Mesh) {
                if(angre.name=='switch'){
                  child.material = new THREE.MeshLambertMaterial({
                    color: color ? color : 0x666666,
                    side: THREE.DoubleSide
                  })
                }else{
                  child.material = new THREE.MeshStandardMaterial({
                    color: color ? color : 0x666666,
                    side: THREE.DoubleSide,
                    roughness: 0,
                    metalness: 0
                  });
                }
              }
            });
            _self.scene.add(obj);
            _self.initRenderer();
          });
        })
      },
      addObjFileChuanglian(mtl,obj,x,y,z,size,angre,color,name){
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
            if(name){
              obj.name = name;
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
        //this.cube.rotation.x += 0
        //this.cube.rotation.y += 0.01
        //this.camera.position.x =this.camera.position.x +0.001;//相机移动
        //this.mesh.position.x += 0.003;//物体移动
        this.renderer.render(this.scene, this.camera);
        this.stats.update();
        var t = ( Date.now() / 2000 );
        // move light in circle around center
        // change light height with sine curve
        var r = 15.0;
        var lx = r * Math.cos( t );
        var lz = r * Math.sin( t );
        var ly = 5.0 + 5.0 * Math.sin( t / 3.0 );
        this.rectLight.position.set( lx, ly, lz );
        this.rectLight.lookAt( origin );
        requestAnimationFrame(this.animate)
      },
      onkeyDown(event) {
        let _self = this;
        event.preventDefault();
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();
        // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
        mouse.x = ( (event.clientX - this.container.getBoundingClientRect().left) / this.container.offsetWidth ) * 2 - 1;
        mouse.y = - ( (event.clientY - this.container.getBoundingClientRect().top) / this.container.offsetHeight ) * 2 + 1;

        //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
        raycaster.setFromCamera(mouse, this.camera);

        //找到场景中所有外部模型
        var scensObjs = [];
        this.scene.children.forEach(child => {
          for (var i = 0; i < child.children.length; i++) {
            var obj=child.children[i];
            scensObjs.push(obj);
          }
        });

        var objs = [];
        //返回选中的外部模型对象
        var intersects = raycaster.intersectObjects(scensObjs);

        for (var i = 0; i < intersects.length; i++) {
          var intersect = intersects[i];
          if (intersect.object instanceof THREE.Mesh) {
            var obj = intersect.object.parent;
            //把距离加到模型用户数据里面，方便后面排序
            obj.userData.distance = intersect.distance;
            //返回模型中选中部分
            objs.push(obj);
            //返回整个模型
            //objs.push(obj.parent);
          }
        }

        //返回选中的矢量模型对象
        intersects = raycaster.intersectObjects(this.scene.children);
        for (var i = 0; i < intersects.length; i++) {
          var intersect = intersects[i];
          if (intersect.object instanceof THREE.Mesh) {
            var obj = intersect.object;
            //把距离加到模型用户数据里面，方便后面排序
            obj.userData.distance = intersect.distance;
            //返回模型中选中部分
            objs.push(obj);
          }
        }

        //按照距离排序
        objs = objs.sort(function (a, b) {
          return a.userData.distance - b.userData.distance;
        });
        for ( var i = 0; i < objs.length; i++ ) {
          console.log(objs[ 0 ].name);
          if(objs[ 0 ].name=='door'){
            if (this.door_state == false) {
              objs[ 0 ].position.x = 0;
              objs[ 0 ].position.z = -this.groupPlane.position.z;
              objs[ 0 ].rotation.y -= 0.5 * Math.PI;
              this.scene.getObjectByName('lock').position.x = -1;
              this.scene.getObjectByName('lock').position.z = -this.groupPlane.position.z+1;
              this.scene.getObjectByName('lock').rotation.y -= 0.5 * Math.PI;

              this.scene.getObjectByName('light1').intensity = 0;
              this.scene.getObjectByName('light2').intensity = 0;
              this.scene.getObjectByName('light3').intensity = 0;
              this.scene.getObjectByName('light4').intensity = 0;
              this.scene.getObjectByName('light5').intensity = 0;
              this.scene.getObjectByName('light6').intensity = 0;
              this.scene.getObjectByName('ambient').intensity = 0;
              this.lightShow = false

              this.door_state = true;
            }
          }
          if(objs[ 0 ].name=='lock'){
            if (this.door_state) {
              this.showPassword = true;
              /*this.dummy.position.x = 2.5;
              this.dummy.position.z = -this.groupPlane.position.z+2;
              this.dummy.rotation.y += 0.5 * Math.PI;
              objs[ 0 ].position.x = 3.5;
              objs[ 0 ].position.z = -this.groupPlane.position.z+3;
              objs[ 0 ].rotation.y += 0.5 * Math.PI;
              this.door_state = false;*/
            } else {
              this.dummy.position.x = 0;
              this.dummy.position.z = -this.groupPlane.position.z;
              this.dummy.rotation.y -= 0.5 * Math.PI;
              objs[ 0 ].position.x = -1;
              objs[ 0 ].position.z = -this.groupPlane.position.z+1;
              objs[ 0 ].rotation.y -= 0.5 * Math.PI;

              this.door_state = true;
            }
          }
          if(objs[ 0 ].name=='switch'){
            if(this.lightShow == true){
              this.intensity = 0;
              this.ambient = 0;
              this.scene.getObjectByName('light1').intensity = 0;
              this.scene.getObjectByName('light2').intensity = 0;
              this.scene.getObjectByName('light3').intensity = 0;
              this.scene.getObjectByName('light4').intensity = 0;
              this.scene.getObjectByName('light5').intensity = 0;
              this.scene.getObjectByName('light6').intensity = 0;
              this.scene.getObjectByName('ambient').intensity = 0;
              this.lightShow = false
            }else{
              this.intensity = 1.5;
              this.ambient = 0.15;
              this.scene.getObjectByName('light1').intensity = 1.5;
              this.scene.getObjectByName('light2').intensity = 1.5;
              this.scene.getObjectByName('light3').intensity = 1.5;
              this.scene.getObjectByName('light4').intensity = 1.5;
              this.scene.getObjectByName('light5').intensity = 1.5;
              this.scene.getObjectByName('light6').intensity = 1.5;
              this.scene.getObjectByName('ambient').intensity = 0.15;
              this.lightShow = true
            }
          }
          this.initRenderer();

          console.log(this.scene.getObjectByName('ambient'));
          break;
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
      },
      clkBtn(event,val){
        if(val != 'x' && val != '√' && this.passwordVal.length <=10){
          this.passwordVal += val
          this.passwordValHidden += '*'
        }
        if(val == 'x'){
          this.passwordVal = '';
          this.passwordValHidden = '';
        }
        if(val == '√'){
          if(this.passwordVal == '123456789'){
            this.showPassword = false;
            this.dummy.position.x = 2.5;
            this.dummy.position.z = -this.groupPlane.position.z+2;
            this.dummy.rotation.y += 0.5 * Math.PI;
            this.scene.getObjectByName('lock').position.x = 3.5;
            this.scene.getObjectByName('lock').position.z = -this.groupPlane.position.z+3;
            this.scene.getObjectByName('lock').rotation.y += 0.5 * Math.PI;
            this.door_state = false;

            this.scene.getObjectByName('light1').intensity = 1.5;
            this.scene.getObjectByName('light2').intensity = 1.5;
            this.scene.getObjectByName('light3').intensity = 1.5;
            this.scene.getObjectByName('light4').intensity = 1.5;
            this.scene.getObjectByName('light5').intensity = 1.5;
            this.scene.getObjectByName('light6').intensity = 1.5;
            this.scene.getObjectByName('ambient').intensity = 0.15;
            this.lightShow = true

            this.initRenderer();
          }
        }
        if(val == 'cancel'){
          this.showPassword = false;
          this.passwordVal = '';
          this.passwordValHidden = '';
        }
      },
      closeModel(event){
        if(event == false){
          this.showPassword = false;
          this.passwordVal = '';
          this.passwordValHidden = '';
        }
      },
      getTextCanvas(text){
        var width=512, height=256;
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#C3C3C3';
        ctx.fillRect(0, 0, width, height);
        ctx.font = 50+'px " bold';
        ctx.fillStyle = '#2891FF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, width/2,height/2);
        return canvas;
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

