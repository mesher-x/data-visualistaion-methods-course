import {Graph} from './graph.js'

function parseStringAsXML(xmlText) {
    let parser = new DOMParser()
    let xml = parser.parseFromString(xmlText, 'text/xml')
    if (xml.activeElement.tagName == 'parsererror') {
        let errorNodes = xml.activeElement.childNodes
        throw new Error(errorNodes[0].data + '\n' + errorNodes[1].textContent)
    }
    return xml
}

export function parseGraphML(xmlText) {
    try {
        let xml = parseStringAsXML(xmlText)
        let graphElem = xml.getElementsByTagName('graph')[0]
        if (!graphElem) {
            throw new Error('no <graph> element')
        }
        let children = Array.from(graphElem.children)
        let edgeType = graphElem.getAttribute('edgedefault')

        let vertexIds = children.filter(e => e.tagName == 'node').map(e => e.id)
        function indexById(id) {
            let index = vertexIds.indexOf(id)
            if (index == -1) {
                throw new Error(`did not find node with id '${id}'`)
            }
            return index
        }

        let graph = new Graph(vertexIds.length)
        graph.ids = vertexIds
        children.filter(e => e.tagName == 'edge').forEach(e => {
            let a = indexById(e.getAttribute('source'))
            let b = indexById(e.getAttribute('target'))
            graph.setEdge(a, b)
        })
        return graph
    } catch(error) {
        alert('GraphML parse failure\n' + error)
        throw error
    }
}