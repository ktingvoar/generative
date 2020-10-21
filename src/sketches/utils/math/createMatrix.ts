import type { Vector } from "./types";

/**
 * Returns a matrix (multi-dimensional array) with your desired dimensions and
 * values.
 *
 * If a number is passed to the `dimensions` parameter, the smallest array with
 * that number of dimensions is returned. If an array is passed, the returned
 * matrix will be of those exact dimensions.
 *
 * @param dimensions - `D`: The desired dimensions of the matrix. A number or array of numbers.
 * @param initialValues - The value that each point in the matrix initialises to. Defaults to `null`.
 * @returns A matrix of `D` dimensions, with each point initialised to the `initialValues` parameter.
 *
 * @example
 * const twoDArray = createMatrix(2); // A 2D array
 *
 * const threeXThreeXTwoArray = createMatrix([3, 3, 2]); // An array of size 3x3x2
 *
 * const twoDNumberArray = createMatrix([3, 5], 0); // A 3x5 array, each point set to 0
 *
 * const threeDStringArray = createMatrix([2, 6, 5], "hi"); // A 2x6x5 array, each point set to "hi"
 */
export const createMatrix = <D extends number, T>(
    dimensions: D | Vector<D>,
    initialValues: T = null
): Matrix<D, T> => {
    let currentDimensionLength: number;
    let remainingDimensions: number | number[];
    let needsRecursion: boolean;

    if (typeof dimensions === "number") {
        currentDimensionLength = dimensions;
        remainingDimensions = dimensions - 1;
        needsRecursion = remainingDimensions > 0;
    } else {
        currentDimensionLength = dimensions[0];
        remainingDimensions = dimensions.slice(1);
        needsRecursion = remainingDimensions.length > 0;
    }

    if (!Number.isInteger(currentDimensionLength)) {
        throw new TypeError(`Dimensions can only be integers`);
    }

    const currentMatrix = Array(currentDimensionLength).fill(initialValues);
    // TODO: callback logic for mapping values based on Vector position?
    // .map((position: Vector<D>) => {
    //     const [x,y,z,...] = position;
    // })

    const finalMatrix = needsRecursion
        ? currentMatrix.map(() =>
              createMatrix(remainingDimensions, initialValues)
          )
        : currentMatrix;

    return finalMatrix as Matrix<D, T>;
};

// const n: number[][] = createMatrix([1, 3]); // FIXME: https://github.com/microsoft/TypeScript/issues/39409

/**
 * A multidimensional array returned by `createMatrix`. Provides type-safety up
 * to 5 dimensions. Above 5 dimensions, it's reccomended you annotate your
 * variables for more safety.
 */
export type Matrix<D extends number, T> = D extends 1
    ? T[]
    : D extends 2
    ? T[][]
    : D extends 3
    ? T[][][]
    : D extends 4
    ? T[][][][]
    : D extends 5
    ? T[][][][][]
    : any[][][][][][]; // TODO: Full type safety?

//

// const getVectorValue = <D extends number, T>(
//     matrix: Matrix<D, T>,
//     vector: Vector<D>
// ): T => {
//     const returnValue: T = getVectorValue(matrix[vector[0]], vector.slice(1));

//     return returnValue;
// };

// const setVectorValue = <D extends number, T>(
//     matrix: Matrix<D, T>,
//     vector: Vector<D>,
//     value: T
// ): void => {
//     if (vector.length === 1) {
//         matrix[vector[0]] = value;
//     } else {
//         setVectorValue(matrix[vector[0]], vector.slice(1), value);
//     }
// };

// setVectorValue([0, 0], [0], 1);
