# wx-bot-backend

本仓库用于存放微信机器人相关的后端服务应用代码。

技术栈： `Nest.js + TypeScript + MySQL + Redis + JWT + Webpack` 。

## 项目目录结构

由于 `Nest` 框架的最佳实践相对比较欠缺，因此在这里指定一套我们自己用于开发的规范，也便于后续的协作开发。

以下的目录结构仅仅指在 `src` 目录下的结构：

- app.module.ts：用于进行一系列的模块导入、全局providers的注册。

  具体的，比如TypeOrmModule、ConfigModule、JwtModule；以及全局拦截器、全局错误过滤器等。

- main.ts：用于进行一系列插件的引入与注册、app的创建与启动、设置全局的一些配置。

- logs：该目录用于配置日志打印输出的一些配置。

- modules（模块目录）: 每个模块通常有自己的文件夹，包含模块的控制器、服务、模型等。

  - module-name:
    - dto（数据传输对象）: 存放 DTO 文件，用于定义接口数据。
    - entities（实体）: 存放 ORM 实体类。
    - controllers（控制器）: 存放处理 HTTP 请求的控制器类。
    - services（服务）: 存放业务逻辑的服务类。
    - module-name.module.ts: 模块定义文件，用于导入和导出模块中的元素。

- middleware：该目录用于放置中间件，一般直接使用 `nest g mi <中间件名>` 进行创建。

- common（公共资源）: 存放整个项目范围内共享的代码，如常量、接口、类型、装饰器等。

  - enum：存放枚举类。
  - interface：存放接口。
  - type：存放类型。

- configs（配置）: 存放应用配置相关的代码和文件。

- filters（过滤器）: 存放异常过滤器。

- interceptors（拦截器）: 存放拦截器，用来改变函数的行为。

- middleware（中间件）: 存放中间件。

- decorators（装饰器）: 存放装饰器。

- pipes（管道）: 存放数据转换和验证用的管道。

- guards：用于存放守卫，直接使用 `nest g gu <守卫名>` 进行生成，一般用于配置与鉴权相关的函数，用于直接在controller中的对应函数使用。

- utils：用于放置一些通用的工具函数，并且内部尽量一个不同的功能函数单独置为一个文件，最后通过 `index.ts` 进行统一暴露。

- [模块目录]：这个目录结构是最复杂的，一般直接通过 `nest g res <实体名> --no-spec` 进行创建（不需要测试文件）。

  ![创建user模块](https://common-1319721118.cos.ap-shanghai.myqcloud.com/picgo/%E5%88%9B%E5%BB%BAuser%E6%A8%A1%E5%9D%97.gif)

  - xxx.module.ts：用于配置这个模块的一些信息，用法和app.module.ts是一样的。如果是使用typeorm，需要在每个模块的这个文中的imports中配置resposity；如果这个模块是全局的，希望将其暴露，可以在@Module上方添加@Global装饰器。
  - xxx.service.ts：用于配置服务，主要是实现和typeorm中与数据库直接交互的操作。
  - xxx.controller.ts：用于配置路由，主要是用来将参数进行鉴权、并配置许多功能性装饰器进行修饰的操作，是service的前置操作，在最后是调用service中的函数进行数据库操作的。
  - dto（Data Transfer Object）：用于配置各个请求中需要的数据格式，通常配合表单验证一起进行。对于service和controller来说，接收的就是对应的dto类型的数据。
  - entities：通常用于配置这个模块中的实体的typeorm映射关系。
  - vo：通常用于配置各个函数的返回数据的格式。
