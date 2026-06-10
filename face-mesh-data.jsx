// ═══════════════════════════════════════════════════════════════════
// N'Mild Face Mesh Data — baked from MediaPipe FaceLandmarker
// All coordinates are in % of the original image (1067×1428).
// ═══════════════════════════════════════════════════════════════════

// Key facial points extracted from MediaPipe's 478 landmarks
const NMILD_FACE = {
  // Eyes (image-left = camera-left eye)
  leftIris:      { x: 41.90, y: 37.72 },
  leftEyeOuter:  { x: 38.52, y: 38.02 },
  leftEyeInner:  { x: 45.49, y: 38.73 },
  leftEyeTop:    { x: 41.26, y: 36.82 },
  leftEyeBottom: { x: 41.73, y: 38.80 },
  // Right eye (image-right)
  rightIris:      { x: 58.50, y: 37.68 },
  rightEyeOuter:  { x: 62.13, y: 37.94 },
  rightEyeInner:  { x: 55.09, y: 38.69 },
  rightEyeTop:    { x: 59.27, y: 36.71 },
  rightEyeBottom: { x: 58.96, y: 38.80 },
  // Eyebrows
  leftBrowOuter:  { x: 35.55, y: 35.58 },
  leftBrowInner:  { x: 46.21, y: 33.82 },
  leftBrowMid:    { x: 39.27, y: 34.29 },
  rightBrowOuter: { x: 65.00, y: 35.40 },
  rightBrowInner: { x: 54.71, y: 33.74 },
  rightBrowMid:   { x: 61.49, y: 34.13 },
  // Nose
  noseTip:    { x: 50.57, y: 47.06 },
  noseBridge: { x: 50.54, y: 40.02 },
  // Mouth
  leftMouthCorner:  { x: 43.07, y: 51.35 },
  rightMouthCorner: { x: 57.26, y: 51.53 },
  upperLipCenter:   { x: 50.34, y: 52.28 },
  lowerLipCenter:   { x: 50.34, y: 52.31 },
  // Cheeks (from face oval — ideal blush placement)
  leftCheek:  { x: 35.08, y: 44.5 },
  rightCheek: { x: 65.07, y: 44.5 },
  // Face bounds
  forehead: { x: 50.46, y: 27.28 },
  chin:     { x: 50.11, y: 61.30 },
};

// Computed filter zones from the landmarks above
const NMILD_FILTER = {
  // Eyeshadow: spans the full eyelid from outer to inner corner,
  // centered vertically in the brow-to-lash gap.
  leftEyeShadow: {
    cx: 42.0, cy: 36.2,
    rx: 7.5,   ry: 3.0,
    topY: 34.29, bottomY: 38.80,
  },
  rightEyeShadow: {
    cx: 58.6, cy: 36.1,
    rx: 7.5,   ry: 3.0,
    topY: 34.13, bottomY: 38.80,
  },
  // Blush: spreads from under the eye up to the cheekbone (โหนกแก้ม),
  // wide enough to give a natural flush across both cheeks.
  leftBlush: {
    cx: 36.0, cy: 42.0,
    rx: 9.8,  ry: 6.9,
  },
  rightBlush: {
    cx: 64.5, cy: 42.0,
    rx: 9.8,  ry: 6.9,
  },
  // Lips: the mouth region
  lips: {
    cx: 50.17, cy: 52.0,
    rx: 8.0,   ry: 2.8,
    topY: 51.35, bottomY: 53.75,
    leftX: 43.07, rightX: 57.26,
  },
};

