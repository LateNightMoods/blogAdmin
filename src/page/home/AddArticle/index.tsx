import { Button, Cascader, Input, Select } from "antd";
import { CascaderOptionType } from "antd/lib/cascader";
import React, { useEffect, useReducer, useState } from "react";
import MarkedEditor from 'sheep-markdown-editor-rc';
import styled from "styled-components";
import { addArticle } from "../../../api/article";
import { getList, ICategories } from "../../../api/categories";
import { getList as getTagsList, ITag } from "../../../api/tags";

const { Option } = Select;

const StyMain = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  .operate-wrap {
    flex-shrink: 0;
  }
  & > div:not(.operate-wrap) {
    flex: 1;
  }
  overflow: hidden;
`

interface IForm {
  categoryId: string;
  tags: string[];
  title: string;
  md: string;
}
const initialForm:IForm = {
  categoryId: '',
  tags: [],
  title: '',
  md: '',
}

export default function() {
  const { cascaderOptions } = useGetCategories()
  const { tags } = useGetTags()
  const [form, dispatchForm] = useReducer((state:IForm, { type, value }: { type: string, value?: any }) => {
    if (!type) {
      return {
        ...initialForm
      }
    }
    return {
      ...state,
      [type]: value
    }
  }, initialForm)

  const handlePublish = async () => {
    await addArticle(form)
    dispatchForm({ type: '' })
  }

  return (
    <StyMain>
      <div className="operate-wrap">
        <Input.Group compact>
          <Cascader
            placeholder="分类"
            changeOnSelect
            value={[form.categoryId]}
            onChange={(value) => dispatchForm({ type: 'categoryId', value: value.length ? value[0] : '' })}
            options={cascaderOptions}
            expandTrigger="hover"
          />
          <Select
            showSearch
            style={{ width: '20%' }}
            placeholder="标签"
            optionFilterProp="children"
            mode="tags"
            value={form.tags}
            onChange={(value) => dispatchForm({ type: 'tags', value })}
            filterOption={(input, option) =>
              option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {tags.map(item => (
              <Option key={item.id} value={item.id}>{ item.name }</Option>
            ))}
          </Select>
          <Input style={{ width: '30%' }} value={form.title} onChange={(e) => dispatchForm({ type: 'title', value: e.target.value })} placeholder="标题" />
          <Button type="primary" onClick={handlePublish}>发布</Button>
        </Input.Group><br />
      </div>
      <MarkedEditor onChange={value => dispatchForm({ type: 'md', value })} />
    </StyMain>
  )
}

function useGetCategories() {
  const [cascaderOptions, setCascaderOptions] = useState<CascaderOptionType[]>([])

  const getCascaderDataByCategories = (cascaderOption: CascaderOptionType[], datas: ICategories[]) => {
    cascaderOption.forEach(item => {
      item.children = datas.filter(son => son.parentId == item.value).map(dataItem => ({
        label: dataItem.name,
        value: dataItem.id,
        children: []
      }))
      if (item.children.length) {
        getCascaderDataByCategories(item.children, datas)
      }
    })
  }

  useEffect(() => {
    getList().then((res: ICategories[]) => {
      const result = res.filter(son => son.parentId == '').map(dataItem => ({
        label: dataItem.name,
        value: dataItem.id,
        children: []
      }))
      getCascaderDataByCategories(result, res)
      setCascaderOptions(result)
    })
  }, [])
  return {
    cascaderOptions
  }
}

function useGetTags() {
  const [tags, setTags] = useState<ITag[]>([])
  useEffect(() => {
    getTagsList().then((res:ITag[]) => {
      setTags(res)
    })
  }, [])
  return {
    tags
  }
}