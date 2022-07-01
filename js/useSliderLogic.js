export function useSliderLogic() {
  const sliders = document.querySelectorAll('.slider')
  const sliderItemsContainerClassName = 'slider__content'
  const sliderBtnClassName = 'slider__btn'
  const sliderPageClassName = 'slider__page'

  for (const slider of sliders) {  
    let activeIndex = 0
    slider.addEventListener('click', (event) => {
      const target = event.target
      if (!target.classList.contains(sliderBtnClassName)
          && !target.classList.contains(sliderPageClassName) ) return
      const sliderPages = [...slider.querySelectorAll('.' + sliderPageClassName)]
      const slidesContainer = slider.querySelector('.' + sliderItemsContainerClassName)
      const slideWidth = window.getComputedStyle(slidesContainer).width


      activeIndex = getNewActiveIndex(target, activeIndex, sliderPages.length)    

      ;[...slider.querySelectorAll('._active')].forEach(item => item.classList.remove('_active') )
      shiftSlides(slideWidth, slidesContainer, activeIndex)
      sliderPages[activeIndex].classList.add('_active')
    })
  }

  function shiftSlides(slideWidth, slidesContainer, activeIndex) {
    slidesContainer.style.transform = `translateX(-${Number.parseFloat(slideWidth) * activeIndex}px)`
  }
  
  function getNewActiveIndex(target, activeIndex, itemsCount) {
    if (target.classList.contains(sliderBtnClassName) ) {
      return target.classList.contains('right') 
      ? (activeIndex + 1) % itemsCount 
      : activeIndex - 1 < 0
        ? itemsCount - 1
        : activeIndex - 1
    }
    return [...target.parentElement.children].indexOf(target)
  }
  
}