// Feature contour connections for the mesh wireframe overlay.
// Each is an array of [startIdx, endIdx] pairs into NMILD_ALL_LANDMARKS.
const FACE_CONTOURS = {
  oval: [[10,338],[338,297],[297,332],[332,284],[284,251],[251,389],[389,356],[356,454],[454,323],[323,361],[361,288],[288,397],[397,365],[365,379],[379,378],[378,400],[400,377],[377,152],[152,148],[148,176],[176,149],[149,150],[150,136],[136,172],[172,58],[58,132],[132,93],[93,234],[234,127],[127,162],[162,21],[21,54],[54,103],[103,67],[67,109],[109,10]],
  leftEye: [[263,249],[249,390],[390,373],[373,374],[374,380],[380,381],[381,382],[382,362],[263,466],[466,388],[388,387],[387,386],[386,385],[385,384],[384,398],[398,362]],
  rightEye: [[33,7],[7,163],[163,144],[144,145],[145,153],[153,154],[154,155],[155,133],[33,246],[246,161],[161,160],[160,159],[159,158],[158,157],[157,173],[173,133]],
  lips: [[61,146],[146,91],[91,181],[181,84],[84,17],[17,314],[314,405],[405,321],[321,375],[375,291],[61,185],[185,40],[40,39],[39,37],[37,0],[0,267],[267,269],[269,270],[270,409],[409,291],[78,95],[95,88],[88,178],[178,87],[87,14],[14,317],[317,402],[402,318],[318,324],[324,308],[78,191],[191,80],[80,81],[81,82],[82,13],[13,312],[312,311],[311,310],[310,415],[415,308]],
  leftBrow: [[276,283],[283,282],[282,295],[295,285],[300,293],[293,334],[334,296],[296,336]],
  rightBrow: [[46,53],[53,52],[52,65],[65,55],[70,63],[63,105],[105,66],[66,107]],
};

