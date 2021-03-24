---
title: Vue 源码阅读：子组件创建过程
date: 2020-12-16T17:44:04
tags:
  - 源码阅读
  - Vue 源码阅读
  - vue
---

## 前言

前面的几篇博文从最基础的 `data` 到 `computed`、`methods`、`watch`，详解了这些 *state* 初始化的情况，并追踪了后续发生变化时的情形。而在 `initState` 中，除了上述属性外，还有一种需要 init 的类型：`props`

props 的作用是父组件给子组件传值，或者子组件接收父组件的值。那么就涉及到 vue 的组件体系。因此，需要先了解 vue 中父子组件分别是什么时候创建的，它们的生命周期是怎样。

## 例子

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demo Vue</title>
  <script src="./vue.runtime.js"></script>
</head>
<body>
  <div id="app"></div>
  <button onclick="app.$mount('#app')">挂载</button>
  <script>
    const CompMessageOptions = {
      data() {
        return {
          message: 'hello vue',
        }
      },
      render: function render() {
        with(this) {
          return _c('span', [_v(_s(message))])
        }
      }
    }
    const AppOptions = {
      components: {
        'comp-message': CompMessageOptions
      },
      render: function render() {
        with(this) {
          return _c('comp-message')
        }
      }
    }
    const app = new Vue(AppOptions)
  </script>
