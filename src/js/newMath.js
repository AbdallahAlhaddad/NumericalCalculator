import { compile, evaluate, derivative, matrix, rationalize, det, simplify } from 'mathjs'
import { parse, Equation } from 'algebra.js'

export const createExpr = (expr) => compile(`f(x) = ${expr}`)
// const math = require('mathjs')
// const algebra = require('  js')
//! function
//f(x)=x4−x−11
// import { equInputDiv } from './methodSwitching'
// const equInputDiv = '-2+7*x-5*x^2+6*x^3'
// const equa = "x^3 + 4*x - 9"
// const equa = "-1.5 * x^6 - 2* x^4 + 12 * x"
// const equa = "Math.sqrt((1.9*x) + 2.8 )"
// const equa = "-2+7*x-5*x^2+6*x^3"
// const equa = "-2 + 6*x -4* x^2 + 0.5 * x^3 "


//? for display gradent 


//! define a function as an expression
// ? require : equation is scope named equa
//! working
export const f = (x, equation) => {
  // console.log(typeof (equation));
  return evaluate(equation, { x: x })
}
//! working
export const fd = (x, equation) => {

  let dEquation = derivative(equation.replace(/\(-x\)/g, '-x'), 'x').toString()

  return evaluate(dEquation, { x: x })
}

//! tested (working):
export const validateExpr = (expr) => {
  try {
    const expression = compile(expr)
    // TODO: fix validation for (x only)
    if (!isNaN(expression.evaluate({ x: 1, y: 1 }))) return true
    else return false
  } catch (err) {
    console.log(err)
    return false
  }
}

export const diff = (expr) => derivative(expr, 'x').toString()

//!========== Truncating decimal places to specific digits ==========!//
//==> step1: create a function to truncate one number:
Number.prototype.toFixedNoRounding = function (n) {
  const reg = new RegExp('^-?\\d+(?:\\.\\d{0,' + n + '})?', 'g')
  const a = this.toString().match(reg)[0]
  const dot = a.indexOf('.')
  if (dot === -1) {
    // integer, insert decimal dot and pad up zeros
    return a + '.' + '0'.repeat(n)
  }
  const b = n - (a.length - dot) + 1
  return b > 0 ? a + '0'.repeat(b) : a
}

export const truncateNum = (num, decimals) => {
  if (isNaN(num)) return num
  return parseFloat(num.toFixedNoRounding(decimals))
}
//==> step2: create a function to truncate the 'result' array of objects:
export const truncateResults = (resultsArr, decimals) => {
  const truncatedResults = []
  resultsArr.forEach((resultsRow) => {
    const tempRow = {}
    for (const cellDataIndex in resultsRow) {
      tempRow[cellDataIndex] = truncateNum(resultsRow[cellDataIndex], decimals)
    }
    truncatedResults.push(tempRow)
  })
  return truncatedResults
}

//!========== Rounding decimals to specific digits ==========!//
export const roundNum = (num, decimals) => {
  if (isNaN(num)) return num
  return +parseFloat(num).toFixed(decimals)
}

export const roundResults = (resultsArr, decimals) => {
  const roundedResults = []
  resultsArr.forEach((resultsRow) => {
    const tempRow = {}
    for (const cellDataIndex in resultsRow) {
      tempRow[cellDataIndex] = roundNum(resultsRow[cellDataIndex], decimals)
    }
    roundedResults.push(tempRow)
  })
  return roundedResults
}
//! tested (working):

