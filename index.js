var canvas, ctx, grad_array;

window.onload = () => {
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  generatePerlinNoise();
  draw();
};

const WIDTH = 32;

const generatePerlinNoise = () => {
  // generate random unit vectors at each corner of a X*Y grid
  let array = [];
  for (let y = 0; y <= WIDTH; y++) {
    for (let x = 0; x <= WIDTH; x++) {
      let randVal = Math.random() * Math.PI * 2;
      array.push({
        x: Math.cos(randVal),
        y: Math.sin(randVal),
      });
    }
  }
  grad_array = array;
  console.log(grad_array.length);
};

const dot = (p1, p2) => {
  return p1.x * p2.x + p1.y * p2.y;
};

const lerp = (a, b, t) => {
  return (1.0 - t) * a + t * b;
};

const fade = (t) => {
  return ((6 * t - 15) * t + 10) * t * t * t;
};

const calc = (x, y) => {
  x = x % (WIDTH + 1);
  y = y % (WIDTH + 1);

  const gridx0 = Math.floor(x);
  const gridy0 = Math.floor(y);
  const gridx1 = (Math.floor(x) + 1) % (WIDTH + 1);
  const gridy1 = (Math.floor(y) + 1) % (WIDTH + 1);
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const p1_dist = {
    x: xf - 0,
    y: yf - 0,
  };
  const p2_dist = {
    x: xf - 1,
    y: yf - 0,
  };
  const p3_dist = {
    x: xf - 0,
    y: yf - 1,
  };
  const p4_dist = {
    x: xf - 1,
    y: yf - 1,
  };

  const dot_product_0 = dot(grad_array[WIDTH * gridy0 + gridx0], p1_dist);
  const dot_product_1 = dot(grad_array[WIDTH * gridy0 + gridx1], p2_dist);
  const lerp_x = lerp(dot_product_0, dot_product_1, fade(x - Math.floor(x)));
  const dot_product_2 = dot(grad_array[WIDTH * gridy1 + gridx0], p3_dist);
  const dot_product_3 = dot(grad_array[WIDTH * gridy1 + gridx1], p4_dist);
  const lerp_y = lerp(dot_product_2, dot_product_3, fade(x - Math.floor(x)));

  const lerp_xy = lerp(lerp_x, lerp_y, fade(y - Math.floor(y)));
  return lerp_xy + 0.5;
};

const noise = (x, y) => {
  let ans = 0;
  const len = 4;
  const largest_part = 2 ** (len - 1) / (2 ** len - 1);
  for (let i = 0; i < len; i++) {
    ans += (calc(x * (i + 1), y * (i + 1)) * largest_part) / (i + 1);
  }
  return ans;
};

var time = 0;
setInterval(() => {
  time += 0.09;
  draw(time);
}, 62.5);

function draw(t) {
  var height = canvas.height;
  var width = canvas.width;
  var pixelData = ctx.createImageData(width, height);
  var pixelPos = 0;
  for (var y = 0; y < pixelData.height; y++) {
    for (var x = 0; x < pixelData.width; x++) {
      let ans = noise(x / 30, y / 30 + t) * 150;
      var r = ans;
      var g = ans;
      var b = ans;

      pixelData.data[pixelPos++] = Math.max(0, Math.min(255, r));
      pixelData.data[pixelPos++] = Math.max(0, Math.min(255, g));
      pixelData.data[pixelPos++] = Math.max(0, Math.min(255, b));
      pixelData.data[pixelPos++] = 255; 
    }
  }

  ctx.putImageData(pixelData, 0, 0);
}
