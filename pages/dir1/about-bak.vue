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

  export default {
    data () {
      return {
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
        objects:[]
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
        //this.initAxes();
        //this.initPlane();
        //this.initCustomPlane();
        this.initControl();
        //绘制正方体
        //this.addCube();
        this.addWall();
        this.addDoor();
        this.addWallLeft();
        this.addWallAfter();
        this.addWallRight();
        this.renderer.render(this.scene, this.camera);

        /*this.renderer.render(this.scene, this.camera)
        this.scene.add(this.mesh);*/

        //监听键盘按键
        window.addEventListener("click", this.onkeyDown, false);
      },
      initContainer(){
        let container = document.getElementById('container');
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(container.clientWidth, container.clientHeight)
        container.appendChild(this.renderer.domElement)
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
        this.controls.target.set(45, 15, 30);// 设置控制器的焦点，使控制器围绕这个焦点进行旋转
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
        this.axes.position.x = 50;
        this.axes.position.y = 4;
        this.axes.position.z = 30;
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
        for(var i=0;i<20;i++){
          for(var j=0;j<10;j++){
            let cubeGeometry=new THREE.CubeGeometry(5,2,5);
            let planeMaterial=new THREE.MeshLambertMaterial(i%2==0 ? {color: 0x00ffff} : {color: 0xffffff});
            var mesh=new THREE.Mesh(cubeGeometry,planeMaterial);
            mesh.position.set(i*5,3,j*5);
            mesh.castShadow=true;//需要阴影，方块进行投射阴影
            this.scene.add(mesh);
          }
        }
        this.camera.position.x =  45
      },
      initLight(){
        let spotLight=new THREE.SpotLight(0xffffff);
        spotLight.position.set(50,100,140);
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
        this.cube.position.x=50;
        this.cube.position.y=10;
        this.cube.position.z=25;
        this.cube.castShadow=true;//需要阴影，方块进行投射阴影
        this.scene.add(this.cube);
      },
      addWall(){//模拟一面墙
        let cubeGeometry=new THREE.CubeGeometry(80,10,1);
        let planeMaterial=new THREE.MeshLambertMaterial({color: 0xbbbbbb,wireframe: false});
        this.wall=new THREE.Mesh(cubeGeometry,planeMaterial);
        this.wall.position.x=50;
        this.wall.position.y=9;
        this.wall.position.z=45;
        this.wall.name = 'mainWall';
        //this.scene.add(this.wall);
      },
      addWallAfter(){//模拟一面墙
        let cubeGeometry=new THREE.CubeGeometry(80,10,1);
        let planeMaterial=new THREE.MeshLambertMaterial({color: 0xbbbbbb,wireframe: false});
        this.wall=new THREE.Mesh(cubeGeometry,planeMaterial);
        this.wall.position.x=50;
        this.wall.position.y=9;
        this.wall.position.z=0;
        this.scene.add(this.wall);
      },
      addWallLeft(){//模拟一面墙
        let cubeGeometry=new THREE.CubeGeometry(1,10,45);
        let planeMaterial=new THREE.MeshLambertMaterial({color: 0xbbbbbb,wireframe: false});
        this.wall=new THREE.Mesh(cubeGeometry,planeMaterial);
        this.wall.position.x=9.5;
        this.wall.position.y=9;
        this.wall.position.z=22.5;
        this.scene.add(this.wall);
      },
      addWallRight(){//模拟一面墙
        let cubeGeometry=new THREE.CubeGeometry(1,10,45);
        let planeMaterial=new THREE.MeshLambertMaterial({color: 0xbbbbbb,wireframe: false});
        this.wall=new THREE.Mesh(cubeGeometry,planeMaterial);
        this.wall.position.x=90.5;
        this.wall.position.y=9;
        this.wall.position.z=22.5;
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
        door_cube.position.x = 50;
        door_cube.position.y = 8;
        door_cube.position.z = 45;
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
          doormaterial.opacity = 1.0;
          doormaterial.transparent = true;
          var door1 = new THREE.Mesh(doorgeometry, doormaterial);
          door1.position.set(50, 8, 45);
          door1.name = 'doorMain';
          var door2 = door1.clone();
          door2.position.set(-50, 8, 45);
          door2.visible = false;
          _self.dummy.position.set(0, 0, 0);

          _self.dummy.name = 'doorMain';
          _self.dummy.add(door1);
          _self.dummy.add(door2);
          _self.objects.push(door1);
          _self.scene.add(_self.dummy);
        });
      },
      subtractMesh(meshDoor,meshWall){
        //平行x轴横墙面4减去与meshHDoor门重叠部分
        var subtract_bsp = meshWall.subtract( meshDoor );
        var result = subtract_bsp.toMesh(new THREE.MeshBasicMaterial({
          flatShading: true,
          color:'#bbbbbb'
        }));
        //result.geometry.computeFaceNormals();
        //result.geometry.computeVertexNormals();
        this.scene.add( result );
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
        var selectedObject = null;
        event.preventDefault();
        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector3();
        //通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
        raycaster.setFromCamera( mouse, this.camera );

        // 获取raycaster直线和所有模型相交的数组集合
        var intersects = raycaster.intersectObjects( this.scene.children );

        //将所有的相交的模型的颜色设置为红色，如果只需要将第一个触发事件，那就数组的第一个模型改变颜色即可
        for ( var i = 0; i < intersects.length; i++ ) {

          console.log(intersects[ i ].object);

        }


        /*switch (event.keyCode) {
          case 13:
            console.log(event.keyCode);
            if (this.door_state) {
              this.dummy.position.x = 7;
              this.dummy.rotation.y += 0.5 * Math.PI;
              this.dummy.position.z = 98;
              this.door_state = false;
            } else {
              this.dummy.position.x = 0;
              this.dummy.position.y = 0;
              this.dummy.position.z = 0;
              this.dummy.rotation.y -= 0.5 * Math.PI;
              this.door_state = true;
            }
            console.log(this.dummy.rotation);
            this.addTouchListener();
            break;
          default:
            console.log(event.keyCode);
            break;
        }*/
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

