import {parseGraphML} from "./graphml-core.js"

export function selectFile(callback, extMask = undefined, readContents = true) {
	let input = document.createElement('input')
	input.type = 'file'
	input.accept = extMask
	input.style.opacity = '0'
	input.style.position = 'fixed'
	input.style.top = '0'
	input.style.left = '0'
	document.body.appendChild(input)
	input.click()
	input.onchange = function() {
        runCallback(input.files, callback, readContents)
	}
	document.body.addEventListener('focusin', function() {
		document.body.removeChild(input)
	}, {once: true})
}

function runCallback(files, callback, readContents) {
    if (!files || !files[0]) return
    if (readContents) {
        getFileContents(files[0], callback)
    } else {
        callback(files)
    }
}

function getFileContents(file, contentCallback) {
	let reader = new FileReader()
	reader.onerror = () => alert('File reading faileure')
	reader.onload = () => contentCallback(reader.result)
	reader.readAsBinaryString(file)
}

export function selectGraph(callback) {
    selectFile(content => callback(parseGraphML(content)), '.xml, application/xml')
}
