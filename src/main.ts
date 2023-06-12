import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import backgroundSrc from "../assets/background.jpg?url";
import logoSrc from "../assets/logo.glb?url";

class Main {
	private renderer: THREE.WebGLRenderer;
	private scene: THREE.Scene;
	private camera: THREE.PerspectiveCamera;
	private controls: OrbitControls;

	constructor() {
		// Create WebGL renderer
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: "high-performance",
		});
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		document.body.appendChild(this.renderer.domElement);

		// Create scene
		this.scene = new THREE.Scene();

		// Create camera
		this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1200);
		this.camera.position.set(0, 0, 100);
		this.camera.lookAt(this.scene.position);
		this.scene.add(this.camera);

		// Create drag & zoom controls
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);

		// Update renderer & camera sizes on window resize
		window.addEventListener("resize", () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		});
	}

	async start() {
		// Create background
		const textureLoader = new THREE.TextureLoader();
		const backgroundTexture = await textureLoader.loadAsync(backgroundSrc);
		backgroundTexture.colorSpace = THREE.SRGBColorSpace;
		const backgroundGeometry = new THREE.PlaneGeometry(100, 100);
		const backgroundMaterial = new THREE.MeshBasicMaterial({ map: backgroundTexture });
		const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
		backgroundMesh.position.set(0, 0, -30);
		this.scene.add(backgroundMesh);

		// Create 3D logo
		const gltfLoader = new GLTFLoader();
		const gltf = await gltfLoader.loadAsync(logoSrc);
		const geometry = (gltf.scene.children[0].children[0] as THREE.Mesh).geometry.clone();
		geometry.center();
		geometry.rotateX(-Math.PI / 2);

		const material = new THREE.MeshBasicMaterial({
			color: 0x0000ff,
		});

		const mesh = new THREE.Mesh(geometry, material);

		this.scene.add(mesh);
	}

	update() {
		this.renderer.render(this.scene, this.camera);
		this.controls.update();
		requestAnimationFrame(this.update.bind(this));
	}
}

const main = new Main();
main.start().then(() => main.update());
