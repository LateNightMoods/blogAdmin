import { get } from "./ajax"

const urlPrefix = '/api/tags'

export interface ITag {
  id: string;
  name: string;
}

export function getList(): any {
  const url = urlPrefix + '/getList'
  return get(url)
}
