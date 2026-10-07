import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function DigitalTwin3DScene({
  boundaryGeoJSON = null,
  centerLat = 19.9231,
  centerLng = 74.5464,
  cropType = 'Crop',
  activeLayer = 'ndvi', // 'ndvi' | 'moisture' | 'npk' | 'thermal' | 'sar'
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

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 480;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060d0a, 0.012);
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 22, 28);
    cameraRef.current = camera;

    // 3. WebGL Renderer Setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x0d281e, 1.8);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x22e58a, 0x060d0a, 1.2);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0x34d399, 2.2);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const cyanLight = new THREE.PointLight(0x00d9ff, 2.5, 70);
    cyanLight.position.set(-18, 16, -12);
    scene.add(cyanLight);

    const emeraldLight = new THREE.PointLight(0x22e58a, 2.0, 50);
    emeraldLight.position.set(18, 12, 12);
    scene.add(emeraldLight);

    // 5. Root Group
    const farmWorld = new THREE.Group();
    scene.add(farmWorld);
    farmWorldRef.current = farmWorld;

    // Pedestal Base
    const baseGeo = new THREE.CylinderGeometry(24, 26, 1.2, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0a1410,
      roughness: 0.7,
      metalness: 0.3
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.8;
    baseMesh.receiveShadow = true;
    farmWorld.add(baseMesh);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(48, 40, 0x1f513f, 0x0b201a);
    gridHelper.position.y = -0.18;
    farmWorld.add(gridHelper);

    // 6. 5x5 Sub-Plot Grid Parcels (25 Modular Land Tiles) - ALWAYS LOADED
    const subPlotGroup = new THREE.Group();
    farmWorld.add(subPlotGroup);

    const gridRows = 5;
    const gridCols = 5;
    const tileSize = 2.2;
    const tileSpacing = 0.25;
    const offsetX = -((gridCols * (tileSize + tileSpacing)) / 2) + tileSize / 2;
    const offsetZ = -((gridRows * (tileSize + tileSpacing)) / 2) + tileSize / 2;

    const tileMeshes = [];

    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const tx = offsetX + c * (tileSize + tileSpacing);
        const tz = offsetZ + r * (tileSize + tileSpacing);

        // Color coding based on active layer & sub-plot anomaly (matching screenshot red deficit tile)
        let tileColor = 0x15803d; // Green optimal
        if (r === 1 && c === 2) tileColor = 0xef4444; // Red deficit anomaly
        else if (r === 0 && c === 4) tileColor = 0xeab308; // Yellow moderate
        else if (r === 4 && c === 0) tileColor = 0x0284c7; // Blue moisture

        if (activeLayer === 'moisture') tileColor = 0x0284c7;
        else if (activeLayer === 'npk' && r === 1 && c === 2) tileColor = 0xef4444;
        else if (activeLayer === 'thermal') tileColor = r % 2 === 0 ? 0xf97316 : 0xd97706;
        else if (activeLayer === 'sar') tileColor = 0x475569;

        const tileGeo = new THREE.BoxGeometry(tileSize, 0.45, tileSize);
        const tileMat = new THREE.MeshStandardMaterial({
          color: tileColor,
          roughness: 0.5,
          metalness: 0.2
        });

        const tileMesh = new THREE.Mesh(tileGeo, tileMat);
        tileMesh.position.set(tx, 0.22, tz);
        tileMesh.castShadow = true;
        tileMesh.receiveShadow = true;
        subPlotGroup.add(tileMesh);
        tileMeshes.push({ mesh: tileMesh, row: r, col: c });

        // Wireframe border outline for sub-plot
        const wireGeo = new THREE.EdgesGeometry(tileGeo);
        const wireMat = new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.6 });
        const wire = new THREE.LineSegments(wireGeo, wireMat);
        tileMesh.add(wire);
      }
    }

    // 7. 3D Crops Planted on Sub-Plot Tiles
    const cropsGroup = new THREE.Group();
    farmWorld.add(cropsGroup);

    const normalizedCrop = (cropType || '').toLowerCase();
    const isPapaya = normalizedCrop.includes('papaya') || normalizedCrop.includes('पपई');
    const isMaize = normalizedCrop.includes('maize') || normalizedCrop.includes('मका');
    const isSugarcane = normalizedCrop.includes('sugarcane') || normalizedCrop.includes('ऊस');
    const isCotton = normalizedCrop.includes('cotton') || normalizedCrop.includes('कापूस');
    const isWheat = normalizedCrop.includes('wheat') || normalizedCrop.includes('गहू');

    tileMeshes.forEach(({ mesh }) => {
      const px = mesh.position.x;
      const pz = mesh.position.z;

      for (let k = 0; k < 2; k++) {
        const rx = px + (Math.random() - 0.5) * 1.2;
        const rz = pz + (Math.random() - 0.5) * 1.2;

        if (isPapaya) {
          const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 1.2, 5), new THREE.MeshStandardMaterial({ color: 0x85583f }));
          trunk.position.set(rx, 1.1, rz);
          cropsGroup.add(trunk);
          const top = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.9, 4), new THREE.MeshStandardMaterial({ color: 0x16a34a }));
          top.position.set(rx, 1.8, rz);
          top.rotation.z = Math.PI / 4;
          cropsGroup.add(top);
        } else {
          const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.7, 5), new THREE.MeshStandardMaterial({ color: 0x22e58a }));
          stalk.position.set(rx, 0.8, rz);
          cropsGroup.add(stalk);
          const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.18, 5, 4), new THREE.MeshStandardMaterial({ color: isWheat ? 0xeab308 : 0x34d399 }));
          leaf.position.set(rx, 1.15, rz);
          leaf.scale.set(1.2, 0.5, 1.2);
          cropsGroup.add(leaf);
        }
      }
    });

    // 8. 3D Scanning UAV Quadcopter Drone Mesh (UAV ALPHA-1) - ALWAYS LOADED
    const droneGroup = new THREE.Group();
    droneGroup.position.set(0, 10.5, 0);
    farmWorld.add(droneGroup);

    // Drone Body Core
    const droneBodyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
    const droneCore = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 1.2), droneBodyMat);
    droneGroup.add(droneCore);

    // Drone Rotors & Arms
    const rotorMat = new THREE.MeshBasicMaterial({ color: 0x00d9ff, transparent: true, opacity: 0.8 });
    const props = [];
    const angles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];

    angles.forEach((ang) => {
      const armLen = 1.4;
      const ax = Math.cos(ang) * armLen;
      const az = Math.sin(ang) * armLen;

      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, armLen, 6), droneBodyMat);
      arm.position.set(ax / 2, 0, az / 2);
      arm.rotation.z = Math.PI / 2;
      arm.rotation.y = -ang;
      droneGroup.add(arm);

      const propMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.02, 12), rotorMat);
      propMesh.position.set(ax, 0.1, az);
      droneGroup.add(propMesh);
      props.push(propMesh);
    });

    // Translucent Cyan UAV Scanning Cone Light Beam
    const coneGeo = new THREE.ConeGeometry(4.8, 10.5, 24, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide
    });
    const scanCone = new THREE.Mesh(coneGeo, coneMat);
    scanCone.position.set(0, -5.25, 0);
    scanCone.rotation.x = Math.PI; // Point downwards
    droneGroup.add(scanCone);

    // 9. Floating Holographic Data Beacons (Orange & Cyan Pins)
    if (tileMeshes.length > 18) {
      const beaconOrange = new THREE.Group();
      beaconOrange.position.set(tileMeshes[7].mesh.position.x, 0.8, tileMeshes[7].mesh.position.z);
      const diaOrange = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.45, 0),
        new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xf97316, emissiveIntensity: 0.9 })
      );
      diaOrange.position.y = 3.2;
      beaconOrange.add(diaOrange);
      const lineOrange = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 3.2, 6),
        new THREE.MeshBasicMaterial({ color: 0xf97316 })
      );
      lineOrange.position.y = 1.6;
      beaconOrange.add(lineOrange);
      farmWorld.add(beaconOrange);

      const beaconCyan = new THREE.Group();
      beaconCyan.position.set(tileMeshes[18].mesh.position.x, 0.8, tileMeshes[18].mesh.position.z);
      const diaCyan = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.45, 0),
        new THREE.MeshStandardMaterial({ color: 0x00d9ff, emissive: 0x00d9ff, emissiveIntensity: 0.9 })
      );
      diaCyan.position.y = 3.2;
      beaconCyan.add(diaCyan);
      const lineCyan = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 3.2, 6),
        new THREE.MeshBasicMaterial({ color: 0x00d9ff })
      );
      lineCyan.position.y = 1.6;
      beaconCyan.add(lineCyan);
      farmWorld.add(beaconCyan);
    }

    // 10. GeoJSON Vector Overlay (If polygon provided)
    let coords = [];
    if (boundaryGeoJSON && boundaryGeoJSON.geometry) {
      if (boundaryGeoJSON.geometry.type === 'Polygon') {
        coords = boundaryGeoJSON.geometry.coordinates[0];
      } else if (boundaryGeoJSON.geometry.type === 'MultiPolygon') {
        coords = boundaryGeoJSON.geometry.coordinates[0][0];
      }
    }

    if (coords && coords.length >= 3) {
      const metersPerDegreeLat = 111320;
      const metersPerDegreeLng = 111320 * Math.cos((centerLat * Math.PI) / 180);
      const points2D = [];

      coords.forEach(([lng, lat]) => {
        const dx = (lng - centerLng) * metersPerDegreeLng;
        const dz = (lat - centerLat) * metersPerDegreeLat;
        points2D.push(new THREE.Vector2(dx * 0.08, -dz * 0.08));
      });

      if (points2D.length >= 3) {
        const shape = new THREE.Shape(points2D);
        const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.6, bevelEnabled: false });
        geometry.rotateX(Math.PI / 2);
        const wireGeo = new THREE.WireframeGeometry(geometry);
        const wireMat = new THREE.LineBasicMaterial({ color: 0x34d399, linewidth: 2 });
        const polyWire = new THREE.LineSegments(wireGeo, wireMat);
        polyWire.position.y = 0.5;
        farmWorld.add(polyWire);
      }
    }

    // 11. Ambient Floating Data Dust Particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 32;
      posArray[i + 1] = Math.random() * 12 + 0.5;
      posArray[i + 2] = (Math.random() - 0.5) * 32;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({ size: 0.2, color: 0x22e58a, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(particleGeo, particleMat);
    farmWorld.add(particles);

    // 12. Interactive Controls & Animation Loop
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

    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // UAV Flight Movement & Propellers
      if (droneGroup) {
        droneGroup.position.x = Math.sin(t * 0.7) * 4.5;
        droneGroup.position.z = Math.cos(t * 0.7) * 3.5;
        droneGroup.position.y = 10.5 + Math.sin(t * 2.2) * 0.25;
        droneGroup.rotation.y = t * 0.3;
        props.forEach((p) => {
          p.rotation.y = t * 25;
        });
      }

      if (autoRotate) {
        rotY += 0.003;
      }
      farmWorld.rotation.y += (rotY - farmWorld.rotation.y) * 0.05;
      farmWorld.rotation.x += (rotX - farmWorld.rotation.x) * 0.05;

      // Particle levitation
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
  }, [boundaryGeoJSON, centerLat, centerLng, cropType, activeLayer]);

  useEffect(() => {
    if (!cameraRef.current) return;
    if (viewMode === 'ortho') {
      cameraRef.current.position.set(0, 42, 0.01);
      if (farmWorldRef.current) {
        farmWorldRef.current.rotation.set(0, 0, 0);
      }
    } else {
      cameraRef.current.position.set(0, 22, 28);
    }
  }, [viewMode]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '450px', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%', minHeight: '450px', cursor: 'grab' }} />
    </div>
  );
}
