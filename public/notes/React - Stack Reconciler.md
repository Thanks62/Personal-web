# React - Stack Reconciler

react15及之前版本的调度器实现方式。

基于递归的实现方式，缺点一旦调度开始则是无法中断任务，对于大量节点的页面渲染将造成性能问题，于是有了react16的基于Fiber链表重构的新架构。

### 一、react组件的分类

#### 1.自定义组件：如\<App />

​	可分为类组件{type: App, props: {}}

​	函数组件{type: function, props: {}}

#### 2.原生节点：如\<div />

​	{type: 'div', props:{}}

📝自定义组件的渲染过程是递归的，最底层是原生节点（结束递归的条件）。

### 📙实现过程：

### 二、顶层组件 ReactDOM

1. #### mountTree 模拟ReactDOM.render()过程

   - 1）若已存在树的根节点，判断新旧节点的type类型是否相同

   ​	相同：调用prevRootComponent.recerve(...) // 后续第三部分会提到该方法的实现

   ​				实现组件复用

   ​	不同：调用unmountTree清除现有树节点

   - 2）创建RootComponent（利用工厂类instantiateComponent）

   - 3）挂载，mount过程（递归）

   - 4）追加到DOM元素中

   - 5）返回publicInstance实例

   ```js
   function mountTree(element, containerNode) {
     // Check for an existing tree
     if (containerNode.firstChild) {
       var prevNode = containerNode.firstChild;
       var prevRootComponent = prevNode._internalInstance;
       var prevElement = prevRootComponent.currentElement;
   
       // If we can, reuse the existing root component
       if (prevElement.type === element.type) {
         prevRootComponent.receive(element);
         return;
       }
   
       // Otherwise, unmount the existing tree
       unmountTree(containerNode);
     }
   
     // Create the top-level internal instance
     var rootComponent = instantiateComponent(element);
   
     // Mount the top-level component into the container
     var node = rootComponent.mount();
     containerNode.appendChild(node);
   
     // Save a reference to the internal instance
     // 卸载树时需要用到根元素的实例，进行unmount方法调用
     node._internalInstance = rootComponent;
   
     // Return the public instance it provides
     var publicInstance = rootComponent.getPublicInstance();
     return publicInstance;
   
   }
   ```

2. #### unmountTreeContainerNode 

   - 1）找到根节点实例

   - 2）调用根节点的unmount(...)方法

   - 3）containerNode.innerHtml = ''

   ```js
   function unmountTree(containerNode) {
     // Read the internal instance from a DOM node:
     // (This doesn't work yet, we will need to change mountTree() to store it.)
     var node = containerNode.firstChild;
     var rootComponent = node._internalInstance;
   
     // Unmount the tree and clear the container
     rootComponent.unmount();
     containerNode.innerHTML = '';
   }
   ```

### 三、工厂类（reconciler的实现）

#### 	1.function instantiateComponent(element){}

​		根据组件类型（element.type）返回不同的组件实例

​		自定义组件返回：CompositeComponent的实例

​		原生节点返回：DOMComponent的实例

```js
function instantiateComponent(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // User-defined components
    return new CompositeComponent(element);
  } else if (typeof type === 'string') {
    // Platform-specific components
    return new DOMComponent(element);
  }  
}
```

#### 	2.自定义组件类CompositeComponent

- ​		类成员：

​		currentElement(如：{type: App, props: {}})： 当前元素，从构造器中获取

​		renderedComponent：渲染的子元素的实例，可能是自定义组件或原生节点

​		publicInstance：组件实例，也即平时编写类组件中的this

```js
constructor(element) {
    this.currentElement = element;
    this.renderedComponent = null;
    this.publicInstance = null;
  }
```

- ​		类方法：

##### 		1）mount() 挂载过程

​			1. 判断组件类型（element.type）：

​				类组件 -> 使用new type(props)创建实例，赋值给publicInstance

​							 -> 调用生命周期，publicInstance.componentWillMount()

