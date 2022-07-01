import { MONTHS, URL } from "./vars.js"
import { jsDateFromInput, parseDateFormated, getShortBody } from './helpers.js'
import { useSetDynamicHeaderHeight } from "./useSetDynamicHeaderHeight.js"
import { useArticleFiltersSticky } from "./useArticleFiltersSticky.js"
import { useSliderLogic } from "./useSliderLogic.js"


export async function fetchArticles(url) {
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

  const dateElem = document.createElement('time')
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
  authorElem.innerHTML = author || 'подробнее'
  authorElem.classList.add('article-card__author')
  authorElem.classList.add('btn-blue')

  articleCard.append(dateElem)
  articleCard.append(titleLinkElem)
  articleCard.append(bodyElem)
  articleCard.append(authorElem)
  return articleCard
}


window.onload = function () {
  fetchArticles(URL)
  useSliderLogic()
  useSetDynamicHeaderHeight()
  useArticleFiltersSticky()
}

