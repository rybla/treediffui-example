const keysDown = {}

window.addEventListener('keydown', (event) => {
    keysDown[event.key] = true
})

window.addEventListener('keyup', (event) => {
    keysDown[event.key] = false
})

function isKeyDown(key) {
    return keysDown[key] || false
}

// Usage
if (isKeyDown('ArrowRight')) {
    console.log('Right arrow key is held down!')
}


export const getContainer = () => {
    console.log("[getContainer]")
    return document.getElementById('container')
}

export const getElement = (id) => () => {
    console.log("[getElement]", JSON.stringify({ id }))
    return document.getElementById(id)
}

export const createElement = (label) => (kids) => () => {
    console.log("[createElement]", JSON.stringify({ label }))
    const e = document.createElement('div')
    e.classList.add('node')
    e.id = label
    const l = document.createElement('div')
    l.classList.add('label')
    l.innerText = label
    e.appendChild(l)
    kids.forEach(kid => e.appendChild(kid))
    return e
}

export const addKid = (parent) => (kid) => () => {
    console.log("[addKid]")
    return parent.appendChild(kid)
}

export const getParent = (kid) => () => {
    console.log("[getParent]")
    return kid.parentElement
}

export const replaceKid = (parent) => args => () => {
    console.log("[replaceKid]")
    return parent.replaceChild(args.new, args.old)
}

// export const cloneElement = (e) => () => e.cloneNode()

export const createButton = ({ label, onclick }) => () => {
    const e = document.createElement('button')
    e.classList.add('node-control')
    e.innerText = label
    e.onclick = () => onclick()
    return e
}

export const removeKid = (parent) => (kid) => () => {
    parent.removeChild(kid)
}

export const getElementById = (id) => () => document.getElementById(id)

export const setTreeDisplay = (str) => () => {
    const e = document.getElementById('tree_display')
    e.innerText = str
}

// foreign import set_clipboard :: { tree:: Tree, element :: Element } -> Effect Unit
// foreign import get_clipboard :: Effect { tree:: Tree, element :: Element }
var clipboard = undefined
export const set_clipboard = (v) => () => {
    console.log("set_clipboard")
    clipboard = v
}
export const get_clipboard = () => {
    console.log("get_clipboard")
    return clipboard
}
