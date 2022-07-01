// import {parseDateFormated} from './helpers.js'
const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

function jsDateFromInput(dateStr) {
  const dateArgs = dateStr.split('-')
  dateArgs[1]--
  return new Date(...dateArgs)
}

function parseDateFormated(dateStr) {
  const dateJS = new Date(dateStr)

  const date = dateJS.getDate()
  const month = MONTHS[dateJS.getMonth()]
  const year = dateJS.getFullYear()

  return [date, month, year].join(' ')
}

function getShortBody(bodyText) {
  const isTooLongText = bodyText.match('...')
  if (isTooLongText) {
    let firstPart = bodyText.split('[+')[0]
    return typeof firstPart === 'string' ? firstPart : firstPart[0]
  }
  return bodyText
}

// ======================================================

function useHeaderHeight() {
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
// ======================================================
function useArticleFiltersSticky() {
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
// ======================================================
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

// ======================================================

const URL = 'https://mocki.io/v1/a5814d24-4e22-49fc-96d1-0e9ae2952afc'

async function fetchArticles(url) {
  const res = await fetch(url).then(r => r.json() )
  const articles = res.articles
  model.setData('articles', articles)
}

const model = {
  articles: [],
  get articlesFiltered() {
    return this.filterQueries.author === 'Все' 
      ? this.articles 
      : this.articles.filter(isPassedFilters)
  },

  get authorsList() {
    const authors = [...this.articles.reduce((authors, article) => authors.add(article.author), new Set(['Все']) )]
    return authors.filter(author => author) // defined only
  },

  filterQueries: {
    author: null,
    dateTo: null,
    dateFrom: null,
  },
  setData(prop, value) {
    this[prop] = value
    updateDomArticles()
    updateDomFilterAuthor()
  },
  
}

// dom authorFilter
const formElems = document.querySelector('.form').elements
const authorSelect = formElems.author
const dateFromInput = formElems.dateFrom
const dateToInput = formElems.dateTo

for (const formElem of formElems) {
  formElem.addEventListener('change', onFilterChange)
}

function onFilterChange(event) {
  const target = event.target
  const value = target.name.includes('date')
    ? jsDateFromInput(target.value) : target.options[target.selectedIndex].value

  model.filterQueries[target.name] = value
  updatePlaceholder(target)
  updateDomFilterAuthor()
  updateDomArticles()
}





function isPassedFilters(article) {
  const articleDate = new Date(article.publishedAt)
  if (model.filterQueries.author && article.author !== model.filterQueries.author) return false
  if (model.filterQueries.dateFrom && articleDate < model.filterQueries.dateFrom) return false
  if (model.filterQueries.dateTo && articleDate > model.filterQueries.dateTo) return false
  return true
}

function updatePlaceholder(input) {
  if (input.tagName === "SELECT") return
  const placeholder = input.nextElementSibling
  const formatedValue = input.value.split('-').reverse().join('.')
  placeholder.value = formatedValue
}

function updateDomFilterAuthor() {
  const optionElems = model.authorsList.map((author) => createOptionElement(author) )
  if (!optionElems) throw new Error('There are no new Articles!')
  optionElems.forEach((authorElem) => authorSelect.append(authorElem) )
}

function createOptionElement(author) {
  const optionElem = document.createElement('option')
  optionElem.className = 'articles-filters__author-filter-option'
  optionElem.innerHTML = author
  optionElem.value = author
  return optionElem
}



// dom articles
function updateDomArticles() {
  const articlesContainer = document.querySelector('.articles__cards')
  const articlesUpdated = model.articlesFiltered.map((articleData) => getArticleElem(articleData) )
  if (!articlesUpdated) throw new Error('There are no new Articles!')
  articlesContainer.innerHTML = ''
  articlesUpdated.forEach((articleCard) => articlesContainer.append(articleCard) )
}

function getArticleElem(articleData) {
  let {
    title,
    content: body,
    author,
    publishedAt: date,
  } = articleData

  body = getShortBody(body)
  date = parseDateFormated(date)

  return createArticleElem(title, body, author, date)
}

function createArticleElem(title, body, author, date) {
  const articleCard = document.createElement('article')
  articleCard.classList.add('article-card')

  const dateElem = document.createElement('div')
  dateElem.innerHTML = date
  dateElem.classList.add('article-card__date')
  const titleElem = document.createElement('h3')
  titleElem.innerHTML = title
  titleElem.classList.add('article-card__title')
  const titleLinkElem = document.createElement('a')
  titleLinkElem.href = '#'
  titleLinkElem.append(titleElem)
  titleLinkElem.classList.add('link')
  const bodyElem = document.createElement('div')
  bodyElem.innerHTML = body
  bodyElem.classList.add('article-card__body')
  const authorElem = document.createElement('button')
  authorElem.innerHTML = author
  authorElem.classList.add('article-card__author')
  authorElem.classList.add('btn-blue')

  articleCard.append(dateElem)
  articleCard.append(titleLinkElem)
  articleCard.append(bodyElem)
  articleCard.append(authorElem)
  return articleCard
}


/*
  Model
  Model-API (setData)

  View
  updateView(Model, DOM)

  Model-View connection (model.onUpdate = updateView() )


  filters(Model)
  ParseViewFilterQueries(DOM.events)
  
*/ 



window.onload = function () {
  fetchArticles(URL)
  useHeaderHeight()
  useArticleFiltersSticky()
}