// All 478 landmarks as [x%, y%] for mesh wireframe rendering
const NMILD_ALL_LANDMARKS = [[50.37,50.86],[50.57,47.06],[50.46,48.07],[49.19,42.92],[50.58,45.78],[50.57,44.13],[50.54,40.02],[39.12,38.36],[50.42,36.01],[50.45,34.05],[50.46,27.28],[50.37,51.4],[50.39,51.91],[50.34,52.28],[50.34,52.31],[50.31,52.96],[50.35,53.75],[50.29,54.54],[50.23,55.94],[50.54,47.67],[49.12,47.54],[32.64,32.55],[43.3,39.55],[41.76,39.58],[40.23,39.54],[38.32,38.86],[44.62,39.42],[40.56,35.69],[42.53,35.92],[38.86,35.94],[37.87,36.51],[36.72,39.66],[44.26,57.95],[38.52,38.02],[31.54,38.54],[34.71,38.69],[42.02,45.27],[48.33,50.52],[48.47,51.8],[46.33,50.8],[44.96,51.05],[46.84,51.7],[45.53,51.61],[42.62,52.97],[49.28,47.03],[49.07,45.73],[35.55,35.58],[45.69,42.1],[45.67,46.37],[45.53,45.63],[36.86,44.92],[49.12,44.21],[39.27,34.29],[37.07,34.69],[34.66,30.34],[46.77,35.61],[44.22,36.62],[41.26,51.56],[33.39,51.2],[46.9,47.13],[47.99,47.48],[43.07,51.35],[43.4,51.41],[36.24,33.87],[45.57,46.86],[42.4,34.46],[42.15,33.4],[41.31,27.8],[35.42,32.02],[41.76,30.49],[34.59,34.91],[33.56,33.76],[48.36,51.19],[46.6,51.26],[45.24,51.3],[47.22,47.36],[43.26,51.37],[44.14,51.86],[43.62,51.45],[47.65,46.84],[45.76,51.82],[47.09,51.97],[48.62,52.14],[48,55.86],[48.21,54.32],[48.26,53.52],[48.39,52.8],[48.56,52.17],[45.73,51.82],[45.43,52.06],[45.13,52.42],[44.93,52.82],[43.3,49.76],[31.28,44.3],[50.49,47.93],[44.77,51.68],[44.45,51.78],[48.21,47.92],[46.02,47.55],[48.1,47.71],[43.82,42.73],[40.88,43.5],[45.22,46.15],[37.49,28.74],[38.1,30.97],[38.74,33.28],[44.04,54.1],[46.21,33.82],[45.93,30.48],[45.67,27.34],[39.04,39.32],[34.84,40.52],[45.5,39.2],[36.4,37.16],[46.91,41.43],[46.57,46],[33.06,41.32],[35.98,41.5],[38.06,42.05],[41.28,41.92],[43.66,41.48],[45.41,41.03],[49.07,40.2],[33.32,44.17],[35.03,36.97],[49.79,47.62],[45.9,43.48],[30.79,38.18],[45.02,46.13],[37.58,38.08],[46.48,45.12],[32.14,47.67],[45.49,38.73],[47.73,44.49],[37.27,54.59],[37.38,56.01],[31.84,44.31],[35.08,52.76],[32.45,35.92],[44.05,59.26],[49.93,47.9],[44.3,44.32],[33.26,38.81],[40.51,38.73],[41.73,38.8],[43.92,52.07],[33.69,46.91],[46.95,61.03],[47.04,52.02],[46.75,52.42],[46.53,52.99],[46.37,53.71],[45.81,55.15],[44.46,51.48],[44.18,51.35],[43.94,51.21],[41.9,50.54],[35.65,47.74],[48.01,40.73],[46.76,37.81],[45.64,37.87],[44.75,51.66],[35.64,50.89],[48.68,38.31],[44.93,56.54],[50.57,42.79],[49.13,41.68],[50.54,41.52],[46.88,43.97],[50.17,59.27],[50.22,57.57],[47.49,57.36],[41.31,53.68],[43.44,47.03],[42.99,55.31],[39.2,46.75],[41.64,48.22],[37.85,48.76],[42.22,59.08],[40.05,57.8],[50.45,30.57],[50.11,61.3],[42.99,38.77],[44.2,38.74],[45.09,38.78],[33.81,36.58],[44.01,37.5],[42.64,36.95],[41.26,36.82],[39.97,37.04],[39.19,37.42],[31.42,35.07],[39.69,38.56],[50.41,49.05],[45.11,49.23],[46.96,46.97],[48.2,49.01],[50.49,38.21],[39.64,56.39],[41.78,57.81],[46.85,60.24],[35.23,53.97],[45.04,38.25],[48.05,42.11],[50.15,60.53],[44.44,60.18],[32.51,47.33],[47,59.03],[45.98,44.57],[40.05,54.85],[42.17,56.49],[39.81,51.97],[34.17,49.2],[37.87,52.3],[33.43,50.2],[40.19,49.7],[47.02,42.75],[47.14,46.64],[46.19,46.83],[47.75,45.81],[45.33,36.4],[42.51,35.42],[40.05,35.19],[38.17,35.48],[36.93,36.14],[36.35,38.36],[31.44,41.39],[37.66,40.23],[39.3,40.64],[41.49,40.67],[43.53,40.47],[45.09,40.17],[46.18,39.88],[30.88,41.16],[46.22,47.13],[48.02,43.33],[48.22,46.77],[49.01,47.34],[48.25,46.94],[46.57,47.47],[49.29,47.49],[49.45,47.72],[46.03,38.83],[47.06,39.24],[47.79,39.65],[38.8,37.74],[37.39,37.21],[51.88,42.92],[61.58,38.34],[51.88,47.59],[67.49,32.55],[57.37,39.54],[58.9,39.6],[60.42,39.54],[62.26,38.82],[56.02,39.37],[60.06,35.56],[58.1,35.81],[61.75,35.82],[62.74,36.39],[63.79,39.6],[56.11,57.96],[62.13,37.94],[68.51,38.55],[65.71,38.61],[58.66,45.32],[52.41,50.56],[52.25,51.84],[54.3,50.9],[55.59,51.17],[53.75,51.8],[54.99,51.72],[57.67,53.05],[51.82,47.03],[51.07,45.77],[65,35.4],[55.12,42.13],[55.19,46.44],[55.28,45.71],[63.69,44.92],[51.97,44.2],[61.49,34.13],[63.59,34.52],[65.65,30.36],[54.1,35.51],[56.42,36.49],[59.04,51.62],[66.59,51.18],[53.91,47.21],[52.87,47.52],[57.26,51.53],[56.91,51.56],[64.36,33.68],[55.24,46.95],[58.38,34.32],[58.74,33.26],[59.49,27.84],[65,31.96],[59.05,30.46],[65.88,34.74],[66.7,33.69],[52.38,51.26],[54.04,51.38],[55.32,51.44],[53.61,47.41],[57.13,51.53],[56.31,52.04],[56.76,51.61],[53.34,46.9],[54.75,51.92],[53.54,52.09],[52.08,52.22],[52.4,55.84],[52.4,54.37],[52.36,53.58],[52.27,52.82],[52.05,52.24],[54.78,51.92],[55.1,52.16],[55.4,52.55],[55.61,52.97],[57.21,49.83],[68.68,44.36],[55.68,51.8],[55.96,51.91],[52.61,47.94],[54.71,47.63],[52.76,47.75],[56.92,42.74],[59.79,43.51],[55.55,46.22],[63.11,28.78],[62.53,30.92],[62.03,33.13],[56.28,54.16],[54.71,33.74],[55,30.48],[55.26,27.37],[61.59,39.28],[65.58,40.51],[55.17,39.17],[64.14,37.05],[53.9,41.45],[54.39,46.06],[67.29,41.31],[64.53,41.49],[62.56,42.06],[59.44,41.93],[57.05,41.48],[55.32,41],[51.95,40.2],[66.99,44.18],[65.41,36.87],[51.25,47.61],[54.93,43.52],[69.12,38.21],[54.01,40.46],[55.74,46.21],[62.97,38],[54.45,45.16],[67.83,47.7],[55.09,38.69],[53.3,44.53],[62.97,54.62],[62.72,56],[68.33,44.31],[65.07,52.75],[67.7,35.9],[56.3,59.28],[51.08,47.89],[56.47,44.38],[67.02,38.72],[60.17,38.71],[58.96,38.8],[56.57,52.22],[66.64,46.92],[53.26,61.06],[57.97,59.12],[60.09,57.83],[57.65,38.77],[56.43,38.72],[55.56,38.72],[66.58,36.49],[56.46,37.38],[57.84,36.83],[59.27,36.71],[60.58,36.93],[61.41,37.33],[68.57,35.07],[60.97,38.56],[55.5,49.29],[53.91,47.03],[52.56,49.04],[60.59,56.4],[58.51,57.85],[53.45,60.28],[64.78,53.97],[55.53,38.16],[48.05,42.11],[52.94,42.14],[55.78,60.22],[67.63,47.38],[53.57,52.06],[53.84,52.52],[54.09,53.12],[54.21,53.79],[54.58,55.16],[55.98,51.65],[56.26,51.48],[56.5,51.38],[58.52,50.63],[64.78,47.75],[52.91,40.73],[53.95,37.74],[55.02,37.78],[55.65,51.78],[64.64,50.92],[52.17,38.29],[55.46,56.53],[51.92,41.69],[54.02,43.99],[52.94,57.39],[59.07,53.74],[57.24,47.11],[57.36,55.32],[61.4,46.79],[58.98,48.27],[62.65,48.76],[53.39,59.03],[54.86,44.63],[60.24,54.87],[58.2,56.51],[60.55,51.98],[66.06,49.21],[62.5,52.35],[66.7,50.2],[60.26,49.75],[53.87,42.77],[53.8,46.68],[54.62,46.92],[53.29,45.83],[55.42,36.28],[58.24,35.28],[60.66,35.08],[62.51,35.36],[63.66,36],[64.14,38.3],[68.64,41.42],[62.94,40.21],[61.31,40.63],[59.16,40.67],[57.13,40.44],[55.59,40.14],[54.49,39.84],[69.06,41.21],[54.6,47.2],[53.02,43.34],[52.84,46.8],[52.02,47.35],[52.75,46.99],[54.24,47.55],[51.72,47.5],[51.54,47.78],[54.59,38.78],[53.65,39.21],[53.04,39.65],[61.83,37.66],[63.24,37.11],[41.9,37.72],[43.61,37.73],[41.92,36.5],[40.2,37.71],[41.91,38.97],[58.5,37.68],[60.21,37.65],[58.44,36.45],[56.76,37.7],[58.49,38.93]];

