import $ from 'jquery'

$(window).on('load', () => {
  //?== Animation divs ==?//
  const equInputDiv = $('.equation-input-div') //for animation (slideUp,Down)
  const matrixInputDiv = $('.matrix-input-div') //for animation (slideUp,Down)
  const resultsCard = $('#results-card') //to hide results when method is changed
  const equPreview = $('#math-preview') //to be cleared when  method is changed
  const diffPreview = $('#diff-preview') //to be cleared when method is changed

  //?== Optional fields ==?//
  const equationCard = $('#equation-card')
  const err = $('#err') //to allow optional fields to be empty
  const maxIter = $('#maxIter') //to allow optional fields to be empty
  const diffInput = $('#diff-input') //to allow optional fields to be empty
  const calcBtn = $('.calc-btn')
  const precision = $('#precision')
  const rounding = $('#rounding')
  const resultsDiv = $('.results-div')
  const resultsProgressBar = $('.results-progress-bar')
  calcBtn.on('click', (event) => calcBtnAnimation(event))

  function calcBtnAnimation(event) {
    console.log('flag1')

    event.preventDefault() //prevent page from submitting and refresh

    if (isHidden(resultsCard)) {
      //?==> if calcBTN is clicked for the first time, do:
      resultsCard.slideDown() //animate card to slide

      // scroll to the result:
      scrollToTopOf(resultsCard)

      // setTimeout: wait for 2000ms then execute function:
      setTimeout(function () {
        resultsProgressBar.hide(0) // 0 ms animation time
        resultsDiv.slideDown()
        // resultsBtnContainer.slideDown()
        scrollToTopOf(resultsCard)
      }, 2000)
    } else {
      //?==> if the user pressed the button before:
      // resultsBtnContainer.slideUp()
      //slide up then scroll:
      resultsDiv.slideUp(400, function () {
        scrollToTopOf(resultsCard)
      })
      resultsProgressBar.show(0)

      setTimeout(function () {
        resultsProgressBar.hide(0)
        resultsDiv.slideDown()
        resultsBtnContainer.slideDown()
        scrollToTopOf(resultsCard)
      }, 2300)
    }
  }
  function scrollToTopOf(elementTarget, animationTime = 600) {
    $('body, html').animate(
      {
        scrollTop: $(elementTarget).offset().top,
      },
      animationTime
    )
  }

  //===> check if an HTML element is hidden
  function isHidden(elementTarget) {
    if (elementTarget.is(':hidden')) {
      return true
    }
  }
})