​							 -> 调用render方法，renderedElement = publicInstance.render()

​				函数组件 -> publicInstance = null

​								-> 调用函数type(props), renderedElement = type(props)

​			2. 递归调用instantiateComponent

​				根据得到的renderedElement子元素，递归调用组件生产方法，直到最内层的原生dom节点

​				renderedComponent = instantiateComponent(renderedElement)

​			3. 返回renderedComponent.mount()

​				从最内层逐层调用mount方法

```js
mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;

    var publicInstance;
    var renderedElement;
    if (isClass(type)) {
      // Component class
      publicInstance = new type(props);
      // Set the props
      publicInstance.props = props;
      // Call the lifecycle if necessary
      if (publicInstance.componentWillMount) {
        publicInstance.componentWillMount();
      }
      renderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // Component function
      publicInstance = null;
      renderedElement = type(props);
    }

    // Save the public instance
    this.publicInstance = publicInstance;

    // Instantiate the child internal instance according to the element.
    // It would be a DOMComponent for <div /> or <p />,
    // and a CompositeComponent for <App /> or <Button />:
    var renderedComponent = instantiateComponent(renderedElement);
    this.renderedComponent = renderedComponent;

    // Mount the rendered output
    return renderedComponent.mount();
  }
```

##### 		2）unmount() 卸载过程

​			1. 获取类的publicInstance，若不为空(为类组件)，则调用生命周期函数publicInstance.componentWillUnmount()

​			2. 递归调用子组件的unmount

​				renderedComponent.unmount()

```js
unmount() {
    // Call the lifecycle method if necessary
    var publicInstance = this.publicInstance;
    if (publicInstance) {
      if (publicInstance.componentWillUnmount) {
        publicInstance.componentWillUnmount();
      }
    }

    // Unmount the single rendered component
    var renderedComponent = this.renderedComponent;
    renderedComponent.unmount();
  }
```

##### 		3）receive(nextElement)：更新过程，也即diff过程

​			1. 更新变量

​					props：

​							prevProps = this.currentElement.props;

​							nextProps = nextElement.props;

​					renderedComponent

​							prevRenderedComponent = this.renderedComponent;

​					prevRenderedElement:

​							prevRenderedComponent.currentElement;

​					currentElement: 

​							this.currentElement = nextElement;

​			2. 判断组件类型（element.type），获取nextRenderedElement：

​					类组件 -> 调用生命周期publicInstance.componentWillUpdate(nextProps);

​								-> 更新publicInstance.props

​								-> 调用render函数，nextRenderedElement = publicInstance.render();

​					函数组件 -> 调用函数，nextRenderedElement = type(nextProps);

​			3. diff过程

​					根据element.type（prevRenderedElement.type === nextRenderedElement.type）判断是否需要重新挂载节点。

​						相同：递归调用receive(nextRenderedElement)，并return；

​						不同：1）递归获取子元素prevRenderedComponent.getHostNode()，直到原生节点

​									2）调用unmount

​									3）重新生成子组件instantiateComponent(nextRenderedElement)

​									4）调用新组件的mount

​									5）层层替换子节点

