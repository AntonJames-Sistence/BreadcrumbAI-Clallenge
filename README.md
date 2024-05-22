# Challenge Solution

## Overview

This solution is designed to read a file containing 3D points with labels, group the points by label, and then find the smallest tetrahedron (by volume) formed by four points with the same label. The solution is divided into several functions to manage different parts of the process:

1. **parsePoints**
2. **groupPointsByLabel**
3. **volumeOfTetrahedron**
4. **getSmallestTetrahedronForEachLabel**
5. **getSmallestTetrahedron**

### `parsePoints`
This function parses the input data from a text file. It splits the data into individual lines, then extracts the coordinates and labels for each point. It returns an array of objects, where each object represents a point with its x, y, z coordinates, label, and index.
```javascript
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
```

### `groupPointsByLabel`
This function groups the parsed points by their labels. It iterates through the array of points and organizes them into a dictionary (object) where the keys are the labels and the values are arrays of points associated with those labels.
```javascript
const groupPointsByLabel = (points) => {
    const groups = {};
    points.forEach((point) => {
      if (!groups[point.label]) {
        groups[point.label] = [];
      }
      groups[point.label].push(point);
    });
    return groups;
}
```

### `volumeOfTetrahedron`
This function calculates the volume of a tetrahedron formed by four points in 3D space. It uses the scalar triple product to compute the volume, which is a measure of how much space the tetrahedron occupies.
```javascript
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
```

### `getSmallestTetrahedronForEachLabel`
This function finds the smallest tetrahedron for a specific group of points (with the same label). It iterates through all possible combinations of four points within the group, calculates the volume for each combination, and keeps track of the smallest volume found.
```javascript
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
```

### `getSmallestTetrahedron`
This function integrates all the other functions to find the smallest tetrahedron in the given file. It reads the file, parses the points, groups them by label, finds the smallest tetrahedron for each label, and finally determines the smallest tetrahedron among all labels. The result is printed to the console.
```javascript
const getSmallestTetrahedron = (pathToFile) => {
    fs.readFile(pathToFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        const points = parsePoints(data);
        const groupedPoints = groupPointsByLabel(points);

        let smallestTetrahedron = null;
        let minVolume = Infinity;

        for (const label in groupedPoints) {
            const currentTetrahedron = getSmallestTetrahedronForEachLabel(groupedPoints[label]);
            if (currentTetrahedron) {
                const currentVolume = volumeOfTetrahedron(
                    points[currentTetrahedron[0]],
                    points[currentTetrahedron[1]],
                    points[currentTetrahedron[2]],
                    points[currentTetrahedron[3]]
                );
                if (currentVolume < minVolume) {
                    minVolume = currentVolume;
                    smallestTetrahedron = currentTetrahedron;
                }
            }
        }

        if (smallestTetrahedron) {
            console.log(`Smallest tetrahedron Indices from`, pathToFile, `file are:`, smallestTetrahedron);
        } else {
            console.log('Not enough points to form a tetrahedron.');
        }
    });
};
```

# Usage
cd into the folder and run the file from your terminal

```terminal
node code.js
```
This will process both small and large files and print the indices of the points forming the smallest tetrahedron for each file into console.