import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Eye, EyeOff, RotateCcw, Sliders, Sparkles } from 'lucide-react';

export const ThreeDBarbershopScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [chairRotationSpeed, setChairRotationSpeed] = useState(1);
  const [lightMode, setLightMode] = useState<'warm' | 'studio' | 'neon'>('warm');
  const [explodedView, setExplodedView] = useState(0); // 0 to 1

  const chairRef = useRef<THREE.Group | null>(null);
  const poleRef = useRef<THREE.Mesh | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0b10);
    scene.fog = new THREE.FogExp2(0x0a0b10, 0.035);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 3, 7);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // Don't go below ground
    controls.minDistance = 3;
    controls.maxDistance = 12;

    // Environment & Lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.5);
    keyLight.position.set(5, 8, 4);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.HemisphereLight(0x38bdf8, 0x1e293b, 1.2);
    scene.add(fillLight);

    // Ground Floor
    const floorGeo = new THREE.PlaneGeometry(20, 20);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111318,
      roughness: 0.25,
      metalness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // --- Procedural Barbershop Styling Chair (Composite 3-12 parts) ---
    const chairGroup = new THREE.Group();

    // 1. Heavy Chrome Base
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.2, 32);
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
    const baseMesh = new THREE.Mesh(baseGeo, chromeMat);
    baseMesh.position.y = 0.1;
    baseMesh.castShadow = true;
    chairGroup.add(baseMesh);

    // 2. Hydraulic Column
    const columnGeo = new THREE.CylinderGeometry(0.3, 0.35, 1.2, 16);
    const darkSteelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const columnMesh = new THREE.Mesh(columnGeo, darkSteelMat);
    columnMesh.position.y = 0.8;
    chairGroup.add(columnMesh);

    // 3. Seat Cushion
    const seatGeo = new THREE.BoxGeometry(1.6, 0.4, 1.6);
    const leatherMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6, metalness: 0.1 }); // Vintage leather brown
    const seatMesh = new THREE.Mesh(seatGeo, leatherMat);
    seatMesh.position.y = 1.5;
    seatMesh.castShadow = true;
    chairGroup.add(seatMesh);

    // 4. Backrest
    const backGeo = new THREE.BoxGeometry(1.5, 1.8, 0.3);
    const backMesh = new THREE.Mesh(backGeo, leatherMat);
    backMesh.position.set(0, 2.5, -0.7);
    backMesh.castShadow = true;
    chairGroup.add(backMesh);

    // 5. Headrest
    const headGeo = new THREE.BoxGeometry(0.6, 0.4, 0.25);
    const headMesh = new THREE.Mesh(headGeo, leatherMat);
    headMesh.position.set(0, 3.6, -0.7);
    chairGroup.add(headMesh);

    // 6. Armrests (Left & Right)
    const armGeo = new THREE.BoxGeometry(0.3, 0.8, 1.4);
    const leftArm = new THREE.Mesh(armGeo, leatherMat);
    leftArm.position.set(-0.9, 2.0, 0.1);
    chairGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, leatherMat);
    rightArm.position.set(0.9, 2.0, 0.1);
    chairGroup.add(rightArm);

    // 7. Golden Trim Accents
    const trimGeo = new THREE.BoxGeometry(1.64, 0.1, 1.64);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
    const trimMesh = new THREE.Mesh(trimGeo, goldMat);
    trimMesh.position.y = 1.32;
    chairGroup.add(trimMesh);

    scene.add(chairGroup);
    chairRef.current = chairGroup;

    // --- Rotating Cinematic Barber Pole nearby ---
    const poleGroup = new THREE.Group();
    const glassTubeGeo = new THREE.CylinderGeometry(0.4, 0.4, 3.5, 24);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
    });
    const poleMesh = new THREE.Mesh(glassTubeGeo, glassMat);
    poleMesh.position.set(3.5, 2.0, 0);
    poleGroup.add(poleMesh);
    scene.add(poleGroup);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (chairRef.current) {
        chairRef.current.rotation.y += delta * 0.4 * chairRotationSpeed;
        // Exploded view offset simulation
        chairRef.current.position.y = THREE.MathUtils.damp(
          chairRef.current.position.y,
          explodedView * 0.5,
          4,
          delta
        );
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [explodedView, chairRotationSpeed]);

  // Handle lighting mode change
  useEffect(() => {
    if (!keyLightRef.current) return;
    if (lightMode === 'warm') {
      keyLightRef.current.color.setHex(0xffeedd);
      keyLightRef.current.intensity = 2.5;
    } else if (lightMode === 'studio') {
      keyLightRef.current.color.setHex(0xffffff);
      keyLightRef.current.intensity = 3.5;
    } else if (lightMode === 'neon') {
      keyLightRef.current.color.setHex(0x38bdf8);
      keyLightRef.current.intensity = 3.0;
    }
  }, [lightMode]);

  return (
    <section id="experience-3d" className="relative w-full h-[650px] bg-[#090a0f] overflow-hidden border-y border-zinc-800">
      {/* WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Banner Badge */}
      <div className="absolute top-6 left-6 z-10 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-2 shadow-xl">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>CinematiCuts 3D Master Studio Viewport</span>
      </div>

      {/* Collapse/Expand Control Toggle */}
      <button
        onClick={() => setIsControlsVisible(!isControlsVisible)}
        className="absolute top-6 right-6 z-20 bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/15 px-3.5 py-2 rounded-xl text-white text-xs font-medium flex items-center gap-2 transition-all shadow-xl"
      >
        {isControlsVisible ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4 text-amber-400" />}
        <span>{isControlsVisible ? 'Hide Controls' : 'Show Controls'}</span>
      </button>

      {/* Unified Bottom Control Dock (Collapsible, Centered, Zero Occlusion) */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[800px] transition-all duration-300 transform ${
          isControlsVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-zinc-950/85 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-4 shadow-2xl flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-300">
          
          {/* Rotation Speed */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" /> Rotation Speed
            </span>
            <input
              type="range"
              min="0"
              max="3"
              step="0.2"
              value={chairRotationSpeed}
              onChange={(e) => setChairRotationSpeed(parseFloat(e.target.value))}
              className="w-24 accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Exploded View Slider */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white">Exploded View</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={explodedView}
              onChange={(e) => setExplodedView(parseFloat(e.target.value))}
              className="w-24 accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Lighting Mode Pills */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setLightMode('warm')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                lightMode === 'warm' ? 'bg-amber-400 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Warm Amber
            </button>
            <button
              onClick={() => setLightMode('studio')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                lightMode === 'studio' ? 'bg-amber-400 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Studio
            </button>
            <button
              onClick={() => setLightMode('neon')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                lightMode === 'neon' ? 'bg-amber-400 text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Cyan Neon
            </button>
          </div>

          {/* Reset View */}
          <button
            onClick={() => {
              setChairRotationSpeed(1);
              setExplodedView(0);
              setLightMode('warm');
            }}
            className="p-2 text-zinc-400 hover:text-amber-400 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors"
            title="Reset Controls"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
