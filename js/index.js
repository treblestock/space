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
    updateDomPosts() 
  },
  // !TEST (works)
  // _add() {
  //   this.articles.push(this.articles[0])
  //   updateDomPosts()
  // },
  // _remove() {
  //   this.articles = this.articles.slice(17)
  //   updateDomPosts()
  //   setTimeout( () => this._add(), 1000)
  // },
}


function updateDomPosts() {
  const postsContainer = document.querySelector('.posts')
  const postsUpdated = getPosts(model.articles)
  if (!postsUpdated) throw new Error('There are no new Posts!')
  postsContainer.innerHTML = ''
  postsUpdated.forEach((postElem) => postsContainer.append(postElem) )
}

function getPosts(articles) {
  return articles.map((articleData) => getPost(articleData) )
}

function getPost(articleData) {
  let {
    title,
    content: body,
    author,
    publishedAt: date,
  } = articleData

  body = getShortBody(body)
  date = parseDateFormated(date)

  return createPost(title, body, author, date)
}

function createPost(title, body, author, date) {
  const postElem = document.createElement('div')
  postElem.classList.add('post')

  const dateElem = document.createElement('div')
  dateElem.innerHTML = date
  dateElem.classList.add('post__date')
  const titleElem = document.createElement('h3')
  titleElem.innerHTML = title
  titleElem.classList.add('post__title')
  const bodyElem = document.createElement('div')
  bodyElem.innerHTML = body
  bodyElem.classList.add('post__body')
  const authorElem = document.createElement('button')
  authorElem.innerHTML = author
  authorElem.classList.add('post__date')
  authorElem.classList.add('btn-blue')

  postElem.append(dateElem)
  postElem.append(titleElem)
  postElem.append(bodyElem)
  postElem.append(authorElem)
  return postElem
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




window.onload = fetchArticles.bind(null, URL)