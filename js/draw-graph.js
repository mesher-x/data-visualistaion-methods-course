const svgNS = 'http://www.w3.org/2000/svg'
let svg = null
let g = null
let gv = null
let ge = null

let margin = 0.1

export function initSVG() {
    svg = document.createElementNS(svgNS, 'svg')
    setLimits()
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    svg.innerHTML = [
        '<marker id="arrow" viewBox="0 0 10 10"',
        'refX="5" refY="5" fill="#ccc"',
        'markerWidth="5" markerHeight="5"',
        'orient="auto-start-reverse">',
        '<path d="M 0 0 L 10 5 L 0 10 z" />',
        '</marker>'
    ].join('\n')

    g = createElem('g', svg)
    ge = createElem('g', g)
    gv = createElem('g', g)

    g.setAttribute('stroke', 'blue')
    gv.setAttribute('fill', 'red')
    ge.setAttribute('fill', 'green')

    document.body.appendChild(svg)
    return svg
}

function createElem(tagName, parent) {
    let e = document.createElementNS(svgNS, tagName)
    if (parent) parent.appendChild(e)
    return e
}

function drawPoint(e, xy, name) {
    if (!e) {
        e = createElem('circle', gv)
        if (name) {
            let title = createElem('title', e)
            title.textContent = name
        }
    }
    e.setAttribute('r', '0.75em')
    e.setAttribute('cx', xy[0])
    e.setAttribute('cy', xy[1])
    return e
}

function drawLine(e, xy0, xy1) {
    if (!e) e = createElem('path', ge)
    let path = `M ${xy0[0]} ${xy0[1]}`
    let tm = 0.8
    let xm = xy0[0] * (1-tm) + xy1[0] * tm
    let ym = xy0[1] * (1-tm) + xy1[1] * tm
    path += ` L ${xm} ${ym}`
    path += ` L ${xy1[0]} ${xy1[1]}`
    e.setAttribute('d', path)
    e.setAttribute('marker-mid', 'url(#arrow)')
    return e
}

let defaultLimits = [0, 0, 1, 1]

function setLimits(limits) {
    if (!limits) limits = defaultLimits
    let w = limits[2] - limits[0]
    let h = limits[3] - limits[1]
    let xm = margin * Math.max(w, 0.5)
    let ym = margin * Math.max(h, 0.5)
    let view = [limits[0]-xm, limits[1]-ym, w+2*xm, h+2*ym]
    svg.setAttribute('viewBox', view.join(' '))
    return (w + h + 2 * (xm + ym)) / 2
}

export function drawGraph(graph2d) {
    clearGraph()
    let limScale = setLimits(graph2d.limits)
    let scale = 0.1 * limScale / (graph2d.n) ** 0.7

    g.setAttribute('font-size', scale)
    g.setAttribute('stroke-width', '0.2em')
    let elems = ge.children
    let i = 0
    graph2d.iterEdges((a, b) => {
        drawLine(elems[i++], graph2d.coords[a], graph2d.coords[b])
    })
    elems = gv.children
    i = 0
    graph2d.iterVertices(a => {
        drawPoint(elems[i++], graph2d.coords[a], graph2d.getVertexName(a))
    }, false)
}

export function clearGraph() {
    gv.innerHTML = ''
    ge.innerHTML = ''
}
