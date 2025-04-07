import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  Sheet,
  Slider,
  Stack,
  Typography,
  Select,
  Option,
} from '@mui/joy';
import {
  SendIcon,
  StopCircle,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ConstructionIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as chatAPI from '../../../lib/transformerlab-api-sdk';
import ChatSettingsOnLeftHandSide from './ChatSettingsOnLeftHandSide';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function ModelLayerVisualization({
  tokenCount,
  stopStreaming,
  generationParameters,
  setGenerationParameters,
  defaultPromptConfigForModel,
  conversations,
  conversationsIsLoading,
  conversationsMutate,
  setChats,
  setConversationId,
  conversationId,
  experimentInfo,
  experimentInfoMutate,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelLayers, setModelLayers] = useState([]);
  const [elevation, setElevation] = useState(30);
  const [azimuth, setAzimuth] = useState(45);
  const [zoom, setZoom] = useState(1.0);

  // Canvas ref for Three.js
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  // Add these near the top of your component
  const [hoveredLayer, setHoveredLayer] = useState(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const layerMeshesRef = useRef([]);

  // Add this function to your component
  const updateHoveredLayer = () => {
    if (
      !raycasterRef.current ||
      !mouseRef.current ||
      !cameraRef.current ||
      !sceneRef.current
    )
      return;

    // Update the raycaster with the current mouse position
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    // Calculate intersections with layer objects
    const intersects = raycasterRef.current.intersectObjects(
      layerMeshesRef.current,
    );

    if (intersects.length > 0) {
      // Found a hovered layer
      const hoveredMesh = intersects[0].object;
      setHoveredLayer({
        name: hoveredMesh.userData.name,
        paramCount: hoveredMesh.userData.paramCount,
        type: hoveredMesh.userData.type,
        index: hoveredMesh.userData.index,
      });
    } else {
      // No layer being hovered
      setHoveredLayer(null);
    }
  };

  // Get current model
  const currentModel = experimentInfo?.config?.foundation;

  // Fetch model layer data
  const fetchModelArchitecture = async () => {
    if (!currentModel) return;

    setIsLoading(true);
    setError(null);

    try {
      // const url = `${chatAPI.API_URL()}v1/model_architecture`;

      // const response = await fetch(url, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     model: currentModel,
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error(
      //     `Server responded with ${response.status}: ${response.statusText}`,
      //   );
      // }

      // const data = await response.json();
      const data = {
        layers: [
          {
            name: 'model.embed_tokens.weight',
            size: 2.0,
            param_count: 28311552,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.self_attn.q_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.self_attn.k_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.v_proj.weight',
            size: 1.2300270212748519,
            param_count: 110592,
          },
          {
            name: 'model.layers.self_attn.o_proj.weight',
            size: 1.382574308505843,
            param_count: 331776,
          },
          {
            name: 'model.layers.mlp.gate_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.up_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.mlp.down_proj.weight',
            size: 1.5187668882967826,
            param_count: 884736,
          },
          {
            name: 'model.layers.input_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          {
            name: 'model.layers.post_attention_layernorm.weight',
            size: 0.5,
            param_count: 576,
          },
          { name: 'model.norm.weight', size: 0.5, param_count: 576 },
          { name: 'lm_head.weight', size: 2.0, param_count: 28311552 },
        ],
      };
      setModelLayers(data.layers || []);
    } catch (err) {
      setError(`Failed to fetch model architecture: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize 3D visualization
  const initVisualization = () => {
    if (!canvasRef.current || modelLayers.length === 0) return;

    // Clean up existing renderer
    if (rendererRef.current) {
      rendererRef.current.dispose();
      canvasRef.current.removeChild(rendererRef.current.domElement);
    }

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Create camera
    const canvas = canvasRef.current;
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000,
    );
    // Position camera to view horizontal layout from above
    camera.position.set(0, 5, 10);
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.update();
    controlsRef.current = controls;

    // Setup raycaster for hover detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    raycasterRef.current = raycaster;
    mouseRef.current = mouse;

    // Find min/max parameter sizes for scaling
    const paramSizes = modelLayers.map((layer) => layer.param_count);
    const maxParamSize = Math.max(...paramSizes);
    const minParamSize = Math.min(...paramSizes);
    const minWidth = 0.5;
    const maxWidth = 5.0; // Length based on param count
    const thickness = 0.2; // Thickness of the rectangle
    const spacing = 0.2; // Spacing between components

    // Create rectangles for each layer - horizontal layout
    let xOffset = 0;
    const totalWidth = modelLayers.reduce((acc, layer) => {
      const paramCount = layer.param_count;
      const width =
        minWidth +
        ((Math.log(paramCount) - Math.log(minParamSize)) /
          (Math.log(maxParamSize) - Math.log(minParamSize))) *
          (maxWidth - minWidth);
      return acc + width + spacing;
    }, 0);

    // Start offset to center the entire model
    xOffset = -totalWidth / 2;

    modelLayers.forEach((layer, index) => {
      // Calculate width based on parameter count (logarithmic scale)
      const paramCount = layer.param_count;
      const width =
        minWidth +
        ((Math.log(paramCount) - Math.log(minParamSize)) /
          (Math.log(maxParamSize) - Math.log(minParamSize))) *
          (maxWidth - minWidth);

      // Create rectangle geometry and material
      // Using BoxGeometry for standing rectangles instead of PlaneGeometry
      const height = 1.0 + (width / maxWidth) * 2; // Height proportional to width but with a minimum
      const geometry = new THREE.BoxGeometry(width, height, thickness);

      const material = new THREE.MeshLambertMaterial({
        color:
          layer.color || `hsl(${(index / modelLayers.length) * 360}, 70%, 60%)`,
        transparent: true,
        opacity: 0.9,
      });

      // Create mesh and position it horizontally
      const rectangle = new THREE.Mesh(geometry, material);

      // Position at the center of its width, with bottom at y=0 (standing up)
      rectangle.position.set(xOffset + width / 2, height / 2, 0);

      // No rotation needed - BoxGeometry is already oriented vertically

      rectangle.userData = {
        name: layer.name,
        paramCount: layer.param_count,
        type: layer.type || layer.name.split('.').slice(-2)[0],
        index: index,
      };

      scene.add(rectangle);
      layerMeshesRef.current.push(rectangle);
      xOffset += width + spacing; // Move to next position horizontally
    });

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Adjust camera position for better viewing of standing rectangles
    camera.position.set(0, 5, 15);
    camera.lookAt(new THREE.Vector3(0, 3, 0)); // Look at the middle height of rectangles
    controls.target.set(0, 3, 0);
    controls.update();

    // Add hover detection
    const handleMouseMove = (event) => {
      // Calculate mouse position in normalized device coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Update the hoveredLayer state
      updateHoveredLayer();
    };

    // Add hover detection events
    renderer.domElement.addEventListener('mousemove', handleMouseMove);

    // Animation function with hover detection
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    // Start animation
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current)
        return;

      const canvas = canvasRef.current;
      cameraRef.current.aspect = canvas.clientWidth / canvas.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(canvas.clientWidth, canvas.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      layerMeshesRef.current = [];
    };
  };

  // Update camera view based on elevation and azimuth
  const updateCameraView = () => {
    if (!controlsRef.current || !cameraRef.current) return;

    // Convert degrees to radians
    const elevRad = (elevation * Math.PI) / 180;
    const azimRad = (azimuth * Math.PI) / 180;

    // Calculate new camera position
    const distance = 10 / zoom;
    const x = distance * Math.sin(azimRad) * Math.cos(elevRad);
    const y = distance * Math.sin(elevRad);
    const z = distance * Math.cos(azimRad) * Math.cos(elevRad);

    // Update camera position
    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(0, 0, 0);
    controlsRef.current.update();
  };

  // Effect to fetch data when model changes
  useEffect(() => {
    if (currentModel) {
      fetchModelArchitecture();
    }
  }, [currentModel]);

  // Effect to initialize visualization when data is loaded
  useEffect(() => {
    if (modelLayers.length > 0) {
      initVisualization();
    }
  }, [modelLayers]);

  // Effect to update camera when controls change
  useEffect(() => {
    updateCameraView();
  }, [elevation, azimuth, zoom]);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchModelArchitecture();
  };

  // Handle zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.2, 5.0));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.2, 0.5));
  };

  return (
    <Sheet
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        gap: 2,
      }}
    >
      <ChatSettingsOnLeftHandSide
        generationParameters={generationParameters}
        setGenerationParameters={setGenerationParameters}
        tokenCount={tokenCount}
        defaultPromptConfigForModel={defaultPromptConfigForModel}
        conversations={conversations}
        conversationsIsLoading={conversationsIsLoading}
        conversationsMutate={conversationsMutate}
        setChats={setChats}
        setConversationId={setConversationId}
        conversationId={conversationId}
        experimentInfo={experimentInfo}
        experimentInfoMutate={experimentInfoMutate}
      />

      <Sheet
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Alert
          color="neutral"
          variant="outlined"
          startDecorator={<ConstructionIcon />}
        >
          This feature is currently in development and requires a compatible
          model server.
        </Alert>

        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography level="h2">Model Layer Visualization</Typography>

          <Stack direction="row" spacing={1}>
            <IconButton
              color="neutral"
              onClick={handleZoomOut}
              aria-label="Zoom out"
            >
              <ZoomOut />
            </IconButton>

            <IconButton
              color="neutral"
              onClick={handleZoomIn}
              aria-label="Zoom in"
            >
              <ZoomIn />
            </IconButton>

            <Button
              color="neutral"
              startDecorator={
                isLoading ? (
                  <CircularProgress thickness={2} size="sm" color="neutral" />
                ) : (
                  <RotateCcw size="20px" />
                )
              }
              onClick={handleRefresh}
              disabled={isLoading}
            >
              Refresh
            </Button>
          </Stack>
        </Box>

        {/* Add this after the canvas box in your return statement */}
        {hoveredLayer && (
          <Box
            sx={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              maxWidth: '300px',
              bgcolor: 'rgba(255,255,255,0.9)',
              p: 2,
              borderRadius: 'md',
              backdropFilter: 'blur(5px)',
              boxShadow: 'sm',
              zIndex: 1000,
            }}
          >
            <Typography level="title-md" sx={{ mb: 1, color: 'primary.500' }}>
              Layer Information
            </Typography>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              <strong>Name:</strong> {hoveredLayer.name}
            </Typography>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              <strong>Type:</strong> {hoveredLayer.type}
            </Typography>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              <strong>Parameters:</strong>{' '}
              {hoveredLayer.paramCount.toLocaleString()}
            </Typography>
            <Typography level="body-sm">
              <strong>Layer Index:</strong> {hoveredLayer.index + 1} of{' '}
              {modelLayers.length}
            </Typography>
          </Box>
        )}

        {error && (
          <Alert color="danger" sx={{ mx: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ p: 2, pb: 0 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <FormControl sx={{ flex: 1 }}>
              <Typography level="body-sm">Elevation: {elevation}°</Typography>
              <Slider
                value={elevation}
                onChange={(e, val) => setElevation(val)}
                min={0}
                max={90}
              />
            </FormControl>

            <FormControl sx={{ flex: 1 }}>
              <Typography level="body-sm">Azimuth: {azimuth}°</Typography>
              <Slider
                value={azimuth}
                onChange={(e, val) => setAzimuth(val)}
                min={0}
                max={360}
              />
            </FormControl>
          </Stack>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            pt: 0,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <CircularProgress size="lg" />
            </Box>
          ) : (
            <Box
              ref={canvasRef}
              sx={{
                flexGrow: 1,
                height: '100%',
                width: '100%',
                bgcolor: 'background.level1',
                borderRadius: 'md',
                overflow: 'hidden',
              }}
            />
          )}

          {modelLayers.length > 0 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                maxWidth: '300px',
                bgcolor: 'rgba(255,255,255,0.8)',
                p: 2,
                borderRadius: 'md',
                backdropFilter: 'blur(5px)',
              }}
            >
              <Typography level="body-sm" sx={{ mb: 1 }}>
                <strong>Model:</strong> {currentModel.split('/').pop()}
              </Typography>
              <Typography level="body-sm">
                <strong>Total Layers:</strong> {modelLayers.length}
              </Typography>
            </Box>
          )}
        </Box>
      </Sheet>
    </Sheet>
  );
}
