const fs = require('fs');

// Function to parse points from points_small file
const parsePoints = (data) =>  {
    return data.trim().split('\n').map(line => {
        const [x, y, z, label] = line.slice(1, -1).split(', ');
        return {
            x: parseFloat(x),
            y: parseFloat(y),
            z: parseFloat(z),
            label: label.slice(1, -1)
        };
    });
};

// Function to group points by label
const groupPointsByLabel = (points) => {
    const groups = {};

    points.forEach((point, index) => {
      if (!groups[point.label]) {
        groups[point.label] = [];
      }
      groups[point.label].push({ ...point, index });
    });

    return groups;
}

// Function to calculate the volume of a tetrahedron
const volumeOfTetrahedron = (p1, p2, p3, p4) => {
    const AB = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
    const AC = { x: p3.x - p1.x, y: p3.y - p1.y, z: p3.z - p1.z };
    const AD = { x: p4.x - p1.x, y: p4.y - p1.y, z: p4.z - p1.z };
  
    const crossProduct = {
      x: AB.y * AC.z - AB.z * AC.y,
      y: AB.z * AC.x - AB.x * AC.z,
      z: AB.x * AC.y - AB.y * AC.x
    };
  
    const scalarTripleProduct = AD.x * crossProduct.x + AD.y * crossProduct.y + AD.z * crossProduct.z;
  
    return Math.abs(scalarTripleProduct) / 6.0;
};

// Function to find smallest tetrahedron for specific label
function getSmallestTetrahedron(points) {
    const n = points.length;
    if (n < 4) return null;
  
    let minVolume = Infinity;
    let minTetrahedron = null;
  
    for (let i = 0; i < n - 3; i++) {
      for (let j = i + 1; j < n - 2; j++) {
        for (let k = j + 1; k < n - 1; k++) {
          for (let l = k + 1; l < n; l++) {
            const volume = volumeOfTetrahedron(points[i], points[j], points[k], points[l]);
            if (volume < minVolume) {
              minVolume = volume;
              minTetrahedron = [points[i].index, points[j].index, points[k].index, points[l].index];
            }
          }
        }
      }
    }
  
    return minTetrahedron ? minTetrahedron.sort((a, b) => a - b) : null;
};

// Read the file
fs.readFile('./points_small.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Parsing data
    const points = parsePoints(data);
    // Grouping points
    const groupedPoints = groupPointsByLabel(points);
    // console.log(groupedPoints);
    const results = [];

    for (const label in groupedPoints) {
        // console.log(label)
      const smallestTetrahedron = getSmallestTetrahedron(groupedPoints[label]);
      if (smallestTetrahedron) {
        // console.log('label:', label, '| smallestTetrahedron:', smallestTetrahedron)
        // results[label] = smallestTetrahedron;
        results.push({ label, smallestTetrahedron: smallestTetrahedron });
      }
    }

    // Sorting in order to satisfy challenge requirements
    results.sort((a, b) => {
        const lastA = a.smallestTetrahedron[a.smallestTetrahedron.length - 1];
        const lastB = b.smallestTetrahedron[b.smallestTetrahedron.length - 1];
        return lastA - lastB;
    });

    console.log('Result:', results);
});

