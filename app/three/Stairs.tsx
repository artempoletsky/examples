"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { StairsMaterial } from "./page";

function createScene(container: HTMLDivElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enablePan = false;

  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  camera.position.y = -10;
  camera.position.z = 3;
  camera.lookAt(0, 0, 0);

  const planeXYgeo = new THREE.PlaneGeometry(100, 100);

  const whiteDuffuseMat = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    roughness: 0.2,
  });
  const planeXY = new THREE.Mesh(planeXYgeo, whiteDuffuseMat);
  planeXY.receiveShadow = true;
  scene.add(planeXY);

  const planeYZ = new THREE.Mesh(planeXYgeo, whiteDuffuseMat);
  planeXY.receiveShadow = true;
  planeYZ.rotation.x = Math.PI / 2;
  scene.add(planeYZ);

  // const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
  // scene.add(ambientLight);

  const light = new THREE.PointLight(0xffffff, 100, 100);
  light.castShadow = true;
  light.position.set(5, -5, 10);
  scene.add(light);


  // const light2 = new THREE.PointLight(0xffffff, 20, 100);
  // light2.castShadow = true;
  // light2.position.set(-3, -5, 5);
  // scene.add(light2);



  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  const hdriLoader = new RGBELoader()
  hdriLoader.load("/hdri/boiler_room_2k.hdr", function (texture) {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    texture.dispose();
    scene.environment = envMap
  });

  return {
    scene,
    camera,
    controls,
    renderer,
  }
}

function createCube() {

  const texture = new THREE.TextureLoader().load("/textures/TCom_Wood_OakVeneer2_512_albedo.png");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(0.5, 0.5);


  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    // color: 0xff0000,
    roughness: 0.2,
    map: texture,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  cube.position.z = 0.501;
  cube.position.y = -0.51;


  return cube;
}


function createStep(width: number, mat: StairsMaterial) {
  let textureFile = "/textures/TCom_Wood_OakVeneer2_512_albedo.png";

  if (mat == "birch") {
    textureFile = "/textures/TCom_Wood_ParquetFiveFinger_512_albedo.png";
  } else if(mat == "pine") {
    textureFile = "/textures/TCom_Wood_ParquetHerringbone9_New_512_albedo.png";
  }

  const texture = new THREE.TextureLoader().load(textureFile);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(0.5, 0.5);


  const geometry = new THREE.BoxGeometry(width / 100, 0.2, 0.1);
  const material = new THREE.MeshStandardMaterial({
    // color: 0xff0000,
    roughness: 0.2,
    map: texture,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;


  return cube;
}

function createStairs(num: number, width: number, material: StairsMaterial) {
  const result: THREE.Mesh[] = [];
  for (let i = 0; i < num; i++) {
    const step = createStep(width, material);
    step.position.z = num * 0.2 - i * 0.2;
    step.position.y = - 0.3 - i * 0.3;
    result.push(step);
  }
  return result;
}

type Props = {
  width: number;
  numStairs: number;
  material: StairsMaterial;
}

let scene: THREE.Scene;
let stairs: THREE.Mesh[] = [];

export default function Stairs({ width, numStairs, material }: Props) {
  const container = useRef<HTMLDivElement>(null);



  useEffect(() => {

    const { scene: sceneCreated, camera, controls, renderer } = createScene(container.current!);

    scene = sceneCreated;
    stairs = createStairs(numStairs, width, material);
    for (const s of stairs) {
      scene.add(s);
    }

    let req: number;
    function animate() {
      req = requestAnimationFrame(animate);
      renderer.render(scene, camera);
      controls.update();
      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;
    }
    animate();


    return () => {
      cancelAnimationFrame(req);
      container.current!.removeChild(renderer.domElement);
    }
  }, []);

  useEffect(() => {
    if (!scene) return;
    for (const s of stairs) {
      scene.remove(s);
    }
    stairs = createStairs(numStairs, width, material);
    for (const s of stairs) {
      scene.add(s);
    }
  }, [width, numStairs, material]);
  // if (!global.window) return "";

  // return renderer.domElement;
  return <div ref={container}>

  </div>;
  // return (
  //   <main className="flex min-h-screen flex-col items-center justify-between p-24">
  //   </main>
  // );
}