// ═══════════════════════════════════════════════════════════════════
// makeupGradientCSS — generates a CSS background from a look's colors
// mapped precisely onto N'Mild's face via MediaPipe landmarks.
// ═══════════════════════════════════════════════════════════════════
function makeupFromMesh(look) {
  if (!look) return 'none';
  const F = NMILD_FILTER;
  const blushColor = look.cheek + '66';
  const lipColor = look.lips + '99';

  // Eyes are handled separately (via makeupEyesFromMesh) for
  // softer blending. This gradient covers cheeks + lips only.
  const gradients = [
    // Left blush
    `radial-gradient(ellipse ${F.leftBlush.rx}% ${F.leftBlush.ry}% at ${F.leftBlush.cx}% ${F.leftBlush.cy}%, ${blushColor} 0%, transparent 100%)`,
    // Right blush
    `radial-gradient(ellipse ${F.rightBlush.rx}% ${F.rightBlush.ry}% at ${F.rightBlush.cx}% ${F.rightBlush.cy}%, ${blushColor} 0%, transparent 100%)`,
    // Lips
    `radial-gradient(ellipse ${F.lips.rx}% ${F.lips.ry}% at ${F.lips.cx}% ${F.lips.cy}%, ${lipColor} 0%, transparent 100%)`,
  ];
  return gradients.join(', ');
}

