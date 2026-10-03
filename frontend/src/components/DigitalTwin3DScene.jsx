import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function DigitalTwin3DScene({
  selectedCell = { row: 1, col: 1 },
  onSelectCell,
  activeLayer = 'vigor', // 'vigor', 'moisture', 'npk', 'thermal', 'sar'
  viewMode = '3d', // '3d' or 'ortho'
  simulationDay = 'today',
  autoRotate = false
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const farmWorldRef = useRef(null);
  const cellsMeshMapRef = useRef([]);
  const selectedPinRef = useRef(null);
  const animFrameIdRef = useRef(null);

  const [hoveredCell, setHoveredCell] = useState(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene & Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06090e, 0.012);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(24, 28, 34);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x0d2820, 1.4);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x22e58a, 0x05101a, 0.9);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0x40f5a0, 2.2);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const cyanPoint = new THREE.PointLight(0x00f0ff, 2.8, 70);
    cyanPoint.position.set(-15, 14, -10);
    scene.add(cyanPoint);

    // 5. Root Group for rotation and zoom
    const farmWorld = new THREE.Group();
    scene.add(farmWorld);
    farmWorldRef.current = farmWorld;

    // Ground base pedestal / Cyber Hexagon Grid
    const baseGeo = new THREE.CylinderGeometry(26, 28, 2, 6);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0b131e,
      roughness: 0.8,
      metalness: 0.2
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -1.2;
    baseMesh.receiveShadow = true;
    farmWorld.add(baseMesh);

    // Base wireframe rim glow
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x184236, wireframe: true });
    const baseWire = new THREE.Mesh(baseGeo, wireMat);
    baseWire.position.y = -1.18;
    farmWorld.add(baseWire);

    // Grid floor under the field
    const gridHelper = new THREE.GridHelper(50, 50, 0x1f513f, 0x0b201a);
    gridHelper.position.y = -0.15;
    farmWorld.add(gridHelper);

    // 6. 5x5 Sub-Plot Grid Construction
    const gridSize = 5;
    const cellSpacing = 3.6;
    const offset = ((gridSize - 1) * cellSpacing) / 2;

    const subPlotData = [
      [0.82, 0.79, 0.77, 0.68, 0.75],
      [0.80, 0.54, 0.78, 0.81, 0.71], // [Row 1, Col 1] = Cell B2 (Nitrogen deficit)
      [0.79, 0.74, 0.85, 0.69, 0.77],
      [0.66, 0.76, 0.83, 0.42, 0.78], // [Row 3, Col 3] = Cell D4 (Moisture stress)
      [0.81, 0.79, 0.75, 0.77, 0.84]
    ];

    const plotCells = [];
    const cropsGroup = new THREE.Group();
    farmWorld.add(cropsGroup);

    const healthyGreen = new THREE.Color(0x22e58a);
    const vibrantTeal = new THREE.Color(0x00d9ff);
    const stressedYellow = new THREE.Color(0xf59e0b);
    const criticalRed = new THREE.Color(0xef4444);

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const ndvi = subPlotData[r][c];
        const xPos = c * cellSpacing - offset;
        const zPos = r * cellSpacing - offset;
        const elevation = Math.sin(r * 0.8) * Math.cos(c * 0.7) * 0.6 + 0.6;

        // Cell soil prism geometry
        const cellGeo = new THREE.BoxGeometry(3.2, 1.0 + elevation, 3.2);
        
        let cellColor = healthyGreen.clone();
        if (ndvi < 0.5) {
          cellColor.lerp(criticalRed, (0.5 - ndvi) / 0.2);
        } else if (ndvi < 0.75) {
          cellColor.lerp(stressedYellow, (0.75 - ndvi) / 0.25);
        } else {
          cellColor.lerp(vibrantTeal, (ndvi - 0.75) / 0.15);
        }

        const cellMat = new THREE.MeshStandardMaterial({
          color: 0x0e1c18,
          roughness: 0.6,
          metalness: 0.3
        });
        
        const cellMesh = new THREE.Mesh(cellGeo, cellMat);
        cellMesh.position.set(xPos, (elevation - 0.5) / 2, zPos);
        cellMesh.castShadow = true;
        cellMesh.receiveShadow = true;
        cellMesh.userData = { row: r, col: c, ndvi, elevation, name: `Sub-Plot ${String.fromCharCode(65 + r)}${c + 1}` };
        farmWorld.add(cellMesh);

        // Surface canopy layer
        const surfaceGeo = new THREE.PlaneGeometry(3.1, 3.1);
        const surfaceMat = new THREE.MeshBasicMaterial({
          color: cellColor,
          transparent: true,
          opacity: 0.55,
          side: THREE.DoubleSide
        });
        const surfaceMesh = new THREE.Mesh(surfaceGeo, surfaceMat);
        surfaceMesh.rotation.x = -Math.PI / 2;
        surfaceMesh.position.set(xPos, elevation + 0.05, zPos);
        surfaceMesh.userData = { row: r, col: c, ndvi };
        farmWorld.add(surfaceMesh);

        // Outline border
        const edges = new THREE.EdgesGeometry(surfaceGeo);
        const lineMat = new THREE.LineBasicMaterial({
          color: (r === 1 && c === 1) ? 0x00f0ff : ((r === 3 && c === 3) ? 0xf59e0b : 0x22e58a),
          linewidth: 2
        });
        const wireOutline = new THREE.LineSegments(edges, lineMat);
        wireOutline.rotation.x = -Math.PI / 2;
        wireOutline.position.set(xPos, elevation + 0.06, zPos);
        farmWorld.add(wireOutline);

        // 3D Crop Stalks
        const cropCount = 5;
        for (let k = 0; k < cropCount; k++) {
          const kx = xPos + (Math.random() - 0.5) * 2.2;
          const kz = zPos + (Math.random() - 0.5) * 2.2;
          const cropHeight = (0.5 + Math.random() * 0.4) * (ndvi >= 0.7 ? 1.0 : (ndvi >= 0.5 ? 0.65 : 0.4));
          
          const stalkGeo = new THREE.CylinderGeometry(0.04, 0.08, cropHeight, 4);
          const stalkMat = new THREE.MeshBasicMaterial({ color: cellColor });
          const stalk = new THREE.Mesh(stalkGeo, stalkMat);
          stalk.position.set(kx, elevation + cropHeight / 2 + 0.06, kz);
          cropsGroup.add(stalk);

          // Leaf clusters
          const leafGeo = new THREE.SphereGeometry(0.18 * (ndvi >= 0.7 ? 1 : 0.7), 4, 3);
          const leafMat = new THREE.MeshBasicMaterial({ color: (ndvi < 0.5) ? 0xf59e0b : 0x22e58a });
          const leaf = new THREE.Mesh(leafGeo, leafMat);
          leaf.position.set(kx, elevation + cropHeight + 0.08, kz);
          leaf.scale.set(1.5, 0.6, 1.2);
          cropsGroup.add(leaf);
        }

        plotCells.push({
          cellMesh,
          surfaceMesh,
          wireOutline,
          row: r,
          col: c,
          ndvi,
          elevation,
          xPos,
          zPos,
          baseColor: cellColor
        });
      }
    }
    cellsMeshMapRef.current = plotCells;

    // 7. Holographic 3D Light Beacon function
    function createPin(x, y, z, beaconColor) {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(x, y, z);

      const beamGeo = new THREE.CylinderGeometry(0.04, 0.12, 8, 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: beaconColor,
        transparent: true,
        opacity: 0.65
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = 4;
      pinGroup.add(beam);

      const diamondGeo = new THREE.OctahedronGeometry(0.55, 0);
      const diamondMat = new THREE.MeshStandardMaterial({
        color: beaconColor,
        emissive: beaconColor,
        emissiveIntensity: 0.9,
        metalness: 0.8,
        roughness: 0.2
      });
      const diamond = new THREE.Mesh(diamondGeo, diamondMat);
      diamond.position.y = 8.2;
      pinGroup.add(diamond);

      const ringGeo = new THREE.RingGeometry(0.4, 0.9, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: beaconColor,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.1;
      pinGroup.add(ring);

      farmWorld.add(pinGroup);
      return { group: pinGroup, diamond, ring, beam };
    }

    // Selected Pin (Cyan)
    const initX = selectedCell.col * cellSpacing - offset;
    const initZ = selectedCell.row * cellSpacing - offset;
    const selPin = createPin(initX, 1.2, initZ, 0x00f0ff);
    selectedPinRef.current = selPin;

    // Stressed Pin (Amber) on D4
    const stressedPin = createPin(3 * cellSpacing - offset, 1.1, 3 * cellSpacing - offset, 0xf59e0b);

    // IoT Probe Pin (Emerald)
    const iotPin = createPin(0 * cellSpacing - offset, 0.9, 4 * cellSpacing - offset, 0x22e58a);

    // 8. Overhead UAV Drone Model
    const droneGroup = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(1.4, 0.3, 1.4);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x111c26, metalness: 0.9, roughness: 0.1 });
    const droneBody = new THREE.Mesh(bodyGeo, bodyMat);
    droneGroup.add(droneBody);

    const rotorGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.05, 12);
    const rotorMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.7 });
    const armOffsets = [[1.1, 1.1], [-1.1, 1.1], [1.1, -1.1], [-1.1, -1.1]];
    const rotors = [];

    armOffsets.forEach(([ax, az]) => {
      const armGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4);
      const armMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
      const arm = new THREE.Mesh(armGeo, armMat);
      arm.position.set(ax * 0.5, 0, az * 0.5);
      arm.rotation.z = (Math.PI / 4) * (ax > 0 ? -1 : 1);
      droneGroup.add(arm);

      const rotor = new THREE.Mesh(rotorGeo, rotorMat);
      rotor.position.set(ax, 0.2, az);
      droneGroup.add(rotor);
      rotors.push(rotor);
    });

    const coneGeo = new THREE.ConeGeometry(4.5, 9, 16, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.14,
      wireframe: true,
      side: THREE.DoubleSide
    });
    const scanCone = new THREE.Mesh(coneGeo, coneMat);
    scanCone.position.y = -4.5;
    droneGroup.add(scanCone);

    droneGroup.position.set(2, 14, 2);
    farmWorld.add(droneGroup);

    // 9. Ambient Data Particles
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 180;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 40;
      posArray[i + 1] = Math.random() * 16 + 0.5;
      posArray[i + 2] = (Math.random() - 0.5) * 40;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.22,
      color: 0x22e58a,
      transparent: true,
      opacity: 0.75
    });
    const particlesMesh = new THREE.Points(particleGeo, particleMat);
    farmWorld.add(particlesMesh);

    // 10. Interactive Drag & Raycaster Handling
    let isDragging = false;
    let hasMoved = false;
    let prevMouse = { x: 0, y: 0 };
    let rotY = -0.55;
    let rotX = 0.38;

    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleMouseDown = (e) => {
      isDragging = true;
      hasMoved = false;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;

        rotY += dx * 0.007;
        rotX = Math.max(0.1, Math.min(1.2, rotX + dy * 0.006));
        prevMouse = { x: e.clientX, y: e.clientY };
      } else {
        // Hover cell detection
        raycaster.setFromCamera(mouseVector, camera);
        const cellMeshes = plotCells.map(c => c.cellMesh);
        const intersects = raycaster.intersectObjects(cellMeshes);
        if (intersects.length > 0) {
          const u = intersects[0].object.userData;
          setHoveredCell(u);
        } else {
          setHoveredCell(null);
        }
      }
    };

    const handleMouseUp = (e) => {
      if (!hasMoved) {
        // Cell Click Detection
        const rect = container.getBoundingClientRect();
        mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouseVector, camera);
        const cellMeshes = plotCells.map(c => c.cellMesh);
        const intersects = raycaster.intersectObjects(cellMeshes);
        if (intersects.length > 0) {
          const u = intersects[0].object.userData;
          if (onSelectCell) onSelectCell({ row: u.row, col: u.col });
        }
      }
      isDragging = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.02;
      const currentDist = camera.position.length();
      if ((currentDist > 16 && zoomFactor < 0) || (currentDist < 70 && zoomFactor > 0)) {
        camera.position.multiplyScalar(1 + zoomFactor * 0.025);
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // Window Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 500;
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

      // Smooth rotation
      if (autoRotate) {
        rotY += 0.003;
      }
      farmWorld.rotation.y += (rotY - farmWorld.rotation.y) * 0.06;
      farmWorld.rotation.x += (rotX - farmWorld.rotation.x) * 0.06;

      // Drone Flight Patrol
      droneGroup.position.x = Math.sin(t * 0.6) * 7.5;
      droneGroup.position.z = Math.cos(t * 0.6) * 7.5;
      droneGroup.position.y = 13 + Math.sin(t * 1.5) * 0.4;
      rotors.forEach(r => { r.rotation.y += 0.4; });
      scanCone.rotation.y = t * 0.5;

      // Floating Beacons Animation
      if (selectedPinRef.current) {
        selectedPinRef.current.diamond.rotation.y = t * 1.6;
        const scaleVal = 1 + Math.sin(t * 3) * 0.25;
        selectedPinRef.current.ring.scale.set(scaleVal, scaleVal, scaleVal);
        selectedPinRef.current.ring.material.opacity = 0.5 + Math.sin(t * 3) * 0.35;
      }
      stressedPin.diamond.rotation.y = -t * 1.2;
      stressedPin.ring.scale.setScalar(1 + Math.cos(t * 2.5) * 0.2);
      iotPin.diamond.rotation.y = t * 0.8;

      // Particle Drift
      const positions = particleGeo.attributes.position.array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += Math.sin(t + i) * 0.015;
      }
      particleGeo.attributes.position.needsUpdate = true;

      camera.lookAt(0, 2, 0);
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
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
  }, []);

  // Update selected Pin position when selectedCell changes
  useEffect(() => {
    if (!selectedPinRef.current) return;
    const cellSpacing = 3.6;
    const offset = (4 * cellSpacing) / 2;
    const targetX = selectedCell.col * cellSpacing - offset;
    const targetZ = selectedCell.row * cellSpacing - offset;
    selectedPinRef.current.group.position.set(targetX, 1.2, targetZ);
  }, [selectedCell]);

  // Update Layer Colors
  useEffect(() => {
    if (!cellsMeshMapRef.current.length) return;
    const cells = cellsMeshMapRef.current;

    cells.forEach(item => {
      const { row, col, ndvi, surfaceMesh, wireOutline } = item;
      let targetColor;

      if (activeLayer === 'vigor') {
        if (ndvi < 0.5) targetColor = new THREE.Color(0xef4444);
        else if (ndvi < 0.75) targetColor = new THREE.Color(0xf59e0b);
        else targetColor = new THREE.Color(0x22e58a);
      } else if (activeLayer === 'moisture') {
        const moisture = 34.5 - Math.sqrt((row - 2) ** 2 + (col - 2) ** 2) * 2.2;
        if (moisture < 25) targetColor = new THREE.Color(0xf59e0b);
        else targetColor = new THREE.Color(0x00d9ff);
      } else if (activeLayer === 'npk') {
        if (row === 1 && col === 1) targetColor = new THREE.Color(0xef4444); // Deficit node
        else targetColor = new THREE.Color(0x88ff76);
      } else if (activeLayer === 'thermal') {
        targetColor = new THREE.Color(0xf59e0b).lerp(new THREE.Color(0x7c3aed), ndvi);
      } else {
        targetColor = new THREE.Color(0x00d9ff);
      }

      surfaceMesh.material.color.copy(targetColor);
      const isSelected = row === selectedCell.row && col === selectedCell.col;
      surfaceMesh.material.opacity = isSelected ? 0.85 : 0.45;
    });
  }, [activeLayer, selectedCell]);

  // Switch between 3D perspective and Orthographic top-down
  useEffect(() => {
    if (!cameraRef.current) return;
    if (viewMode === 'ortho') {
      cameraRef.current.position.set(0, 48, 0.01);
      if (farmWorldRef.current) {
        farmWorldRef.current.rotation.set(0, 0, 0);
      }
    } else {
      cameraRef.current.position.set(24, 28, 34);
    }
  }, [viewMode]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
      
      {/* Floating Hover Indicator Badge */}
      {hoveredCell && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          background: 'rgba(11, 21, 17, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.4rem 0.8rem',
          fontSize: '0.75rem',
          fontFamily: 'Space Grotesk, sans-serif',
          color: 'var(--color-primary)',
          boxShadow: 'var(--shadow-glow)',
          pointerEvents: 'none'
        }}>
          Hovered: <strong style={{ color: '#ffffff' }}>{hoveredCell.name}</strong> • NDVI: {hoveredCell.ndvi} • Elevation: +{hoveredCell.elevation.toFixed(1)}m
        </div>
      )}
    </div>
  );
}
