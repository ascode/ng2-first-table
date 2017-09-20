![Build Status](https://travis-ci.org/akveo/ng2-first-table.svg?branch=master)

# Angular2 first Table 组件

### Demo

<a target="_blank" href="http://192.168.2.244:4200">查看演示</a>

![alt tag](src/assets/img/demo.gif)

## 安装

该库可用作npm软件包，因此您只需运行以下命令即可：（如果不是新手，建议先装淘宝镜像端，因为cnpm更快）

```
npm install --save ng2-first-table
```

该命令将在您的`package.json`文件中创建一个记录，并将该包安装到npm modules文件夹中。

## 最简单的设置示例

首先需要将ng2-first-table指令导入到组件中。

```

import { Ng2FirstTableModule } from 'ng2-first-table';

```

然后通过添加到您的模块的指令列表来注册它：

```
// ...

@NgModule({
  imports: [
    // ...
    
    Ng2FirstTableModule,
    
    // ...
  ],
  declarations: [ ... ]
})
// ...
```

现在，我们需要配置表并将其添加到模板中。 组件开始工作的唯一必需设置是列配置。 我们在组件中注册设置属性，我们想要具有表并配置一些列[设置文档](http://192.168.2.244:4200/#/documentation)：
    
```
settings = {
  columns: {
    id: {
      title: 'ID'
    },
    name: {
      title: 'Full Name'
    },
    username: {
      title: 'User Name'
    },
    email: {
      title: 'Email'
    }
  }
};
```

最后，我们将ng2-first-table组件放在模板中：

```
// ...

@Component({
  template: `
    <ng2-first-table [settings]="settings"></ng2-first-table>
  `
})
// ...
```
在此步骤中，您将拥有一个最小配置的表。 默认情况下，所有功能都可用，您无需配置它们，因此现在您可以添加/编辑/删除行，对表进行排序或过滤。
 
仍然似乎缺少一些东西...对，默认情况下，表中没有数据。 要添加一些，我们创建一个数组属性与组件中的对象列表。 请注意，对象键与列配置中的相同。

```
data = [
  {
    id: 1,
    name: "Leanne Graham",
    username: "Bret",
    email: "Sincere@april.biz"
  },
  {
    id: 2,
    name: "Ervin Howell",
    username: "Antonette",
    email: "Shanna@melissa.tv"
  },
  
  // ... list of items
  
  {
    id: 11,
    name: "Nicholas DuBuque",
    username: "Nicholas.Stanton",
    email: "Rey.Padberg@rosamond.biz"
  }
];
```

And pass the data to the table:

```
// ...

@Component({
  template: `
    <ng2-first-table [settings]="settings" [source]="data"></ng2-first-table>
  `
})
// ...
```

现在你有一些数据在表中。
 
## 进一步的文档
安装，定制等有用的文档: https://ascode.github.io/ng2-first-table/

## How can I support developers?

- 可以关注我们的：[Github](https://github.com/wangraoji/ng2-first-table)
- 创建拉请求，提交错误，建议新功能


## 功能特征（详情请看本项目文档）
* 本地数据源（Server / API DataSource正在进行中）
* 首行过滤
* 當前頁排序
* 客戶端分页
* 单元行 单击/双击/复选框勾选 事件
* 隔行换色/自定义点击背景色
* 工具栏
* 汇总

## 感谢我们的贡献者！ 
[<img alt="nnixaa" src="https://avatars0.githubusercontent.com/u/2718661?v=4&s=400" width="60">](https://github.com/ascode)    [<img alt="nnixaa" src="https://avatars3.githubusercontent.com/u/24467663?v=4&s=400" width="60">](https://github.com/wangraoji)



ok