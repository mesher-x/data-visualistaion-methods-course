export function treeCoords(graph) {
    let roots = []
    graph.invsets.forEach((s, i) => {
        if (s.size == 0) roots.push(i)
    })
    let visited = Array(graph.n)
    visited.fill(false)
    let step = 0.8

    function mergeTwoHulls(hull, lhull, rhull) {
        let dist = 0
        let depth = Math.min(lhull[0].length, rhull[0].length)
        for (let h = 0; h < depth; h++) {
            let currDist = lhull[1][h] - rhull[0][h]
            if (dist < currDist) dist = currDist
        }
        dist += step
        hull[0] = lhull[0].concat(rhull[0].slice(lhull[0].length).map(x => x + dist))
        hull[1] = rhull[1].map(x => x + dist).concat(lhull[1].slice(rhull[1].length))
        return dist
    }

    function mergeTrees(nodes, h) {
        if (nodes.length == 0) {
            return [[0], [0]]
        }
        let middle = Math.floor(nodes.length / 2)
        let hull = nodes[middle].hull

        // merging from right
        let rdist = 0
        for (let i = middle + 1; i < nodes.length; i++) {
            let r = nodes[i]
            rdist = mergeTwoHulls(hull, hull, r.hull)
            r.offset = rdist
        }

        // merging from left
        let ldist = 0
        for (let i = middle - 1; i >= 0; i--) {
            let l = nodes[i]
            ldist -= mergeTwoHulls(hull, l.hull, hull)
            l.offset = ldist
        }

        let center = (rdist + ldist) / 2
        let shift = (rdist - ldist) / 2
        hull = hull.map(half => {
            let newHalf = half.map(x => x - shift)
            newHalf.unshift(0)
            return newHalf
        })
        nodes.forEach(c => {
            c.offset -= center
        })
        return hull
    }

    function computeNode(u, h) {
        visited[u] = true
        let children = Array.from(graph.sets[u])
            .filter(v => !visited[v])
            .map(v => computeNode(v, h + 1))
        
        let hull = mergeTrees(children, h)

        return {
            index: u,
            offset: 0,
            hull,
            children
        }
    }

    function computeCoords(node, x, y) {
        x += node.offset
        graph.coords[node.index] = [x, y]
        let step2 = 0.5 * step
        graph.limits[0] = Math.min(graph.limits[0], x - step2)
        graph.limits[2] = Math.max(graph.limits[2], x + step2)
        graph.limits[3] = Math.max(graph.limits[3], y)
        y += 1
        node.children.forEach(c => computeCoords(c, x, y))
    }

    graph.coords = Array(graph.n)
    graph.limits = [0, 0, 0, 0]
    if (roots.length == 1) {
        let rootNode = computeNode(roots[0], 0)
        computeCoords(rootNode, 0, 0)
    } else {
        let rootNodes = roots.map(root => computeNode(root, 0))
        mergeTrees(rootNodes, 0)
        rootNodes.forEach(rootNode => computeCoords(rootNode, 0, 0))
    }

    return graph
}