export const resultsToTable = ({ results, customHeader = null }) => {
  // make sure that results isn't null:
  if (!results)
    throw "Error: The results can't be null, Please enter the results as array of result iteration objects [{iteration:'1', xl:'3', ...} {iteration:'2', xl:'5', ...}]"

  // make sure that results is array of objects:
  try {
    const temp = Object.getOwnPropertyNames(results[0]) //will throw (TypeError: Cannot convert undefined or null to object)(js error)
    if (customHeader === null) customHeader = temp
  } catch {
    throw 'Error: The results must be passed as an array of result iteration objects e.g.: [{iteration:"1", xl:"3", ...} {iteration:"2", xl:"5", ...}]'
  }

  // make sure that customHeader is an array:
  if (!Array.isArray(customHeader)) throw "Error: the custom header must be an array. e.g.: ['headerCell 1','headerCell 2', ...]"

  // check if the customHeader is appropriate for the table that will be generated:
  if (customHeader.length != Object.getOwnPropertyNames(results[0]).length)
    throw 'Error: the number of custom header cells != the number of body cells'

  //=====================================================================================================================//

  let table = document.createElement('table')
  let tableHeader = document.createElement('thead')
  let tableBody = document.createElement('tbody')
  let cell, cellText

  // create the table header:
  customHeader.forEach((headerName) => {
    cell = document.createElement('th')
    cellText = document.createTextNode(headerName)
    cell.appendChild(cellText)
    tableHeader.appendChild(cell)
  })

  // create the table body:
  results.forEach((resultsRow) => {
    let row = document.createElement('tr')
    for (const cellDataIndex in resultsRow) {
      cell = document.createElement('td')
      cellText = document.createTextNode(resultsRow[cellDataIndex])
      cell.appendChild(cellText)
      row.appendChild(cell)
    }
    tableBody.appendChild(row)
  })

  table.appendChild(tableHeader)
  table.appendChild(tableBody)
  return table
}

export const hessianToResult = ({ results }) => {
  // create the table body:

  let table = document.createElement('table')
  let tableBody = document.createElement('tbody')
  let cell, cellText

  // create the table body:
  let mat = results.hessianMatrix
  mat.forEach((resultsRow) => {
    let row = document.createElement('tr')

    resultsRow.forEach(element => {
      cell = document.createElement('td')
      cellText = document.createTextNode(element)
      cell.classList.add('browser-default')
      cell.appendChild(cellText)

      row.appendChild(cell)
    });
    row.classList.add('browser-default')
    tableBody.appendChild(row)
  })
  tableBody.classList.add('browser-default')
  table.appendChild(tableBody)
  table.classList.add('matrix', 'browser-default', 'determinant-matrix')
  console.log(table)
  let htmlData = `
  <table>
  <thead>
      <th>
          <center><span>Gradient and hessian </span></center>
      </th>
  </thead>
  <tbody>
      <tr>
          <td>
              ∇f = 𝜕f/𝜕x i+𝜕f/𝜕y j
          </td>
      </tr>
      <tr>
          <td>
              𝜕f/𝜕x=${results.dfdx1}
          </td>
      </tr>
      <tr>
          <td>
              𝜕f/𝜕y = ${results.dfdy1}
          </td>
      </tr>
      <tr>
          <td>
              ∇𝑓 = ${results.gradient}
          </td>
      </tr>
      <tr>
          <td>
              𝜕2𝑓/𝜕x2 = ${results.d2fdx2}
          </td>
      </tr>
      <tr>
          <td>
              𝜕2𝑓/𝜕y2 = ${results.d2fdy2}
          </td>
      </tr>
      <tr>
          <td>
              𝜕2𝑓/𝜕x𝜕y = ${results.d2fdxdy}
          </td>
      </tr>
      <tr>
     
      </tr>
      <tr>
          <td>
              |𝐻| = ${results.detHessianMatrix}
          </td>
      </tr>
      <tr>
          <th>
                  Get value of h
          </th>
      </tr>
      <tr>
          <td>
              g(h) = (x0 +𝜕𝑓/𝜕x*h , y0 + 𝜕𝑓/𝜕y h )
          </td>
      </tr>
      <tr>
          <td>
              x = ${results.xValueOfGh}
          </td>
      </tr>
      <tr>
          <td>
              y = ${results.yValueOfGh}
          </td>
      </tr>
      <tr>
          <td>
             f(g(h)) = ${results.gh}
          </td>
      </tr>
      <tr>
          <td>
              f(g(h)) = ${results.ghAfterSimplify}
          </td>
      </tr>
      <tr>
          <th>
              let g\`(h) = 0
          </th>
      </tr>
      <tr>
          <td>
               g\`(h) = ${results.dgh}
          </td>
      </tr>
      <tr>
          <td>
               g\`(h) = 0 =>  ${results.eq}
          </td>
      </tr>
      <tr>
          <td>
               g\`(h) =  ${results.resultEquation}
          </td>
      </tr>
      <tr>
          <th>
              (𝑥, 𝑦) coordinates corresponding to this point h = ${results.resultEquation}
          </th>
      </tr>
      <tr>
          <td>
              x = ${results.newX}
          </td>
      </tr>
      <tr>
          <td>
              y = ${results.newY}
          </td>
      </tr>
  </tbody>
</table>
  `
  return htmlData
}

