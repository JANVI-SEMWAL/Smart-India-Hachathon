import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { RotateCcw, Move, ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';

interface ExtendedElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

interface ExtendedDocument extends Document {
  webkitFullscreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface PanoramaViewerProps {
  imageUrl: string;
  onClose?: () => void;
  locationName: string;
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ 
  imageUrl, 
  onClose, 
  locationName 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const animationIdRef = useRef<number | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fov, setFov] = useState(75);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mouse interaction state
  const mouseRef = useRef({ x: 0, y: 0 });
  const isMouseDownRef = useRef(false);
  const rotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;
    
    // Store mount element reference for cleanup
    const mountElement = mountRef.current;

    // Initialize Three.js scene with realistic 360° settings
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      fov,
      mountElement.clientWidth / mountElement.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false,
      powerPreference: "high-performance"
    });
    
    // Configure renderer for better quality
    renderer.setSize(mountElement.clientWidth, mountElement.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mountElement.appendChild(renderer.domElement);

    // Create high-quality sphere geometry for 360° image with better resolution
    const geometry = new THREE.SphereGeometry(500, 64, 32);
    // Flip the geometry so we see the inside
    geometry.scale(-1, 1, 1);
    
    // Load texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      imageUrl,
      (texture) => {
        // Optimize texture settings for realistic panoramic images
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBAFormat;
        
        // Create material with the panoramic image
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.FrontSide, // Use FrontSide since we flipped the geometry
          transparent: false,
          opacity: 1.0
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        
        sphereRef.current = sphere;
        setIsLoading(false);
      },
      (progress) => {
        // Loading progress
        console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%');
      },
      (error) => {
        console.error('Error loading panoramic image:', error);
        setError('Failed to load panoramic image');
        setIsLoading(false);
      }
    );

    // Store refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Set initial camera position
    camera.position.set(0, 0, 0);
    camera.lookAt(1, 0, 0);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      if (!isMouseDownRef.current) {
        // Subtle auto-rotation when not interacting
        rotationRef.current.y += 0.002;
      }
      
      // Apply rotation to camera
      if (cameraRef.current) {
        cameraRef.current.rotation.x = rotationRef.current.x;
        cameraRef.current.rotation.y = rotationRef.current.y;
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Mouse event handlers
    const handleMouseDown = (event: MouseEvent) => {
      isMouseDownRef.current = true;
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
      renderer.domElement.style.cursor = 'grabbing';
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isMouseDownRef.current) return;

      const deltaX = event.clientX - mouseRef.current.x;
      const deltaY = event.clientY - mouseRef.current.y;

      rotationRef.current.y += deltaX * 0.005;
      rotationRef.current.x += deltaY * 0.005;

      // Limit vertical rotation
      rotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationRef.current.x));

      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
      renderer.domElement.style.cursor = 'grab';
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const newFov = Math.max(30, Math.min(120, fov + event.deltaY * 0.1));
      setFov(newFov);
      if (cameraRef.current) {
        cameraRef.current.fov = newFov;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    // Add event listeners
    const canvas = renderer.domElement;
    canvas.style.cursor = 'grab';
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    // Handle window resize
    const handleResize = () => {
      if (!mountElement || !cameraRef.current || !rendererRef.current) return;
      
      const width = mountElement.clientWidth;
      const height = mountElement.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      
      if (mountElement && rendererRef.current && mountElement.contains(rendererRef.current.domElement)) {
        mountElement.removeChild(rendererRef.current.domElement);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      // Dispose geometry and materials
      if (sphereRef.current) {
        if (sphereRef.current.geometry) {
          sphereRef.current.geometry.dispose();
        }
        if (sphereRef.current.material && 'dispose' in sphereRef.current.material) {
          (sphereRef.current.material as THREE.Material).dispose();
        }
      }
    };
  }, [imageUrl, fov]);

  const resetView = () => {
    rotationRef.current = { x: 0, y: 0 };
    setFov(75);
    if (cameraRef.current) {
      cameraRef.current.fov = 75;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const zoomIn = () => {
    const newFov = Math.max(30, fov - 10);
    setFov(newFov);
    if (cameraRef.current) {
      cameraRef.current.fov = newFov;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const zoomOut = () => {
    const newFov = Math.min(120, fov + 10);
    setFov(newFov);
    if (cameraRef.current) {
      cameraRef.current.fov = newFov;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const toggleFullscreen = () => {
    if (!mountRef.current) return;
    
    if (!isFullscreen) {
      // Enter fullscreen
      const element = mountRef.current as ExtendedElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      const doc = document as ExtendedDocument;
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as ExtendedDocument;
      const isCurrentlyFullscreen = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
      
      // Resize renderer when entering/exiting fullscreen
      if (rendererRef.current && mountRef.current) {
        setTimeout(() => {
          const width = mountRef.current!.clientWidth;
          const height = mountRef.current!.clientHeight;
          rendererRef.current!.setSize(width, height);
          
          if (cameraRef.current) {
            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
          }
        }, 100);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {/* 360° Viewer Container */}
      <div 
        ref={mountRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-lg font-semibold">Loading 360° View...</p>
            <p className="text-sm text-gray-300">Preparing panoramic experience</p>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <p className="text-lg font-semibold text-red-400 mb-2">Error Loading 360° View</p>
            <p className="text-sm text-gray-300">{error}</p>
          </div>
        </div>
      )}
      
      {/* 360° Viewer Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <Button
          variant="outline"
          size="sm"
          className="w-10 h-10 p-0 bg-black/70 backdrop-blur-sm border-cyan-400/50 hover:bg-cyan-400/20 text-white"
          onClick={zoomIn}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-10 h-10 p-0 bg-black/70 backdrop-blur-sm border-cyan-400/50 hover:bg-cyan-400/20 text-white"
          onClick={zoomOut}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-10 h-10 p-0 bg-black/70 backdrop-blur-sm border-cyan-400/50 hover:bg-cyan-400/20 text-white"
          onClick={resetView}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-10 h-10 p-0 bg-black/70 backdrop-blur-sm border-cyan-400/50 hover:bg-cyan-400/20 text-white"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </Button>
      </div>
      
      {/* 360° Mode Indicator */}
      <div className="absolute top-4 left-4 bg-cyan-600/90 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-semibold z-20 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        360° Panoramic View
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm p-3 rounded-lg text-white text-sm z-20">
        <div className="font-semibold mb-2">{locationName}</div>
        <div className="space-y-1 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <Move className="w-3 h-3" />
            <span>Drag to look around</span>
          </div>
          <div>🔄 Scroll to zoom</div>
          <div>↻ Auto-rotation when idle</div>
        </div>
      </div>
      
      {/* Zoom Level Indicator */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-xs z-20">
        FOV: {fov.toFixed(0)}°
      </div>
      
      {/* Close Button */}
      {onClose && (
        <Button
          variant="outline"
          className="absolute top-4 right-20 bg-red-600/70 backdrop-blur-sm border-red-400/50 hover:bg-red-600/90 text-white"
          onClick={onClose}
        >
          Close 360° View
        </Button>
      )}
    </div>
  );
};

export default PanoramaViewer;
