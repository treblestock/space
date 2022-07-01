export function useSetDynamicHeaderHeight() {
  const resizeObserver = new ResizeObserver((entries) => {
    const target = entries[0].target
    const headerHeight = getComputedStyle(target).height
    document.documentElement.style.setProperty('--header-height', headerHeight)
  })
  
  function setHeaderHeightVar() {
    const header = document.querySelector('.header__section')
    const headerHeight = getComputedStyle(header).height
    document.documentElement.style.setProperty('--header-height', headerHeight)
    resizeObserver.observe(header)
  }

  setHeaderHeightVar()
}

export function useArticleFiltersSticky() {
  const articleFilters = document.querySelector('.articles__filters-toolbar')
  const filtersHeight = getComputedStyle(articleFilters).height
  document.documentElement.style.setProperty('--filter-height', filtersHeight)
  window.onscroll = () => {
    const scrollTop = document.documentElement.scrollTop
    const offsetHeight = document.documentElement.offsetHeight
    const headerHeight = parseInt(document.documentElement.style.getPropertyValue('--header-height'))
    if (scrollTop > offsetHeight - headerHeight) {
      articleFilters.classList.add('articles__filters-toolbar_fixed')
    } else {
      articleFilters.classList.remove('articles__filters-toolbar_fixed')
    }
  }
}