require('./js/determineInitialStyle')
require('./js/mathjax-config')
require('./js/methodSwitching')
require('./js/customFieldValidation')
require('./js/calcBtnAnimation')
import $ from 'jquery'

import {
  calcCrammer,
  calcBisectionOrFalsePos,
  calcLu,
  calcGauss,
  maxAndMinFunction,
  calcNewton,
  calcSimplePoint,
  resultsToTable,
  calcGoldenSection,
  hessianToResult,
} from './js/newMath'

//!==========Input==========!// ============> joo
const methods = {
  bisection: true, //default selected method (will be changed in run time)
  simpleFixed: false,
  falsePosition: false,
  newton: false,
  gauss: false,
  lu: false,
  crammer: false,
  golden: false,
  hessian: false,
}

// equ & diff input:
const equInput = $('#math-input')
const diffInput = $('#diff-input')

// bisection & falsePos only & golden section :
const xl = $('#xl')
const xu = $('#xu')

// simple fixed & newton only:
const x0 = $('#x0')

// hessian only:
const x = $('#x')
const y = $('#y')

// In all Equation based methods (not matrix):
const err = $('#err') //not in hessian
const maxIter = $('#maxIter')
const precision = $('#precision')
const rounding = $('#rounding')

const resultsDiv = $('.results-div')
const calcBtn = $('.calc-btn')

const bisectionAndFalseHeader = [
  '`i`',
  '`x_{xl}`',
  '`f(x_{l})`',
  '`x_{u}`',
  '`f(x_{u})`',
  '`x_{r}`',
  '`f(x_{r})`',
  '`varepsilon_{e}`',
]
const simpleFixedHeader = ['`i`', '`x_{i}`', '`f(x_{i})`', '`varepsilon_{e}`']
const newtonHeader = ['`i`', '`x_{i}`', '`f(x_{i})`', "`f'(x_{i})`", '`varepsilon_{e}`']
const goldenHeader = [
  '`i`',
  '`x_{xl}`',
  '`f(x_{l})`',
  '`x_{u}`',
  '`f(x_{u})`',
  '`d`',
  '`x_{1}`',
  '`f(x_{1})`',
  '`x_{2}`',
  '`f(x_{2})`',
]

$(document).ready(() => {
  $('#choose-a-method-form').delegate('input', 'change', event => {
    // Change Active method to the selected one:
    for (const method in methods) {
      if (method != event.target.id) methods[method] = false
      else methods[method] = true
    }
  })
})

$(window).on('load', () => {
  calcBtn.on('click', event => {
    event.preventDefault()
    // making sure that result div is empty:
    resultsDiv.html('')
    if (methods.bisection) bisectionOrFalsePos({ bisection: true })
    else if (methods.falsePosition) bisectionOrFalsePos({ falsePos: true })
    else if (methods.simpleFixed) simpleFixed({})
    else if (methods.newton) newton()
    else if (methods.gauss) gauss()
    else if (methods.lu) lu()
    else if (methods.crammer) crammer()
    else if (methods.golden) goldenSec()
    else if (methods.hessian) hessian()
  })
})

const bisectionOrFalsePos = ({ bisection = true, falsePos = false }) => {
  const results = calcBisectionOrFalsePos(
    parseFloat(eval(eval(xl.val()))),
    parseFloat(eval(xu.val())),
    parseFloat(eval(err.val())),
    equInput.val(),
    {
      maxIter: parseInt(maxIter.val()),
      precision: precision.val() == '' ? 3 : precision.val(),
      rounding: true, //rounding.val(),
      bisection: bisection,
      falsePos: falsePos,
    }
  )
  console.log('results:', results)
  const resultsTable = resultsToTable({
    results: results,
    customHeader: bisectionAndFalseHeader,
  })
  resultsDiv.append(resultsTable)
  MathJax.typesetClear()
  MathJax.typeset()
}

const simpleFixed = ({ rounding = 3, maxIter = null }) => {
  console.log('flag 1')

  const results = calcSimplePoint(parseFloat(eval(x0.val())), err.val(), equInput.val(), {
    precision: parseInt(precision.val()),
    rounding: rounding,
    maxIter: maxIter,
  })
  console.log('flag 2')

  console.log('results:', results)
  const resultsTable = resultsToTable({
    results: results,
    customHeader: simpleFixedHeader,
  })
  resultsDiv.append(resultsTable)
  MathJax.typesetClear()
  MathJax.typeset()
}

const newton = () => {
  const results = calcNewton(
    parseFloat(eval(x0.val())),
    parseFloat(eval(err.val())),
    equInput.val(),
    {
      precision: parseInt(precision.val()),
      rounding: rounding.val(),
      maxIter: parseInt(maxIter.val()),
      diff: diffInput.val(),
    }
  )
  console.log('results:', results)
  const resultsTable = resultsToTable({ results: results, customHeader: newtonHeader })
  resultsDiv.append(resultsTable)
  MathJax.typesetClear()
  MathJax.typeset()
}

const goldenSec = () => {
  const results = calcGoldenSection(
    parseFloat(eval(xl.val())),
    parseFloat(eval(xu.val())),
    equInput.val(),
    {
      precision: parseInt(precision.val()),
      rounding: rounding.val(),
      maxIter: parseInt(maxIter.val()),
    }
  )
  console.log('results:', results)
  const resultsTable = resultsToTable({ results: results, customHeader: goldenHeader })
  resultsDiv.append(resultsTable)
  MathJax.typesetClear()
  MathJax.typeset()
}

const gauss = () => {
  const matrix = getInputMat()
  const results = calcGauss(matrix)
  console.log(results)
}

const lu = () => {
  const matrix = getInputMat()
  const results = calcLu(matrix)
  console.log(results)
}

const crammer = () => {
  const matrix = getInputMat()
  const results = calcCrammer(matrix)
  console.log(results)
}

const hessian = () => {
  const results = maxAndMinFunction(
    parseFloat(eval(x.val())),
    parseFloat(eval(y.val())),
    equInput.val()
  )
  let data = hessianToResult({ results })
  resultsDiv.append(data)
  console.log(results)
}

//!==> Helper Functions:
// create a Dynamic 2D array
function a(rows, cols) {
  var array = new Array(rows)
  for (var i = 0; i < array.length; i++) {
    array[i] = new Array(cols)
  }
  return array
}

//get matrix user Input
const getInputMat = () => {
  const in_matrix = a(3, 4) //3 rows, 4 cols
  // row 1:
  in_matrix[0][0] = parseFloat(eval(document.getElementById('a1').value))
  in_matrix[0][1] = parseFloat(eval(document.getElementById('a2').value))
  in_matrix[0][2] = parseFloat(eval(document.getElementById('a3').value))
  in_matrix[0][3] = parseFloat(eval(document.getElementById('x1').value))

  // row 2:
  in_matrix[1][0] = parseFloat(eval(document.getElementById('b1').value))
  in_matrix[1][1] = parseFloat(eval(document.getElementById('b2').value))
  in_matrix[1][2] = parseFloat(eval(document.getElementById('b3').value))
  in_matrix[1][3] = parseFloat(eval(document.getElementById('x2').value))

  // row 3:
  in_matrix[2][0] = parseFloat(eval(document.getElementById('c1').value))
  in_matrix[2][1] = parseFloat(eval(document.getElementById('c2').value))
  in_matrix[2][2] = parseFloat(eval(document.getElementById('c3').value))
  in_matrix[2][3] = parseFloat(eval(document.getElementById('x3').value))

  return in_matrix
}
