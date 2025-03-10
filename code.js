const fs = require('fs');

// Function to parse points from points_small.txt or points_large.txt file
const parsePoints = (data) =>  {
    return data.trim().split('\n').map((line, index) => {
        const [x, y, z, label] = line.slice(1, -1).split(', ');
        return {
            x: parseFloat(x),
            y: parseFloat(y),
            z: parseFloat(z),
            label: label.slice(1, -1),
            index: index
        };
    });
};

// Function to group points by label
const groupPointsByLabel = (points) => {
    const groups = {};

    points.forEach((point) => {
      if (!groups[point.label]) {
        groups[point.label] = [];
      }
    //   groups[point.label].push({ ...point, index });
      groups[point.label].push(point);
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
const getSmallestTetrahedronForEachLabel = (points) => {
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

// Function with core logic
const getSmallestTetrahedron = (pathToFile) => {
    // Reading txt file...
    fs.readFile(pathToFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        // Parsing data...
        const points = parsePoints(data);
        // console.log(points);

        // Grouping points...
        const groupedPoints = groupPointsByLabel(points);
        // console.log(groupedPoints);

        let smallestTetrahedron = null;
        let minVolume = Infinity;

        for (const label in groupedPoints) {
            const currentTetrahedron = getSmallestTetrahedronForEachLabel(groupedPoints[label]);

            if (currentTetrahedron) {
                // console.log(`Smallest Tetrahedron Indices:`, currentTetrahedron, `from ${label} label group`)

                const currentVolume = volumeOfTetrahedron(
                    points[currentTetrahedron[0]],
                    points[currentTetrahedron[1]],
                    points[currentTetrahedron[2]],
                    points[currentTetrahedron[3]]
                );
                // console.log('currentVolume:', currentVolume, '| label:', label)
                if (currentVolume < minVolume) {
                    minVolume = currentVolume;
                    // console.log('Setting minimum volume...', minVolume)
                    smallestTetrahedron = currentTetrahedron;
                };
            }
        }
        
        // Printing result...
        if (smallestTetrahedron) {
            console.log(`Smallest tetrahedron Indicies from`, pathToFile, `file are:`, smallestTetrahedron);
            // return smallestTetrahedron;
        } else {
            console.log('Not enough points to form a tetrahedron.');
            // return null;
        };

    });
}

const smallFile = './points_small.txt';
getSmallestTetrahedron(smallFile);
const largeFile = './points_large.txt';
getSmallestTetrahedron(largeFile);