</body>
</html>
```

上面的例子，除了 App 组件外，还声明了 CompMessage 组件，并将其注册为 App 组件的局部组件。然后在 App 的渲染函数里直接渲染了这个组件，App 对应的 template 如下

```html
<comp-message />
```

> 从模板转化到的 render 函数来看，`_c` 在调用的时候并没有区分自定义组件与原生的 div 等标签

对于 CompMessage 组件，它的 template 就是很普通的展示下 `message`

```html
<span>{{ message }}</span>
```

这里我把之前用得比较经常的 div 换成了 span

## 深入前的思考

首先是结构，最外层的根组件只是简单地渲染了子组件 CompMessage，在子组件内部才具体渲染了 HTML 的 span 标签。

对于例子中的根组件而言，它是没有具体的 HTML 节点的。这里就有一个问题，我们知道在 `$mount` 后，组件实例上会有 `$el` 属性指向具体的 HTML 元素节点，那么在这个例子里，根组件的 `$el` 会是什么？

另外，从上面的例子以及我们之前的流程来看。执行 `const app = new Vue(AppOptions)` 时，已经开始了 App 组件的初始化，但没执行 `app.$mount('#app')`，就不会触及 App 的 `render`。分析来讲，肯定是渲染到了子组件，才开始实例化子组件，那么子组件的挂载和根组件的挂载间是什么关系，根组件的挂载先执行完成还是子组件的挂载先执行完成？

## 深入

### 渲染调用链

回顾下 `$mount` 的调用链：

- 渲染 `watcher` 中的 `get` 执行了 `updateComponent`
- `updateComponent` 中执行了 `vm._update(vm._render(), hydrating);`
- 在 `vm._render()` 中调用了我们定义的 `render` 函数
- 执行到 `_c('comp-message')`

这里 `vm._render()` 的作用实际上是构建出 `vdom`，然后在 `vm._update()` 中才将 `vdom` 中变化的部分应用到实际 dom 中。因此此处 `_c('comp-message')` 的产物是是虚拟 dom 节点。

OK，进入 `_c('comp-message')`

### render

先到 `_c` 赋值的位置

- src/core/instance/render.js

```js
vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
```

进入 `createElement`。

```js
// wrapper function for providing a more flexible interface
// without getting yelled at by flow
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}
```

在这里传入 `createElement` 的只有 
- `context`，值为 `vm`
- `tag`，值为 `comp-message`

进入 `_createElement`

- src/core/vdom/create-element.js

```js
export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  if (isDef(data) && isDef((data: any).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
      'Always create fresh vnode data objects in each render!',
      context
    )
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    if (!__WEEX__ || !('@binding' in data.key)) {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      )
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if (process.env.NODE_ENV !== 'production' && isDef(data) && isDef(data.nativeOn)) {
        warn(
          `The .native modifier for v-on is only valid on components but it was used on <${tag}>.`,
          context
        )
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children)
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {
    return createEmptyVNode()
  }
}
```

这段代码前面对传入的参数进行了校验和处理，主体内容是创建 `vnode`，实际执行进入的代码是

```js
else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
  // component
  vnode = createComponent(Ctor, data, context, children, tag)
}
```

进入 `resolveAsset`

- src/core/util/options.js

```js
/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
export function resolveAsset (
  options: Object,
  type: string,
  id: string,
  warnMissing?: boolean
): any {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  const assets = options[type]
  // check local registration variations first
  if (hasOwn(assets, id)) return assets[id]
  const camelizedId = camelize(id)
  if (hasOwn(assets, camelizedId)) return assets[camelizedId]
  const PascalCaseId = capitalize(camelizedId)
  if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId]
  // fallback to prototype chain
  const res = assets[id] || assets[camelizedId] || assets[PascalCaseId]
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    )
  }
  return res
}
```

这里的 `assets` 即 `AppOptions.components`，`id` 即 `comp-message`，而后 `return assets[id]` 即 `CompMessageOptions`。

> 这是一个关键小节点，`Ctor` 被赋值为 `CompMessageOptions`

回到 `vnode` 创建代码

```js
vnode = createComponent(Ctor, data, context, children, tag)
```

- `Ctor` 是 `CompMessageOptions`
- `data` 是 `undefined`
- `context` 是根组件实例 `vm`
- `children` 是 `undefined`
- `tag` 是 `comp-message`

先不进入 `createComponent`，这里创建的 `vnode` 后续会逐步 `return` 出去，成为 `vm._render()` 的结果。

开始进入 `createComponent`

- src/core/vdom/create-component.js

```js
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  if (isUndef(Ctor)) {
    return
  }

  const baseCtor = context.$options._base

  // plain options object: turn it into a constructor
  // 简单配置对象：转换为构造函数
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  // 若到此 Ctor 还不是一个构造函数或异步组件工厂，返回
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(`Invalid Component definition: ${String(Ctor)}`, context)
    }
    return
  }

  // async component
  // 异步组件
  let asyncFactory
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor)
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {}

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  // 解析构造函数选项以防全局 mixin 在组件构造函数创建后应用
  resolveConstructorOptions(Ctor)

  // transform component v-model data into props & events
  // 将组件的 v-model 转换为 props 和 events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data)
  }

  // extract props
  // 抽取 props
  const propsData = extractPropsFromVNodeData(data, Ctor, tag)

  // functional component
  // 函数式组件
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  // 由于是组件的监听器而不是 DOM 的监听器，因此抽取监听器
  const listeners = data.on
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  // 替换为带 .native 修饰符的监听器，这样会在父组件 patch 时处理
  data.on = data.nativeOn

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot
    // 抽象组件不持有任何东西，除了 props，listeners，slot

    // work around flow
    const slot = data.slot
    data = {}
    if (slot) {
      data.slot = slot
    }
  }

  // install component management hooks onto the placeholder node
  // 在占位符节点上安装组件管理钩子
  installComponentHooks(data)

  // return a placeholder vnode
  // 返回占位符节点
  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  if (__WEEX__ && isRecyclableComponent(vnode)) {
    return renderRecyclableComponentTemplate(vnode)
  }

  return vnode
}
```

这里主要的关键点如下

- `Ctor = baseCtor.extend(Ctor)`：通过 `extend`，`Ctor` 由上一步的 `CompMessageOptions` 变成了用于创建 `CompMessage` 组件的构造函数。
- `new VNode`：暂不深入 `vnode`，通过注释发现，这里实际上返回的是一个占位符 `vnode`，并不是组件实际对应的 `vnode`，而且也没有调用 `Ctor`，自然，组件也就没有初始化。
- `installComponentHooks(data)`：主要给 `data` 添加一些属性，这些属性会在后面的属性初始化中用到。


### update

回到

```js
vm._update(vm._render(), hydrating);
```

从上面得知，`_render` 拿到了一个占位符 `vnode`，进入 `_update`。`_update` 在 `lifecycleMixin` 中添加

- src/core/instance/lifecycle.js

```js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this
  const prevEl = vm.$el
  const prevVnode = vm._vnode
  const restoreActiveInstance = setActiveInstance(vm)
  vm._vnode = vnode
  // Vue.prototype.__patch__ is injected in entry points
  // based on the rendering backend used.
  // Vue.prototype.__patch__ 基于渲染终端在入口处注入
  if (!prevVnode) {
    // initial render
    // 首次渲染
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // 更新
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
  restoreActiveInstance()
  // update __vue__ reference
  if (prevEl) {
    prevEl.__vue__ = null
  }
  if (vm.$el) {
    vm.$el.__vue__ = vm
  }
  // if parent is an HOC, update its $el as well
  if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
    vm.$parent.$el = vm.$el
  }
  // updated hook is called by the scheduler to ensure that children are
  // updated in a parent's updated hook.
}
```

进入首次渲染

```js
vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
```

`__patch__` 前面注释提到是在入口处注入，对于浏览器终端而言，注入代码如下

- src/platforms/web/runtime/index.js

```js
// install platform patch function
// 安装平台 patch 函数
Vue.prototype.__patch__ = inBrowser ? patch : noop
```

而 `patch` 是创建出来的

- src/platforms/web/runtime/patch.js

```js
export const patch: Function = createPatchFunction({ nodeOps, modules })
```

这里创建 `patch` 的原因是将终端节点的逻辑抽离，比如普通的浏览器终端、weex 终端等。不同的终端对于如何操纵视图上的节点实现是不同的，而 `patch` 内只关注需要“补”哪些东西。

这里涉及到 vue 中另一块非常重要的内容就是虚拟 dom 的 patch 算法，本篇不涉及此块内容，这里只是个概览，重点还是关注子组件的创建时机。

- src/core/vdom/patch.js

```js
function patch (oldVnode, vnode, hydrating, removeOnly) {
  if (isUndef(vnode)) {
    if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
    return
  }

  let isInitialPatch = false
  const insertedVnodeQueue = []

  if (isUndef(oldVnode)) {
    // empty mount (likely as component), create new root element
    isInitialPatch = true
    createElm(vnode, insertedVnodeQueue)
  } else {
    const isRealElement = isDef(oldVnode.nodeType)
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // patch existing root node
      patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
    } else {
      if (isRealElement) {
        // mounting to a real element
        // check if this is server-rendered content and if we can perform
        // a successful hydration.
        if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
          oldVnode.removeAttribute(SSR_ATTR)
          hydrating = true
        }
        if (isTrue(hydrating)) {
          if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
            invokeInsertHook(vnode, insertedVnodeQueue, true)
            return oldVnode
          } else if (process.env.NODE_ENV !== 'production') {
            warn(
              'The client-side rendered virtual DOM tree is not matching ' +
              'server-rendered content. This is likely caused by incorrect ' +
              'HTML markup, for example nesting block-level elements inside ' +
              '<p>, or missing <tbody>. Bailing hydration and performing ' +
              'full client-side render.'
            )
          }
        }
        // either not server-rendered, or hydration failed.
        // create an empty node and replace it
        oldVnode = emptyNodeAt(oldVnode)
      }

      // replacing existing element
      const oldElm = oldVnode.elm
      const parentElm = nodeOps.parentNode(oldElm)

      // create new node
      createElm(
        vnode,
        insertedVnodeQueue,
        // extremely rare edge case: do not insert if old element is in a
        // leaving transition. Only happens when combining transition +
        // keep-alive + HOCs. (#4590)
        oldElm._leaveCb ? null : parentElm,
        nodeOps.nextSibling(oldElm)
      )

      // update parent placeholder node element, recursively
      if (isDef(vnode.parent)) {
        let ancestor = vnode.parent
        const patchable = isPatchable(vnode)
        while (ancestor) {
          for (let i = 0; i < cbs.destroy.length; ++i) {
            cbs.destroy[i](ancestor)
          }
          ancestor.elm = vnode.elm
          if (patchable) {
            for (let i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, ancestor)
            }
            // #6513
            // invoke insert hooks that may have been merged by create hooks.
            // e.g. for directives that uses the "inserted" hook.
            const insert = ancestor.data.hook.insert
            if (insert.merged) {
              // start at index 1 to avoid re-invoking component mounted hook
              for (let i = 1; i < insert.fns.length; i++) {
                insert.fns[i]()
              }
            }
          } else {
            registerRef(ancestor)
          }
          ancestor = ancestor.parent
        }
      }

      // destroy old node
      if (isDef(parentElm)) {
        removeVnodes([oldVnode], 0, 0)
      } else if (isDef(oldVnode.tag)) {
        invokeDestroyHook(oldVnode)
      }
    }
  }

  invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
  return vnode.elm
}
```

具体而言，会进入

```js
// create new node
// 创建新节点
createElm(
  vnode,
  insertedVnodeQueue,
  // extremely rare edge case: do not insert if old element is in a
  // leaving transition. Only happens when combining transition +
  // keep-alive + HOCs. (#4590)
  // 极偶发的例子：不在就元素处于离开变化时插入。
  // 只在 transition 与 keep-alive 与高阶组件一同使用时发生
  oldElm._leaveCb ? null : parentElm,
  nodeOps.nextSibling(oldElm)
)
```

在 `createElm` 中并不会深入

```js
function createElm (
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  if (isDef(vnode.elm) && isDef(ownerArray)) {
    // This vnode was used in a previous render!
    // now it's used as a new node, overwriting its elm would cause
    // potential patch errors down the road when it's used as an insertion
    // reference node. Instead, we clone the node on-demand before creating
    // associated DOM element for it.
    vnode = ownerArray[index] = cloneVNode(vnode);
  }

  vnode.isRootInsert = !nested; // for transition enter check
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }

  // ...
}
```

进入 `createComponent`

```js
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      i(vnode, false /* hydrating */)
    }
    // after calling the init hook, if the vnode is a child component
    // it should've created a child instance and mounted it. the child
    // component also has set the placeholder vnode's elm.
    // in that case we can just return the element and be done.
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue)
      insert(parentElm, vnode.elm, refElm)
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
      }
      return true
    }
  }
}
```

注意 `isDef(i = i.hook) && isDef(i = i.init)`，此时，`i` 被赋值为 `vnode.data.hook.init`

此处的 `data.hook` 是在前面段落中介绍的 `installComponentHooks` 中添加的，相关代码如下

- src/core/vdom/create-component.js

```js
// inline hooks to be invoked on component VNodes during patch
const componentVNodeHooks = {
  init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },

  // ...
}

