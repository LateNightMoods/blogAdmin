import { Button, Col, Input, message, Row, Tree } from "antd";
import { DataNode } from "rc-tree/lib/interface";
import React, { useEffect, useState } from "react";
import { addByParentId, deleteAllById, getList, ICategories } from "../../../api/categories";

function categoriesManager() {
  const [datas, setDatas] = useState<ICategories[]>([])
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [childText, setChildText] = useState('')
  useEffect(() => {
    getCategorys()
  }, [])
  const treeData = [
    {
      title: '根节点',
      key: '',
      children: []
    }
  ]
  getTreeDataByCategories(treeData, datas)

  const getCategorys = () => {
    getList().then((res:any) => {
      setDatas(res)
    })
  }

  const addChild = async () => {
    if (!checkedKeys.length) {
      message.warning('请先选中分类')
      return
    } 
    setChildText('')
    await addByParentId(childText, checkedKeys[0])
    getCategorys()
  }

  const handleChangeCheck = (checkedKeys:any) => {
    const { checked } = checkedKeys
    if (!checked.length) return
    setChildText('')
    setCheckedKeys([checked[checked.length - 1]])
  }
  
  const handleDelete = async () => {
    await deleteAllById(checkedKeys[0])
    getCategorys()
  }
  return (
    <div>
      <Row gutter={24}>
        <Col span={12}>
          <Tree
            checkable
            checkStrictly
            defaultExpandAll
            checkedKeys={checkedKeys}
            treeData={treeData}
            onCheck={handleChangeCheck}
          />
        </Col>
        <Col span={12}>
          <Input placeholder="选中节点新增子分类" value={childText} onChange={e => setChildText(e.target.value)} style={{ marginBottom: 8 }} onPressEnter={addChild} />
          <Row gutter={24}>
            <Col span={12}>
              <Button block type="primary" onClick={addChild} disabled={!checkedKeys.length}>新增子分类</Button>
            </Col>
            <Col span={12}>
              <Button block danger onClick={handleDelete} disabled={!checkedKeys.length || !checkedKeys[0]}>删除选中分类</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

function getTreeDataByCategories(treeData: DataNode[], datas: ICategories[]) {
  treeData.forEach(item => {
    item.children = datas.filter(son => son.parentId == item.key).map(dataItem => ({
      title: dataItem.name,
      key: dataItem.id,
      children: []
    }))
    if (item.children.length) {
      getTreeDataByCategories(item.children, datas)
    }
  })
}

export default categoriesManager