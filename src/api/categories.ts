import { get, post } from "./ajax"

const urlPrefix = '/api/categories'

export function getList(): any {
  const url = urlPrefix + '/getList'
  return get(url)
}

export interface ICategories {
  id: string;
  name: string;
  parentId?: string;
}

export function addByParentId(name:string, id:string): any {
  const url = urlPrefix + '/add'
  return post(url, {
    parentId: id,
    name,
  }, {
    successMsg: '新增分类成功'
  })
}

export function deleteAllById(id:string): any {
  const url = urlPrefix + '/delete'
  return post(url, {
    id
  }, {
    successMsg: '删除分类成功'
  })
}