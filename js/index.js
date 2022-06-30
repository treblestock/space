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
const sliders = document.querySelectorAll('.slider')
const sliderItemsContainerClassName = 'slider__content'
const sliderBtnClassName = 'slider-btn'
const sliderPageClassName = 'slider-page'

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
    // a weak place: if there is a wrapper for paggination-item 
    // (for example we use pictures as pagination-items)
    // we will always have 0, so we should find paggination-container exactly

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

  filterQueryAuthor: null,
  filterQueryDateFrom: null,
  filterQueryDateTo: null,

  setData(prop, value) {

    this[prop] = value
    updateDomArticles() 
  },
  // !TEST (works)
  // _add() {
  //   this.articles.push(this.articles[0])
  //   updateDomArticles()
  // },
  // _remove() {
  //   this.articles = this.articles.slice(17)
  //   updateDomArticles()
  //   setTimeout( () => this._add(), 1000)
  // },
}


function updateDomArticles() {
  const articlesContainer = document.querySelector('.articles__cards')
  const articlesUpdated = getArticles(model.articles)
  if (!articlesUpdated) throw new Error('There are no new Articles!')
  articlesContainer.innerHTML = ''
  articlesUpdated.forEach((articleCard) => articlesContainer.append(articleCard) )
}

function getArticles(articles) {
  return articles.map((articleData) => getArticle(articleData) )
}

function getArticle(articleData) {
  let {
    title,
    content: body,
    author,
    publishedAt: date,
  } = articleData

  body = getShortBody(body)
  date = parseDateFormated(date)

  return createArticle(title, body, author, date)
}

function createArticle(title, body, author, date) {
  const articleCard = document.createElement('div')
  articleCard.classList.add('article-card')

  const dateElem = document.createElement('div')
  dateElem.innerHTML = date
  dateElem.classList.add('article-card__date')
  const titleElem = document.createElement('h3')
  titleElem.innerHTML = title
  titleElem.classList.add('article-card__title')
  const titleLinkElem = document.createElement('h3')
  titleLinkElem.innerHTML = titleElem
  titleLinkElem.classList.add('link')
  const bodyElem = document.createElement('div')
  bodyElem.innerHTML = body
  bodyElem.classList.add('article-card__body')
  const authorElem = document.createElement('button')
  authorElem.innerHTML = author
  authorElem.classList.add('article-card__date')
  authorElem.classList.add('btn-blue')

  articleCard.append(dateElem)
  articleCard.append(titleElem)
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
}