//!=========== CHAPTER 1 ======================
//! tested (working):
// export const calcBisectionOrFalsePos = (
//   xl,
//   xu,
//   targetErr,
//   { precision = 3, rounding = false, maxIter = null, bisection = false, falsePos = false }
// ) => {
//   let iter = 0,
//     currentErr = 100,
//     xr = 0,
//     xrOld = 0,
//     iterationsResults = []

//   if (f(xl) * f(xu) < 0) {
//     do {
//       xrOld = xr
//       if (bisection) xr = rounding ? roundNum((xl + xu) / 2, precision) : truncateNum((xl + xu) / 2, precision)
//       else if (falsePos)
//         xr = rounding
//           ? roundNum(xu - (f(xu) * (xl - xu)) / (f(xl) - f(xu)), precision)
//           : truncateNum(xu - (f(xu) * (xl - xu)) / (f(xl) - f(xu)), precision)

//       currentErr = rounding
//         ? roundNum(Math.abs((xr - xrOld) / xr) * 100, precision)
//         : truncateNum(Math.abs((xr - xrOld) / xr) * 100, precision)

//       iterationsResults.push({ i: iter, xl: xl, fxl: f(xl), xu: xu, fxu: f(xu), xr: xr, fxr: f(xr), err: iter == 0 ? '----' : currentErr })

//       if (f(xl) * f(xr) == 0) return iterationsResults
//       else if (f(xl) * f(xr) > 0) xl = xr
//       else if (f(xl) * f(xr) < 0) xu = xr

//       iter++
//     } while (maxIter ? iter < maxIter : currentErr >= targetErr)
//     return iterationsResults
//   } else {
//     return new Error("Root isn't in the interval")
//   }
// }

export const calcBisectionOrFalsePos = (
  xl,
  xu,
  targetErr,
  equation,
  { precision = 3, rounding = false, maxIter = null, bisection = false, falsePos = false }

) => {
  let iter = 0,
    currentErr = 100,
    xr = 0,
    xrOld = 0,
    iterationsResults = [],
    fxl,
    fxr,
    fxu
  console.log({ precision: precision, rounding: rounding, bisection: bisection, falsePos: falsePos });

  if (f(xl, equation) * f(xu, equation) < 0) {
    do {
      xrOld = xr
      if (rounding) {
        fxl = roundNum(f(xl, equation), precision)
        fxu = roundNum(f(xu, equation), precision)
      } else {
        fxl = truncateNum(f(xl, equation), precision)
        fxu = truncateNum(f(xu, equation), precision)
      }
      if (bisection)
        xr = rounding
          ? roundNum((xl + xu) / 2, precision)
          : truncateNum((xl + xu) / 2, precision);
      else if (falsePos)
        xr = rounding
          ? roundNum(xu - (fxu * (xl - xu)) / (fxl - fxu), precision)
          : truncateNum(xu - (fxu * (xl - xu)) / (fxl - fxu), precision);
      fxr = rounding
        ? roundNum(f(xr, equation), precision)
        : truncateNum(f(xr, equation), precision);
      currentErr = rounding
        ? roundNum(Math.abs((xr - xrOld) / xr) * 100, precision)
        : truncateNum(Math.abs((xr - xrOld) / xr) * 100, precision)
      iterationsResults.push({ i: iter, xl: xl, fxl: fxl, xu: xu, fxu: fxu, xr: xr, fxr: fxr, err: iter == 0 ? '----' : currentErr })

      if (fxl * fxr == 0) return iterationsResults
      else if (fxl * fxr > 0) xl = xr
      else if (fxl * fxr < 0) xu = xr
      iter++
      // console.log({ fxl: fxl, fxr: fxr, xr: xr, xl: xl, xu: xu });

    } while (maxIter ? iter < maxIter : currentErr >= targetErr)
    return iterationsResults
  } else {
    return new Error("Root isn't in the interval")
  }
}

