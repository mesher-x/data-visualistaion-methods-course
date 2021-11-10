import {Graph} from './graph.js'

let chance = p => (Math.random() < p)

export function randomDAG(n = 10, p = Math.sqrt(1/n)) {
    let graph = new Graph(n, true)
    graph.iterPairs((a, b) => {
        if (!chance(p)) return
        if (a < b) {
            graph.setEdge(a, b)
        } else {
            graph.setEdge(b, a)
        }
    })
    return graph
}

function addSubtree(arr, n) {
    if (n <= 0) return arr
    let squash = chance(0.35)
    let subtree = randomTreeSlice(n - !squash)
    if (squash) {
        arr = arr.concat(subtree)
    } else {
        arr.push(subtree)
    }
    return arr
}

function randomTreeSlice(n) {
    if (n <= 0) return []
    if (n == 1) return [[]]
    let rand = n => Math.floor(Math.random() * n)
    let pos = rand(n + 1)
    return addSubtree(addSubtree([], pos), n - pos)
}

export function randomTree(n = 10) {
    let graph = new Graph(n)

    let i = 0
    function visit(arr) {
        let a = i
        for (let sub of arr) {
            i++
            graph.setEdge(a, i)
            visit(sub)
        }
    }

    if (n > 0) visit(randomTreeSlice(n - 1))
    return graph
}