// Eye-only gradient — rendered as a separate layer with soft-light
// blend and ~40% less opacity so it blends naturally with the skin
// without looking like a harsh painted swatch. Uses two overlapping
// ellipses per eye: a tight "crease" gradient + a wider "lid wash"
// for a natural buildup like real eyeshadow application.
function makeupEyesFromMesh(look) {
  if (!look) return 'none';
  const F = NMILD_FILTER;
  // Inner crease: tighter, slightly more opaque
  const creaseAlpha = '44';  // ~27% — the concentrated pigment
  // Outer wash: wider, very sheer
  const washAlpha = '2a';    // ~17% — the diffused halo
  const c = look.eyes;

  const gradients = [
    // Left eye — crease (tight, along the lid fold)
    `radial-gradient(ellipse ${F.leftEyeShadow.rx * 0.7}% ${F.leftEyeShadow.ry * 0.75}% at ${F.leftEyeShadow.cx}% ${F.leftEyeShadow.cy - 0.3}%, ${c}${creaseAlpha} 0%, transparent 100%)`,
    // Left eye — wash (wider, sheerer)
    `radial-gradient(ellipse ${F.leftEyeShadow.rx * 1.15}% ${F.leftEyeShadow.ry * 1.3}% at ${F.leftEyeShadow.cx}% ${F.leftEyeShadow.cy + 0.2}%, ${c}${washAlpha} 0%, transparent 100%)`,
    // Right eye — crease
    `radial-gradient(ellipse ${F.rightEyeShadow.rx * 0.7}% ${F.rightEyeShadow.ry * 0.75}% at ${F.rightEyeShadow.cx}% ${F.rightEyeShadow.cy - 0.3}%, ${c}${creaseAlpha} 0%, transparent 100%)`,
    // Right eye — wash
    `radial-gradient(ellipse ${F.rightEyeShadow.rx * 1.15}% ${F.rightEyeShadow.ry * 1.3}% at ${F.rightEyeShadow.cx}% ${F.rightEyeShadow.cy + 0.2}%, ${c}${washAlpha} 0%, transparent 100%)`,
  ];
  return gradients.join(', ');
}