//! tested -> working
// simple fixed point
export const calcSimplePoint = (x0, targetErr, equation, { precision = 3, rounding = false, maxIter = null }) => {
  let iter = 0,
    currentErr = 0,
    xi = x0, //start with x0 (initial point by the user)
    xiOld = 0,
    iterationsResults = []

  console.log("flag 1.1");

  do {
    currentErr = rounding
      ? roundNum(Math.abs((xi - xiOld) / xi) * 100, precision)
      : truncateNum(Math.abs((xi - xiOld) / xi) * 100, precision)
    //append every result to the result table:
    let fxi = rounding ? roundNum(f(xi, equation), precision) : truncateNum(f(xi, equation), precision)
    console.log("flag 1.2", currentErr, targetErr, maxIter);

    iterationsResults.push({ i: iter, xi: xi, fxi: fxi, err: iter == 0 ? '----' : currentErr })
    xiOld = xi
    xi = fxi
    iter++
  } while (maxIter ? iter < maxIter : currentErr >= targetErr)
  return iterationsResults
}
// npm init
//!  tested Working
// newton methon
export const calcNewton = (x0, targetErr, equation, { precision = 3, diff = null, rounding = false, maxIter = null }) => {
  let iter = 0,
    currentErr,
    xi,
    xiOld,
    fx,
    fxDash,
    iterationsResults = []
  // determine the derivative:
  xi = x0 //initial point by user.
  xiOld = 0
  do {
    currentErr = rounding
      ? roundNum(Math.abs((xi - xiOld) / xi) * 100, precision)
      : truncateNum(Math.abs((xi - xiOld) / xi) * 100, precision)
    fx = rounding ? roundNum(f(xi, equation), precision) : truncateNum(f(xi, equation), precision)
    fxDash = rounding ? roundNum(fd(xi, equation), precision) : truncateNum(fd(xi, equation), precision)
    //append every result to the result table:
    iterationsResults.push({ i: iter, xi: xi, fx: fx, fxDash: fxDash, err: iter == 0 ? '----' : currentErr })
    xiOld = xi
    xi = rounding ? roundNum(xi - fx / fxDash, precision) : truncateNum(xi - fx / fxDash, precision)
    iter++
  } while (maxIter ? iter < maxIter && currentErr > 0 : currentErr > targetErr)
  return iterationsResults
}

//! ===================CHAPTER 2 ===================

//? ===============Gauss-Jordan elimination ================
//! tested and working
export const calcGauss = (matrix) => {
  // calculate m21 and m31
  let m21 = matrix[1][0] / matrix[0][0], _m21 = matrix[1][0] + '/' + matrix[0][0],
    m31 = matrix[2][0] / matrix[0][0], _m31 = matrix[2][0] + '/' + matrix[0][0]
  // calculate new row 2
  let Row2 = []
  for (let i = 0; i < 4; i++) {
    Row2.push(matrix[1][i] - m21 * matrix[0][i])
  }
  // calculate new row 3
  let Row3 = []
  for (let i = 0; i < 4; i++) {
    Row3.push(matrix[2][i] - m31 * matrix[0][i])
  }
  // new matrix
  let matrixWithR2R3 = [matrix[0], Row2, Row3]
  // calculate m32
  let m32 = matrixWithR2R3[2][1] / matrixWithR2R3[1][1], _m32 = matrixWithR2R3[2][1] + '/' + matrixWithR2R3[1][1]
  // calculate new row 3
  let newRow3 = []
  for (let i = 0; i < 4; i++) {
    newRow3.push(matrixWithR2R3[2][i] - m32 * matrixWithR2R3[1][i])
  }
  let newMatrix = []
  newMatrix.push([matrixWithR2R3[0], matrixWithR2R3[1], newRow3])
  // back substitution
  let x3 = newRow3[3] / newRow3[2]
  let x2 = (matrixWithR2R3[1][3] - matrixWithR2R3[1][2] * x3) / matrixWithR2R3[1][1]
  let x1 = (matrixWithR2R3[0][3] - matrixWithR2R3[0][2] * x3 - matrixWithR2R3[0][1] * x2) / matrixWithR2R3[0][0]

  return {
    matrix: matrix,
    m21: m21,
    m31: m31,
    m21String: _m21,
    m31String: _m31,
    Row2: Row2,
    Row3: Row3,
    matrixWithR2R3: matrixWithR2R3,
    m32: m32,
    m32String: _m32,
    newRow3: newRow3,
    newMatrix: newMatrix,
    x3: x3,
    x2: x2,
    x1,
    x1,
  }
}

