import { URL } from "./vars.js"

export async function fetchArticles(url) {
  const res = await fetch(url).then(r => r.json() )
  const articles = res.articles
  model.setData('articles', articles)
}