// ═══════════════════════════════════════════════════════════════════
// FaceMeshWireframe — SVG overlay showing detected feature contours
// ═══════════════════════════════════════════════════════════════════
function FaceMeshWireframe({ highlight = null, intensity = 0.55 }) {
  const lm = NMILD_ALL_LANDMARKS;
  const line = (a, b) => {
    const [x1, y1] = lm[a];
    const [x2, y2] = lm[b];
    return { x1, y1, x2, y2 };
  };

  const featureStyles = {
    oval:     { stroke: 'rgba(255,246,240,0.25)', strokeWidth: '0.3' },
    leftEye:  { stroke: highlight === 'eyes' || !highlight ? 'rgba(201,146,62,0.7)' : 'rgba(255,246,240,0.2)', strokeWidth: highlight === 'eyes' ? '0.6' : '0.35' },
    rightEye: { stroke: highlight === 'eyes' || !highlight ? 'rgba(201,146,62,0.7)' : 'rgba(255,246,240,0.2)', strokeWidth: highlight === 'eyes' ? '0.6' : '0.35' },
    lips:     { stroke: highlight === 'lips' || !highlight ? 'rgba(193,58,78,0.7)' : 'rgba(255,246,240,0.2)', strokeWidth: highlight === 'lips' ? '0.6' : '0.35' },
    leftBrow: { stroke: highlight === 'brows' || !highlight ? 'rgba(255,246,240,0.4)' : 'rgba(255,246,240,0.15)', strokeWidth: '0.3' },
    rightBrow:{ stroke: highlight === 'brows' || !highlight ? 'rgba(255,246,240,0.4)' : 'rgba(255,246,240,0.15)', strokeWidth: '0.3' },
  };

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none"
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', opacity: intensity,
        filter: 'drop-shadow(0 0.5px 1px rgba(42,31,26,0.6))',
      }}>
      {Object.entries(FACE_CONTOURS).map(([feature, connections]) => (
        <g key={feature} {...featureStyles[feature]}
           fill="none" strokeLinecap="round"
           vectorEffect="non-scaling-stroke">
          {connections.map(([a, b], i) => {
            const l = line(a, b);
            return <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />;
          })}
        </g>
      ))}
      {/* Feature key-point dots */}
      {[
        { ...NMILD_FACE.leftIris, r: 0.6, fill: 'rgba(201,146,62,0.85)' },
        { ...NMILD_FACE.rightIris, r: 0.6, fill: 'rgba(201,146,62,0.85)' },
        { ...NMILD_FACE.noseTip, r: 0.5, fill: 'rgba(194,97,138,0.75)' },
        { ...NMILD_FACE.leftMouthCorner, r: 0.4, fill: 'rgba(193,58,78,0.75)' },
        { ...NMILD_FACE.rightMouthCorner, r: 0.4, fill: 'rgba(193,58,78,0.75)' },
        { ...NMILD_FACE.leftCheek, r: 0.5, fill: 'rgba(219,145,120,0.6)' },
        { ...NMILD_FACE.rightCheek, r: 0.5, fill: 'rgba(219,145,120,0.6)' },
      ].map((dot, i) => (
        <circle key={`dot-${i}`} cx={dot.x} cy={dot.y} r={dot.r}
          fill={dot.fill}
          stroke="rgba(255,246,240,0.9)" strokeWidth="0.15"
          vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FaceWithMakeupMesh — replaces the old FaceWithMakeup, using MediaPipe
// positions instead of manual landmarks
// ═══════════════════════════════════════════════════════════════════
function FaceWithMakeupMesh({ look, photo, photoFrame, intensity = 0.85, rounded = 0, showMesh = false }) {
  if (!look) return null;
  if (!photo) {
    return (
      <div style={{ width: '100%', height: '100%', borderRadius: rounded,
        background: 'rgba(255,246,240,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <FaceAvatar size={60} style={{ opacity: 0.4 }} />
      </div>
    );
  }
  return (
    <div style={{ position: 'absolute', inset: 0, borderRadius: rounded, overflow: 'hidden' }}>
      <FaceStage photo={photo} photoFrame={photoFrame}>
        {/* Cheeks + lips layer — multiply blend */}
        <div style={{
          position: 'absolute', inset: 0, opacity: intensity,
          background: makeupFromMesh(look),
          mixBlendMode: 'multiply', pointerEvents: 'none',
        }} />
        {/* Eyes layer — soft-light blend, separate so it's sheerer
            and blends more naturally with the skin texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: intensity,
          background: makeupEyesFromMesh(look),
          mixBlendMode: 'soft-light', pointerEvents: 'none',
        }} />
        {showMesh && <FaceMeshWireframe intensity={0.4} />}
      </FaceStage>
      <div style={{
        position: 'absolute', inset: 0, opacity: intensity * 0.35,
        background: `linear-gradient(180deg, ${look.eyes}22 0%, transparent 30%, transparent 70%, ${look.lips}22 100%)`,
        pointerEvents: 'none',
      }} />
    </div>
  );
}

Object.assign(window, {
  NMILD_FACE, NMILD_FILTER, FACE_CONTOURS, NMILD_ALL_LANDMARKS,
  makeupFromMesh, makeupEyesFromMesh, FaceMeshWireframe, FaceWithMakeupMesh,
});
