import { post } from "./ajax"

const urlPrefix = '/api/article'


export function addArticle(params:any): any {
  const url = urlPrefix + '/add'
  return post(url, params, {
    successMsg: '文章发布成功'
  })
}
