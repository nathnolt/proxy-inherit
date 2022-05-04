export function proxyInherit(item, overwrites) {
    const handler = {
        get(target, property) {
            
            let value
            const overwriteVal = overwrites[property]
            
            if(overwriteVal != undefined) {
                value = overwriteVal
            } else {
                value = target[property]
            }
            
            if(value instanceof Function) {
                return value.bind(item)
            }
            
            return value
        },
        set(target, property, value) {
            target[property] = value
        }
    }
    
    return new Proxy(item, handler)
}



// 
// Example usage
// 

// 1. index.html
... normal stuff...

<ul id="list">
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    <li>6</li>
    <li>7</li>
</ul>

<script type="module" src="dom-helpers.js"></script>
<script type="module">
import {wrappedEl} from './dom-helpers.js'
var listEl = document.getElementById('list')

listEl.addEventListener('click', function(e) {
  var liEl = e.target.closest('li')
  if(liEl != null) {
    liEl = wrappedEl(liEl)
    if(liEl.siblingIndex() >= 5) {
      liEl.style.background = 'red'
    }
  }
})
</script>

// 2. dom-helpers.js
import {proxyInherit} from './lib.js' // this contains the top code.

var wrappedElMethods = {
  siblingIndex() {
    var parent = this.parentNode
    if(parent == null) {
      return -1
    }
    var children = parent.children
    for(var i = 0; i < children.length; i++) {
      var child = children[i]
      if(child == this) {
        return i
      }
    }

    return -1
  }
}

export function wrappedEl(el) {
    return proxyInherit(el, wrappedElMethods)
}