```js
receive(nextElement) {
    var prevProps = this.currentElement.props;
    var publicInstance = this.publicInstance;
    var prevRenderedComponent = this.renderedComponent;
    var prevRenderedElement = prevRenderedComponent.currentElement;

    // Update *own* element
    this.currentElement = nextElement;
    var type = nextElement.type;
    var nextProps = nextElement.props;

    // Figure out what the next render() output is
    var nextRenderedElement;
    if (isClass(type)) {
      // Component class
      // Call the lifecycle if necessary
      if (publicInstance.componentWillUpdate) {
        publicInstance.componentWillUpdate(nextProps);
      }
      // Update the props
      publicInstance.props = nextProps;
      // Re-render
      nextRenderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // Component function
      nextRenderedElement = type(nextProps);
    }
  	// diff过程
  	// If the rendered element type has not changed,
    // reuse the existing component instance and exit.
    if (prevRenderedElement.type === nextRenderedElement.type) {
      prevRenderedComponent.receive(nextRenderedElement);
      return;
    }
  	// If we reached this point, we need to unmount the previously
    // mounted component, mount the new one, and swap their nodes.

    // Find the old node because it will need to be replaced
    var prevNode = prevRenderedComponent.getHostNode();

    // Unmount the old child and mount a new child
    prevRenderedComponent.unmount();
    var nextRenderedComponent = instantiateComponent(nextRenderedElement);
    var nextNode = nextRenderedComponent.mount();

    // Replace the reference to the child
    this.renderedComponent = nextRenderedComponent;

    // Replace the old node with the new one
    // Note: this is renderer-specific code and
    // ideally should live outside of CompositeComponent:
    prevNode.parentNode.replaceChild(nextNode, prevNode);
  }
}

getHostNode() {
    // Ask the rendered component to provide it.
    // This will recursively drill down any composites.
    return this.renderedComponent.getHostNode();
}
```

#### 	3.原生节点类DOMComponent

- ​		类成员：

​			currentElement(如：{type: 'div', props: {}})： 当前元素，从构造器中获取

​			renderedChildren: [],子元素数组

​			node：当前DOM元素

```js
constructor(element) {
    this.currentElement = element;
    this.renderedChildren = [];
    this.node = null;
  }
```

- ​		类方法：

##### 		1）mount() 挂载过程

​			1. 根据type创建dom元素，node = document.createElement(type);

​			2. 根据props创建attribute

​			3. 遍历props.children获取子元素，循环调用工厂类创建组件props.children.map(instantiateComponent);

​			4. 递归调用，遍历子元素的mount方法得到node list，childNodes = renderedChildren.map(child => child.mount())

​			5. 将node list逐个插入到当前节点的子元素中 childNodes.forEach(childNode => node.appendChild(childNode));

​			6. 返回node

```js
mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;
    var children = props.children || [];
    if (!Array.isArray(children)) {
      children = [children];
    }

    // 1.Create and save the node
    var node = document.createElement(type);
    this.node = node;

    // 2.Set the attributes
    Object.keys(props).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, props[propName]);
      }
    });

    // 3.Create and save the contained children.
    // Each of them can be a DOMComponent or a CompositeComponent,
    // depending on whether the element type is a string or a function.
    var renderedChildren = children.map(instantiateComponent);
    this.renderedChildren = renderedChildren;

    // 4.Collect DOM nodes they return on mount
    var childNodes = renderedChildren.map(child => child.mount());
  	// 5.
    childNodes.forEach(childNode => node.appendChild(childNode));

    // 6.Return the DOM node as mount result
    return node;
  }
```

##### 		2）unmount() 卸载过程

​			1. 遍历子元素调用unmount()

```js
	unmount() {
    // Unmount all the children
    var renderedChildren = this.renderedChildren;
    renderedChildren.forEach(child => child.unmount());
  }
```

##### 		3) receive(nextElement) 更新过程

​			1. 更新变量

​					props：

​							prevProps = this.currentElement.props;

​							nextProps = nextElement.props;

​					element：

​							prevElement = this.currentElement;

​							this.currentElement = nextElement;

​			2. 根据新旧props设置attribute

​			3. 定义临时变量

​					prevChildren: [] = prevProps.children

​					nextChildren: [] = nextProps.children

​					prevRenderedChildren: [] = this.renderedChildren

​					nextRenderedChildren = [] 

​					operationQueue: [] 存放节点操作：ADD、REPLEASE、REMOVE

​			4. diff过程

​					1）遍历nextChildren

​							在prevChildren中查询同下标节点：	

​								超出prevChildren部分（新增节点）operationQueue.push({type: 'ADD', node})

​								都存在的节点，对比type类型：

​									相同： 递归调用receive(nextChildren[i])

​									不同：获取子元素节点getHostNode()

​												调用unmount方法

