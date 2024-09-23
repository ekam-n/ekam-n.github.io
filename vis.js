const colors = ['red', 'blue', 'green', 'purple', 'orange', 'cyan', 'magenta', 'yellow'];
const spiralGroup = document.getElementById('spiral-group');

for (let i = 0; i < 500; i++) {
  const rotation = (i * 360 / 500); // Rotate each spiral differently
  const color = colors[i % colors.length]; // Cycle through colors

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `
    M 0 0 
    Q 10 10, 20 0
    T 40 0 
    T 60 0
    T 80 0 
    T 100 0
    T 120 0 
    T 140 0
    T 160 0 
    T 180 0
  `);
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', color);
  path.setAttribute('stroke-width', '2');
  path.setAttribute('transform', `rotate(${rotation})`);

  spiralGroup.appendChild(path);
}
