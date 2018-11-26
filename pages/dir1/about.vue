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
        door:null,
        controls:null,
        gui:null
      }
    },
    created() {

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
        //绘制正方体
        //this.addCube();
        this.addWall();
        this.addDoor();
        this.renderer.render(this.scene, this.camera);

        this.initControl();
        /*this.renderer.render(this.scene, this.camera)
        this.scene.add(this.mesh);*/
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
        this.controls.addEventListener("change", () => this.renderer.render(this.scene, this.camera));
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
        this.axes.position.y = 5;
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
        spotLight.position.set(-50,100,140);
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
        let planeMaterial=new THREE.MeshLambertMaterial({color: 0xdddddd});
        this.wall=new THREE.Mesh(cubeGeometry,planeMaterial);
        this.wall.position.x=50;
        this.wall.position.y=10;
        this.wall.position.z=40;
        this.scene.add(this.wall);
      },
      addDoor(){
        var door = new THREE.BoxGeometry(5, 8, 1);
        // 创建门材料
        var doorMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff'});
        var door_cube = new THREE.Mesh( door, doorMaterial);
        //var door_cube = new THREE.Mesh( door);
        // 设置门位置
        door_cube.position.x = 50;
        door_cube.position.y = 9;
        door_cube.position.z = 40;
        //door_cube.rotation.y += 0.5*Math.PI;

        var sphere1BSP = new ThreeBSP(this.wall);
        var cube2BSP = new ThreeBSP(door_cube);

        var resultBSP = sphere1BSP.subtract(cube2BSP);
        var result = resultBSP.toMesh();
        //result.material.shading = THREE.FlatShading;
        result.geometry.computeFaceNormals();
        result.geometry.computeVertexNormals();
        result.material.needsUpdate = true;
        result.geometry.buffersNeedUpdate = true;
        result.geometry.uvsNeedUpdate = true;
        this.scene.add(door_cube);
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
      addTouchListener() {
        this.controls.update();
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
    height: 400px;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
</style>

