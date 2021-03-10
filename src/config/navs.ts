import { ReactNode } from "react";
import AddArticle from "../page/home/AddArticle";
import CategoriesManager from "../page/home/categories/Manager";

export interface Nav {
  name: string;
  url: string;
  component?: () => ReactNode;
  childrens?: Nav[];
}

const navs:Nav[] = [
  {
    name: '文章管理',
    url: '/article',
    childrens: [
      {
        name: '发布文章',
        url: '/add',
        component: () => AddArticle
      }
    ]
  },
  {
    name: '分类管理',
    url: '/categories/manager',
    component: () => CategoriesManager
  },
]

export default navs