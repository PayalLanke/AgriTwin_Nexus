import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function DigitalTwin3DScene({
  boundaryGeoJSON = null,
  centerLat = 18.5204,
  centerLng = 73.8567,
  activeLayer = 'boundary',
  autoRotate = false
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const farmWorldRef = useRef(null);
  const animFrameIdRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    // 1. Scene & Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070e0b, 0.012);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 22, 28);
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
    const ambientLight = new THREE.AmbientLight(0x0f291e, 1.6);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x22e58a, 0x070e0b, 1.1);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0x34d399, 2.0);
    dirLight.position.set(15, 35, 15);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const cyanLight = new THREE.PointLight(0x00d9ff, 1.8, 60);
    cyanLight.position.set(-15, 12, -10);
    scene.add(cyanLight);

    // 5. Root Group
    const farmWorld = new THREE.Group();
    scene.add(farmWorld);
    farmWorldRef.current = farmWorld;

    // Grid Floor
    const gridHelper = new THREE.GridHelper(50, 40, 0x1f513f, 0x0b201a);
    gridHelper.position.y = -0.2;
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
    if (coords && coords.length >= 3) {
      // Convert (lng, lat) to local meters offset relative to farm center
      const metersPerDegreeLat = 111320;
      const metersPerDegreeLng = 111320 * Math.cos((centerLat * Math.PI) / 180);

      coords.forEach(([lng, lat]) => {
        const dx = (lng - centerLng) * metersPerDegreeLng;
        const dz = (lat - centerLat) * metersPerDegreeLat;
        // Scale meters down to Three.js units (e.g. 15 meters = 1 unit)
        points2D.push(new THREE.Vector2(dx * 0.08, -dz * 0.08));
      });
    }

    if (points2D.length >= 3) {
      // Build extruded 3D polygon slab
      const shape = new THREE.Shape(points2D);
      const extrudeSettings = {
        depth: 0.6,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 2
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geometry.rotateX(Math.PI / 2); // Orient flat on XZ plane

      const material = new THREE.MeshStandardMaterial({
        color: 0x0d281e,
        roughness: 0.5,
        metalness: 0.2
      });

      const farmMesh = new THREE.Mesh(geometry, material);
      farmMesh.position.y = 0;
      farmMesh.castShadow = true;
      farmMesh.receiveShadow = true;
      farmWorld.add(farmMesh);

      // Top Surface Layer
      const surfaceMat = new THREE.MeshBasicMaterial({
        color: 0x22e58a,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide
      });
      const surfaceMesh = new THREE.Mesh(geometry, surfaceMat);
      surfaceMesh.position.y = 0.62;
      farmWorld.add(surfaceMesh);

      // Wireframe Outline
      const wireGeo = new THREE.WireframeGeometry(geometry);
      const wireMat = new THREE.LineBasicMaterial({ color: 0x34d399, linewidth: 2 });
      const wireframe = new THREE.LineSegments(wireGeo, wireMat);
      wireframe.position.y = 0.63;
      farmWorld.add(wireframe);

      // Center Pin Marker
      const pinGroup = new THREE.Group();
      pinGroup.position.set(0, 1.2, 0);

      const beamGeo = new THREE.CylinderGeometry(0.05, 0.15, 6, 8);
      const beamMat = new THREE.MeshBasicMaterial({ color: 0x00d9ff, transparent: true, opacity: 0.7 });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = 3;
      pinGroup.add(beam);

      const diamondGeo = new THREE.OctahedronGeometry(0.5, 0);
      const diamondMat = new THREE.MeshStandardMaterial({ color: 0x00d9ff, emissive: 0x00d9ff, emissiveIntensity: 0.8 });
      const diamond = new THREE.Mesh(diamondGeo, diamondMat);
      diamond.position.y = 6.2;
      pinGroup.add(diamond);

      farmWorld.add(pinGroup);
    } else {
      // Fallback 3D Farm Slab if GeoJSON polygon is not provided
      const fallbackGeo = new THREE.BoxGeometry(16, 0.8, 14);
      const fallbackMat = new THREE.MeshStandardMaterial({ color: 0x0f271d, roughness: 0.6 });
      const fallbackMesh = new THREE.Mesh(fallbackGeo, fallbackMat);
      fallbackMesh.position.y = 0;
      farmWorld.add(fallbackMesh);

      const topGeo = new THREE.PlaneGeometry(15.8, 13.8);
      const topMat = new THREE.MeshBasicMaterial({ color: 0x22e58a, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
      const topMesh = new THREE.Mesh(topGeo, topMat);
      topMesh.rotation.x = -Math.PI / 2;
      topMesh.position.y = 0.42;
      farmWorld.add(topMesh);

      const edgesGeo = new THREE.EdgesGeometry(topGeo);
      const wireMat = new THREE.LineBasicMaterial({ color: 0x34d399 });
      const wire = new THREE.LineSegments(edgesGeo, wireMat);
      wire.rotation.x = -Math.PI / 2;
      wire.position.y = 0.43;
      farmWorld.add(wire);
    }

    // 7. Orbit Rotation Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotY = -0.4;
    let rotX = 0.4;

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
      if ((currentDist > 12 && zoomFactor < 0) || (currentDist < 60 && zoomFactor > 0)) {
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
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      if (autoRotate) {
        rotY += 0.003;
      }
      farmWorld.rotation.y += (rotY - farmWorld.rotation.y) * 0.05;
      farmWorld.rotation.x += (rotX - farmWorld.rotation.x) * 0.05;

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
  }, [boundaryGeoJSON, centerLat, centerLng]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '380px', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%', minHeight: '380px', cursor: 'grab' }} />
    </div>
  );
}