const hooksToMerge = Object.keys(componentVNodeHooks)

// ...

function installComponentHooks (data: VNodeData) {
  const hooks = data.hook || (data.hook = {})
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i]
    const existing = hooks[key]
    const toMerge = componentVNodeHooks[key]
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge
    }
  }
}
```

在执行 `i(vnode, false /* hydrating */)` 时，实际会执行 `componentVNodeHooks` 的 `init` 方法。于是走到：

```js
const child = vnode.componentInstance = createComponentInstanceForVnode(
  vnode,
  activeInstance
)
child.$mount(hydrating ? vnode.elm : undefined, hydrating)
```

同样，先不考虑 `createComponentInstanceForVnode` 内部发生了什么事，仅从命名上看，可以猜猜测 `child` 即为子组件实例，`child.$mount` 执行挂载流程。

同样可以猜测执行完 `child.$mount(hydrating ? vnode.elm : undefined, hydrating)`，子组件的挂载流程即结束，而此时父组件还处于挂载中。因此可以理出父子组件的生命周期顺序。

这里的 `vnode` 是外部一直传入的占位符节点，回顾下该节点的创建语句

- src/core/vdom/create-component.js

```js
const vnode = new VNode(
  `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
  data, undefined, undefined, undefined, context,
  { Ctor, propsData, listeners, tag, children },
  asyncFactory
)
```

进入 `createComponentInstanceForVnode`

```js
export function createComponentInstanceForVnode (
  vnode: any, // we know it's MountedComponentVNode but flow doesn't
  parent: any, // activeInstance in lifecycle state
): Component {
  const options: InternalComponentOptions = {
    _isComponent: true,
    _parentVnode: vnode,
    parent
  }
  // check inline-template render functions
  const inlineTemplate = vnode.data.inlineTemplate
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render
    options.staticRenderFns = inlineTemplate.staticRenderFns
  }
  return new vnode.componentOptions.Ctor(options)
}
```

终于 `new vnode.componentOptions.Ctor(options)`，在 `Ctor` 内部就会调用到熟悉的 `_init` 方法，开始属性的初始化流程。

> 实际上 `Ctor` 由 `baseCtor.extend()` 也就是 `Vue.extend` 而来，还是一样暂时忽略，此处只需知晓 `Vue.extend` 而来的构造函数内部与 `Vue` 几乎一致，都是调用了 `_init` 进行初始化即可。

`createComponentInstanceForVnode` 与子组件实例的 `$mount` 完成后即 `componentVNodeHooks` 的 `init` 完成，回到 `createComponent`

- src/core/vdom/patch.js

```js
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      i(vnode, false /* hydrating */)
    }
    // after calling the init hook, if the vnode is a child component
    // it should've created a child instance and mounted it. the child
    // component also has set the placeholder vnode's elm.
    // in that case we can just return the element and be done.
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue)
      insert(parentElm, vnode.elm, refElm)
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
      }
      return true
    }
  }
}
```

## 小结

本节通过自定义父子组件，跟踪父组件的渲染流程，触及了渲染过程中非常多的方法。主要发现了：

- render 过程仅创建子组件的占位节点，并不创建子组件实际对应节点；update 过程的 patch 里才初始化并挂载子组件对应节点。
- 子组件初始化完成后即 $mount，也因此，对于 mounted 生命周期钩子，子组件会先于父组件触发。

> 思考：子组件一定是自定义组件么？在原生元素上绑定 props，如 `<span :title="message">`，vue 会怎么处理？会是让原生元素对应有内部组件么？