//? =================== LU ==================================
//! tested and working
export const calcLu = (matrix) => {
  // solve using gauss
  let gaussResult = gauss(matrix)
  // A matrix and B matrix
  let a = [
    [matrix[0][0], matrix[0][1], matrix[0][2]],
    [matrix[1][0], matrix[1][1], matrix[1][2]],
    [matrix[2][0], matrix[2][1], matrix[2][2]],
  ]
  let b = [matrix[0][3], matrix[1][3], matrix[2][3]]
  //calculate m21,m31,m32
  let m21 = gaussResult.m21
  let m31 = gaussResult.m31
  let m32 = gaussResult.m32
  // calculate lower matrix => L
  let lowerMatrix = [
    [1, 0, 0],
    [m21, 1, 0],
    [m31, m32, 1],
  ]
  // calculate upper matrix => U
  let upperMatrix = [
    [gaussResult.matrix[0][0], gaussResult.matrix[0][1], gaussResult.matrix[0][2]],
    [0, gaussResult.Row2[1], gaussResult.Row2[2]],
    [0, 0, gaussResult.newRow3[2]],
  ]
  // l.c = b  => calculate c values
  let c1 = b[0] / lowerMatrix[0][0]
  let c2 = (b[1] - lowerMatrix[1][0] * c1) / lowerMatrix[1][1]
  let c3 = b[2] - (lowerMatrix[2][0] * c1 + lowerMatrix[2][1] * c2) / lowerMatrix[2][2]
  // U.X=C
  let x3 = c3 / upperMatrix[2][2]
  let x2 = (c2 - upperMatrix[1][2] * x3) / upperMatrix[1][1]
  let x1 = c1 - (upperMatrix[0][1] * x2 + upperMatrix[0][2] * x3) / upperMatrix[0][0]
  return {
    c3: c3,
    c2: c2,
    c1: c1,
    x3: x3,
    x2: x2,
    x1: x1,
    a: a,
    b: b,
    lowerMatrix: lowerMatrix,
    upperMatrix: upperMatrix,
    m21: m21,
    m31: m31,
    m32: m32,
  }
}

//? ================== crammer ==============================
export const calcCrammer = (matrix) => {
  const a = [
    [matrix[0][0], matrix[0][1], matrix[0][2]],
    [matrix[1][0], matrix[1][1], matrix[1][2]],
    [matrix[2][0], matrix[2][1], matrix[2][2]],
  ]

  let b = [matrix[0][3], matrix[1][3], matrix[2][3]]
  // calculate det A
  let detA = truncateNum(det(a), 3)
  let detResult = []
  detResult.push({ a: a, b: b, detA: detA })
  // calculate det 1
  for (let m = 0; m < 3; m++) {
    let detm1 = [[], [], []]
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        detm1[i][j] = a[i][j]
      }
      for (let j = 0; j < 3; j++) {
        detm1[j][m] = b[j]
      }
    }
    let det = truncateNum(det(detm1), 3)
    detResult.push({ det: det, detMatrix: detm1 })
  }
  return detResult
}
//!====================CHAPTER 3 ====================
//!  tested --> Working
//golden section method
export const calcGoldenSection = (xl, xu, equation, { precision = 3, rounding = false, maxIter = 7 }) => {
  const constGoldenRatio = (Math.sqrt(5) - 1) / 2 // const of golden ratio
  let iter = 0,
    d,
    x1,
    x2,
    iterationsResults = []

  console.log(rounding);

  do {
    d = rounding ? roundNum(constGoldenRatio * (xu - xl), precision) : truncateNum(constGoldenRatio * (xu - xl), precision)
    x1 = rounding ? roundNum((xl + d), precision) : truncateNum((xl + d), precision)
    x2 = rounding ? roundNum(xu - d, precision) : truncateNum(xu - d, precision)
    let fxl, fxu, fx1, fx2
    if (rounding) {
      fxl = roundNum(f(xl, equation), precision)
      fxu = roundNum(f(xu, equation), precision)
      fx1 = roundNum(f(x1, equation), precision)
      fx2 = roundNum(f(x2, equation), precision)
    } else {
      fxl = truncateNum(f(xl, equation), precision)
      fxu = truncateNum(f(xu, equation), precision)
      fx1 = truncateNum(f(x1, equation), precision)
      fx2 = truncateNum(f(x2, equation), precision)
    }
    iterationsResults.push({ i: iter, xl: xl, fxl: fxl, xu: xu, fxu: fxu, d: d, x1: x1, fx1: fx1, x2: x2, fx2: fx2 })
    if (fx1 > fx2) {
      xl = x2
      x2 = x1
      // xu is the same
      x1 = rounding ? roundNum(xl + d, precision) : truncateNum(xl + d, precision)
    } else {
      // xl is the same
      xu = x1
      x1 = x2
      x2 = rounding ? roundNum(xu - d, precision) : truncateNum(xu - d, precision)
    }

    iter++
  } while (iter < maxIter)
  return iterationsResults
}

