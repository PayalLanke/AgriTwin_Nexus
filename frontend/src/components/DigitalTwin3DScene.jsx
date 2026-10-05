import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function DigitalTwin3DScene({
  boundaryGeoJSON = null,
  centerLat = 18.5204,
  centerLng = 73.8567,
  cropType = 'Crop',
  activeLayer = 'canopy', // 'canopy' | 'terrain' | 'grid' | 'contour'
  viewMode = '3d', // '3d' | 'ortho'
  autoRotate = false
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const farmWorldRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const beaconGroupRef = useRef(null);

  const [hoveredInfo, setHoveredInfo] = useState(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    // 1. Scene & Environment Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060d0a, 0.01);
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 24, 30);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0x0d281e, 1.8);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x22e58a, 0x060d0a, 1.2);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0x34d399, 2.2);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const cyanLight = new THREE.PointLight(0x00d9ff, 2.4, 70);
    cyanLight.position.set(-18, 16, -12);
    scene.add(cyanLight);

    const emeraldLight = new THREE.PointLight(0x22e58a, 2.0, 50);
    emeraldLight.position.set(18, 12, 12);
    scene.add(emeraldLight);

    // 5. Root Group
    const farmWorld = new THREE.Group();
    scene.add(farmWorld);
    farmWorldRef.current = farmWorld;

    // Pedestal Base Cylinder Grid
    const baseGeo = new THREE.CylinderGeometry(26, 28, 1.5, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0a1410,
      roughness: 0.7,
      metalness: 0.3
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.0;
    baseMesh.receiveShadow = true;
    farmWorld.add(baseMesh);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(52, 44, 0x1f513f, 0x0b201a);
    gridHelper.position.y = -0.22;
    farmWorld.add(gridHelper);

    // 6. Convert GeoJSON Polygon into 3D Extruded Shape
    let coords = [];
    if (boundaryGeoJSON && boundaryGeoJSON.geometry) {
      if (boundaryGeoJSON.geometry.type === 'Polygon') {
        coords = boundaryGeoJSON.geometry.coordinates[0];
      } else if (boundaryGeoJSON.geometry.type === 'MultiPolygon') {
        coords = boundaryGeoJSON.geometry.coordinates[0][0];
      }
    }

    const points2D = [];
    const cornerVertices = [];

    if (coords && coords.length >= 3) {
      const metersPerDegreeLat = 111320;
      const metersPerDegreeLng = 111320 * Math.cos((centerLat * Math.PI) / 180);

      coords.forEach(([lng, lat]) => {
        const dx = (lng - centerLng) * metersPerDegreeLng;
        const dz = (lat - centerLat) * metersPerDegreeLat;
        const pt = new THREE.Vector2(dx * 0.08, -dz * 0.08);
        points2D.push(pt);
        cornerVertices.push({ x: dx * 0.08, z: dz * 0.08, lat, lng });
      });
    }

    let farmMesh, surfaceMesh, wireframeMesh, cropsGroup;

    if (points2D.length >= 3) {
      // Build Realistic Extruded Field Geometry
      const shape = new THREE.Shape(points2D);
      const extrudeSettings = {
        depth: 0.75,
        bevelEnabled: true,
        bevelThickness: 0.12,
        bevelSize: 0.12,
        bevelSegments: 3
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geometry.rotateX(Math.PI / 2); // Orient flat on XZ plane

      // Soil Earth Material
      const soilMat = new THREE.MeshStandardMaterial({
        color: 0x122a1f,
        roughness: 0.65,
        metalness: 0.2
      });

      farmMesh = new THREE.Mesh(geometry, soilMat);
      farmMesh.position.y = 0;
      farmMesh.castShadow = true;
      farmMesh.receiveShadow = true;
      farmWorld.add(farmMesh);

      // Realistic Vegetation Canopy Surface Mesh
      const surfaceMat = new THREE.MeshStandardMaterial({
        color: 0x22e58a,
        roughness: 0.4,
        metalness: 0.1,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide
      });
      surfaceMesh = new THREE.Mesh(geometry, surfaceMat);
      surfaceMesh.position.y = 0.77;
      farmWorld.add(surfaceMesh);

      // High-Precision Vector Wireframe Grid
      const wireGeo = new THREE.WireframeGeometry(geometry);
      const wireMat = new THREE.LineBasicMaterial({ color: 0x34d399, linewidth: 2 });
      wireframeMesh = new THREE.LineSegments(wireGeo, wireMat);
      wireframeMesh.position.y = 0.78;
      farmWorld.add(wireframeMesh);

      // 7. Realistic 3D Stalk Crops inside Polygon Boundary
      cropsGroup = new THREE.Group();
      farmWorld.add(cropsGroup);

      // Simple Raycasting inside bounding box to plant crops inside shape
      const bbox = new THREE.Box2();
      points2D.forEach(p => bbox.expandByPoint(p));

      const stalkGeo = new THREE.CylinderGeometry(0.04, 0.08, 0.7, 5);
      const stalkMat = new THREE.MeshStandardMaterial({ color: 0x22e58a, roughness: 0.5 });
      const leafGeo = new THREE.SphereGeometry(0.2, 5, 4);
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x34d399 });

      const step = 0.9;
      for (let x = bbox.min.x + 0.3; x <= bbox.max.x - 0.3; x += step) {
        for (let y = bbox.min.y + 0.3; y <= bbox.max.y - 0.3; y += step) {
          // Check if point is inside polygon shape
          if (shape.containsPoint(new THREE.Vector2(x, y))) {
            const rx = x + (Math.random() - 0.5) * 0.3;
            const rz = -y + (Math.random() - 0.5) * 0.3;

            const stalk = new THREE.Mesh(stalkGeo, stalkMat);
            stalk.position.set(rx, 1.1, rz);
            cropsGroup.add(stalk);

            const leaf = new THREE.Mesh(leafGeo, leafMat);
            leaf.position.set(rx, 1.45, rz);
            leaf.scale.set(1.4, 0.5, 1.2);
            cropsGroup.add(leaf);
          }
        }
      }

      // 8. 3D Spatial Holographic Beacon for Farm Center
      const beaconGroup = new THREE.Group();
      beaconGroup.position.set(0, 0.8, 0);
      beaconGroupRef.current = beaconGroup;

      const beamGeo = new THREE.CylinderGeometry(0.05, 0.18, 9, 12);
      const beamMat = new THREE.MeshBasicMaterial({ color: 0x00d9ff, transparent: true, opacity: 0.65 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = 4.5;
      beaconGroup.add(beam);

      const diamondGeo = new THREE.OctahedronGeometry(0.65, 0);
      const diamondMat = new THREE.MeshStandardMaterial({
        color: 0x00d9ff,
        emissive: 0x00d9ff,
        emissiveIntensity: 0.9,
        metalness: 0.8
      });
      const diamond = new THREE.Mesh(diamondGeo, diamondMat);
      diamond.position.y = 9.2;
      beaconGroup.add(diamond);

      const ringGeo = new THREE.RingGeometry(0.4, 1.0, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x00d9ff, transparent: true, opacity: 0.75, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.1;
      beaconGroup.add(ring);

      farmWorld.add(beaconGroup);

      // Corner Beacons
      cornerVertices.slice(0, 4).forEach((v) => {
        const cornerPin = new THREE.Mesh(
          new THREE.SphereGeometry(0.2, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0x22e58a })
        );
        cornerPin.position.set(v.x, 0.85, -v.z);
        farmWorld.add(cornerPin);
      });
    } else {
      // Fallback Field Mesh if GeoJSON polygon is missing
      const fallbackGeo = new THREE.BoxGeometry(16, 0.8, 14);
      const fallbackMat = new THREE.MeshStandardMaterial({ color: 0x122a1f, roughness: 0.6 });
      const fallbackMesh = new THREE.Mesh(fallbackGeo, fallbackMat);
      fallbackMesh.position.y = 0;
      farmWorld.add(fallbackMesh);

      const topGeo = new THREE.PlaneGeometry(15.8, 13.8);
      const topMat = new THREE.MeshStandardMaterial({ color: 0x22e58a, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
      const topMesh = new THREE.Mesh(topGeo, topMat);
      topMesh.rotation.x = -Math.PI / 2;
      topMesh.position.y = 0.42;
      farmWorld.add(topMesh);

      const wireGeo = new THREE.EdgesGeometry(topGeo);
      const wireMat = new THREE.LineBasicMaterial({ color: 0x34d399 });
      const wire = new THREE.LineSegments(wireGeo, wireMat);
      wire.rotation.x = -Math.PI / 2;
      wire.position.y = 0.43;
      farmWorld.add(wire);
    }

    // 9. Ambient Data Dust Particles
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 36;
      posArray[i + 1] = Math.random() * 14 + 0.5;
      posArray[i + 2] = (Math.random() - 0.5) * 36;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({ size: 0.2, color: 0x22e58a, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(particleGeo, particleMat);
    farmWorld.add(particles);

    // 10. Interactive Drag & Zoom Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotY = -0.45;
    let rotX = 0.42;

    const handleMouseDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        rotY += dx * 0.006;
        rotX = Math.max(0.1, Math.min(1.2, rotX + dy * 0.005));
        prevMouse = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.02;
      const currentDist = camera.position.length();
      if ((currentDist > 12 && zoomFactor < 0) || (currentDist < 65 && zoomFactor > 0)) {
        camera.position.multiplyScalar(1 + zoomFactor * 0.02);
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 11. Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (autoRotate) {
        rotY += 0.003;
      }
      farmWorld.rotation.y += (rotY - farmWorld.rotation.y) * 0.05;
      farmWorld.rotation.x += (rotX - farmWorld.rotation.x) * 0.05;

      if (beaconGroupRef.current) {
        beaconGroupRef.current.children[1].rotation.y = t * 1.5; // Rotate diamond
      }

      // Floating Particle movement
      const positions = particleGeo.attributes.position.array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += Math.sin(t + i) * 0.01;
      }
      particleGeo.attributes.position.needsUpdate = true;

      camera.lookAt(0, 0.5, 0);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [boundaryGeoJSON, centerLat, centerLng, cropType]);

  // Switch between 3D Perspective and 2D Top-Down Orthographic
  useEffect(() => {
    if (!cameraRef.current) return;
    if (viewMode === 'ortho') {
      cameraRef.current.position.set(0, 42, 0.01);
      if (farmWorldRef.current) {
        farmWorldRef.current.rotation.set(0, 0, 0);
      }
    } else {
      cameraRef.current.position.set(0, 24, 30);
    }
  }, [viewMode]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '420px', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%', minHeight: '420px', cursor: 'grab' }} />
    </div>
  );
}
