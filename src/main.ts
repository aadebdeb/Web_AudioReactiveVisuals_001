import { TimeDomainRenderer } from './timeDomainRenderer';
import { FrequencyRenderer } from './frequencyRenderer';

const clickElem = document.createElement('div');
clickElem.textContent = 'Click to Start';
document.body.appendChild(clickElem);
let clicked = false;
addEventListener('click', async () => {
  if (clicked) return;
  clicked = true;
  clickElem.remove();

  const audioContext = new AudioContext();

  const stream = await navigator.mediaDevices.getUserMedia({audio: true});
  const input = audioContext.createMediaStreamSource(stream);
  const analyzer = audioContext.createAnalyser();
  input.connect(analyzer);

  const canvas = document.createElement('canvas');
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  document.body.appendChild(canvas);
  const gl = <WebGL2RenderingContext>canvas.getContext('webgl2');
  
  const timeDomainRenderer = new TimeDomainRenderer(gl, analyzer.fftSize);
  const frequencyRenderer = new FrequencyRenderer(gl, analyzer.frequencyBinCount);
  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  let requestId: number | null = null;
  const render = () => {  
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    if(analyzer != null) {
      timeDomainRenderer.update(gl, analyzer);
      frequencyRenderer.update(gl, analyzer);
    }
    timeDomainRenderer.render(gl);
    frequencyRenderer.render(gl, analyzer);

    requestId = requestAnimationFrame(render);
  };

  addEventListener('resize', () => {
    if (requestId != null) {
      cancelAnimationFrame(requestId);
    }
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    requestId = requestAnimationFrame(render);
  });
  
  requestId = requestAnimationFrame(render);  
});
 