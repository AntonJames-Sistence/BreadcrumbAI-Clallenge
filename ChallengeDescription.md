# Programming Challenge

Welcome to the programming screening for Breadcrumb.ai! 

This challenge is designed to assess your problem-solving and programming skills. Please read the instructions carefully before you begin.

## Instructions

1. You will be provided links to download two files: `points_small.txt` and `points_large.txt`.
2. Your task is to write a program that processes these files to solve the given problem.
3. After running your program on each file, enter the results into this form.
4. The results should be submitted in the specified format.
5. Ensure that you are signed into your Google account, as we will use this email to contact you regarding next steps.

## Problem Description

You are to write a program that reads a list of points on a 3D plane from a file. Each point is defined by its coordinates and a label and is presented in the following format: `(x, y, z, 'label')`, where `x`, `y`, and `z` are floats with two decimal points, and `'label'` is a character ranging from 'A' to 'Z' and 'a' to 'z'.

### Your Task

Identify the indices of four points that form a tetrahedron with the smallest possible volume. The resultant four points must have the same associated letter to be a valid tetrahedron.

The output should list the zero-based indices of these four points in ascending order.

## Answer Submission

Your code should return a list of four points that form the smallest tetrahedron for each input file. Enter the indices of the four points for each file in the below input boxes. 
You should input the indexes in ascending order.
Make sure that the indexes start at 0.
Only enter a number (integer) in the following boxes.
Attempt to solve both files `points_small.txt` and `points_large.txt`, if not, feel free to submit answers for `points_small.txt`.

## Example

Suppose `points_small.txt` contains the following lines:
```js
(3.00, 4.00, 5.00, 'A')
(2.00, 3.00, 3.00, 'A')
(1.00, 2.00, 2.00, 'B')
(3.50, 4.50, 5.50, 'A')
(2.50, 3.50, 3.50, 'A')
(2.50, 3.00, 7.00, 'B')
```

If the tetrahedron with the smallest volume is formed by the points at indices 0, 1, 3, and 4 (all have the letter 'A'), your answer should be entered as: `0, 1, 3, 4`.

## Hint

To calculate the volume, you can use the following Python function:

```python
def volume_of_tetrahedron(p1, p2, p3, p4):
    # Vectors from p1 to p2, p3, and p4
    AB = (p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2])
    AC = (p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2])
    AD = (p4[0] - p1[0], p4[1] - p1[1], p4[2] - p1[2])

    # Direct calculation of the cross product components
    cross_product_x = AB[1] * AC[2] - AB[2] * AC[1]
    cross_product_y = AB[2] * AC[0] - AB[0] * AC[2]
    cross_product_z = AB[0] * AC[1] - AB[1] * AC[0]

    # Dot product of AD with the cross product of AB and AC
    scalar_triple_product = (
        AD[0] * cross_product_x +
        AD[1] * cross_product_y +
        AD[2] * cross_product_z
    )

    # The volume of the tetrahedron
    volume = abs(scalar_triple_product) / 6.0
    return volume

# Example points
A = (1, 2, 3)
B = (2, 3, 4)
C = (1, 5, 1)
D = (4, 2, 3)

# Calculate the volume
vol = volume_of_tetrahedron(A, B, C, D)
print(f"The volume of the tetrahedron is {vol}")
