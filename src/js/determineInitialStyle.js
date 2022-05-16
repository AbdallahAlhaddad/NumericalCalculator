import $ from 'jquery'
// const isMobile = require('./isMobileBrowser')()

//===>load animation cycle between the two cards:
let loadingPageAnimation

//===> "equation card" components:
let equationCard

//===> "results card" components:
let resultsCard

let resultsDiv //results table
let resultsBtnContainer
let pcDownloadBtn

// //====> mobile buttons:
// let mobBMenuBtn //main Button for mobiles only (inserted after the 'results' table)
// let mobRotateBtn //part of menu btn
// let mobLandscapeDownloadBtn //used instead of menu btn if mobile is in landscape mode

$(window).on('load', function () {
  loadDomElements() //==> load DOM Elements
  // determineWebsiteStyle() //==>if mobile then add its elements and custom style
  loadingPageAnimation.hide(0) //==> hide website is loading cycle
  equationCard.slideDown(700) //==> To fix "equation shows before MathJax rendering"
})

//===> Puts DOM elements in variables
function loadDomElements() {
  //==> the loading cycle between the two cards
  loadingPageAnimation = $('.pageLoadAnimation')

  //===> "equation card" components:
  equationCard = $('#equation-card')
  resultsDiv = $('results-div')

  //===> "results card" components:
  resultsCard = $('#results-card') // the results card

  resultsBtnContainer = $('.results-buttons-container')
  // pcDownloadBtn = $(
  //   '<div class="col s12 center-align pc-download-btn"> <a class="waves-effect waves-light btn"><i class="material-icons right">file_download</i>Download</a> </div>'
  // )
  //?====> mobile buttons:
  // mobBMenuBtn = $(
  //   '<div class="menu-btn-div fixed-action-btn" style="position: absolute; right: 24px;"> <a class="menu-btn btn-floating btn-large lighten-2 pulse"> <i class="large material-icons">menu</i> </a> <ul> <li> <a class="download-btn btn-floating light-blue darken-2"><i class="material-icons">file_download</i></a> </li><li> <a class="rotate-btn btn-floating deep-orange lighten-1 pulse"><i class="material-icons">screen_rotation</i></a> </li></ul> </div>'
  // ) //main Button for mobiles only (inserted after the 'results' table)
  // mobRotateBtn = $('.rotate-btn') //part of menu btn
  // // mobDownloadBtn = $('.download-btn') //part of menu btn
  // mobLandscapeDownloadBtn = $(
  //   '<a style="display: none;" class="download-btn btn-floating btn-large lighten-2"><i class="material-icons">file_download</i></a>'
  // ) //used instead of menu btn if mobile is in landscape mode
}

//==> mobile style or pc style?:
// function determineWebsiteStyle() {
//   if (isMobile) {
//     //!===> 1. append mobile buttons & make table responsive:
//     let orn = getOrientation()
//     if (orn == 'portrait-primary' || 'portrait-secondary') {
//       resultsDiv.addClass('responsive-table') //make table responsive
//       mobBMenuBtn.appendTo(resultsBtnContainer) //add change menu btn (contain 'pdf download' and 'screen rotation')
//       mobLandscapeDownloadBtn.appendTo(resultsBtnContainer) //(hidden) (take menu btn place in landscape mode)

//       mobRotateBtn = $('.rotate-btn')
//       mobBMenuBtn.show(0)
//     }

//     //!====> 2. init floating btn (materialize):
//     var elems = document.querySelectorAll('.fixed-action-btn')
//     var instances = M.FloatingActionButton.init(elems, {
//       direction: 'left',
//       hoverEnabled: false,
//     })

//     $('.fixed-action-btn').on('click', function () {
//       if ($('.menu-btn').hasClass('pulse')) {
//         $('.menu-btn').removeClass('pulse')
//       } else {
//         $('.menu-btn').addClass('pulse')
//       }
//     })

//     //!====> 3. Add Event listeners for mobile only:
//     $(window).on('orientationchange', changeMobResultsStylingOnOrientation)
//     mobRotateBtn.on('click', rotateScreenUsingBtn)

//     //!====> 4. device orientation auto handling (requires https)   //TODO: make it work
//     if (window.DeviceOrientationEvent) {
//       window.addEventListener(
//         'deviceorientation',
//         function (event) {
//           // alpha: rotation around z-axis
//           var rotateDegrees = event.alpha
//           // gamma: left to right
//           var leftToRight = event.gamma
//           // beta: front back motion
//           var frontToBack = event.beta

//           handleOrientationEvent(frontToBack, leftToRight, rotateDegrees)
//         },
//         true
//       )
//     }
//     var handleOrientationEvent = function (frontToBack, leftToRight, rotateDegrees) {}
//   } else {
//     pcDownloadBtn.appendTo(resultsBtnContainer)
//   }
// }
//!==================== helper functions (called when needed) ====================!//

//==> check device orientation:
function getOrientation() {
  let _orn = screen.msOrientation || (screen.orientation || screen.mozOrientation).type
  return _orn
}

//==> enter fullscreen mode:
function fullScreen() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen()
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen()
  } else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen()
  } else if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen()
  }
}

//==> exit fullscreen mode:
function smolScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
}

//==> rotate the mobile screen using the 'rotateBTN':
function rotateScreenUsingBtn() {
  let orientation = getOrientation()
  //!==> document.fullscreenElement ->return true if fullscreen, if not then return null.
  if (
    orientation == ('portrait-primary' || 'portrait-secondary') &&
    document.fullscreenElement === null
  ) {
    if (document.fullscreenEnabled) {
      fullScreen()
      screen.orientation.lock('landscape-primary')
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: "Your browser version doesn't support screen rotation using this button. for better experience, please rotate your device manually.",
        confirmButtonColor: '#26a69a',
      })
    }
  }
  //==> if in fullscreen (locked to landscape) --> return to portrait then exit fullscreen
  if (document.fullscreenElement != null) {
    screen.orientation.lock('portrait-primary')
    smolScreen()
  }

  //==> scroll to results section:
  scrollToTopOf(resultsCard)
}
