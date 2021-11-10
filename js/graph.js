
let range = (n, f = i => i) => [...Array(n)].map((_, i) => (typeof f == "function" ? f(i) : f))

export class Graph {
    constructor(n) {
        if (n instanceof Graph) {
            Object.assign(this, n)
            this.sets = this.sets.map(x => new Set(x))
            this.invsets = this.invsets.map(x => new Set(x))
            this.halfsets = this.halfsets.map(x => new Set(x))
            this.table = this.table.map(x => Array.from(x))
            return
        }
        this.n = n
        this.sets = range(n, _ => new Set())
        this.invsets = range(n, _ => new Set())
        this.halfsets = range(n, _ => new Set())
        this.table = range(n, _ => range(n, 0))

        this.nDummies = 0
        
        this.coords = null
        this.ids = null
    }

    setEdge(a, b) {
        if (this.table[a][b]) return
        this.table[a][b] = 1
        this.sets[a].add(b)
        this.invsets[b].add(a)
        if (a < b) {
            this.halfsets[a].add(b)
        } else {
            this.halfsets[b].add(a)
        }
    }

    removeEdge(a, b) {
        if (!this.table[a][b]) return
        this.table[a][b] = 0
        this.sets[a].delete(b)
        this.invsets[b].delete(a)
        if (a < b) {
            this.halfsets[a].delete(b)
        } else {
            this.halfsets[b].delete(a)
        }
    }

    hasEdge(a, b) {
        return this.table[a][b]
    }

    addVertex(isDummy = true) {
        this.n++
        this.sets.push(new Set())
        this.invsets.push(new Set())
        this.halfsets.push(new Set())
        this.table.forEach(row => row.push(0))
        this.table.push(range(this.n, 0))
        if (isDummy) this.nDummies++
        return this.n - 1
    }

    iterPairs(f) {
        for (let b = 1; b < this.n; b++) {
            for (let a = 0; a < b; a++) f(a, b)
        }
    }

    iterVertices(f, withDummies = true) {
        let n = this.n
        if (!withDummies) n -= this.nDummies
        for (let a = 0; a < n; a++) f(a)
    }

    iterEdges(f) {
        let sets = this.sets
        this.iterVertices(a => sets[a].forEach(b => f(a, b)))
    }

    getVertexName(a) {
        return this.ids ? this.ids[a] : a.toString()
    }

    isDummy(a) {
        return a >= this.n - this.nDummies
    }

    copy(deepCopy = true) {
        return new Graph(this, deepCopy)
    }
}