​												重新生成节点instantiateComponent(nextChildren[i])

​												挂载新节点mount

​												operationQueue.push({type: 'REPLACE', prevNode, nextNode})

​						2）遍历在prevChildren中超出nextChildren部分节点

​								获取子元素节点getHostNode()

​								卸载节点umount()

​								operationQueue.push({type: 'REMOVE', node});

​						3) 执行operationQueue

```js
	receive(nextElement) {
    // 1.
    var node = this.node;
    var prevElement = this.currentElement;
    var prevProps = prevElement.props;
    var nextProps = nextElement.props;    
    this.currentElement = nextElement;

    // 2.Remove old attributes.
    Object.keys(prevProps).forEach(propName => {
      if (propName !== 'children' && !nextProps.hasOwnProperty(propName)) {
        node.removeAttribute(propName);
      }
    });
    // 2.Set next attributes.
    Object.keys(nextProps).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, nextProps[propName]);
      }
    });
    // 3.These are arrays of React elements:
    var prevChildren = prevProps.children || [];
    if (!Array.isArray(prevChildren)) {
      prevChildren = [prevChildren];
    }
    var nextChildren = nextProps.children || [];
    if (!Array.isArray(nextChildren)) {
      nextChildren = [nextChildren];
    }
    // These are arrays of internal instances:
    var prevRenderedChildren = this.renderedChildren;
    var nextRenderedChildren = [];

    // As we iterate over children, we will add operations to the array.
    var operationQueue = [];

    // Note: the section below is extremely simplified!
    // It doesn't handle reorders, children with holes, or keys.
    // It only exists to illustrate the overall flow, not the specifics.
		//4.-(1)
    for (var i = 0; i < nextChildren.length; i++) {
      // Try to get an existing internal instance for this child
      var prevChild = prevRenderedChildren[i];

      // If there is no internal instance under this index,
      // a child has been appended to the end. Create a new
      // internal instance, mount it, and use its node.
      if (!prevChild) {
        var nextChild = instantiateComponent(nextChildren[i]);
        var node = nextChild.mount();

        // Record that we need to append a node
        operationQueue.push({type: 'ADD', node});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // We can only update the instance if its element's type matches.
      // For example, <Button size="small" /> can be updated to
      // <Button size="large" /> but not to an <App />.
      var canUpdate = prevChildren[i].type === nextChildren[i].type;

      // If we can't update an existing instance, we have to unmount it
      // and mount a new one instead of it.
      if (!canUpdate) {
        var prevNode = prevChild.getHostNode();
        prevChild.unmount();

        var nextChild = instantiateComponent(nextChildren[i]);
        var nextNode = nextChild.mount();

        // Record that we need to swap the nodes
        operationQueue.push({type: 'REPLACE', prevNode, nextNode});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // If we can update an existing internal instance,
      // just let it receive the next element and handle its own update.
      prevChild.receive(nextChildren[i]);
      nextRenderedChildren.push(prevChild);
    }

    // 4.-(2)Finally, unmount any children that don't exist:
    for (var j = nextChildren.length; j < prevChildren.length; j++) {
      var prevChild = prevRenderedChildren[j];
      var node = prevChild.getHostNode();
      prevChild.unmount();

      // Record that we need to remove the node
      operationQueue.push({type: 'REMOVE', node});
    }

    // Point the list of rendered children to the updated version.
    this.renderedChildren = nextRenderedChildren;
		// 4.-(3)Process the operation queue.
    while (operationQueue.length > 0) {
      var operation = operationQueue.shift();
      switch (operation.type) {
      case 'ADD':
        this.node.appendChild(operation.node);
        break;
      case 'REPLACE':
        this.node.replaceChild(operation.nextNode, operation.prevNode);
        break;
      case 'REMOVE':
        this.node.removeChild(operation.node);
        break;
      }
    }
  }

	getHostNode() {
    return this.node;
  } 
```

参考：react官方文档：https://legacy.reactjs.org/docs/implementation-notes.html