//! tested and working
//?  Gradent
export const maxAndMinFunction = (x, y, equation) => {
  // ? step 1 calculate df/fx
  console.log({ flag: "flag 2", equation: equation, x: x, y: y });

  let dfdx1 = derivative(equation, 'x').toString()
  let dfdy1 = derivative(equation, 'y').toString()
  // Gradient  = delta f = dfdx1 i + dfdy1 j => ∇𝑓 = 𝜕𝑓 𝑖 + 𝜕𝑓 𝑗
  let edfdx1 = eval(evaluate(dfdx1, { x: x, y: y }))
  let edfdy1 = eval(evaluate(dfdy1, { x: x, y: y }))
  let gradient = edfdx1 + ' i + ' + edfdy1 + ' j '
  //? step 2 The second partial derivatives can also be determined and evaluated at the optimum
  let d2fdx2 = eval(derivative(dfdx1, 'x').toString())
  let d2fdy2 = eval(derivative(dfdy1, 'y').toString())
  let d2fdxdy = eval(derivative(dfdx1, 'y').toString())
  let hessianMatrix = matrix([
    [d2fdx2, d2fdxdy],
    [d2fdxdy, d2fdy2],
  ])

  let detHessianMatrix = eval(det(hessianMatrix))
  let hessianMatrixArray = [
    [d2fdx2, d2fdxdy],
    [d2fdxdy, d2fdy2],
  ];

  if (detHessianMatrix == 0) {
    console.log('saddle point')
    return {
      dfdx1: dfdx1,
      dfdy1: dfdy1,
      edfdx1: edfdx1,
      edfdy1: edfdy1,
      gradient: gradient,
      d2fdx2: d2fdx2,
      d2fdy2: d2fdy2,
      d2fdxdy: d2fdxdy,
      hessianMatrix: hessianMatrixArray,
      detHessianMatrix: detHessianMatrix,
      saddelPoint: true,
    }

    //! stop
  }
  console.log("flag 3");

  //? g(h) = (x0 +𝜕𝑓 h , y0 + 𝜕𝑓 h ) => get value of h
  let xValueOfGh = x + '+' + edfdx1.toString() + 'h'
  let yValueOfGh = y + '+' + edfdy1 + 'h'
  let gh = equation.replace(/x/g, '(' + xValueOfGh + ')')
  gh = gh.replace(/y/g, '(' + yValueOfGh + ')')
  let ghAfterSimplify = rationalize(gh).toString()
  //! turn simplify off to run with all equation
  let dgh = derivative(ghAfterSimplify, 'h', { simplify: false }).toString()
  var expr = new parse(dgh)
  var eq = new Equation(expr, 0)
  let resultEquation = eval(eq.solveFor('h').toString())
  let newX = truncateNum(evaluate(xValueOfGh, { h: resultEquation }), 4)
  let newY = truncateNum(evaluate(yValueOfGh, { h: resultEquation }), 4)
  console.log({ x: newX, y: newY })
  console.log("flag 4");

  return {
    saddelPoint: false,
    dfdx1: dfdx1,
    dfdy1: dfdy1,
    edfdx1: edfdx1,
    edfdy1: edfdy1,
    gradient: gradient,
    d2fdx2: d2fdx2,
    d2fdy2: d2fdy2,
    d2fdxdy: d2fdxdy,
    hessianMatrix: hessianMatrixArray,
    detHessianMatrix: detHessianMatrix,
    xValueOfGh: xValueOfGh,
    yValueOfGh: yValueOfGh,
    gh: gh,
    ghAfterSimplify: ghAfterSimplify,
    dgh: dgh,
    eq: eq.toString(),
    resultEquation: resultEquation,
    newX: newX,
    newY: newY,
  }
}



//? to help
const a = (rows, cols) => {
  var array = new Array(rows)
  for (var i = 0; i < array.length; i++) {
    array[i] = new Array(cols)
  }
  return array
}