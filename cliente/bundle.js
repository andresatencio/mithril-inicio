(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var m = require('mithril');

var otra = require('./paginas/otra');
var inicio = require('./paginas/inicio');

m.route.mode = 'pathname';

m.route(document.getElementById('bundle'), "/", {
  "/": inicio,
  "/otra": otra
});

},{"./paginas/inicio":2,"./paginas/otra":3,"mithril":4}],2:[function(require,module,exports){
'use strict';

var m = require('mithril');

var vista = {
	view: function view() {
		return {
			tag: 'div',
			children: [{
				tag: 'h1',
				children: ['Inicio']
			}, {
				tag: 'a',
				children: [' Ir a otra '],
				attrs: { href: '/otra', config: m.route }
			}]
		};
	}
};

module.exports = vista;

},{"mithril":4}],3:[function(require,module,exports){
'use strict';

var m = require('mithril');

var vista = {
	view: function view() {
		return {
			tag: 'div',
			children: [{
				tag: 'h1',
				children: ['Otra']
			}, {
				tag: 'a',
				children: [' Ir a inicio '],
				attrs: { href: '/', config: m.route }
			}]
		};
	}
};

module.exports = vista;

},{"mithril":4}],4:[function(require,module,exports){
;(function (global, factory) { // eslint-disable-line
	"use strict"
	/* eslint-disable no-undef */
	var m = factory(global)
	if (typeof module === "object" && module != null && module.exports) {
		module.exports = m
	} else if (typeof define === "function" && define.amd) {
		define(function () { return m })
	} else {
		global.m = m
	}
	/* eslint-enable no-undef */
})(typeof window !== "undefined" ? window : this, function (global, undefined) { // eslint-disable-line
	"use strict"

	m.version = function () {
		return "v0.2.5"
	}

	var hasOwn = {}.hasOwnProperty
	var type = {}.toString

	function isFunction(object) {
		return typeof object === "function"
	}

	function isObject(object) {
		return type.call(object) === "[object Object]"
	}

	function isString(object) {
		return type.call(object) === "[object String]"
	}

	var isArray = Array.isArray || function (object) {
		return type.call(object) === "[object Array]"
	}

	function noop() {}

	var voidElements = {
		AREA: 1,
		BASE: 1,
		BR: 1,
		COL: 1,
		COMMAND: 1,
		EMBED: 1,
		HR: 1,
		IMG: 1,
		INPUT: 1,
		KEYGEN: 1,
		LINK: 1,
		META: 1,
		PARAM: 1,
		SOURCE: 1,
		TRACK: 1,
		WBR: 1
	}

	// caching commonly used variables
	var $document, $location, $requestAnimationFrame, $cancelAnimationFrame

	// self invoking function needed because of the way mocks work
	function initialize(mock) {
		$document = mock.document
		$location = mock.location
		$cancelAnimationFrame = mock.cancelAnimationFrame || mock.clearTimeout
		$requestAnimationFrame = mock.requestAnimationFrame || mock.setTimeout
	}

	// testing API
	m.deps = function (mock) {
		initialize(global = mock || window)
		return global
	}

	m.deps(global)

	/**
	 * @typedef {String} Tag
	 * A string that looks like -> div.classname#id[param=one][param2=two]
	 * Which describes a DOM node
	 */

	function parseTagAttrs(cell, tag) {
		var classes = []
		var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g
		var match

		while ((match = parser.exec(tag))) {
			if (match[1] === "" && match[2]) {
				cell.tag = match[2]
			} else if (match[1] === "#") {
				cell.attrs.id = match[2]
			} else if (match[1] === ".") {
				classes.push(match[2])
			} else if (match[3][0] === "[") {
				var pair = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/.exec(match[3])
				cell.attrs[pair[1]] = pair[3] || ""
			}
		}

		return classes
	}

	function getVirtualChildren(args, hasAttrs) {
		var children = hasAttrs ? args.slice(1) : args

		if (children.length === 1 && isArray(children[0])) {
			return children[0]
		} else {
			return children
		}
	}

	function assignAttrs(target, attrs, classes) {
		var classAttr = "class" in attrs ? "class" : "className"

		for (var attrName in attrs) {
			if (hasOwn.call(attrs, attrName)) {
				if (attrName === classAttr &&
						attrs[attrName] != null &&
						attrs[attrName] !== "") {
					classes.push(attrs[attrName])
					// create key in correct iteration order
					target[attrName] = ""
				} else {
					target[attrName] = attrs[attrName]
				}
			}
		}

		if (classes.length) target[classAttr] = classes.join(" ")
	}

	/**
	 *
	 * @param {Tag} The DOM node tag
	 * @param {Object=[]} optional key-value pairs to be mapped to DOM attrs
	 * @param {...mNode=[]} Zero or more Mithril child nodes. Can be an array,
	 *                      or splat (optional)
	 */
	function m(tag, pairs) {
		var args = []

		for (var i = 1, length = arguments.length; i < length; i++) {
			args[i - 1] = arguments[i]
		}

		if (isObject(tag)) return parameterize(tag, args)

		if (!isString(tag)) {
			throw new Error("selector in m(selector, attrs, children) should " +
				"be a string")
		}

		var hasAttrs = pairs != null && isObject(pairs) &&
			!("tag" in pairs || "view" in pairs || "subtree" in pairs)

		var attrs = hasAttrs ? pairs : {}
		var cell = {
			tag: "div",
			attrs: {},
			children: getVirtualChildren(args, hasAttrs)
		}

		assignAttrs(cell.attrs, attrs, parseTagAttrs(cell, tag))
		return cell
	}

	function forEach(list, f) {
		for (var i = 0; i < list.length && !f(list[i], i++);) {
			// function called in condition
		}
	}

	function forKeys(list, f) {
		forEach(list, function (attrs, i) {
			return (attrs = attrs && attrs.attrs) &&
				attrs.key != null &&
				f(attrs, i)
		})
	}
	// This function was causing deopts in Chrome.
	function dataToString(data) {
		// data.toString() might throw or return null if data is the return
		// value of Console.log in some versions of Firefox (behavior depends on
		// version)
		try {
			if (data != null && data.toString() != null) return data
		} catch (e) {
			// silently ignore errors
		}
		return ""
	}

	// This function was causing deopts in Chrome.
	function injectTextNode(parentElement, first, index, data) {
		try {
			insertNode(parentElement, first, index)
			first.nodeValue = data
		} catch (e) {
			// IE erroneously throws error when appending an empty text node
			// after a null
		}
	}

	function flatten(list) {
		// recursively flatten array
		for (var i = 0; i < list.length; i++) {
			if (isArray(list[i])) {
				list = list.concat.apply([], list)
				// check current index again and flatten until there are no more
				// nested arrays at that index
				i--
			}
		}
		return list
	}

	function insertNode(parentElement, node, index) {
		parentElement.insertBefore(node,
			parentElement.childNodes[index] || null)
	}

	var DELETION = 1
	var INSERTION = 2
	var MOVE = 3

	function handleKeysDiffer(data, existing, cached, parentElement) {
		forKeys(data, function (key, i) {
			existing[key = key.key] = existing[key] ? {
				action: MOVE,
				index: i,
				from: existing[key].index,
				element: cached.nodes[existing[key].index] ||
					$document.createElement("div")
			} : {action: INSERTION, index: i}
		})

		var actions = []
		for (var prop in existing) {
			if (hasOwn.call(existing, prop)) {
				actions.push(existing[prop])
			}
		}

		var changes = actions.sort(sortChanges)
		var newCached = new Array(cached.length)

		newCached.nodes = cached.nodes.slice()

		forEach(changes, function (change) {
			var index = change.index
			if (change.action === DELETION) {
				clear(cached[index].nodes, cached[index])
				newCached.splice(index, 1)
			}
			if (change.action === INSERTION) {
				var dummy = $document.createElement("div")
				dummy.key = data[index].attrs.key
				insertNode(parentElement, dummy, index)
				newCached.splice(index, 0, {
					attrs: {key: data[index].attrs.key},
					nodes: [dummy]
				})
				newCached.nodes[index] = dummy
			}

			if (change.action === MOVE) {
				var changeElement = change.element
				var maybeChanged = parentElement.childNodes[index]
				if (maybeChanged !== changeElement && changeElement !== null) {
					parentElement.insertBefore(changeElement,
						maybeChanged || null)
				}
				newCached[index] = cached[change.from]
				newCached.nodes[index] = changeElement
			}
		})

		return newCached
	}

	function diffKeys(data, cached, existing, parentElement) {
		var keysDiffer = data.length !== cached.length

		if (!keysDiffer) {
			forKeys(data, function (attrs, i) {
				var cachedCell = cached[i]
				return keysDiffer = cachedCell &&
					cachedCell.attrs &&
					cachedCell.attrs.key !== attrs.key
			})
		}

		if (keysDiffer) {
			return handleKeysDiffer(data, existing, cached, parentElement)
		} else {
			return cached
		}
	}

	function diffArray(data, cached, nodes) {
		// diff the array itself

		// update the list of DOM nodes by collecting the nodes from each item
		forEach(data, function (_, i) {
			if (cached[i] != null) nodes.push.apply(nodes, cached[i].nodes)
		})
		// remove items from the end of the array if the new array is shorter
		// than the old one. if errors ever happen here, the issue is most
		// likely a bug in the construction of the `cached` data structure
		// somewhere earlier in the program
		forEach(cached.nodes, function (node, i) {
			if (node.parentNode != null && nodes.indexOf(node) < 0) {
				clear([node], [cached[i]])
			}
		})

		if (data.length < cached.length) cached.length = data.length
		cached.nodes = nodes
	}

	function buildArrayKeys(data) {
		var guid = 0
		forKeys(data, function () {
			forEach(data, function (attrs) {
				if ((attrs = attrs && attrs.attrs) && attrs.key == null) {
					attrs.key = "__mithril__" + guid++
				}
			})
			return 1
		})
	}

	function isDifferentEnough(data, cached, dataAttrKeys) {
		if (data.tag !== cached.tag) return true

		if (dataAttrKeys.sort().join() !==
				Object.keys(cached.attrs).sort().join()) {
			return true
		}

		if (data.attrs.id !== cached.attrs.id) {
			return true
		}

		if (data.attrs.key !== cached.attrs.key) {
			return true
		}

		if (m.redraw.strategy() === "all") {
			return !cached.configContext || cached.configContext.retain !== true
		}

		if (m.redraw.strategy() === "diff") {
			return cached.configContext && cached.configContext.retain === false
		}

		return false
	}

	function maybeRecreateObject(data, cached, dataAttrKeys) {
		// if an element is different enough from the one in cache, recreate it
		if (isDifferentEnough(data, cached, dataAttrKeys)) {
			if (cached.nodes.length) clear(cached.nodes)

			if (cached.configContext &&
					isFunction(cached.configContext.onunload)) {
				cached.configContext.onunload()
			}

			if (cached.controllers) {
				forEach(cached.controllers, function (controller) {
					if (controller.onunload) {
						controller.onunload({preventDefault: noop})
					}
				})
			}
		}
	}

	function getObjectNamespace(data, namespace) {
		if (data.attrs.xmlns) return data.attrs.xmlns
		if (data.tag === "svg") return "http://www.w3.org/2000/svg"
		if (data.tag === "math") return "http://www.w3.org/1998/Math/MathML"
		return namespace
	}

	var pendingRequests = 0
	m.startComputation = function () { pendingRequests++ }
	m.endComputation = function () {
		if (pendingRequests > 1) {
			pendingRequests--
		} else {
			pendingRequests = 0
			m.redraw()
		}
	}

	function unloadCachedControllers(cached, views, controllers) {
		if (controllers.length) {
			cached.views = views
			cached.controllers = controllers
			forEach(controllers, function (controller) {
				if (controller.onunload && controller.onunload.$old) {
					controller.onunload = controller.onunload.$old
				}

				if (pendingRequests && controller.onunload) {
					var onunload = controller.onunload
					controller.onunload = noop
					controller.onunload.$old = onunload
				}
			})
		}
	}

	function scheduleConfigsToBeCalled(configs, data, node, isNew, cached) {
		// schedule configs to be called. They are called after `build` finishes
		// running
		if (isFunction(data.attrs.config)) {
			var context = cached.configContext = cached.configContext || {}

			// bind
			configs.push(function () {
				return data.attrs.config.call(data, node, !isNew, context,
					cached)
			})
		}
	}

	function buildUpdatedNode(
		cached,
		data,
		editable,
		hasKeys,
		namespace,
		views,
		configs,
		controllers
	) {
		var node = cached.nodes[0]

		if (hasKeys) {
			setAttributes(node, data.tag, data.attrs, cached.attrs, namespace)
		}

		cached.children = build(
			node,
			data.tag,
			undefined,
			undefined,
			data.children,
			cached.children,
			false,
			0,
			data.attrs.contenteditable ? node : editable,
			namespace,
			configs
		)

		cached.nodes.intact = true

		if (controllers.length) {
			cached.views = views
			cached.controllers = controllers
		}

		return node
	}

	function handleNonexistentNodes(data, parentElement, index) {
		var nodes
		if (data.$trusted) {
			nodes = injectHTML(parentElement, index, data)
		} else {
			nodes = [$document.createTextNode(data)]
			if (!(parentElement.nodeName in voidElements)) {
				insertNode(parentElement, nodes[0], index)
			}
		}

		var cached

		if (typeof data === "string" ||
				typeof data === "number" ||
				typeof data === "boolean") {
			cached = new data.constructor(data)
		} else {
			cached = data
		}

		cached.nodes = nodes
		return cached
	}

	function reattachNodes(
		data,
		cached,
		parentElement,
		editable,
		index,
		parentTag
	) {
		var nodes = cached.nodes
		if (!editable || editable !== $document.activeElement) {
			if (data.$trusted) {
				clear(nodes, cached)
				nodes = injectHTML(parentElement, index, data)
			} else if (parentTag === "textarea") {
				// <textarea> uses `value` instead of `nodeValue`.
				parentElement.value = data
			} else if (editable) {
				// contenteditable nodes use `innerHTML` instead of `nodeValue`.
				editable.innerHTML = data
			} else {
				// was a trusted string
				if (nodes[0].nodeType === 1 || nodes.length > 1 ||
						(nodes[0].nodeValue.trim &&
							!nodes[0].nodeValue.trim())) {
					clear(cached.nodes, cached)
					nodes = [$document.createTextNode(data)]
				}

				injectTextNode(parentElement, nodes[0], index, data)
			}
		}
		cached = new data.constructor(data)
		cached.nodes = nodes
		return cached
	}

	function handleTextNode(
		cached,
		data,
		index,
		parentElement,
		shouldReattach,
		editable,
		parentTag
	) {
		if (!cached.nodes.length) {
			return handleNonexistentNodes(data, parentElement, index)
		} else if (cached.valueOf() !== data.valueOf() || shouldReattach) {
			return reattachNodes(data, cached, parentElement, editable, index,
				parentTag)
		} else {
			return (cached.nodes.intact = true, cached)
		}
	}

	function getSubArrayCount(item) {
		if (item.$trusted) {
			// fix offset of next element if item was a trusted string w/ more
			// than one html element
			// the first clause in the regexp matches elements
			// the second clause (after the pipe) matches text nodes
			var match = item.match(/<[^\/]|\>\s*[^<]/g)
			if (match != null) return match.length
		} else if (isArray(item)) {
			return item.length
		}
		return 1
	}

	function buildArray(
		data,
		cached,
		parentElement,
		index,
		parentTag,
		shouldReattach,
		editable,
		namespace,
		configs
	) {
		data = flatten(data)
		var nodes = []
		var intact = cached.length === data.length
		var subArrayCount = 0

		// keys algorithm: sort elements without recreating them if keys are
		// present
		//
		// 1) create a map of all existing keys, and mark all for deletion
		// 2) add new keys to map and mark them for addition
		// 3) if key exists in new list, change action from deletion to a move
		// 4) for each key, handle its corresponding action as marked in
		//    previous steps

		var existing = {}
		var shouldMaintainIdentities = false

		forKeys(cached, function (attrs, i) {
			shouldMaintainIdentities = true
			existing[cached[i].attrs.key] = {action: DELETION, index: i}
		})

		buildArrayKeys(data)
		if (shouldMaintainIdentities) {
			cached = diffKeys(data, cached, existing, parentElement)
		}
		// end key algorithm

		var cacheCount = 0
		// faster explicitly written
		for (var i = 0, len = data.length; i < len; i++) {
			// diff each item in the array
			var item = build(
				parentElement,
				parentTag,
				cached,
				index,
				data[i],
				cached[cacheCount],
				shouldReattach,
				index + subArrayCount || subArrayCount,
				editable,
				namespace,
				configs)

			if (item !== undefined) {
				intact = intact && item.nodes.intact
				subArrayCount += getSubArrayCount(item)
				cached[cacheCount++] = item
			}
		}

		if (!intact) diffArray(data, cached, nodes)
		return cached
	}

	function makeCache(data, cached, index, parentIndex, parentCache) {
		if (cached != null) {
			if (type.call(cached) === type.call(data)) return cached

			if (parentCache && parentCache.nodes) {
				var offset = index - parentIndex
				var end = offset + (isArray(data) ? data : cached.nodes).length
				clear(
					parentCache.nodes.slice(offset, end),
					parentCache.slice(offset, end))
			} else if (cached.nodes) {
				clear(cached.nodes, cached)
			}
		}

		cached = new data.constructor()
		// if constructor creates a virtual dom element, use a blank object as
		// the base cached node instead of copying the virtual el (#277)
		if (cached.tag) cached = {}
		cached.nodes = []
		return cached
	}

	function constructNode(data, namespace) {
		if (data.attrs.is) {
			if (namespace == null) {
				return $document.createElement(data.tag, data.attrs.is)
			} else {
				return $document.createElementNS(namespace, data.tag,
					data.attrs.is)
			}
		} else if (namespace == null) {
			return $document.createElement(data.tag)
		} else {
			return $document.createElementNS(namespace, data.tag)
		}
	}

	function constructAttrs(data, node, namespace, hasKeys) {
		if (hasKeys) {
			return setAttributes(node, data.tag, data.attrs, {}, namespace)
		} else {
			return data.attrs
		}
	}

	function constructChildren(
		data,
		node,
		cached,
		editable,
		namespace,
		configs
	) {
		if (data.children != null && data.children.length > 0) {
			return build(
				node,
				data.tag,
				undefined,
				undefined,
				data.children,
				cached.children,
				true,
				0,
				data.attrs.contenteditable ? node : editable,
				namespace,
				configs)
		} else {
			return data.children
		}
	}

	function reconstructCached(
		data,
		attrs,
		children,
		node,
		namespace,
		views,
		controllers
	) {
		var cached = {
			tag: data.tag,
			attrs: attrs,
			children: children,
			nodes: [node]
		}

		unloadCachedControllers(cached, views, controllers)

		if (cached.children && !cached.children.nodes) {
			cached.children.nodes = []
		}

		// edge case: setting value on <select> doesn't work before children
		// exist, so set it again after children have been created
		if (data.tag === "select" && "value" in data.attrs) {
			setAttributes(node, data.tag, {value: data.attrs.value}, {},
				namespace)
		}

		return cached
	}

	function getController(views, view, cachedControllers, controller) {
		var controllerIndex

		if (m.redraw.strategy() === "diff" && views) {
			controllerIndex = views.indexOf(view)
		} else {
			controllerIndex = -1
		}

		if (controllerIndex > -1) {
			return cachedControllers[controllerIndex]
		} else if (isFunction(controller)) {
			return new controller()
		} else {
			return {}
		}
	}

	var unloaders = []

	function updateLists(views, controllers, view, controller) {
		if (controller.onunload != null &&
				unloaders.map(function (u) { return u.handler })
					.indexOf(controller.onunload) < 0) {
			unloaders.push({
				controller: controller,
				handler: controller.onunload
			})
		}

		views.push(view)
		controllers.push(controller)
	}

	var forcing = false
	function checkView(
		data,
		view,
		cached,
		cachedControllers,
		controllers,
		views
	) {
		var controller = getController(
			cached.views,
			view,
			cachedControllers,
			data.controller)

		var key = data && data.attrs && data.attrs.key

		if (pendingRequests === 0 ||
				forcing ||
				cachedControllers &&
					cachedControllers.indexOf(controller) > -1) {
			data = data.view(controller)
		} else {
			data = {tag: "placeholder"}
		}

		if (data.subtree === "retain") return data
		data.attrs = data.attrs || {}
		data.attrs.key = key
		updateLists(views, controllers, view, controller)
		return data
	}

	function markViews(data, cached, views, controllers) {
		var cachedControllers = cached && cached.controllers

		while (data.view != null) {
			data = checkView(
				data,
				data.view.$original || data.view,
				cached,
				cachedControllers,
				controllers,
				views)
		}

		return data
	}

	function buildObject( // eslint-disable-line max-statements
		data,
		cached,
		editable,
		parentElement,
		index,
		shouldReattach,
		namespace,
		configs
	) {
		var views = []
		var controllers = []

		data = markViews(data, cached, views, controllers)

		if (data.subtree === "retain") return cached

		if (!data.tag && controllers.length) {
			throw new Error("Component template must return a virtual " +
				"element, not an array, string, etc.")
		}

		data.attrs = data.attrs || {}
		cached.attrs = cached.attrs || {}

		var dataAttrKeys = Object.keys(data.attrs)
		var hasKeys = dataAttrKeys.length > ("key" in data.attrs ? 1 : 0)

		maybeRecreateObject(data, cached, dataAttrKeys)

		if (!isString(data.tag)) return

		var isNew = cached.nodes.length === 0

		namespace = getObjectNamespace(data, namespace)

		var node
		if (isNew) {
			node = constructNode(data, namespace)
			// set attributes first, then create children
			var attrs = constructAttrs(data, node, namespace, hasKeys)

			// add the node to its parent before attaching children to it
			insertNode(parentElement, node, index)

			var children = constructChildren(data, node, cached, editable,
				namespace, configs)

			cached = reconstructCached(
				data,
				attrs,
				children,
				node,
				namespace,
				views,
				controllers)
		} else {
			node = buildUpdatedNode(
				cached,
				data,
				editable,
				hasKeys,
				namespace,
				views,
				configs,
				controllers)
		}

		if (!isNew && shouldReattach === true && node != null) {
			insertNode(parentElement, node, index)
		}

		// The configs are called after `build` finishes running
		scheduleConfigsToBeCalled(configs, data, node, isNew, cached)

		return cached
	}

	function build(
		parentElement,
		parentTag,
		parentCache,
		parentIndex,
		data,
		cached,
		shouldReattach,
		index,
		editable,
		namespace,
		configs
	) {
		/*
		 * `build` is a recursive function that manages creation/diffing/removal
		 * of DOM elements based on comparison between `data` and `cached` the
		 * diff algorithm can be summarized as this:
		 *
		 * 1 - compare `data` and `cached`
		 * 2 - if they are different, copy `data` to `cached` and update the DOM
		 *     based on what the difference is
		 * 3 - recursively apply this algorithm for every array and for the
		 *     children of every virtual element
		 *
		 * The `cached` data structure is essentially the same as the previous
		 * redraw's `data` data structure, with a few additions:
		 * - `cached` always has a property called `nodes`, which is a list of
		 *    DOM elements that correspond to the data represented by the
		 *    respective virtual element
		 * - in order to support attaching `nodes` as a property of `cached`,
		 *    `cached` is *always* a non-primitive object, i.e. if the data was
		 *    a string, then cached is a String instance. If data was `null` or
		 *    `undefined`, cached is `new String("")`
		 * - `cached also has a `configContext` property, which is the state
		 *    storage object exposed by config(element, isInitialized, context)
		 * - when `cached` is an Object, it represents a virtual element; when
		 *    it's an Array, it represents a list of elements; when it's a
		 *    String, Number or Boolean, it represents a text node
		 *
		 * `parentElement` is a DOM element used for W3C DOM API calls
		 * `parentTag` is only used for handling a corner case for textarea
		 * values
		 * `parentCache` is used to remove nodes in some multi-node cases
		 * `parentIndex` and `index` are used to figure out the offset of nodes.
		 * They're artifacts from before arrays started being flattened and are
		 * likely refactorable
		 * `data` and `cached` are, respectively, the new and old nodes being
		 * diffed
		 * `shouldReattach` is a flag indicating whether a parent node was
		 * recreated (if so, and if this node is reused, then this node must
		 * reattach itself to the new parent)
		 * `editable` is a flag that indicates whether an ancestor is
		 * contenteditable
		 * `namespace` indicates the closest HTML namespace as it cascades down
		 * from an ancestor
		 * `configs` is a list of config functions to run after the topmost
		 * `build` call finishes running
		 *
		 * there's logic that relies on the assumption that null and undefined
		 * data are equivalent to empty strings
		 * - this prevents lifecycle surprises from procedural helpers that mix
		 *   implicit and explicit return statements (e.g.
		 *   function foo() {if (cond) return m("div")}
		 * - it simplifies diffing code
		 */
		data = dataToString(data)
		if (data.subtree === "retain") return cached
		cached = makeCache(data, cached, index, parentIndex, parentCache)

		if (isArray(data)) {
			return buildArray(
				data,
				cached,
				parentElement,
				index,
				parentTag,
				shouldReattach,
				editable,
				namespace,
				configs)
		} else if (data != null && isObject(data)) {
			return buildObject(
				data,
				cached,
				editable,
				parentElement,
				index,
				shouldReattach,
				namespace,
				configs)
		} else if (!isFunction(data)) {
			return handleTextNode(
				cached,
				data,
				index,
				parentElement,
				shouldReattach,
				editable,
				parentTag)
		} else {
			return cached
		}
	}

	function sortChanges(a, b) {
		return a.action - b.action || a.index - b.index
	}

	function copyStyleAttrs(node, dataAttr, cachedAttr) {
		for (var rule in dataAttr) {
			if (hasOwn.call(dataAttr, rule)) {
				if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) {
					node.style[rule] = dataAttr[rule]
				}
			}
		}

		for (rule in cachedAttr) {
			if (hasOwn.call(cachedAttr, rule)) {
				if (!hasOwn.call(dataAttr, rule)) node.style[rule] = ""
			}
		}
	}

	var shouldUseSetAttribute = {
		list: 1,
		style: 1,
		form: 1,
		type: 1,
		width: 1,
		height: 1
	}

	function setSingleAttr(
		node,
		attrName,
		dataAttr,
		cachedAttr,
		tag,
		namespace
	) {
		if (attrName === "config" || attrName === "key") {
			// `config` isn't a real attribute, so ignore it
			return true
		} else if (isFunction(dataAttr) && attrName.slice(0, 2) === "on") {
			// hook event handlers to the auto-redrawing system
			node[attrName] = autoredraw(dataAttr, node)
		} else if (attrName === "style" && dataAttr != null &&
				isObject(dataAttr)) {
			// handle `style: {...}`
			copyStyleAttrs(node, dataAttr, cachedAttr)
		} else if (namespace != null) {
			// handle SVG
			if (attrName === "href") {
				node.setAttributeNS("http://www.w3.org/1999/xlink",
					"href", dataAttr)
			} else {
				node.setAttribute(
					attrName === "className" ? "class" : attrName,
					dataAttr)
			}
		} else if (attrName in node && !shouldUseSetAttribute[attrName]) {
			// handle cases that are properties (but ignore cases where we
			// should use setAttribute instead)
			//
			// - list and form are typically used as strings, but are DOM
			//   element references in js
			//
			// - when using CSS selectors (e.g. `m("[style='']")`), style is
			//   used as a string, but it's an object in js
			//
			// #348 don't set the value if not needed - otherwise, cursor
			// placement breaks in Chrome
			try {
				if (tag !== "input" || node[attrName] !== dataAttr) {
					node[attrName] = dataAttr
				}
			} catch (e) {
				node.setAttribute(attrName, dataAttr)
			}
		}
		else node.setAttribute(attrName, dataAttr)
	}

	function trySetAttr(
		node,
		attrName,
		dataAttr,
		cachedAttr,
		cachedAttrs,
		tag,
		namespace
	) {
		if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr) || ($document.activeElement === node)) {
			cachedAttrs[attrName] = dataAttr
			try {
				return setSingleAttr(
					node,
					attrName,
					dataAttr,
					cachedAttr,
					tag,
					namespace)
			} catch (e) {
				// swallow IE's invalid argument errors to mimic HTML's
				// fallback-to-doing-nothing-on-invalid-attributes behavior
				if (e.message.indexOf("Invalid argument") < 0) throw e
			}
		} else if (attrName === "value" && tag === "input" &&
				node.value !== dataAttr) {
			// #348 dataAttr may not be a string, so use loose comparison
			node.value = dataAttr
		}
	}

	function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
		for (var attrName in dataAttrs) {
			if (hasOwn.call(dataAttrs, attrName)) {
				if (trySetAttr(
						node,
						attrName,
						dataAttrs[attrName],
						cachedAttrs[attrName],
						cachedAttrs,
						tag,
						namespace)) {
					continue
				}
			}
		}
		return cachedAttrs
	}

	function clear(nodes, cached) {
		for (var i = nodes.length - 1; i > -1; i--) {
			if (nodes[i] && nodes[i].parentNode) {
				try {
					nodes[i].parentNode.removeChild(nodes[i])
				} catch (e) {
					/* eslint-disable max-len */
					// ignore if this fails due to order of events (see
					// http://stackoverflow.com/questions/21926083/failed-to-execute-removechild-on-node)
					/* eslint-enable max-len */
				}
				cached = [].concat(cached)
				if (cached[i]) unload(cached[i])
			}
		}
		// release memory if nodes is an array. This check should fail if nodes
		// is a NodeList (see loop above)
		if (nodes.length) {
			nodes.length = 0
		}
	}

	function unload(cached) {
		if (cached.configContext && isFunction(cached.configContext.onunload)) {
			cached.configContext.onunload()
			cached.configContext.onunload = null
		}
		if (cached.controllers) {
			forEach(cached.controllers, function (controller) {
				if (isFunction(controller.onunload)) {
					controller.onunload({preventDefault: noop})
				}
			})
		}
		if (cached.children) {
			if (isArray(cached.children)) forEach(cached.children, unload)
			else if (cached.children.tag) unload(cached.children)
		}
	}

	function appendTextFragment(parentElement, data) {
		try {
			parentElement.appendChild(
				$document.createRange().createContextualFragment(data))
		} catch (e) {
			parentElement.insertAdjacentHTML("beforeend", data)
			replaceScriptNodes(parentElement)
		}
	}

	// Replace script tags inside given DOM element with executable ones.
	// Will also check children recursively and replace any found script
	// tags in same manner.
	function replaceScriptNodes(node) {
		if (node.tagName === "SCRIPT") {
			node.parentNode.replaceChild(buildExecutableNode(node), node)
		} else {
			var children = node.childNodes
			if (children && children.length) {
				for (var i = 0; i < children.length; i++) {
					replaceScriptNodes(children[i])
				}
			}
		}

		return node
	}

	// Replace script element with one whose contents are executable.
	function buildExecutableNode(node){
		var scriptEl = document.createElement("script")
		var attrs = node.attributes

		for (var i = 0; i < attrs.length; i++) {
			scriptEl.setAttribute(attrs[i].name, attrs[i].value)
		}

		scriptEl.text = node.innerHTML
		return scriptEl
	}

	function injectHTML(parentElement, index, data) {
		var nextSibling = parentElement.childNodes[index]
		if (nextSibling) {
			var isElement = nextSibling.nodeType !== 1
			var placeholder = $document.createElement("span")
			if (isElement) {
				parentElement.insertBefore(placeholder, nextSibling || null)
				placeholder.insertAdjacentHTML("beforebegin", data)
				parentElement.removeChild(placeholder)
			} else {
				nextSibling.insertAdjacentHTML("beforebegin", data)
			}
		} else {
			appendTextFragment(parentElement, data)
		}

		var nodes = []

		while (parentElement.childNodes[index] !== nextSibling) {
			nodes.push(parentElement.childNodes[index])
			index++
		}

		return nodes
	}

	function autoredraw(callback, object) {
		return function (e) {
			e = e || event
			m.redraw.strategy("diff")
			m.startComputation()
			try {
				return callback.call(object, e)
			} finally {
				endFirstComputation()
			}
		}
	}

	var html
	var documentNode = {
		appendChild: function (node) {
			if (html === undefined) html = $document.createElement("html")
			if ($document.documentElement &&
					$document.documentElement !== node) {
				$document.replaceChild(node, $document.documentElement)
			} else {
				$document.appendChild(node)
			}

			this.childNodes = $document.childNodes
		},

		insertBefore: function (node) {
			this.appendChild(node)
		},

		childNodes: []
	}

	var nodeCache = []
	var cellCache = {}

	m.render = function (root, cell, forceRecreation) {
		if (!root) {
			throw new Error("Ensure the DOM element being passed to " +
				"m.route/m.mount/m.render is not undefined.")
		}
		var configs = []
		var id = getCellCacheKey(root)
		var isDocumentRoot = root === $document
		var node

		if (isDocumentRoot || root === $document.documentElement) {
			node = documentNode
		} else {
			node = root
		}

		if (isDocumentRoot && cell.tag !== "html") {
			cell = {tag: "html", attrs: {}, children: cell}
		}

		if (cellCache[id] === undefined) clear(node.childNodes)
		if (forceRecreation === true) reset(root)

		cellCache[id] = build(
			node,
			null,
			undefined,
			undefined,
			cell,
			cellCache[id],
			false,
			0,
			null,
			undefined,
			configs)

		forEach(configs, function (config) { config() })
	}

	function getCellCacheKey(element) {
		var index = nodeCache.indexOf(element)
		return index < 0 ? nodeCache.push(element) - 1 : index
	}

	m.trust = function (value) {
		value = new String(value) // eslint-disable-line no-new-wrappers
		value.$trusted = true
		return value
	}

	function gettersetter(store) {
		function prop() {
			if (arguments.length) store = arguments[0]
			return store
		}

		prop.toJSON = function () {
			return store
		}

		return prop
	}

	m.prop = function (store) {
		if ((store != null && (isObject(store) || isFunction(store)) || ((typeof Promise !== "undefined") && (store instanceof Promise))) &&
				isFunction(store.then)) {
			return propify(store)
		}

		return gettersetter(store)
	}

	var roots = []
	var components = []
	var controllers = []
	var lastRedrawId = null
	var lastRedrawCallTime = 0
	var computePreRedrawHook = null
	var computePostRedrawHook = null
	var topComponent
	var FRAME_BUDGET = 16 // 60 frames per second = 1 call per 16 ms

	function parameterize(component, args) {
		function controller() {
			/* eslint-disable no-invalid-this */
			return (component.controller || noop).apply(this, args) || this
			/* eslint-enable no-invalid-this */
		}

		if (component.controller) {
			controller.prototype = component.controller.prototype
		}

		function view(ctrl) {
			var currentArgs = [ctrl].concat(args)
			for (var i = 1; i < arguments.length; i++) {
				currentArgs.push(arguments[i])
			}

			return component.view.apply(component, currentArgs)
		}

		view.$original = component.view
		var output = {controller: controller, view: view}
		if (args[0] && args[0].key != null) output.attrs = {key: args[0].key}
		return output
	}

	m.component = function (component) {
		var args = new Array(arguments.length - 1)

		for (var i = 1; i < arguments.length; i++) {
			args[i - 1] = arguments[i]
		}

		return parameterize(component, args)
	}

	function checkPrevented(component, root, index, isPrevented) {
		if (!isPrevented) {
			m.redraw.strategy("all")
			m.startComputation()
			roots[index] = root
			var currentComponent

			if (component) {
				currentComponent = topComponent = component
			} else {
				currentComponent = topComponent = component = {controller: noop}
			}

			var controller = new (component.controller || noop)()

			// controllers may call m.mount recursively (via m.route redirects,
			// for example)
			// this conditional ensures only the last recursive m.mount call is
			// applied
			if (currentComponent === topComponent) {
				controllers[index] = controller
				components[index] = component
			}
			endFirstComputation()
			if (component === null) {
				removeRootElement(root, index)
			}
			return controllers[index]
		} else if (component == null) {
			removeRootElement(root, index)
		}
	}

	m.mount = m.module = function (root, component) {
		if (!root) {
			throw new Error("Please ensure the DOM element exists before " +
				"rendering a template into it.")
		}

		var index = roots.indexOf(root)
		if (index < 0) index = roots.length

		var isPrevented = false
		var event = {
			preventDefault: function () {
				isPrevented = true
				computePreRedrawHook = computePostRedrawHook = null
			}
		}

		forEach(unloaders, function (unloader) {
			unloader.handler.call(unloader.controller, event)
			unloader.controller.onunload = null
		})

		if (isPrevented) {
			forEach(unloaders, function (unloader) {
				unloader.controller.onunload = unloader.handler
			})
		} else {
			unloaders = []
		}

		if (controllers[index] && isFunction(controllers[index].onunload)) {
			controllers[index].onunload(event)
		}

		return checkPrevented(component, root, index, isPrevented)
	}

	function removeRootElement(root, index) {
		roots.splice(index, 1)
		controllers.splice(index, 1)
		components.splice(index, 1)
		reset(root)
		nodeCache.splice(getCellCacheKey(root), 1)
	}

	var redrawing = false
	m.redraw = function (force) {
		if (redrawing) return
		redrawing = true
		if (force) forcing = true

		try {
			// lastRedrawId is a positive number if a second redraw is requested
			// before the next animation frame
			// lastRedrawId is null if it's the first redraw and not an event
			// handler
			if (lastRedrawId && !force) {
				// when setTimeout: only reschedule redraw if time between now
				// and previous redraw is bigger than a frame, otherwise keep
				// currently scheduled timeout
				// when rAF: always reschedule redraw
				if ($requestAnimationFrame === global.requestAnimationFrame ||
						new Date() - lastRedrawCallTime > FRAME_BUDGET) {
					if (lastRedrawId > 0) $cancelAnimationFrame(lastRedrawId)
					lastRedrawId = $requestAnimationFrame(redraw, FRAME_BUDGET)
				}
			} else {
				redraw()
				lastRedrawId = $requestAnimationFrame(function () {
					lastRedrawId = null
				}, FRAME_BUDGET)
			}
		} finally {
			redrawing = forcing = false
		}
	}

	m.redraw.strategy = m.prop()
	function redraw() {
		if (computePreRedrawHook) {
			computePreRedrawHook()
			computePreRedrawHook = null
		}
		forEach(roots, function (root, i) {
			var component = components[i]
			if (controllers[i]) {
				var args = [controllers[i]]
				m.render(root,
					component.view ? component.view(controllers[i], args) : "")
			}
		})
		// after rendering within a routed context, we need to scroll back to
		// the top, and fetch the document title for history.pushState
		if (computePostRedrawHook) {
			computePostRedrawHook()
			computePostRedrawHook = null
		}
		lastRedrawId = null
		lastRedrawCallTime = new Date()
		m.redraw.strategy("diff")
	}

	function endFirstComputation() {
		if (m.redraw.strategy() === "none") {
			pendingRequests--
			m.redraw.strategy("diff")
		} else {
			m.endComputation()
		}
	}

	m.withAttr = function (prop, withAttrCallback, callbackThis) {
		return function (e) {
			e = e || window.event
			/* eslint-disable no-invalid-this */
			var currentTarget = e.currentTarget || this
			var _this = callbackThis || this
			/* eslint-enable no-invalid-this */
			var target = prop in currentTarget ?
				currentTarget[prop] :
				currentTarget.getAttribute(prop)
			withAttrCallback.call(_this, target)
		}
	}

	// routing
	var modes = {pathname: "", hash: "#", search: "?"}
	var redirect = noop
	var isDefaultRoute = false
	var routeParams, currentRoute

	m.route = function (root, arg1, arg2, vdom) { // eslint-disable-line
		// m.route()
		if (arguments.length === 0) return currentRoute
		// m.route(el, defaultRoute, routes)
		if (arguments.length === 3 && isString(arg1)) {
			redirect = function (source) {
				var path = currentRoute = normalizeRoute(source)
				if (!routeByValue(root, arg2, path)) {
					if (isDefaultRoute) {
						throw new Error("Ensure the default route matches " +
							"one of the routes defined in m.route")
					}

					isDefaultRoute = true
					m.route(arg1, true)
					isDefaultRoute = false
				}
			}

			var listener = m.route.mode === "hash" ?
				"onhashchange" :
				"onpopstate"

			global[listener] = function () {
				var path = $location[m.route.mode]
				if (m.route.mode === "pathname") path += $location.search
				if (currentRoute !== normalizeRoute(path)) redirect(path)
			}

			computePreRedrawHook = setScroll
			global[listener]()

			return
		}

		// config: m.route
		if (root.addEventListener || root.attachEvent) {
			var base = m.route.mode !== "pathname" ? $location.pathname : ""
			root.href = base + modes[m.route.mode] + vdom.attrs.href
			if (root.addEventListener) {
				root.removeEventListener("click", routeUnobtrusive)
				root.addEventListener("click", routeUnobtrusive)
			} else {
				root.detachEvent("onclick", routeUnobtrusive)
				root.attachEvent("onclick", routeUnobtrusive)
			}

			return
		}
		// m.route(route, params, shouldReplaceHistoryEntry)
		if (isString(root)) {
			var oldRoute = currentRoute
			currentRoute = root

			var args = arg1 || {}
			var queryIndex = currentRoute.indexOf("?")
			var params

			if (queryIndex > -1) {
				params = parseQueryString(currentRoute.slice(queryIndex + 1))
			} else {
				params = {}
			}

			for (var i in args) {
				if (hasOwn.call(args, i)) {
					params[i] = args[i]
				}
			}

			var querystring = buildQueryString(params)
			var currentPath

			if (queryIndex > -1) {
				currentPath = currentRoute.slice(0, queryIndex)
			} else {
				currentPath = currentRoute
			}

			if (querystring) {
				currentRoute = currentPath +
					(currentPath.indexOf("?") === -1 ? "?" : "&") +
					querystring
			}

			var replaceHistory =
				(arguments.length === 3 ? arg2 : arg1) === true ||
				oldRoute === root

			if (global.history.pushState) {
				var method = replaceHistory ? "replaceState" : "pushState"
				computePreRedrawHook = setScroll
				computePostRedrawHook = function () {
					try {
						global.history[method](null, $document.title,
							modes[m.route.mode] + currentRoute)
					} catch (err) {
						// In the event of a pushState or replaceState failure,
						// fallback to a standard redirect. This is specifically
						// to address a Safari security error when attempting to
						// call pushState more than 100 times.
						$location[m.route.mode] = currentRoute
					}
				}
				redirect(modes[m.route.mode] + currentRoute)
			} else {
				$location[m.route.mode] = currentRoute
				redirect(modes[m.route.mode] + currentRoute)
			}
		}
	}

	m.route.param = function (key) {
		if (!routeParams) {
			throw new Error("You must call m.route(element, defaultRoute, " +
				"routes) before calling m.route.param()")
		}

		if (!key) {
			return routeParams
		}

		return routeParams[key]
	}

	m.route.mode = "search"

	function normalizeRoute(route) {
		return route.slice(modes[m.route.mode].length)
	}

	function routeByValue(root, router, path) {
		routeParams = {}

		var queryStart = path.indexOf("?")
		if (queryStart !== -1) {
			routeParams = parseQueryString(
				path.substr(queryStart + 1, path.length))
			path = path.substr(0, queryStart)
		}

		// Get all routes and check if there's
		// an exact match for the current path
		var keys = Object.keys(router)
		var index = keys.indexOf(path)

		if (index !== -1){
			m.mount(root, router[keys [index]])
			return true
		}

		for (var route in router) {
			if (hasOwn.call(router, route)) {
				if (route === path) {
					m.mount(root, router[route])
					return true
				}

				var matcher = new RegExp("^" + route
					.replace(/:[^\/]+?\.{3}/g, "(.*?)")
					.replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$")

				if (matcher.test(path)) {
					/* eslint-disable no-loop-func */
					path.replace(matcher, function () {
						var keys = route.match(/:[^\/]+/g) || []
						var values = [].slice.call(arguments, 1, -2)
						forEach(keys, function (key, i) {
							routeParams[key.replace(/:|\./g, "")] =
								decodeURIComponent(values[i])
						})
						m.mount(root, router[route])
					})
					/* eslint-enable no-loop-func */
					return true
				}
			}
		}
	}

	function routeUnobtrusive(e) {
		e = e || event
		if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return

		if (e.preventDefault) {
			e.preventDefault()
		} else {
			e.returnValue = false
		}

		var currentTarget = e.currentTarget || e.srcElement
		var args

		if (m.route.mode === "pathname" && currentTarget.search) {
			args = parseQueryString(currentTarget.search.slice(1))
		} else {
			args = {}
		}

		while (currentTarget && !/a/i.test(currentTarget.nodeName)) {
			currentTarget = currentTarget.parentNode
		}

		// clear pendingRequests because we want an immediate route change
		pendingRequests = 0
		m.route(currentTarget[m.route.mode]
			.slice(modes[m.route.mode].length), args)
	}

	function setScroll() {
		if (m.route.mode !== "hash" && $location.hash) {
			$location.hash = $location.hash
		} else {
			global.scrollTo(0, 0)
		}
	}

	function buildQueryString(object, prefix) {
		var duplicates = {}
		var str = []

		for (var prop in object) {
			if (hasOwn.call(object, prop)) {
				var key = prefix ? prefix + "[" + prop + "]" : prop
				var value = object[prop]

				if (value === null) {
					str.push(encodeURIComponent(key))
				} else if (isObject(value)) {
					str.push(buildQueryString(value, key))
				} else if (isArray(value)) {
					var keys = []
					duplicates[key] = duplicates[key] || {}
					/* eslint-disable no-loop-func */
					forEach(value, function (item) {
						/* eslint-enable no-loop-func */
						if (!duplicates[key][item]) {
							duplicates[key][item] = true
							keys.push(encodeURIComponent(key) + "=" +
								encodeURIComponent(item))
						}
					})
					str.push(keys.join("&"))
				} else if (value !== undefined) {
					str.push(encodeURIComponent(key) + "=" +
						encodeURIComponent(value))
				}
			}
		}

		return str.join("&")
	}

	function parseQueryString(str) {
		if (str === "" || str == null) return {}
		if (str.charAt(0) === "?") str = str.slice(1)

		var pairs = str.split("&")
		var params = {}

		forEach(pairs, function (string) {
			var pair = string.split("=")
			var key = decodeURIComponent(pair[0])
			var value = pair.length === 2 ? decodeURIComponent(pair[1]) : null
			if (params[key] != null) {
				if (!isArray(params[key])) params[key] = [params[key]]
				params[key].push(value)
			}
			else params[key] = value
		})

		return params
	}

	m.route.buildQueryString = buildQueryString
	m.route.parseQueryString = parseQueryString

	function reset(root) {
		var cacheKey = getCellCacheKey(root)
		clear(root.childNodes, cellCache[cacheKey])
		cellCache[cacheKey] = undefined
	}

	m.deferred = function () {
		var deferred = new Deferred()
		deferred.promise = propify(deferred.promise)
		return deferred
	}

	function propify(promise, initialValue) {
		var prop = m.prop(initialValue)
		promise.then(prop)
		prop.then = function (resolve, reject) {
			return propify(promise.then(resolve, reject), initialValue)
		}

		prop.catch = prop.then.bind(null, null)
		return prop
	}
	// Promiz.mithril.js | Zolmeister | MIT
	// a modified version of Promiz.js, which does not conform to Promises/A+
	// for two reasons:
	//
	// 1) `then` callbacks are called synchronously (because setTimeout is too
	//    slow, and the setImmediate polyfill is too big
	//
	// 2) throwing subclasses of Error cause the error to be bubbled up instead
	//    of triggering rejection (because the spec does not account for the
	//    important use case of default browser error handling, i.e. message w/
	//    line number)

	var RESOLVING = 1
	var REJECTING = 2
	var RESOLVED = 3
	var REJECTED = 4

	function Deferred(onSuccess, onFailure) {
		var self = this
		var state = 0
		var promiseValue = 0
		var next = []

		self.promise = {}

		self.resolve = function (value) {
			if (!state) {
				promiseValue = value
				state = RESOLVING

				fire()
			}

			return self
		}

		self.reject = function (value) {
			if (!state) {
				promiseValue = value
				state = REJECTING

				fire()
			}

			return self
		}

		self.promise.then = function (onSuccess, onFailure) {
			var deferred = new Deferred(onSuccess, onFailure)

			if (state === RESOLVED) {
				deferred.resolve(promiseValue)
			} else if (state === REJECTED) {
				deferred.reject(promiseValue)
			} else {
				next.push(deferred)
			}

			return deferred.promise
		}

		function finish(type) {
			state = type || REJECTED
			next.map(function (deferred) {
				if (state === RESOLVED) {
					deferred.resolve(promiseValue)
				} else {
					deferred.reject(promiseValue)
				}
			})
		}

		function thennable(then, success, failure, notThennable) {
			if (((promiseValue != null && isObject(promiseValue)) ||
					isFunction(promiseValue)) && isFunction(then)) {
				try {
					// count protects against abuse calls from spec checker
					var count = 0
					then.call(promiseValue, function (value) {
						if (count++) return
						promiseValue = value
						success()
					}, function (value) {
						if (count++) return
						promiseValue = value
						failure()
					})
				} catch (e) {
					m.deferred.onerror(e)
					promiseValue = e
					failure()
				}
			} else {
				notThennable()
			}
		}

		function fire() {
			// check if it's a thenable
			var then
			try {
				then = promiseValue && promiseValue.then
			} catch (e) {
				m.deferred.onerror(e)
				promiseValue = e
				state = REJECTING
				return fire()
			}

			if (state === REJECTING) {
				m.deferred.onerror(promiseValue)
			}

			thennable(then, function () {
				state = RESOLVING
				fire()
			}, function () {
				state = REJECTING
				fire()
			}, function () {
				try {
					if (state === RESOLVING && isFunction(onSuccess)) {
						promiseValue = onSuccess(promiseValue)
					} else if (state === REJECTING && isFunction(onFailure)) {
						promiseValue = onFailure(promiseValue)
						state = RESOLVING
					}
				} catch (e) {
					m.deferred.onerror(e)
					promiseValue = e
					return finish()
				}

				if (promiseValue === self) {
					promiseValue = TypeError()
					finish()
				} else {
					thennable(then, function () {
						finish(RESOLVED)
					}, finish, function () {
						finish(state === RESOLVING && RESOLVED)
					})
				}
			})
		}
	}

	m.deferred.onerror = function (e) {
		if (type.call(e) === "[object Error]" &&
				!/ Error/.test(e.constructor.toString())) {
			pendingRequests = 0
			throw e
		}
	}

	m.sync = function (args) {
		var deferred = m.deferred()
		var outstanding = args.length
		var results = []
		var method = "resolve"

		function synchronizer(pos, resolved) {
			return function (value) {
				results[pos] = value
				if (!resolved) method = "reject"
				if (--outstanding === 0) {
					deferred.promise(results)
					deferred[method](results)
				}
				return value
			}
		}

		if (args.length > 0) {
			forEach(args, function (arg, i) {
				arg.then(synchronizer(i, true), synchronizer(i, false))
			})
		} else {
			deferred.resolve([])
		}

		return deferred.promise
	}

	function identity(value) { return value }

	function handleJsonp(options) {
		var callbackKey = options.callbackName || "mithril_callback_" +
			new Date().getTime() + "_" +
			(Math.round(Math.random() * 1e16)).toString(36)

		var script = $document.createElement("script")

		global[callbackKey] = function (resp) {
			script.parentNode.removeChild(script)
			options.onload({
				type: "load",
				target: {
					responseText: resp
				}
			})
			global[callbackKey] = undefined
		}

		script.onerror = function () {
			script.parentNode.removeChild(script)

			options.onerror({
				type: "error",
				target: {
					status: 500,
					responseText: JSON.stringify({
						error: "Error making jsonp request"
					})
				}
			})
			global[callbackKey] = undefined

			return false
		}

		script.onload = function () {
			return false
		}

		script.src = options.url +
			(options.url.indexOf("?") > 0 ? "&" : "?") +
			(options.callbackKey ? options.callbackKey : "callback") +
			"=" + callbackKey +
			"&" + buildQueryString(options.data || {})

		$document.body.appendChild(script)
	}

	function createXhr(options) {
		var xhr = new global.XMLHttpRequest()
		xhr.open(options.method, options.url, true, options.user,
			options.password)

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status >= 200 && xhr.status < 300) {
					options.onload({type: "load", target: xhr})
				} else {
					options.onerror({type: "error", target: xhr})
				}
			}
		}

		if (options.serialize === JSON.stringify &&
				options.data &&
				options.method !== "GET") {
			xhr.setRequestHeader("Content-Type",
				"application/json; charset=utf-8")
		}

		if (options.deserialize === JSON.parse) {
			xhr.setRequestHeader("Accept", "application/json, text/*")
		}

		if (isFunction(options.config)) {
			var maybeXhr = options.config(xhr, options)
			if (maybeXhr != null) xhr = maybeXhr
		}

		var data = options.method === "GET" || !options.data ? "" : options.data

		if (data && !isString(data) && data.constructor !== global.FormData) {
			throw new Error("Request data should be either be a string or " +
				"FormData. Check the `serialize` option in `m.request`")
		}

		xhr.send(data)
		return xhr
	}

	function ajax(options) {
		if (options.dataType && options.dataType.toLowerCase() === "jsonp") {
			return handleJsonp(options)
		} else {
			return createXhr(options)
		}
	}

	function bindData(options, data, serialize) {
		if (options.method === "GET" && options.dataType !== "jsonp") {
			var prefix = options.url.indexOf("?") < 0 ? "?" : "&"
			var querystring = buildQueryString(data)
			options.url += (querystring ? prefix + querystring : "")
		} else {
			options.data = serialize(data)
		}
	}

	function parameterizeUrl(url, data) {
		if (data) {
			url = url.replace(/:[a-z]\w+/gi, function (token){
				var key = token.slice(1)
				var value = data[key] || token
				delete data[key]
				return value
			})
		}
		return url
	}

	m.request = function (options) {
		if (options.background !== true) m.startComputation()
		var deferred = new Deferred()
		var isJSONP = options.dataType &&
			options.dataType.toLowerCase() === "jsonp"

		var serialize, deserialize, extract

		if (isJSONP) {
			serialize = options.serialize =
			deserialize = options.deserialize = identity

			extract = function (jsonp) { return jsonp.responseText }
		} else {
			serialize = options.serialize = options.serialize || JSON.stringify

			deserialize = options.deserialize =
				options.deserialize || JSON.parse
			extract = options.extract || function (xhr) {
				if (xhr.responseText.length || deserialize !== JSON.parse) {
					return xhr.responseText
				} else {
					return null
				}
			}
		}

		options.method = (options.method || "GET").toUpperCase()
		options.url = parameterizeUrl(options.url, options.data)
		bindData(options, options.data, serialize)
		options.onload = options.onerror = function (ev) {
			try {
				ev = ev || event
				var response = deserialize(extract(ev.target, options))
				if (ev.type === "load") {
					if (options.unwrapSuccess) {
						response = options.unwrapSuccess(response, ev.target)
					}

					if (isArray(response) && options.type) {
						forEach(response, function (res, i) {
							response[i] = new options.type(res)
						})
					} else if (options.type) {
						response = new options.type(response)
					}

					deferred.resolve(response)
				} else {
					if (options.unwrapError) {
						response = options.unwrapError(response, ev.target)
					}

					deferred.reject(response)
				}
			} catch (e) {
				deferred.reject(e)
				m.deferred.onerror(e)
			} finally {
				if (options.background !== true) m.endComputation()
			}
		}

		ajax(options)
		deferred.promise = propify(deferred.promise, options.initialValue)
		return deferred.promise
	}

	return m
}); // eslint-disable-line

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnRlL2luZGV4LmpzIiwiY2xpZW50ZS9wYWdpbmFzL2luaWNpby5qcyIsImNsaWVudGUvcGFnaW5hcy9vdHJhLmpzIiwibm9kZV9tb2R1bGVzL21pdGhyaWwvbWl0aHJpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBTSxJQUFJLFFBQVEsU0FBUixDQUFWOztBQUVBLElBQU0sT0FBTyxRQUFRLGdCQUFSLENBQWI7QUFDQSxJQUFNLFNBQVMsUUFBUSxrQkFBUixDQUFmOztBQUVBLEVBQUUsS0FBRixDQUFRLElBQVIsR0FBZSxVQUFmOztBQUVBLEVBQUUsS0FBRixDQUFRLFNBQVMsY0FBVCxDQUF3QixRQUF4QixDQUFSLEVBQTJDLEdBQTNDLEVBQWdEO0FBQzlDLE9BQUssTUFEeUM7QUFFOUMsV0FBVTtBQUZvQyxDQUFoRDs7Ozs7QUNQQSxJQUFNLElBQUksUUFBUSxTQUFSLENBQVY7O0FBRUEsSUFBTSxRQUFRO0FBQ2IsT0FBTSxnQkFBTTtBQUNYO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUdLLE1BQUssT0FIVixFQUdrQixRQUFRLEVBQUUsS0FINUI7QUFBQTtBQUFBO0FBS0E7QUFQWSxDQUFkOztBQVVBLE9BQU8sT0FBUCxHQUFpQixLQUFqQjs7Ozs7QUNaQSxJQUFNLElBQUksUUFBUSxTQUFSLENBQVY7O0FBRUEsSUFBTSxRQUFRO0FBQ2IsT0FBTSxnQkFBTTtBQUNYO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUdLLE1BQUssR0FIVixFQUdjLFFBQVEsRUFBRSxLQUh4QjtBQUFBO0FBQUE7QUFLQTtBQVBZLENBQWQ7O0FBVUEsT0FBTyxPQUFQLEdBQWlCLEtBQWpCOzs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IG0gPSByZXF1aXJlKCdtaXRocmlsJylcblxuY29uc3Qgb3RyYSA9IHJlcXVpcmUoJy4vcGFnaW5hcy9vdHJhJylcbmNvbnN0IGluaWNpbyA9IHJlcXVpcmUoJy4vcGFnaW5hcy9pbmljaW8nKVxuXG5tLnJvdXRlLm1vZGUgPSAncGF0aG5hbWUnO1xuXG5tLnJvdXRlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidW5kbGUnKSwgXCIvXCIsIHtcbiAgXCIvXCI6IGluaWNpbyxcbiAgXCIvb3RyYVwiOiAgb3RyYVxufSk7XG5cbiIsImNvbnN0IG0gPSByZXF1aXJlKCdtaXRocmlsJylcblxuY29uc3QgdmlzdGEgPSB7XG5cdHZpZXc6ICgpID0+IHtcblx0XHRyZXR1cm4oXG5cdFx0XHQ8ZGl2PlxuXHRcdFx0XHQ8aDE+SW5pY2lvPC9oMT5cblx0XHRcdFx0PGEgaHJlZj0nL290cmEnIGNvbmZpZz17bS5yb3V0ZX0+IElyIGEgb3RyYSA8L2E+XG5cdFx0XHQ8L2Rpdj4pXG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB2aXN0YSIsImNvbnN0IG0gPSByZXF1aXJlKCdtaXRocmlsJylcblxuY29uc3QgdmlzdGEgPSB7XG5cdHZpZXc6ICgpID0+IHtcblx0XHRyZXR1cm4oXG5cdFx0XHQ8ZGl2PlxuXHRcdFx0XHQ8aDE+T3RyYTwvaDE+XG5cdFx0XHRcdDxhIGhyZWY9Jy8nIGNvbmZpZz17bS5yb3V0ZX0+IElyIGEgaW5pY2lvIDwvYT5cblx0XHRcdDwvZGl2Pilcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHZpc3RhIiwiOyhmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuXHRcInVzZSBzdHJpY3RcIlxyXG5cdC8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXHJcblx0dmFyIG0gPSBmYWN0b3J5KGdsb2JhbClcclxuXHRpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiBtb2R1bGUgIT0gbnVsbCAmJiBtb2R1bGUuZXhwb3J0cykge1xyXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBtXHJcblx0fSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xyXG5cdFx0ZGVmaW5lKGZ1bmN0aW9uICgpIHsgcmV0dXJuIG0gfSlcclxuXHR9IGVsc2Uge1xyXG5cdFx0Z2xvYmFsLm0gPSBtXHJcblx0fVxyXG5cdC8qIGVzbGludC1lbmFibGUgbm8tdW5kZWYgKi9cclxufSkodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHRoaXMsIGZ1bmN0aW9uIChnbG9iYWwsIHVuZGVmaW5lZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcblx0XCJ1c2Ugc3RyaWN0XCJcclxuXHJcblx0bS52ZXJzaW9uID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIFwidjAuMi41XCJcclxuXHR9XHJcblxyXG5cdHZhciBoYXNPd24gPSB7fS5oYXNPd25Qcm9wZXJ0eVxyXG5cdHZhciB0eXBlID0ge30udG9TdHJpbmdcclxuXHJcblx0ZnVuY3Rpb24gaXNGdW5jdGlvbihvYmplY3QpIHtcclxuXHRcdHJldHVybiB0eXBlb2Ygb2JqZWN0ID09PSBcImZ1bmN0aW9uXCJcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGlzT2JqZWN0KG9iamVjdCkge1xyXG5cdFx0cmV0dXJuIHR5cGUuY2FsbChvYmplY3QpID09PSBcIltvYmplY3QgT2JqZWN0XVwiXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBpc1N0cmluZyhvYmplY3QpIHtcclxuXHRcdHJldHVybiB0eXBlLmNhbGwob2JqZWN0KSA9PT0gXCJbb2JqZWN0IFN0cmluZ11cIlxyXG5cdH1cclxuXHJcblx0dmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChvYmplY3QpIHtcclxuXHRcdHJldHVybiB0eXBlLmNhbGwob2JqZWN0KSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBub29wKCkge31cclxuXHJcblx0dmFyIHZvaWRFbGVtZW50cyA9IHtcclxuXHRcdEFSRUE6IDEsXHJcblx0XHRCQVNFOiAxLFxyXG5cdFx0QlI6IDEsXHJcblx0XHRDT0w6IDEsXHJcblx0XHRDT01NQU5EOiAxLFxyXG5cdFx0RU1CRUQ6IDEsXHJcblx0XHRIUjogMSxcclxuXHRcdElNRzogMSxcclxuXHRcdElOUFVUOiAxLFxyXG5cdFx0S0VZR0VOOiAxLFxyXG5cdFx0TElOSzogMSxcclxuXHRcdE1FVEE6IDEsXHJcblx0XHRQQVJBTTogMSxcclxuXHRcdFNPVVJDRTogMSxcclxuXHRcdFRSQUNLOiAxLFxyXG5cdFx0V0JSOiAxXHJcblx0fVxyXG5cclxuXHQvLyBjYWNoaW5nIGNvbW1vbmx5IHVzZWQgdmFyaWFibGVzXHJcblx0dmFyICRkb2N1bWVudCwgJGxvY2F0aW9uLCAkcmVxdWVzdEFuaW1hdGlvbkZyYW1lLCAkY2FuY2VsQW5pbWF0aW9uRnJhbWVcclxuXHJcblx0Ly8gc2VsZiBpbnZva2luZyBmdW5jdGlvbiBuZWVkZWQgYmVjYXVzZSBvZiB0aGUgd2F5IG1vY2tzIHdvcmtcclxuXHRmdW5jdGlvbiBpbml0aWFsaXplKG1vY2spIHtcclxuXHRcdCRkb2N1bWVudCA9IG1vY2suZG9jdW1lbnRcclxuXHRcdCRsb2NhdGlvbiA9IG1vY2subG9jYXRpb25cclxuXHRcdCRjYW5jZWxBbmltYXRpb25GcmFtZSA9IG1vY2suY2FuY2VsQW5pbWF0aW9uRnJhbWUgfHwgbW9jay5jbGVhclRpbWVvdXRcclxuXHRcdCRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBtb2NrLnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCBtb2NrLnNldFRpbWVvdXRcclxuXHR9XHJcblxyXG5cdC8vIHRlc3RpbmcgQVBJXHJcblx0bS5kZXBzID0gZnVuY3Rpb24gKG1vY2spIHtcclxuXHRcdGluaXRpYWxpemUoZ2xvYmFsID0gbW9jayB8fCB3aW5kb3cpXHJcblx0XHRyZXR1cm4gZ2xvYmFsXHJcblx0fVxyXG5cclxuXHRtLmRlcHMoZ2xvYmFsKVxyXG5cclxuXHQvKipcclxuXHQgKiBAdHlwZWRlZiB7U3RyaW5nfSBUYWdcclxuXHQgKiBBIHN0cmluZyB0aGF0IGxvb2tzIGxpa2UgLT4gZGl2LmNsYXNzbmFtZSNpZFtwYXJhbT1vbmVdW3BhcmFtMj10d29dXHJcblx0ICogV2hpY2ggZGVzY3JpYmVzIGEgRE9NIG5vZGVcclxuXHQgKi9cclxuXHJcblx0ZnVuY3Rpb24gcGFyc2VUYWdBdHRycyhjZWxsLCB0YWcpIHtcclxuXHRcdHZhciBjbGFzc2VzID0gW11cclxuXHRcdHZhciBwYXJzZXIgPSAvKD86KF58I3xcXC4pKFteI1xcLlxcW1xcXV0rKSl8KFxcWy4rP1xcXSkvZ1xyXG5cdFx0dmFyIG1hdGNoXHJcblxyXG5cdFx0d2hpbGUgKChtYXRjaCA9IHBhcnNlci5leGVjKHRhZykpKSB7XHJcblx0XHRcdGlmIChtYXRjaFsxXSA9PT0gXCJcIiAmJiBtYXRjaFsyXSkge1xyXG5cdFx0XHRcdGNlbGwudGFnID0gbWF0Y2hbMl1cclxuXHRcdFx0fSBlbHNlIGlmIChtYXRjaFsxXSA9PT0gXCIjXCIpIHtcclxuXHRcdFx0XHRjZWxsLmF0dHJzLmlkID0gbWF0Y2hbMl1cclxuXHRcdFx0fSBlbHNlIGlmIChtYXRjaFsxXSA9PT0gXCIuXCIpIHtcclxuXHRcdFx0XHRjbGFzc2VzLnB1c2gobWF0Y2hbMl0pXHJcblx0XHRcdH0gZWxzZSBpZiAobWF0Y2hbM11bMF0gPT09IFwiW1wiKSB7XHJcblx0XHRcdFx0dmFyIHBhaXIgPSAvXFxbKC4rPykoPzo9KFwifCd8KSguKj8pXFwyKT9cXF0vLmV4ZWMobWF0Y2hbM10pXHJcblx0XHRcdFx0Y2VsbC5hdHRyc1twYWlyWzFdXSA9IHBhaXJbM10gfHwgXCJcIlxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGNsYXNzZXNcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldFZpcnR1YWxDaGlsZHJlbihhcmdzLCBoYXNBdHRycykge1xyXG5cdFx0dmFyIGNoaWxkcmVuID0gaGFzQXR0cnMgPyBhcmdzLnNsaWNlKDEpIDogYXJnc1xyXG5cclxuXHRcdGlmIChjaGlsZHJlbi5sZW5ndGggPT09IDEgJiYgaXNBcnJheShjaGlsZHJlblswXSkpIHtcclxuXHRcdFx0cmV0dXJuIGNoaWxkcmVuWzBdXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gY2hpbGRyZW5cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFzc2lnbkF0dHJzKHRhcmdldCwgYXR0cnMsIGNsYXNzZXMpIHtcclxuXHRcdHZhciBjbGFzc0F0dHIgPSBcImNsYXNzXCIgaW4gYXR0cnMgPyBcImNsYXNzXCIgOiBcImNsYXNzTmFtZVwiXHJcblxyXG5cdFx0Zm9yICh2YXIgYXR0ck5hbWUgaW4gYXR0cnMpIHtcclxuXHRcdFx0aWYgKGhhc093bi5jYWxsKGF0dHJzLCBhdHRyTmFtZSkpIHtcclxuXHRcdFx0XHRpZiAoYXR0ck5hbWUgPT09IGNsYXNzQXR0ciAmJlxyXG5cdFx0XHRcdFx0XHRhdHRyc1thdHRyTmFtZV0gIT0gbnVsbCAmJlxyXG5cdFx0XHRcdFx0XHRhdHRyc1thdHRyTmFtZV0gIT09IFwiXCIpIHtcclxuXHRcdFx0XHRcdGNsYXNzZXMucHVzaChhdHRyc1thdHRyTmFtZV0pXHJcblx0XHRcdFx0XHQvLyBjcmVhdGUga2V5IGluIGNvcnJlY3QgaXRlcmF0aW9uIG9yZGVyXHJcblx0XHRcdFx0XHR0YXJnZXRbYXR0ck5hbWVdID0gXCJcIlxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0YXJnZXRbYXR0ck5hbWVdID0gYXR0cnNbYXR0ck5hbWVdXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGNsYXNzZXMubGVuZ3RoKSB0YXJnZXRbY2xhc3NBdHRyXSA9IGNsYXNzZXMuam9pbihcIiBcIilcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtUYWd9IFRoZSBET00gbm9kZSB0YWdcclxuXHQgKiBAcGFyYW0ge09iamVjdD1bXX0gb3B0aW9uYWwga2V5LXZhbHVlIHBhaXJzIHRvIGJlIG1hcHBlZCB0byBET00gYXR0cnNcclxuXHQgKiBAcGFyYW0gey4uLm1Ob2RlPVtdfSBaZXJvIG9yIG1vcmUgTWl0aHJpbCBjaGlsZCBub2Rlcy4gQ2FuIGJlIGFuIGFycmF5LFxyXG5cdCAqICAgICAgICAgICAgICAgICAgICAgIG9yIHNwbGF0IChvcHRpb25hbClcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBtKHRhZywgcGFpcnMpIHtcclxuXHRcdHZhciBhcmdzID0gW11cclxuXHJcblx0XHRmb3IgKHZhciBpID0gMSwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzT2JqZWN0KHRhZykpIHJldHVybiBwYXJhbWV0ZXJpemUodGFnLCBhcmdzKVxyXG5cclxuXHRcdGlmICghaXNTdHJpbmcodGFnKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJzZWxlY3RvciBpbiBtKHNlbGVjdG9yLCBhdHRycywgY2hpbGRyZW4pIHNob3VsZCBcIiArXHJcblx0XHRcdFx0XCJiZSBhIHN0cmluZ1wiKVxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBoYXNBdHRycyA9IHBhaXJzICE9IG51bGwgJiYgaXNPYmplY3QocGFpcnMpICYmXHJcblx0XHRcdCEoXCJ0YWdcIiBpbiBwYWlycyB8fCBcInZpZXdcIiBpbiBwYWlycyB8fCBcInN1YnRyZWVcIiBpbiBwYWlycylcclxuXHJcblx0XHR2YXIgYXR0cnMgPSBoYXNBdHRycyA/IHBhaXJzIDoge31cclxuXHRcdHZhciBjZWxsID0ge1xyXG5cdFx0XHR0YWc6IFwiZGl2XCIsXHJcblx0XHRcdGF0dHJzOiB7fSxcclxuXHRcdFx0Y2hpbGRyZW46IGdldFZpcnR1YWxDaGlsZHJlbihhcmdzLCBoYXNBdHRycylcclxuXHRcdH1cclxuXHJcblx0XHRhc3NpZ25BdHRycyhjZWxsLmF0dHJzLCBhdHRycywgcGFyc2VUYWdBdHRycyhjZWxsLCB0YWcpKVxyXG5cdFx0cmV0dXJuIGNlbGxcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGZvckVhY2gobGlzdCwgZikge1xyXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aCAmJiAhZihsaXN0W2ldLCBpKyspOykge1xyXG5cdFx0XHQvLyBmdW5jdGlvbiBjYWxsZWQgaW4gY29uZGl0aW9uXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBmb3JLZXlzKGxpc3QsIGYpIHtcclxuXHRcdGZvckVhY2gobGlzdCwgZnVuY3Rpb24gKGF0dHJzLCBpKSB7XHJcblx0XHRcdHJldHVybiAoYXR0cnMgPSBhdHRycyAmJiBhdHRycy5hdHRycykgJiZcclxuXHRcdFx0XHRhdHRycy5rZXkgIT0gbnVsbCAmJlxyXG5cdFx0XHRcdGYoYXR0cnMsIGkpXHJcblx0XHR9KVxyXG5cdH1cclxuXHQvLyBUaGlzIGZ1bmN0aW9uIHdhcyBjYXVzaW5nIGRlb3B0cyBpbiBDaHJvbWUuXHJcblx0ZnVuY3Rpb24gZGF0YVRvU3RyaW5nKGRhdGEpIHtcclxuXHRcdC8vIGRhdGEudG9TdHJpbmcoKSBtaWdodCB0aHJvdyBvciByZXR1cm4gbnVsbCBpZiBkYXRhIGlzIHRoZSByZXR1cm5cclxuXHRcdC8vIHZhbHVlIG9mIENvbnNvbGUubG9nIGluIHNvbWUgdmVyc2lvbnMgb2YgRmlyZWZveCAoYmVoYXZpb3IgZGVwZW5kcyBvblxyXG5cdFx0Ly8gdmVyc2lvbilcclxuXHRcdHRyeSB7XHJcblx0XHRcdGlmIChkYXRhICE9IG51bGwgJiYgZGF0YS50b1N0cmluZygpICE9IG51bGwpIHJldHVybiBkYXRhXHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdC8vIHNpbGVudGx5IGlnbm9yZSBlcnJvcnNcclxuXHRcdH1cclxuXHRcdHJldHVybiBcIlwiXHJcblx0fVxyXG5cclxuXHQvLyBUaGlzIGZ1bmN0aW9uIHdhcyBjYXVzaW5nIGRlb3B0cyBpbiBDaHJvbWUuXHJcblx0ZnVuY3Rpb24gaW5qZWN0VGV4dE5vZGUocGFyZW50RWxlbWVudCwgZmlyc3QsIGluZGV4LCBkYXRhKSB7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRpbnNlcnROb2RlKHBhcmVudEVsZW1lbnQsIGZpcnN0LCBpbmRleClcclxuXHRcdFx0Zmlyc3Qubm9kZVZhbHVlID0gZGF0YVxyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHQvLyBJRSBlcnJvbmVvdXNseSB0aHJvd3MgZXJyb3Igd2hlbiBhcHBlbmRpbmcgYW4gZW1wdHkgdGV4dCBub2RlXHJcblx0XHRcdC8vIGFmdGVyIGEgbnVsbFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZmxhdHRlbihsaXN0KSB7XHJcblx0XHQvLyByZWN1cnNpdmVseSBmbGF0dGVuIGFycmF5XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKGlzQXJyYXkobGlzdFtpXSkpIHtcclxuXHRcdFx0XHRsaXN0ID0gbGlzdC5jb25jYXQuYXBwbHkoW10sIGxpc3QpXHJcblx0XHRcdFx0Ly8gY2hlY2sgY3VycmVudCBpbmRleCBhZ2FpbiBhbmQgZmxhdHRlbiB1bnRpbCB0aGVyZSBhcmUgbm8gbW9yZVxyXG5cdFx0XHRcdC8vIG5lc3RlZCBhcnJheXMgYXQgdGhhdCBpbmRleFxyXG5cdFx0XHRcdGktLVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbGlzdFxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gaW5zZXJ0Tm9kZShwYXJlbnRFbGVtZW50LCBub2RlLCBpbmRleCkge1xyXG5cdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUobm9kZSxcclxuXHRcdFx0cGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XSB8fCBudWxsKVxyXG5cdH1cclxuXHJcblx0dmFyIERFTEVUSU9OID0gMVxyXG5cdHZhciBJTlNFUlRJT04gPSAyXHJcblx0dmFyIE1PVkUgPSAzXHJcblxyXG5cdGZ1bmN0aW9uIGhhbmRsZUtleXNEaWZmZXIoZGF0YSwgZXhpc3RpbmcsIGNhY2hlZCwgcGFyZW50RWxlbWVudCkge1xyXG5cdFx0Zm9yS2V5cyhkYXRhLCBmdW5jdGlvbiAoa2V5LCBpKSB7XHJcblx0XHRcdGV4aXN0aW5nW2tleSA9IGtleS5rZXldID0gZXhpc3Rpbmdba2V5XSA/IHtcclxuXHRcdFx0XHRhY3Rpb246IE1PVkUsXHJcblx0XHRcdFx0aW5kZXg6IGksXHJcblx0XHRcdFx0ZnJvbTogZXhpc3Rpbmdba2V5XS5pbmRleCxcclxuXHRcdFx0XHRlbGVtZW50OiBjYWNoZWQubm9kZXNbZXhpc3Rpbmdba2V5XS5pbmRleF0gfHxcclxuXHRcdFx0XHRcdCRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXHJcblx0XHRcdH0gOiB7YWN0aW9uOiBJTlNFUlRJT04sIGluZGV4OiBpfVxyXG5cdFx0fSlcclxuXHJcblx0XHR2YXIgYWN0aW9ucyA9IFtdXHJcblx0XHRmb3IgKHZhciBwcm9wIGluIGV4aXN0aW5nKSB7XHJcblx0XHRcdGlmIChoYXNPd24uY2FsbChleGlzdGluZywgcHJvcCkpIHtcclxuXHRcdFx0XHRhY3Rpb25zLnB1c2goZXhpc3RpbmdbcHJvcF0pXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgY2hhbmdlcyA9IGFjdGlvbnMuc29ydChzb3J0Q2hhbmdlcylcclxuXHRcdHZhciBuZXdDYWNoZWQgPSBuZXcgQXJyYXkoY2FjaGVkLmxlbmd0aClcclxuXHJcblx0XHRuZXdDYWNoZWQubm9kZXMgPSBjYWNoZWQubm9kZXMuc2xpY2UoKVxyXG5cclxuXHRcdGZvckVhY2goY2hhbmdlcywgZnVuY3Rpb24gKGNoYW5nZSkge1xyXG5cdFx0XHR2YXIgaW5kZXggPSBjaGFuZ2UuaW5kZXhcclxuXHRcdFx0aWYgKGNoYW5nZS5hY3Rpb24gPT09IERFTEVUSU9OKSB7XHJcblx0XHRcdFx0Y2xlYXIoY2FjaGVkW2luZGV4XS5ub2RlcywgY2FjaGVkW2luZGV4XSlcclxuXHRcdFx0XHRuZXdDYWNoZWQuc3BsaWNlKGluZGV4LCAxKVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChjaGFuZ2UuYWN0aW9uID09PSBJTlNFUlRJT04pIHtcclxuXHRcdFx0XHR2YXIgZHVtbXkgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG5cdFx0XHRcdGR1bW15LmtleSA9IGRhdGFbaW5kZXhdLmF0dHJzLmtleVxyXG5cdFx0XHRcdGluc2VydE5vZGUocGFyZW50RWxlbWVudCwgZHVtbXksIGluZGV4KVxyXG5cdFx0XHRcdG5ld0NhY2hlZC5zcGxpY2UoaW5kZXgsIDAsIHtcclxuXHRcdFx0XHRcdGF0dHJzOiB7a2V5OiBkYXRhW2luZGV4XS5hdHRycy5rZXl9LFxyXG5cdFx0XHRcdFx0bm9kZXM6IFtkdW1teV1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdG5ld0NhY2hlZC5ub2Rlc1tpbmRleF0gPSBkdW1teVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoY2hhbmdlLmFjdGlvbiA9PT0gTU9WRSkge1xyXG5cdFx0XHRcdHZhciBjaGFuZ2VFbGVtZW50ID0gY2hhbmdlLmVsZW1lbnRcclxuXHRcdFx0XHR2YXIgbWF5YmVDaGFuZ2VkID0gcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XVxyXG5cdFx0XHRcdGlmIChtYXliZUNoYW5nZWQgIT09IGNoYW5nZUVsZW1lbnQgJiYgY2hhbmdlRWxlbWVudCAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0cGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoY2hhbmdlRWxlbWVudCxcclxuXHRcdFx0XHRcdFx0bWF5YmVDaGFuZ2VkIHx8IG51bGwpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld0NhY2hlZFtpbmRleF0gPSBjYWNoZWRbY2hhbmdlLmZyb21dXHJcblx0XHRcdFx0bmV3Q2FjaGVkLm5vZGVzW2luZGV4XSA9IGNoYW5nZUVsZW1lbnRcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHJcblx0XHRyZXR1cm4gbmV3Q2FjaGVkXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBkaWZmS2V5cyhkYXRhLCBjYWNoZWQsIGV4aXN0aW5nLCBwYXJlbnRFbGVtZW50KSB7XHJcblx0XHR2YXIga2V5c0RpZmZlciA9IGRhdGEubGVuZ3RoICE9PSBjYWNoZWQubGVuZ3RoXHJcblxyXG5cdFx0aWYgKCFrZXlzRGlmZmVyKSB7XHJcblx0XHRcdGZvcktleXMoZGF0YSwgZnVuY3Rpb24gKGF0dHJzLCBpKSB7XHJcblx0XHRcdFx0dmFyIGNhY2hlZENlbGwgPSBjYWNoZWRbaV1cclxuXHRcdFx0XHRyZXR1cm4ga2V5c0RpZmZlciA9IGNhY2hlZENlbGwgJiZcclxuXHRcdFx0XHRcdGNhY2hlZENlbGwuYXR0cnMgJiZcclxuXHRcdFx0XHRcdGNhY2hlZENlbGwuYXR0cnMua2V5ICE9PSBhdHRycy5rZXlcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoa2V5c0RpZmZlcikge1xyXG5cdFx0XHRyZXR1cm4gaGFuZGxlS2V5c0RpZmZlcihkYXRhLCBleGlzdGluZywgY2FjaGVkLCBwYXJlbnRFbGVtZW50KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGNhY2hlZFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZGlmZkFycmF5KGRhdGEsIGNhY2hlZCwgbm9kZXMpIHtcclxuXHRcdC8vIGRpZmYgdGhlIGFycmF5IGl0c2VsZlxyXG5cclxuXHRcdC8vIHVwZGF0ZSB0aGUgbGlzdCBvZiBET00gbm9kZXMgYnkgY29sbGVjdGluZyB0aGUgbm9kZXMgZnJvbSBlYWNoIGl0ZW1cclxuXHRcdGZvckVhY2goZGF0YSwgZnVuY3Rpb24gKF8sIGkpIHtcclxuXHRcdFx0aWYgKGNhY2hlZFtpXSAhPSBudWxsKSBub2Rlcy5wdXNoLmFwcGx5KG5vZGVzLCBjYWNoZWRbaV0ubm9kZXMpXHJcblx0XHR9KVxyXG5cdFx0Ly8gcmVtb3ZlIGl0ZW1zIGZyb20gdGhlIGVuZCBvZiB0aGUgYXJyYXkgaWYgdGhlIG5ldyBhcnJheSBpcyBzaG9ydGVyXHJcblx0XHQvLyB0aGFuIHRoZSBvbGQgb25lLiBpZiBlcnJvcnMgZXZlciBoYXBwZW4gaGVyZSwgdGhlIGlzc3VlIGlzIG1vc3RcclxuXHRcdC8vIGxpa2VseSBhIGJ1ZyBpbiB0aGUgY29uc3RydWN0aW9uIG9mIHRoZSBgY2FjaGVkYCBkYXRhIHN0cnVjdHVyZVxyXG5cdFx0Ly8gc29tZXdoZXJlIGVhcmxpZXIgaW4gdGhlIHByb2dyYW1cclxuXHRcdGZvckVhY2goY2FjaGVkLm5vZGVzLCBmdW5jdGlvbiAobm9kZSwgaSkge1xyXG5cdFx0XHRpZiAobm9kZS5wYXJlbnROb2RlICE9IG51bGwgJiYgbm9kZXMuaW5kZXhPZihub2RlKSA8IDApIHtcclxuXHRcdFx0XHRjbGVhcihbbm9kZV0sIFtjYWNoZWRbaV1dKVxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cclxuXHRcdGlmIChkYXRhLmxlbmd0aCA8IGNhY2hlZC5sZW5ndGgpIGNhY2hlZC5sZW5ndGggPSBkYXRhLmxlbmd0aFxyXG5cdFx0Y2FjaGVkLm5vZGVzID0gbm9kZXNcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJ1aWxkQXJyYXlLZXlzKGRhdGEpIHtcclxuXHRcdHZhciBndWlkID0gMFxyXG5cdFx0Zm9yS2V5cyhkYXRhLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGZvckVhY2goZGF0YSwgZnVuY3Rpb24gKGF0dHJzKSB7XHJcblx0XHRcdFx0aWYgKChhdHRycyA9IGF0dHJzICYmIGF0dHJzLmF0dHJzKSAmJiBhdHRycy5rZXkgPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0YXR0cnMua2V5ID0gXCJfX21pdGhyaWxfX1wiICsgZ3VpZCsrXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0XHRyZXR1cm4gMVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGlzRGlmZmVyZW50RW5vdWdoKGRhdGEsIGNhY2hlZCwgZGF0YUF0dHJLZXlzKSB7XHJcblx0XHRpZiAoZGF0YS50YWcgIT09IGNhY2hlZC50YWcpIHJldHVybiB0cnVlXHJcblxyXG5cdFx0aWYgKGRhdGFBdHRyS2V5cy5zb3J0KCkuam9pbigpICE9PVxyXG5cdFx0XHRcdE9iamVjdC5rZXlzKGNhY2hlZC5hdHRycykuc29ydCgpLmpvaW4oKSkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChkYXRhLmF0dHJzLmlkICE9PSBjYWNoZWQuYXR0cnMuaWQpIHtcclxuXHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZGF0YS5hdHRycy5rZXkgIT09IGNhY2hlZC5hdHRycy5rZXkpIHtcclxuXHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdH1cclxuXHJcblx0XHRpZiAobS5yZWRyYXcuc3RyYXRlZ3koKSA9PT0gXCJhbGxcIikge1xyXG5cdFx0XHRyZXR1cm4gIWNhY2hlZC5jb25maWdDb250ZXh0IHx8IGNhY2hlZC5jb25maWdDb250ZXh0LnJldGFpbiAhPT0gdHJ1ZVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChtLnJlZHJhdy5zdHJhdGVneSgpID09PSBcImRpZmZcIikge1xyXG5cdFx0XHRyZXR1cm4gY2FjaGVkLmNvbmZpZ0NvbnRleHQgJiYgY2FjaGVkLmNvbmZpZ0NvbnRleHQucmV0YWluID09PSBmYWxzZVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmYWxzZVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gbWF5YmVSZWNyZWF0ZU9iamVjdChkYXRhLCBjYWNoZWQsIGRhdGFBdHRyS2V5cykge1xyXG5cdFx0Ly8gaWYgYW4gZWxlbWVudCBpcyBkaWZmZXJlbnQgZW5vdWdoIGZyb20gdGhlIG9uZSBpbiBjYWNoZSwgcmVjcmVhdGUgaXRcclxuXHRcdGlmIChpc0RpZmZlcmVudEVub3VnaChkYXRhLCBjYWNoZWQsIGRhdGFBdHRyS2V5cykpIHtcclxuXHRcdFx0aWYgKGNhY2hlZC5ub2Rlcy5sZW5ndGgpIGNsZWFyKGNhY2hlZC5ub2RlcylcclxuXHJcblx0XHRcdGlmIChjYWNoZWQuY29uZmlnQ29udGV4dCAmJlxyXG5cdFx0XHRcdFx0aXNGdW5jdGlvbihjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCkpIHtcclxuXHRcdFx0XHRjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCgpXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChjYWNoZWQuY29udHJvbGxlcnMpIHtcclxuXHRcdFx0XHRmb3JFYWNoKGNhY2hlZC5jb250cm9sbGVycywgZnVuY3Rpb24gKGNvbnRyb2xsZXIpIHtcclxuXHRcdFx0XHRcdGlmIChjb250cm9sbGVyLm9udW5sb2FkKSB7XHJcblx0XHRcdFx0XHRcdGNvbnRyb2xsZXIub251bmxvYWQoe3ByZXZlbnREZWZhdWx0OiBub29wfSlcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRPYmplY3ROYW1lc3BhY2UoZGF0YSwgbmFtZXNwYWNlKSB7XHJcblx0XHRpZiAoZGF0YS5hdHRycy54bWxucykgcmV0dXJuIGRhdGEuYXR0cnMueG1sbnNcclxuXHRcdGlmIChkYXRhLnRhZyA9PT0gXCJzdmdcIikgcmV0dXJuIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxyXG5cdFx0aWYgKGRhdGEudGFnID09PSBcIm1hdGhcIikgcmV0dXJuIFwiaHR0cDovL3d3dy53My5vcmcvMTk5OC9NYXRoL01hdGhNTFwiXHJcblx0XHRyZXR1cm4gbmFtZXNwYWNlXHJcblx0fVxyXG5cclxuXHR2YXIgcGVuZGluZ1JlcXVlc3RzID0gMFxyXG5cdG0uc3RhcnRDb21wdXRhdGlvbiA9IGZ1bmN0aW9uICgpIHsgcGVuZGluZ1JlcXVlc3RzKysgfVxyXG5cdG0uZW5kQ29tcHV0YXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAocGVuZGluZ1JlcXVlc3RzID4gMSkge1xyXG5cdFx0XHRwZW5kaW5nUmVxdWVzdHMtLVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cGVuZGluZ1JlcXVlc3RzID0gMFxyXG5cdFx0XHRtLnJlZHJhdygpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB1bmxvYWRDYWNoZWRDb250cm9sbGVycyhjYWNoZWQsIHZpZXdzLCBjb250cm9sbGVycykge1xyXG5cdFx0aWYgKGNvbnRyb2xsZXJzLmxlbmd0aCkge1xyXG5cdFx0XHRjYWNoZWQudmlld3MgPSB2aWV3c1xyXG5cdFx0XHRjYWNoZWQuY29udHJvbGxlcnMgPSBjb250cm9sbGVyc1xyXG5cdFx0XHRmb3JFYWNoKGNvbnRyb2xsZXJzLCBmdW5jdGlvbiAoY29udHJvbGxlcikge1xyXG5cdFx0XHRcdGlmIChjb250cm9sbGVyLm9udW5sb2FkICYmIGNvbnRyb2xsZXIub251bmxvYWQuJG9sZCkge1xyXG5cdFx0XHRcdFx0Y29udHJvbGxlci5vbnVubG9hZCA9IGNvbnRyb2xsZXIub251bmxvYWQuJG9sZFxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHBlbmRpbmdSZXF1ZXN0cyAmJiBjb250cm9sbGVyLm9udW5sb2FkKSB7XHJcblx0XHRcdFx0XHR2YXIgb251bmxvYWQgPSBjb250cm9sbGVyLm9udW5sb2FkXHJcblx0XHRcdFx0XHRjb250cm9sbGVyLm9udW5sb2FkID0gbm9vcFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlci5vbnVubG9hZC4kb2xkID0gb251bmxvYWRcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzY2hlZHVsZUNvbmZpZ3NUb0JlQ2FsbGVkKGNvbmZpZ3MsIGRhdGEsIG5vZGUsIGlzTmV3LCBjYWNoZWQpIHtcclxuXHRcdC8vIHNjaGVkdWxlIGNvbmZpZ3MgdG8gYmUgY2FsbGVkLiBUaGV5IGFyZSBjYWxsZWQgYWZ0ZXIgYGJ1aWxkYCBmaW5pc2hlc1xyXG5cdFx0Ly8gcnVubmluZ1xyXG5cdFx0aWYgKGlzRnVuY3Rpb24oZGF0YS5hdHRycy5jb25maWcpKSB7XHJcblx0XHRcdHZhciBjb250ZXh0ID0gY2FjaGVkLmNvbmZpZ0NvbnRleHQgPSBjYWNoZWQuY29uZmlnQ29udGV4dCB8fCB7fVxyXG5cclxuXHRcdFx0Ly8gYmluZFxyXG5cdFx0XHRjb25maWdzLnB1c2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHJldHVybiBkYXRhLmF0dHJzLmNvbmZpZy5jYWxsKGRhdGEsIG5vZGUsICFpc05ldywgY29udGV4dCxcclxuXHRcdFx0XHRcdGNhY2hlZClcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJ1aWxkVXBkYXRlZE5vZGUoXHJcblx0XHRjYWNoZWQsXHJcblx0XHRkYXRhLFxyXG5cdFx0ZWRpdGFibGUsXHJcblx0XHRoYXNLZXlzLFxyXG5cdFx0bmFtZXNwYWNlLFxyXG5cdFx0dmlld3MsXHJcblx0XHRjb25maWdzLFxyXG5cdFx0Y29udHJvbGxlcnNcclxuXHQpIHtcclxuXHRcdHZhciBub2RlID0gY2FjaGVkLm5vZGVzWzBdXHJcblxyXG5cdFx0aWYgKGhhc0tleXMpIHtcclxuXHRcdFx0c2V0QXR0cmlidXRlcyhub2RlLCBkYXRhLnRhZywgZGF0YS5hdHRycywgY2FjaGVkLmF0dHJzLCBuYW1lc3BhY2UpXHJcblx0XHR9XHJcblxyXG5cdFx0Y2FjaGVkLmNoaWxkcmVuID0gYnVpbGQoXHJcblx0XHRcdG5vZGUsXHJcblx0XHRcdGRhdGEudGFnLFxyXG5cdFx0XHR1bmRlZmluZWQsXHJcblx0XHRcdHVuZGVmaW5lZCxcclxuXHRcdFx0ZGF0YS5jaGlsZHJlbixcclxuXHRcdFx0Y2FjaGVkLmNoaWxkcmVuLFxyXG5cdFx0XHRmYWxzZSxcclxuXHRcdFx0MCxcclxuXHRcdFx0ZGF0YS5hdHRycy5jb250ZW50ZWRpdGFibGUgPyBub2RlIDogZWRpdGFibGUsXHJcblx0XHRcdG5hbWVzcGFjZSxcclxuXHRcdFx0Y29uZmlnc1xyXG5cdFx0KVxyXG5cclxuXHRcdGNhY2hlZC5ub2Rlcy5pbnRhY3QgPSB0cnVlXHJcblxyXG5cdFx0aWYgKGNvbnRyb2xsZXJzLmxlbmd0aCkge1xyXG5cdFx0XHRjYWNoZWQudmlld3MgPSB2aWV3c1xyXG5cdFx0XHRjYWNoZWQuY29udHJvbGxlcnMgPSBjb250cm9sbGVyc1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBub2RlXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBoYW5kbGVOb25leGlzdGVudE5vZGVzKGRhdGEsIHBhcmVudEVsZW1lbnQsIGluZGV4KSB7XHJcblx0XHR2YXIgbm9kZXNcclxuXHRcdGlmIChkYXRhLiR0cnVzdGVkKSB7XHJcblx0XHRcdG5vZGVzID0gaW5qZWN0SFRNTChwYXJlbnRFbGVtZW50LCBpbmRleCwgZGF0YSlcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG5vZGVzID0gWyRkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkYXRhKV1cclxuXHRcdFx0aWYgKCEocGFyZW50RWxlbWVudC5ub2RlTmFtZSBpbiB2b2lkRWxlbWVudHMpKSB7XHJcblx0XHRcdFx0aW5zZXJ0Tm9kZShwYXJlbnRFbGVtZW50LCBub2Rlc1swXSwgaW5kZXgpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgY2FjaGVkXHJcblxyXG5cdFx0aWYgKHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiIHx8XHJcblx0XHRcdFx0dHlwZW9mIGRhdGEgPT09IFwibnVtYmVyXCIgfHxcclxuXHRcdFx0XHR0eXBlb2YgZGF0YSA9PT0gXCJib29sZWFuXCIpIHtcclxuXHRcdFx0Y2FjaGVkID0gbmV3IGRhdGEuY29uc3RydWN0b3IoZGF0YSlcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNhY2hlZCA9IGRhdGFcclxuXHRcdH1cclxuXHJcblx0XHRjYWNoZWQubm9kZXMgPSBub2Rlc1xyXG5cdFx0cmV0dXJuIGNhY2hlZFxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcmVhdHRhY2hOb2RlcyhcclxuXHRcdGRhdGEsXHJcblx0XHRjYWNoZWQsXHJcblx0XHRwYXJlbnRFbGVtZW50LFxyXG5cdFx0ZWRpdGFibGUsXHJcblx0XHRpbmRleCxcclxuXHRcdHBhcmVudFRhZ1xyXG5cdCkge1xyXG5cdFx0dmFyIG5vZGVzID0gY2FjaGVkLm5vZGVzXHJcblx0XHRpZiAoIWVkaXRhYmxlIHx8IGVkaXRhYmxlICE9PSAkZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xyXG5cdFx0XHRpZiAoZGF0YS4kdHJ1c3RlZCkge1xyXG5cdFx0XHRcdGNsZWFyKG5vZGVzLCBjYWNoZWQpXHJcblx0XHRcdFx0bm9kZXMgPSBpbmplY3RIVE1MKHBhcmVudEVsZW1lbnQsIGluZGV4LCBkYXRhKVxyXG5cdFx0XHR9IGVsc2UgaWYgKHBhcmVudFRhZyA9PT0gXCJ0ZXh0YXJlYVwiKSB7XHJcblx0XHRcdFx0Ly8gPHRleHRhcmVhPiB1c2VzIGB2YWx1ZWAgaW5zdGVhZCBvZiBgbm9kZVZhbHVlYC5cclxuXHRcdFx0XHRwYXJlbnRFbGVtZW50LnZhbHVlID0gZGF0YVxyXG5cdFx0XHR9IGVsc2UgaWYgKGVkaXRhYmxlKSB7XHJcblx0XHRcdFx0Ly8gY29udGVudGVkaXRhYmxlIG5vZGVzIHVzZSBgaW5uZXJIVE1MYCBpbnN0ZWFkIG9mIGBub2RlVmFsdWVgLlxyXG5cdFx0XHRcdGVkaXRhYmxlLmlubmVySFRNTCA9IGRhdGFcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvLyB3YXMgYSB0cnVzdGVkIHN0cmluZ1xyXG5cdFx0XHRcdGlmIChub2Rlc1swXS5ub2RlVHlwZSA9PT0gMSB8fCBub2Rlcy5sZW5ndGggPiAxIHx8XHJcblx0XHRcdFx0XHRcdChub2Rlc1swXS5ub2RlVmFsdWUudHJpbSAmJlxyXG5cdFx0XHRcdFx0XHRcdCFub2Rlc1swXS5ub2RlVmFsdWUudHJpbSgpKSkge1xyXG5cdFx0XHRcdFx0Y2xlYXIoY2FjaGVkLm5vZGVzLCBjYWNoZWQpXHJcblx0XHRcdFx0XHRub2RlcyA9IFskZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGF0YSldXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpbmplY3RUZXh0Tm9kZShwYXJlbnRFbGVtZW50LCBub2Rlc1swXSwgaW5kZXgsIGRhdGEpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGNhY2hlZCA9IG5ldyBkYXRhLmNvbnN0cnVjdG9yKGRhdGEpXHJcblx0XHRjYWNoZWQubm9kZXMgPSBub2Rlc1xyXG5cdFx0cmV0dXJuIGNhY2hlZFxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gaGFuZGxlVGV4dE5vZGUoXHJcblx0XHRjYWNoZWQsXHJcblx0XHRkYXRhLFxyXG5cdFx0aW5kZXgsXHJcblx0XHRwYXJlbnRFbGVtZW50LFxyXG5cdFx0c2hvdWxkUmVhdHRhY2gsXHJcblx0XHRlZGl0YWJsZSxcclxuXHRcdHBhcmVudFRhZ1xyXG5cdCkge1xyXG5cdFx0aWYgKCFjYWNoZWQubm9kZXMubGVuZ3RoKSB7XHJcblx0XHRcdHJldHVybiBoYW5kbGVOb25leGlzdGVudE5vZGVzKGRhdGEsIHBhcmVudEVsZW1lbnQsIGluZGV4KVxyXG5cdFx0fSBlbHNlIGlmIChjYWNoZWQudmFsdWVPZigpICE9PSBkYXRhLnZhbHVlT2YoKSB8fCBzaG91bGRSZWF0dGFjaCkge1xyXG5cdFx0XHRyZXR1cm4gcmVhdHRhY2hOb2RlcyhkYXRhLCBjYWNoZWQsIHBhcmVudEVsZW1lbnQsIGVkaXRhYmxlLCBpbmRleCxcclxuXHRcdFx0XHRwYXJlbnRUYWcpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gKGNhY2hlZC5ub2Rlcy5pbnRhY3QgPSB0cnVlLCBjYWNoZWQpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRTdWJBcnJheUNvdW50KGl0ZW0pIHtcclxuXHRcdGlmIChpdGVtLiR0cnVzdGVkKSB7XHJcblx0XHRcdC8vIGZpeCBvZmZzZXQgb2YgbmV4dCBlbGVtZW50IGlmIGl0ZW0gd2FzIGEgdHJ1c3RlZCBzdHJpbmcgdy8gbW9yZVxyXG5cdFx0XHQvLyB0aGFuIG9uZSBodG1sIGVsZW1lbnRcclxuXHRcdFx0Ly8gdGhlIGZpcnN0IGNsYXVzZSBpbiB0aGUgcmVnZXhwIG1hdGNoZXMgZWxlbWVudHNcclxuXHRcdFx0Ly8gdGhlIHNlY29uZCBjbGF1c2UgKGFmdGVyIHRoZSBwaXBlKSBtYXRjaGVzIHRleHQgbm9kZXNcclxuXHRcdFx0dmFyIG1hdGNoID0gaXRlbS5tYXRjaCgvPFteXFwvXXxcXD5cXHMqW148XS9nKVxyXG5cdFx0XHRpZiAobWF0Y2ggIT0gbnVsbCkgcmV0dXJuIG1hdGNoLmxlbmd0aFxyXG5cdFx0fSBlbHNlIGlmIChpc0FycmF5KGl0ZW0pKSB7XHJcblx0XHRcdHJldHVybiBpdGVtLmxlbmd0aFxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIDFcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJ1aWxkQXJyYXkoXHJcblx0XHRkYXRhLFxyXG5cdFx0Y2FjaGVkLFxyXG5cdFx0cGFyZW50RWxlbWVudCxcclxuXHRcdGluZGV4LFxyXG5cdFx0cGFyZW50VGFnLFxyXG5cdFx0c2hvdWxkUmVhdHRhY2gsXHJcblx0XHRlZGl0YWJsZSxcclxuXHRcdG5hbWVzcGFjZSxcclxuXHRcdGNvbmZpZ3NcclxuXHQpIHtcclxuXHRcdGRhdGEgPSBmbGF0dGVuKGRhdGEpXHJcblx0XHR2YXIgbm9kZXMgPSBbXVxyXG5cdFx0dmFyIGludGFjdCA9IGNhY2hlZC5sZW5ndGggPT09IGRhdGEubGVuZ3RoXHJcblx0XHR2YXIgc3ViQXJyYXlDb3VudCA9IDBcclxuXHJcblx0XHQvLyBrZXlzIGFsZ29yaXRobTogc29ydCBlbGVtZW50cyB3aXRob3V0IHJlY3JlYXRpbmcgdGhlbSBpZiBrZXlzIGFyZVxyXG5cdFx0Ly8gcHJlc2VudFxyXG5cdFx0Ly9cclxuXHRcdC8vIDEpIGNyZWF0ZSBhIG1hcCBvZiBhbGwgZXhpc3Rpbmcga2V5cywgYW5kIG1hcmsgYWxsIGZvciBkZWxldGlvblxyXG5cdFx0Ly8gMikgYWRkIG5ldyBrZXlzIHRvIG1hcCBhbmQgbWFyayB0aGVtIGZvciBhZGRpdGlvblxyXG5cdFx0Ly8gMykgaWYga2V5IGV4aXN0cyBpbiBuZXcgbGlzdCwgY2hhbmdlIGFjdGlvbiBmcm9tIGRlbGV0aW9uIHRvIGEgbW92ZVxyXG5cdFx0Ly8gNCkgZm9yIGVhY2gga2V5LCBoYW5kbGUgaXRzIGNvcnJlc3BvbmRpbmcgYWN0aW9uIGFzIG1hcmtlZCBpblxyXG5cdFx0Ly8gICAgcHJldmlvdXMgc3RlcHNcclxuXHJcblx0XHR2YXIgZXhpc3RpbmcgPSB7fVxyXG5cdFx0dmFyIHNob3VsZE1haW50YWluSWRlbnRpdGllcyA9IGZhbHNlXHJcblxyXG5cdFx0Zm9yS2V5cyhjYWNoZWQsIGZ1bmN0aW9uIChhdHRycywgaSkge1xyXG5cdFx0XHRzaG91bGRNYWludGFpbklkZW50aXRpZXMgPSB0cnVlXHJcblx0XHRcdGV4aXN0aW5nW2NhY2hlZFtpXS5hdHRycy5rZXldID0ge2FjdGlvbjogREVMRVRJT04sIGluZGV4OiBpfVxyXG5cdFx0fSlcclxuXHJcblx0XHRidWlsZEFycmF5S2V5cyhkYXRhKVxyXG5cdFx0aWYgKHNob3VsZE1haW50YWluSWRlbnRpdGllcykge1xyXG5cdFx0XHRjYWNoZWQgPSBkaWZmS2V5cyhkYXRhLCBjYWNoZWQsIGV4aXN0aW5nLCBwYXJlbnRFbGVtZW50KVxyXG5cdFx0fVxyXG5cdFx0Ly8gZW5kIGtleSBhbGdvcml0aG1cclxuXHJcblx0XHR2YXIgY2FjaGVDb3VudCA9IDBcclxuXHRcdC8vIGZhc3RlciBleHBsaWNpdGx5IHdyaXR0ZW5cclxuXHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBkYXRhLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdC8vIGRpZmYgZWFjaCBpdGVtIGluIHRoZSBhcnJheVxyXG5cdFx0XHR2YXIgaXRlbSA9IGJ1aWxkKFxyXG5cdFx0XHRcdHBhcmVudEVsZW1lbnQsXHJcblx0XHRcdFx0cGFyZW50VGFnLFxyXG5cdFx0XHRcdGNhY2hlZCxcclxuXHRcdFx0XHRpbmRleCxcclxuXHRcdFx0XHRkYXRhW2ldLFxyXG5cdFx0XHRcdGNhY2hlZFtjYWNoZUNvdW50XSxcclxuXHRcdFx0XHRzaG91bGRSZWF0dGFjaCxcclxuXHRcdFx0XHRpbmRleCArIHN1YkFycmF5Q291bnQgfHwgc3ViQXJyYXlDb3VudCxcclxuXHRcdFx0XHRlZGl0YWJsZSxcclxuXHRcdFx0XHRuYW1lc3BhY2UsXHJcblx0XHRcdFx0Y29uZmlncylcclxuXHJcblx0XHRcdGlmIChpdGVtICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRpbnRhY3QgPSBpbnRhY3QgJiYgaXRlbS5ub2Rlcy5pbnRhY3RcclxuXHRcdFx0XHRzdWJBcnJheUNvdW50ICs9IGdldFN1YkFycmF5Q291bnQoaXRlbSlcclxuXHRcdFx0XHRjYWNoZWRbY2FjaGVDb3VudCsrXSA9IGl0ZW1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghaW50YWN0KSBkaWZmQXJyYXkoZGF0YSwgY2FjaGVkLCBub2RlcylcclxuXHRcdHJldHVybiBjYWNoZWRcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIG1ha2VDYWNoZShkYXRhLCBjYWNoZWQsIGluZGV4LCBwYXJlbnRJbmRleCwgcGFyZW50Q2FjaGUpIHtcclxuXHRcdGlmIChjYWNoZWQgIT0gbnVsbCkge1xyXG5cdFx0XHRpZiAodHlwZS5jYWxsKGNhY2hlZCkgPT09IHR5cGUuY2FsbChkYXRhKSkgcmV0dXJuIGNhY2hlZFxyXG5cclxuXHRcdFx0aWYgKHBhcmVudENhY2hlICYmIHBhcmVudENhY2hlLm5vZGVzKSB7XHJcblx0XHRcdFx0dmFyIG9mZnNldCA9IGluZGV4IC0gcGFyZW50SW5kZXhcclxuXHRcdFx0XHR2YXIgZW5kID0gb2Zmc2V0ICsgKGlzQXJyYXkoZGF0YSkgPyBkYXRhIDogY2FjaGVkLm5vZGVzKS5sZW5ndGhcclxuXHRcdFx0XHRjbGVhcihcclxuXHRcdFx0XHRcdHBhcmVudENhY2hlLm5vZGVzLnNsaWNlKG9mZnNldCwgZW5kKSxcclxuXHRcdFx0XHRcdHBhcmVudENhY2hlLnNsaWNlKG9mZnNldCwgZW5kKSlcclxuXHRcdFx0fSBlbHNlIGlmIChjYWNoZWQubm9kZXMpIHtcclxuXHRcdFx0XHRjbGVhcihjYWNoZWQubm9kZXMsIGNhY2hlZClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNhY2hlZCA9IG5ldyBkYXRhLmNvbnN0cnVjdG9yKClcclxuXHRcdC8vIGlmIGNvbnN0cnVjdG9yIGNyZWF0ZXMgYSB2aXJ0dWFsIGRvbSBlbGVtZW50LCB1c2UgYSBibGFuayBvYmplY3QgYXNcclxuXHRcdC8vIHRoZSBiYXNlIGNhY2hlZCBub2RlIGluc3RlYWQgb2YgY29weWluZyB0aGUgdmlydHVhbCBlbCAoIzI3NylcclxuXHRcdGlmIChjYWNoZWQudGFnKSBjYWNoZWQgPSB7fVxyXG5cdFx0Y2FjaGVkLm5vZGVzID0gW11cclxuXHRcdHJldHVybiBjYWNoZWRcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNvbnN0cnVjdE5vZGUoZGF0YSwgbmFtZXNwYWNlKSB7XHJcblx0XHRpZiAoZGF0YS5hdHRycy5pcykge1xyXG5cdFx0XHRpZiAobmFtZXNwYWNlID09IG51bGwpIHtcclxuXHRcdFx0XHRyZXR1cm4gJGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZGF0YS50YWcsIGRhdGEuYXR0cnMuaXMpXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuICRkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlLCBkYXRhLnRhZyxcclxuXHRcdFx0XHRcdGRhdGEuYXR0cnMuaXMpXHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAobmFtZXNwYWNlID09IG51bGwpIHtcclxuXHRcdFx0cmV0dXJuICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KGRhdGEudGFnKVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuICRkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlLCBkYXRhLnRhZylcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNvbnN0cnVjdEF0dHJzKGRhdGEsIG5vZGUsIG5hbWVzcGFjZSwgaGFzS2V5cykge1xyXG5cdFx0aWYgKGhhc0tleXMpIHtcclxuXHRcdFx0cmV0dXJuIHNldEF0dHJpYnV0ZXMobm9kZSwgZGF0YS50YWcsIGRhdGEuYXR0cnMsIHt9LCBuYW1lc3BhY2UpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gZGF0YS5hdHRyc1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY29uc3RydWN0Q2hpbGRyZW4oXHJcblx0XHRkYXRhLFxyXG5cdFx0bm9kZSxcclxuXHRcdGNhY2hlZCxcclxuXHRcdGVkaXRhYmxlLFxyXG5cdFx0bmFtZXNwYWNlLFxyXG5cdFx0Y29uZmlnc1xyXG5cdCkge1xyXG5cdFx0aWYgKGRhdGEuY2hpbGRyZW4gIT0gbnVsbCAmJiBkYXRhLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0cmV0dXJuIGJ1aWxkKFxyXG5cdFx0XHRcdG5vZGUsXHJcblx0XHRcdFx0ZGF0YS50YWcsXHJcblx0XHRcdFx0dW5kZWZpbmVkLFxyXG5cdFx0XHRcdHVuZGVmaW5lZCxcclxuXHRcdFx0XHRkYXRhLmNoaWxkcmVuLFxyXG5cdFx0XHRcdGNhY2hlZC5jaGlsZHJlbixcclxuXHRcdFx0XHR0cnVlLFxyXG5cdFx0XHRcdDAsXHJcblx0XHRcdFx0ZGF0YS5hdHRycy5jb250ZW50ZWRpdGFibGUgPyBub2RlIDogZWRpdGFibGUsXHJcblx0XHRcdFx0bmFtZXNwYWNlLFxyXG5cdFx0XHRcdGNvbmZpZ3MpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gZGF0YS5jaGlsZHJlblxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcmVjb25zdHJ1Y3RDYWNoZWQoXHJcblx0XHRkYXRhLFxyXG5cdFx0YXR0cnMsXHJcblx0XHRjaGlsZHJlbixcclxuXHRcdG5vZGUsXHJcblx0XHRuYW1lc3BhY2UsXHJcblx0XHR2aWV3cyxcclxuXHRcdGNvbnRyb2xsZXJzXHJcblx0KSB7XHJcblx0XHR2YXIgY2FjaGVkID0ge1xyXG5cdFx0XHR0YWc6IGRhdGEudGFnLFxyXG5cdFx0XHRhdHRyczogYXR0cnMsXHJcblx0XHRcdGNoaWxkcmVuOiBjaGlsZHJlbixcclxuXHRcdFx0bm9kZXM6IFtub2RlXVxyXG5cdFx0fVxyXG5cclxuXHRcdHVubG9hZENhY2hlZENvbnRyb2xsZXJzKGNhY2hlZCwgdmlld3MsIGNvbnRyb2xsZXJzKVxyXG5cclxuXHRcdGlmIChjYWNoZWQuY2hpbGRyZW4gJiYgIWNhY2hlZC5jaGlsZHJlbi5ub2Rlcykge1xyXG5cdFx0XHRjYWNoZWQuY2hpbGRyZW4ubm9kZXMgPSBbXVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGVkZ2UgY2FzZTogc2V0dGluZyB2YWx1ZSBvbiA8c2VsZWN0PiBkb2Vzbid0IHdvcmsgYmVmb3JlIGNoaWxkcmVuXHJcblx0XHQvLyBleGlzdCwgc28gc2V0IGl0IGFnYWluIGFmdGVyIGNoaWxkcmVuIGhhdmUgYmVlbiBjcmVhdGVkXHJcblx0XHRpZiAoZGF0YS50YWcgPT09IFwic2VsZWN0XCIgJiYgXCJ2YWx1ZVwiIGluIGRhdGEuYXR0cnMpIHtcclxuXHRcdFx0c2V0QXR0cmlidXRlcyhub2RlLCBkYXRhLnRhZywge3ZhbHVlOiBkYXRhLmF0dHJzLnZhbHVlfSwge30sXHJcblx0XHRcdFx0bmFtZXNwYWNlKVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBjYWNoZWRcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldENvbnRyb2xsZXIodmlld3MsIHZpZXcsIGNhY2hlZENvbnRyb2xsZXJzLCBjb250cm9sbGVyKSB7XHJcblx0XHR2YXIgY29udHJvbGxlckluZGV4XHJcblxyXG5cdFx0aWYgKG0ucmVkcmF3LnN0cmF0ZWd5KCkgPT09IFwiZGlmZlwiICYmIHZpZXdzKSB7XHJcblx0XHRcdGNvbnRyb2xsZXJJbmRleCA9IHZpZXdzLmluZGV4T2YodmlldylcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnRyb2xsZXJJbmRleCA9IC0xXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGNvbnRyb2xsZXJJbmRleCA+IC0xKSB7XHJcblx0XHRcdHJldHVybiBjYWNoZWRDb250cm9sbGVyc1tjb250cm9sbGVySW5kZXhdXHJcblx0XHR9IGVsc2UgaWYgKGlzRnVuY3Rpb24oY29udHJvbGxlcikpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBjb250cm9sbGVyKClcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiB7fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIHVubG9hZGVycyA9IFtdXHJcblxyXG5cdGZ1bmN0aW9uIHVwZGF0ZUxpc3RzKHZpZXdzLCBjb250cm9sbGVycywgdmlldywgY29udHJvbGxlcikge1xyXG5cdFx0aWYgKGNvbnRyb2xsZXIub251bmxvYWQgIT0gbnVsbCAmJlxyXG5cdFx0XHRcdHVubG9hZGVycy5tYXAoZnVuY3Rpb24gKHUpIHsgcmV0dXJuIHUuaGFuZGxlciB9KVxyXG5cdFx0XHRcdFx0LmluZGV4T2YoY29udHJvbGxlci5vbnVubG9hZCkgPCAwKSB7XHJcblx0XHRcdHVubG9hZGVycy5wdXNoKHtcclxuXHRcdFx0XHRjb250cm9sbGVyOiBjb250cm9sbGVyLFxyXG5cdFx0XHRcdGhhbmRsZXI6IGNvbnRyb2xsZXIub251bmxvYWRcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblx0XHR2aWV3cy5wdXNoKHZpZXcpXHJcblx0XHRjb250cm9sbGVycy5wdXNoKGNvbnRyb2xsZXIpXHJcblx0fVxyXG5cclxuXHR2YXIgZm9yY2luZyA9IGZhbHNlXHJcblx0ZnVuY3Rpb24gY2hlY2tWaWV3KFxyXG5cdFx0ZGF0YSxcclxuXHRcdHZpZXcsXHJcblx0XHRjYWNoZWQsXHJcblx0XHRjYWNoZWRDb250cm9sbGVycyxcclxuXHRcdGNvbnRyb2xsZXJzLFxyXG5cdFx0dmlld3NcclxuXHQpIHtcclxuXHRcdHZhciBjb250cm9sbGVyID0gZ2V0Q29udHJvbGxlcihcclxuXHRcdFx0Y2FjaGVkLnZpZXdzLFxyXG5cdFx0XHR2aWV3LFxyXG5cdFx0XHRjYWNoZWRDb250cm9sbGVycyxcclxuXHRcdFx0ZGF0YS5jb250cm9sbGVyKVxyXG5cclxuXHRcdHZhciBrZXkgPSBkYXRhICYmIGRhdGEuYXR0cnMgJiYgZGF0YS5hdHRycy5rZXlcclxuXHJcblx0XHRpZiAocGVuZGluZ1JlcXVlc3RzID09PSAwIHx8XHJcblx0XHRcdFx0Zm9yY2luZyB8fFxyXG5cdFx0XHRcdGNhY2hlZENvbnRyb2xsZXJzICYmXHJcblx0XHRcdFx0XHRjYWNoZWRDb250cm9sbGVycy5pbmRleE9mKGNvbnRyb2xsZXIpID4gLTEpIHtcclxuXHRcdFx0ZGF0YSA9IGRhdGEudmlldyhjb250cm9sbGVyKVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGF0YSA9IHt0YWc6IFwicGxhY2Vob2xkZXJcIn1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZGF0YS5zdWJ0cmVlID09PSBcInJldGFpblwiKSByZXR1cm4gZGF0YVxyXG5cdFx0ZGF0YS5hdHRycyA9IGRhdGEuYXR0cnMgfHwge31cclxuXHRcdGRhdGEuYXR0cnMua2V5ID0ga2V5XHJcblx0XHR1cGRhdGVMaXN0cyh2aWV3cywgY29udHJvbGxlcnMsIHZpZXcsIGNvbnRyb2xsZXIpXHJcblx0XHRyZXR1cm4gZGF0YVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gbWFya1ZpZXdzKGRhdGEsIGNhY2hlZCwgdmlld3MsIGNvbnRyb2xsZXJzKSB7XHJcblx0XHR2YXIgY2FjaGVkQ29udHJvbGxlcnMgPSBjYWNoZWQgJiYgY2FjaGVkLmNvbnRyb2xsZXJzXHJcblxyXG5cdFx0d2hpbGUgKGRhdGEudmlldyAhPSBudWxsKSB7XHJcblx0XHRcdGRhdGEgPSBjaGVja1ZpZXcoXHJcblx0XHRcdFx0ZGF0YSxcclxuXHRcdFx0XHRkYXRhLnZpZXcuJG9yaWdpbmFsIHx8IGRhdGEudmlldyxcclxuXHRcdFx0XHRjYWNoZWQsXHJcblx0XHRcdFx0Y2FjaGVkQ29udHJvbGxlcnMsXHJcblx0XHRcdFx0Y29udHJvbGxlcnMsXHJcblx0XHRcdFx0dmlld3MpXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGRhdGFcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJ1aWxkT2JqZWN0KCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG1heC1zdGF0ZW1lbnRzXHJcblx0XHRkYXRhLFxyXG5cdFx0Y2FjaGVkLFxyXG5cdFx0ZWRpdGFibGUsXHJcblx0XHRwYXJlbnRFbGVtZW50LFxyXG5cdFx0aW5kZXgsXHJcblx0XHRzaG91bGRSZWF0dGFjaCxcclxuXHRcdG5hbWVzcGFjZSxcclxuXHRcdGNvbmZpZ3NcclxuXHQpIHtcclxuXHRcdHZhciB2aWV3cyA9IFtdXHJcblx0XHR2YXIgY29udHJvbGxlcnMgPSBbXVxyXG5cclxuXHRcdGRhdGEgPSBtYXJrVmlld3MoZGF0YSwgY2FjaGVkLCB2aWV3cywgY29udHJvbGxlcnMpXHJcblxyXG5cdFx0aWYgKGRhdGEuc3VidHJlZSA9PT0gXCJyZXRhaW5cIikgcmV0dXJuIGNhY2hlZFxyXG5cclxuXHRcdGlmICghZGF0YS50YWcgJiYgY29udHJvbGxlcnMubGVuZ3RoKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkNvbXBvbmVudCB0ZW1wbGF0ZSBtdXN0IHJldHVybiBhIHZpcnR1YWwgXCIgK1xyXG5cdFx0XHRcdFwiZWxlbWVudCwgbm90IGFuIGFycmF5LCBzdHJpbmcsIGV0Yy5cIilcclxuXHRcdH1cclxuXHJcblx0XHRkYXRhLmF0dHJzID0gZGF0YS5hdHRycyB8fCB7fVxyXG5cdFx0Y2FjaGVkLmF0dHJzID0gY2FjaGVkLmF0dHJzIHx8IHt9XHJcblxyXG5cdFx0dmFyIGRhdGFBdHRyS2V5cyA9IE9iamVjdC5rZXlzKGRhdGEuYXR0cnMpXHJcblx0XHR2YXIgaGFzS2V5cyA9IGRhdGFBdHRyS2V5cy5sZW5ndGggPiAoXCJrZXlcIiBpbiBkYXRhLmF0dHJzID8gMSA6IDApXHJcblxyXG5cdFx0bWF5YmVSZWNyZWF0ZU9iamVjdChkYXRhLCBjYWNoZWQsIGRhdGFBdHRyS2V5cylcclxuXHJcblx0XHRpZiAoIWlzU3RyaW5nKGRhdGEudGFnKSkgcmV0dXJuXHJcblxyXG5cdFx0dmFyIGlzTmV3ID0gY2FjaGVkLm5vZGVzLmxlbmd0aCA9PT0gMFxyXG5cclxuXHRcdG5hbWVzcGFjZSA9IGdldE9iamVjdE5hbWVzcGFjZShkYXRhLCBuYW1lc3BhY2UpXHJcblxyXG5cdFx0dmFyIG5vZGVcclxuXHRcdGlmIChpc05ldykge1xyXG5cdFx0XHRub2RlID0gY29uc3RydWN0Tm9kZShkYXRhLCBuYW1lc3BhY2UpXHJcblx0XHRcdC8vIHNldCBhdHRyaWJ1dGVzIGZpcnN0LCB0aGVuIGNyZWF0ZSBjaGlsZHJlblxyXG5cdFx0XHR2YXIgYXR0cnMgPSBjb25zdHJ1Y3RBdHRycyhkYXRhLCBub2RlLCBuYW1lc3BhY2UsIGhhc0tleXMpXHJcblxyXG5cdFx0XHQvLyBhZGQgdGhlIG5vZGUgdG8gaXRzIHBhcmVudCBiZWZvcmUgYXR0YWNoaW5nIGNoaWxkcmVuIHRvIGl0XHJcblx0XHRcdGluc2VydE5vZGUocGFyZW50RWxlbWVudCwgbm9kZSwgaW5kZXgpXHJcblxyXG5cdFx0XHR2YXIgY2hpbGRyZW4gPSBjb25zdHJ1Y3RDaGlsZHJlbihkYXRhLCBub2RlLCBjYWNoZWQsIGVkaXRhYmxlLFxyXG5cdFx0XHRcdG5hbWVzcGFjZSwgY29uZmlncylcclxuXHJcblx0XHRcdGNhY2hlZCA9IHJlY29uc3RydWN0Q2FjaGVkKFxyXG5cdFx0XHRcdGRhdGEsXHJcblx0XHRcdFx0YXR0cnMsXHJcblx0XHRcdFx0Y2hpbGRyZW4sXHJcblx0XHRcdFx0bm9kZSxcclxuXHRcdFx0XHRuYW1lc3BhY2UsXHJcblx0XHRcdFx0dmlld3MsXHJcblx0XHRcdFx0Y29udHJvbGxlcnMpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRub2RlID0gYnVpbGRVcGRhdGVkTm9kZShcclxuXHRcdFx0XHRjYWNoZWQsXHJcblx0XHRcdFx0ZGF0YSxcclxuXHRcdFx0XHRlZGl0YWJsZSxcclxuXHRcdFx0XHRoYXNLZXlzLFxyXG5cdFx0XHRcdG5hbWVzcGFjZSxcclxuXHRcdFx0XHR2aWV3cyxcclxuXHRcdFx0XHRjb25maWdzLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXJzKVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICghaXNOZXcgJiYgc2hvdWxkUmVhdHRhY2ggPT09IHRydWUgJiYgbm9kZSAhPSBudWxsKSB7XHJcblx0XHRcdGluc2VydE5vZGUocGFyZW50RWxlbWVudCwgbm9kZSwgaW5kZXgpXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVGhlIGNvbmZpZ3MgYXJlIGNhbGxlZCBhZnRlciBgYnVpbGRgIGZpbmlzaGVzIHJ1bm5pbmdcclxuXHRcdHNjaGVkdWxlQ29uZmlnc1RvQmVDYWxsZWQoY29uZmlncywgZGF0YSwgbm9kZSwgaXNOZXcsIGNhY2hlZClcclxuXHJcblx0XHRyZXR1cm4gY2FjaGVkXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBidWlsZChcclxuXHRcdHBhcmVudEVsZW1lbnQsXHJcblx0XHRwYXJlbnRUYWcsXHJcblx0XHRwYXJlbnRDYWNoZSxcclxuXHRcdHBhcmVudEluZGV4LFxyXG5cdFx0ZGF0YSxcclxuXHRcdGNhY2hlZCxcclxuXHRcdHNob3VsZFJlYXR0YWNoLFxyXG5cdFx0aW5kZXgsXHJcblx0XHRlZGl0YWJsZSxcclxuXHRcdG5hbWVzcGFjZSxcclxuXHRcdGNvbmZpZ3NcclxuXHQpIHtcclxuXHRcdC8qXHJcblx0XHQgKiBgYnVpbGRgIGlzIGEgcmVjdXJzaXZlIGZ1bmN0aW9uIHRoYXQgbWFuYWdlcyBjcmVhdGlvbi9kaWZmaW5nL3JlbW92YWxcclxuXHRcdCAqIG9mIERPTSBlbGVtZW50cyBiYXNlZCBvbiBjb21wYXJpc29uIGJldHdlZW4gYGRhdGFgIGFuZCBgY2FjaGVkYCB0aGVcclxuXHRcdCAqIGRpZmYgYWxnb3JpdGhtIGNhbiBiZSBzdW1tYXJpemVkIGFzIHRoaXM6XHJcblx0XHQgKlxyXG5cdFx0ICogMSAtIGNvbXBhcmUgYGRhdGFgIGFuZCBgY2FjaGVkYFxyXG5cdFx0ICogMiAtIGlmIHRoZXkgYXJlIGRpZmZlcmVudCwgY29weSBgZGF0YWAgdG8gYGNhY2hlZGAgYW5kIHVwZGF0ZSB0aGUgRE9NXHJcblx0XHQgKiAgICAgYmFzZWQgb24gd2hhdCB0aGUgZGlmZmVyZW5jZSBpc1xyXG5cdFx0ICogMyAtIHJlY3Vyc2l2ZWx5IGFwcGx5IHRoaXMgYWxnb3JpdGhtIGZvciBldmVyeSBhcnJheSBhbmQgZm9yIHRoZVxyXG5cdFx0ICogICAgIGNoaWxkcmVuIG9mIGV2ZXJ5IHZpcnR1YWwgZWxlbWVudFxyXG5cdFx0ICpcclxuXHRcdCAqIFRoZSBgY2FjaGVkYCBkYXRhIHN0cnVjdHVyZSBpcyBlc3NlbnRpYWxseSB0aGUgc2FtZSBhcyB0aGUgcHJldmlvdXNcclxuXHRcdCAqIHJlZHJhdydzIGBkYXRhYCBkYXRhIHN0cnVjdHVyZSwgd2l0aCBhIGZldyBhZGRpdGlvbnM6XHJcblx0XHQgKiAtIGBjYWNoZWRgIGFsd2F5cyBoYXMgYSBwcm9wZXJ0eSBjYWxsZWQgYG5vZGVzYCwgd2hpY2ggaXMgYSBsaXN0IG9mXHJcblx0XHQgKiAgICBET00gZWxlbWVudHMgdGhhdCBjb3JyZXNwb25kIHRvIHRoZSBkYXRhIHJlcHJlc2VudGVkIGJ5IHRoZVxyXG5cdFx0ICogICAgcmVzcGVjdGl2ZSB2aXJ0dWFsIGVsZW1lbnRcclxuXHRcdCAqIC0gaW4gb3JkZXIgdG8gc3VwcG9ydCBhdHRhY2hpbmcgYG5vZGVzYCBhcyBhIHByb3BlcnR5IG9mIGBjYWNoZWRgLFxyXG5cdFx0ICogICAgYGNhY2hlZGAgaXMgKmFsd2F5cyogYSBub24tcHJpbWl0aXZlIG9iamVjdCwgaS5lLiBpZiB0aGUgZGF0YSB3YXNcclxuXHRcdCAqICAgIGEgc3RyaW5nLCB0aGVuIGNhY2hlZCBpcyBhIFN0cmluZyBpbnN0YW5jZS4gSWYgZGF0YSB3YXMgYG51bGxgIG9yXHJcblx0XHQgKiAgICBgdW5kZWZpbmVkYCwgY2FjaGVkIGlzIGBuZXcgU3RyaW5nKFwiXCIpYFxyXG5cdFx0ICogLSBgY2FjaGVkIGFsc28gaGFzIGEgYGNvbmZpZ0NvbnRleHRgIHByb3BlcnR5LCB3aGljaCBpcyB0aGUgc3RhdGVcclxuXHRcdCAqICAgIHN0b3JhZ2Ugb2JqZWN0IGV4cG9zZWQgYnkgY29uZmlnKGVsZW1lbnQsIGlzSW5pdGlhbGl6ZWQsIGNvbnRleHQpXHJcblx0XHQgKiAtIHdoZW4gYGNhY2hlZGAgaXMgYW4gT2JqZWN0LCBpdCByZXByZXNlbnRzIGEgdmlydHVhbCBlbGVtZW50OyB3aGVuXHJcblx0XHQgKiAgICBpdCdzIGFuIEFycmF5LCBpdCByZXByZXNlbnRzIGEgbGlzdCBvZiBlbGVtZW50czsgd2hlbiBpdCdzIGFcclxuXHRcdCAqICAgIFN0cmluZywgTnVtYmVyIG9yIEJvb2xlYW4sIGl0IHJlcHJlc2VudHMgYSB0ZXh0IG5vZGVcclxuXHRcdCAqXHJcblx0XHQgKiBgcGFyZW50RWxlbWVudGAgaXMgYSBET00gZWxlbWVudCB1c2VkIGZvciBXM0MgRE9NIEFQSSBjYWxsc1xyXG5cdFx0ICogYHBhcmVudFRhZ2AgaXMgb25seSB1c2VkIGZvciBoYW5kbGluZyBhIGNvcm5lciBjYXNlIGZvciB0ZXh0YXJlYVxyXG5cdFx0ICogdmFsdWVzXHJcblx0XHQgKiBgcGFyZW50Q2FjaGVgIGlzIHVzZWQgdG8gcmVtb3ZlIG5vZGVzIGluIHNvbWUgbXVsdGktbm9kZSBjYXNlc1xyXG5cdFx0ICogYHBhcmVudEluZGV4YCBhbmQgYGluZGV4YCBhcmUgdXNlZCB0byBmaWd1cmUgb3V0IHRoZSBvZmZzZXQgb2Ygbm9kZXMuXHJcblx0XHQgKiBUaGV5J3JlIGFydGlmYWN0cyBmcm9tIGJlZm9yZSBhcnJheXMgc3RhcnRlZCBiZWluZyBmbGF0dGVuZWQgYW5kIGFyZVxyXG5cdFx0ICogbGlrZWx5IHJlZmFjdG9yYWJsZVxyXG5cdFx0ICogYGRhdGFgIGFuZCBgY2FjaGVkYCBhcmUsIHJlc3BlY3RpdmVseSwgdGhlIG5ldyBhbmQgb2xkIG5vZGVzIGJlaW5nXHJcblx0XHQgKiBkaWZmZWRcclxuXHRcdCAqIGBzaG91bGRSZWF0dGFjaGAgaXMgYSBmbGFnIGluZGljYXRpbmcgd2hldGhlciBhIHBhcmVudCBub2RlIHdhc1xyXG5cdFx0ICogcmVjcmVhdGVkIChpZiBzbywgYW5kIGlmIHRoaXMgbm9kZSBpcyByZXVzZWQsIHRoZW4gdGhpcyBub2RlIG11c3RcclxuXHRcdCAqIHJlYXR0YWNoIGl0c2VsZiB0byB0aGUgbmV3IHBhcmVudClcclxuXHRcdCAqIGBlZGl0YWJsZWAgaXMgYSBmbGFnIHRoYXQgaW5kaWNhdGVzIHdoZXRoZXIgYW4gYW5jZXN0b3IgaXNcclxuXHRcdCAqIGNvbnRlbnRlZGl0YWJsZVxyXG5cdFx0ICogYG5hbWVzcGFjZWAgaW5kaWNhdGVzIHRoZSBjbG9zZXN0IEhUTUwgbmFtZXNwYWNlIGFzIGl0IGNhc2NhZGVzIGRvd25cclxuXHRcdCAqIGZyb20gYW4gYW5jZXN0b3JcclxuXHRcdCAqIGBjb25maWdzYCBpcyBhIGxpc3Qgb2YgY29uZmlnIGZ1bmN0aW9ucyB0byBydW4gYWZ0ZXIgdGhlIHRvcG1vc3RcclxuXHRcdCAqIGBidWlsZGAgY2FsbCBmaW5pc2hlcyBydW5uaW5nXHJcblx0XHQgKlxyXG5cdFx0ICogdGhlcmUncyBsb2dpYyB0aGF0IHJlbGllcyBvbiB0aGUgYXNzdW1wdGlvbiB0aGF0IG51bGwgYW5kIHVuZGVmaW5lZFxyXG5cdFx0ICogZGF0YSBhcmUgZXF1aXZhbGVudCB0byBlbXB0eSBzdHJpbmdzXHJcblx0XHQgKiAtIHRoaXMgcHJldmVudHMgbGlmZWN5Y2xlIHN1cnByaXNlcyBmcm9tIHByb2NlZHVyYWwgaGVscGVycyB0aGF0IG1peFxyXG5cdFx0ICogICBpbXBsaWNpdCBhbmQgZXhwbGljaXQgcmV0dXJuIHN0YXRlbWVudHMgKGUuZy5cclxuXHRcdCAqICAgZnVuY3Rpb24gZm9vKCkge2lmIChjb25kKSByZXR1cm4gbShcImRpdlwiKX1cclxuXHRcdCAqIC0gaXQgc2ltcGxpZmllcyBkaWZmaW5nIGNvZGVcclxuXHRcdCAqL1xyXG5cdFx0ZGF0YSA9IGRhdGFUb1N0cmluZyhkYXRhKVxyXG5cdFx0aWYgKGRhdGEuc3VidHJlZSA9PT0gXCJyZXRhaW5cIikgcmV0dXJuIGNhY2hlZFxyXG5cdFx0Y2FjaGVkID0gbWFrZUNhY2hlKGRhdGEsIGNhY2hlZCwgaW5kZXgsIHBhcmVudEluZGV4LCBwYXJlbnRDYWNoZSlcclxuXHJcblx0XHRpZiAoaXNBcnJheShkYXRhKSkge1xyXG5cdFx0XHRyZXR1cm4gYnVpbGRBcnJheShcclxuXHRcdFx0XHRkYXRhLFxyXG5cdFx0XHRcdGNhY2hlZCxcclxuXHRcdFx0XHRwYXJlbnRFbGVtZW50LFxyXG5cdFx0XHRcdGluZGV4LFxyXG5cdFx0XHRcdHBhcmVudFRhZyxcclxuXHRcdFx0XHRzaG91bGRSZWF0dGFjaCxcclxuXHRcdFx0XHRlZGl0YWJsZSxcclxuXHRcdFx0XHRuYW1lc3BhY2UsXHJcblx0XHRcdFx0Y29uZmlncylcclxuXHRcdH0gZWxzZSBpZiAoZGF0YSAhPSBudWxsICYmIGlzT2JqZWN0KGRhdGEpKSB7XHJcblx0XHRcdHJldHVybiBidWlsZE9iamVjdChcclxuXHRcdFx0XHRkYXRhLFxyXG5cdFx0XHRcdGNhY2hlZCxcclxuXHRcdFx0XHRlZGl0YWJsZSxcclxuXHRcdFx0XHRwYXJlbnRFbGVtZW50LFxyXG5cdFx0XHRcdGluZGV4LFxyXG5cdFx0XHRcdHNob3VsZFJlYXR0YWNoLFxyXG5cdFx0XHRcdG5hbWVzcGFjZSxcclxuXHRcdFx0XHRjb25maWdzKVxyXG5cdFx0fSBlbHNlIGlmICghaXNGdW5jdGlvbihkYXRhKSkge1xyXG5cdFx0XHRyZXR1cm4gaGFuZGxlVGV4dE5vZGUoXHJcblx0XHRcdFx0Y2FjaGVkLFxyXG5cdFx0XHRcdGRhdGEsXHJcblx0XHRcdFx0aW5kZXgsXHJcblx0XHRcdFx0cGFyZW50RWxlbWVudCxcclxuXHRcdFx0XHRzaG91bGRSZWF0dGFjaCxcclxuXHRcdFx0XHRlZGl0YWJsZSxcclxuXHRcdFx0XHRwYXJlbnRUYWcpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gY2FjaGVkXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzb3J0Q2hhbmdlcyhhLCBiKSB7XHJcblx0XHRyZXR1cm4gYS5hY3Rpb24gLSBiLmFjdGlvbiB8fCBhLmluZGV4IC0gYi5pbmRleFxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gY29weVN0eWxlQXR0cnMobm9kZSwgZGF0YUF0dHIsIGNhY2hlZEF0dHIpIHtcclxuXHRcdGZvciAodmFyIHJ1bGUgaW4gZGF0YUF0dHIpIHtcclxuXHRcdFx0aWYgKGhhc093bi5jYWxsKGRhdGFBdHRyLCBydWxlKSkge1xyXG5cdFx0XHRcdGlmIChjYWNoZWRBdHRyID09IG51bGwgfHwgY2FjaGVkQXR0cltydWxlXSAhPT0gZGF0YUF0dHJbcnVsZV0pIHtcclxuXHRcdFx0XHRcdG5vZGUuc3R5bGVbcnVsZV0gPSBkYXRhQXR0cltydWxlXVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAocnVsZSBpbiBjYWNoZWRBdHRyKSB7XHJcblx0XHRcdGlmIChoYXNPd24uY2FsbChjYWNoZWRBdHRyLCBydWxlKSkge1xyXG5cdFx0XHRcdGlmICghaGFzT3duLmNhbGwoZGF0YUF0dHIsIHJ1bGUpKSBub2RlLnN0eWxlW3J1bGVdID0gXCJcIlxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgc2hvdWxkVXNlU2V0QXR0cmlidXRlID0ge1xyXG5cdFx0bGlzdDogMSxcclxuXHRcdHN0eWxlOiAxLFxyXG5cdFx0Zm9ybTogMSxcclxuXHRcdHR5cGU6IDEsXHJcblx0XHR3aWR0aDogMSxcclxuXHRcdGhlaWdodDogMVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U2luZ2xlQXR0cihcclxuXHRcdG5vZGUsXHJcblx0XHRhdHRyTmFtZSxcclxuXHRcdGRhdGFBdHRyLFxyXG5cdFx0Y2FjaGVkQXR0cixcclxuXHRcdHRhZyxcclxuXHRcdG5hbWVzcGFjZVxyXG5cdCkge1xyXG5cdFx0aWYgKGF0dHJOYW1lID09PSBcImNvbmZpZ1wiIHx8IGF0dHJOYW1lID09PSBcImtleVwiKSB7XHJcblx0XHRcdC8vIGBjb25maWdgIGlzbid0IGEgcmVhbCBhdHRyaWJ1dGUsIHNvIGlnbm9yZSBpdFxyXG5cdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0fSBlbHNlIGlmIChpc0Z1bmN0aW9uKGRhdGFBdHRyKSAmJiBhdHRyTmFtZS5zbGljZSgwLCAyKSA9PT0gXCJvblwiKSB7XHJcblx0XHRcdC8vIGhvb2sgZXZlbnQgaGFuZGxlcnMgdG8gdGhlIGF1dG8tcmVkcmF3aW5nIHN5c3RlbVxyXG5cdFx0XHRub2RlW2F0dHJOYW1lXSA9IGF1dG9yZWRyYXcoZGF0YUF0dHIsIG5vZGUpXHJcblx0XHR9IGVsc2UgaWYgKGF0dHJOYW1lID09PSBcInN0eWxlXCIgJiYgZGF0YUF0dHIgIT0gbnVsbCAmJlxyXG5cdFx0XHRcdGlzT2JqZWN0KGRhdGFBdHRyKSkge1xyXG5cdFx0XHQvLyBoYW5kbGUgYHN0eWxlOiB7Li4ufWBcclxuXHRcdFx0Y29weVN0eWxlQXR0cnMobm9kZSwgZGF0YUF0dHIsIGNhY2hlZEF0dHIpXHJcblx0XHR9IGVsc2UgaWYgKG5hbWVzcGFjZSAhPSBudWxsKSB7XHJcblx0XHRcdC8vIGhhbmRsZSBTVkdcclxuXHRcdFx0aWYgKGF0dHJOYW1lID09PSBcImhyZWZcIikge1xyXG5cdFx0XHRcdG5vZGUuc2V0QXR0cmlidXRlTlMoXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIsXHJcblx0XHRcdFx0XHRcImhyZWZcIiwgZGF0YUF0dHIpXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bm9kZS5zZXRBdHRyaWJ1dGUoXHJcblx0XHRcdFx0XHRhdHRyTmFtZSA9PT0gXCJjbGFzc05hbWVcIiA/IFwiY2xhc3NcIiA6IGF0dHJOYW1lLFxyXG5cdFx0XHRcdFx0ZGF0YUF0dHIpXHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAoYXR0ck5hbWUgaW4gbm9kZSAmJiAhc2hvdWxkVXNlU2V0QXR0cmlidXRlW2F0dHJOYW1lXSkge1xyXG5cdFx0XHQvLyBoYW5kbGUgY2FzZXMgdGhhdCBhcmUgcHJvcGVydGllcyAoYnV0IGlnbm9yZSBjYXNlcyB3aGVyZSB3ZVxyXG5cdFx0XHQvLyBzaG91bGQgdXNlIHNldEF0dHJpYnV0ZSBpbnN0ZWFkKVxyXG5cdFx0XHQvL1xyXG5cdFx0XHQvLyAtIGxpc3QgYW5kIGZvcm0gYXJlIHR5cGljYWxseSB1c2VkIGFzIHN0cmluZ3MsIGJ1dCBhcmUgRE9NXHJcblx0XHRcdC8vICAgZWxlbWVudCByZWZlcmVuY2VzIGluIGpzXHJcblx0XHRcdC8vXHJcblx0XHRcdC8vIC0gd2hlbiB1c2luZyBDU1Mgc2VsZWN0b3JzIChlLmcuIGBtKFwiW3N0eWxlPScnXVwiKWApLCBzdHlsZSBpc1xyXG5cdFx0XHQvLyAgIHVzZWQgYXMgYSBzdHJpbmcsIGJ1dCBpdCdzIGFuIG9iamVjdCBpbiBqc1xyXG5cdFx0XHQvL1xyXG5cdFx0XHQvLyAjMzQ4IGRvbid0IHNldCB0aGUgdmFsdWUgaWYgbm90IG5lZWRlZCAtIG90aGVyd2lzZSwgY3Vyc29yXHJcblx0XHRcdC8vIHBsYWNlbWVudCBicmVha3MgaW4gQ2hyb21lXHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0aWYgKHRhZyAhPT0gXCJpbnB1dFwiIHx8IG5vZGVbYXR0ck5hbWVdICE9PSBkYXRhQXR0cikge1xyXG5cdFx0XHRcdFx0bm9kZVthdHRyTmFtZV0gPSBkYXRhQXR0clxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCBkYXRhQXR0cilcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZSBub2RlLnNldEF0dHJpYnV0ZShhdHRyTmFtZSwgZGF0YUF0dHIpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB0cnlTZXRBdHRyKFxyXG5cdFx0bm9kZSxcclxuXHRcdGF0dHJOYW1lLFxyXG5cdFx0ZGF0YUF0dHIsXHJcblx0XHRjYWNoZWRBdHRyLFxyXG5cdFx0Y2FjaGVkQXR0cnMsXHJcblx0XHR0YWcsXHJcblx0XHRuYW1lc3BhY2VcclxuXHQpIHtcclxuXHRcdGlmICghKGF0dHJOYW1lIGluIGNhY2hlZEF0dHJzKSB8fCAoY2FjaGVkQXR0ciAhPT0gZGF0YUF0dHIpIHx8ICgkZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gbm9kZSkpIHtcclxuXHRcdFx0Y2FjaGVkQXR0cnNbYXR0ck5hbWVdID0gZGF0YUF0dHJcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRyZXR1cm4gc2V0U2luZ2xlQXR0cihcclxuXHRcdFx0XHRcdG5vZGUsXHJcblx0XHRcdFx0XHRhdHRyTmFtZSxcclxuXHRcdFx0XHRcdGRhdGFBdHRyLFxyXG5cdFx0XHRcdFx0Y2FjaGVkQXR0cixcclxuXHRcdFx0XHRcdHRhZyxcclxuXHRcdFx0XHRcdG5hbWVzcGFjZSlcclxuXHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdC8vIHN3YWxsb3cgSUUncyBpbnZhbGlkIGFyZ3VtZW50IGVycm9ycyB0byBtaW1pYyBIVE1MJ3NcclxuXHRcdFx0XHQvLyBmYWxsYmFjay10by1kb2luZy1ub3RoaW5nLW9uLWludmFsaWQtYXR0cmlidXRlcyBiZWhhdmlvclxyXG5cdFx0XHRcdGlmIChlLm1lc3NhZ2UuaW5kZXhPZihcIkludmFsaWQgYXJndW1lbnRcIikgPCAwKSB0aHJvdyBlXHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAoYXR0ck5hbWUgPT09IFwidmFsdWVcIiAmJiB0YWcgPT09IFwiaW5wdXRcIiAmJlxyXG5cdFx0XHRcdG5vZGUudmFsdWUgIT09IGRhdGFBdHRyKSB7XHJcblx0XHRcdC8vICMzNDggZGF0YUF0dHIgbWF5IG5vdCBiZSBhIHN0cmluZywgc28gdXNlIGxvb3NlIGNvbXBhcmlzb25cclxuXHRcdFx0bm9kZS52YWx1ZSA9IGRhdGFBdHRyXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRBdHRyaWJ1dGVzKG5vZGUsIHRhZywgZGF0YUF0dHJzLCBjYWNoZWRBdHRycywgbmFtZXNwYWNlKSB7XHJcblx0XHRmb3IgKHZhciBhdHRyTmFtZSBpbiBkYXRhQXR0cnMpIHtcclxuXHRcdFx0aWYgKGhhc093bi5jYWxsKGRhdGFBdHRycywgYXR0ck5hbWUpKSB7XHJcblx0XHRcdFx0aWYgKHRyeVNldEF0dHIoXHJcblx0XHRcdFx0XHRcdG5vZGUsXHJcblx0XHRcdFx0XHRcdGF0dHJOYW1lLFxyXG5cdFx0XHRcdFx0XHRkYXRhQXR0cnNbYXR0ck5hbWVdLFxyXG5cdFx0XHRcdFx0XHRjYWNoZWRBdHRyc1thdHRyTmFtZV0sXHJcblx0XHRcdFx0XHRcdGNhY2hlZEF0dHJzLFxyXG5cdFx0XHRcdFx0XHR0YWcsXHJcblx0XHRcdFx0XHRcdG5hbWVzcGFjZSkpIHtcclxuXHRcdFx0XHRcdGNvbnRpbnVlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2FjaGVkQXR0cnNcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNsZWFyKG5vZGVzLCBjYWNoZWQpIHtcclxuXHRcdGZvciAodmFyIGkgPSBub2Rlcy5sZW5ndGggLSAxOyBpID4gLTE7IGktLSkge1xyXG5cdFx0XHRpZiAobm9kZXNbaV0gJiYgbm9kZXNbaV0ucGFyZW50Tm9kZSkge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRub2Rlc1tpXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGVzW2ldKVxyXG5cdFx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdC8qIGVzbGludC1kaXNhYmxlIG1heC1sZW4gKi9cclxuXHRcdFx0XHRcdC8vIGlnbm9yZSBpZiB0aGlzIGZhaWxzIGR1ZSB0byBvcmRlciBvZiBldmVudHMgKHNlZVxyXG5cdFx0XHRcdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMTkyNjA4My9mYWlsZWQtdG8tZXhlY3V0ZS1yZW1vdmVjaGlsZC1vbi1ub2RlKVxyXG5cdFx0XHRcdFx0LyogZXNsaW50LWVuYWJsZSBtYXgtbGVuICovXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhY2hlZCA9IFtdLmNvbmNhdChjYWNoZWQpXHJcblx0XHRcdFx0aWYgKGNhY2hlZFtpXSkgdW5sb2FkKGNhY2hlZFtpXSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gcmVsZWFzZSBtZW1vcnkgaWYgbm9kZXMgaXMgYW4gYXJyYXkuIFRoaXMgY2hlY2sgc2hvdWxkIGZhaWwgaWYgbm9kZXNcclxuXHRcdC8vIGlzIGEgTm9kZUxpc3QgKHNlZSBsb29wIGFib3ZlKVxyXG5cdFx0aWYgKG5vZGVzLmxlbmd0aCkge1xyXG5cdFx0XHRub2Rlcy5sZW5ndGggPSAwXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiB1bmxvYWQoY2FjaGVkKSB7XHJcblx0XHRpZiAoY2FjaGVkLmNvbmZpZ0NvbnRleHQgJiYgaXNGdW5jdGlvbihjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCkpIHtcclxuXHRcdFx0Y2FjaGVkLmNvbmZpZ0NvbnRleHQub251bmxvYWQoKVxyXG5cdFx0XHRjYWNoZWQuY29uZmlnQ29udGV4dC5vbnVubG9hZCA9IG51bGxcclxuXHRcdH1cclxuXHRcdGlmIChjYWNoZWQuY29udHJvbGxlcnMpIHtcclxuXHRcdFx0Zm9yRWFjaChjYWNoZWQuY29udHJvbGxlcnMsIGZ1bmN0aW9uIChjb250cm9sbGVyKSB7XHJcblx0XHRcdFx0aWYgKGlzRnVuY3Rpb24oY29udHJvbGxlci5vbnVubG9hZCkpIHtcclxuXHRcdFx0XHRcdGNvbnRyb2xsZXIub251bmxvYWQoe3ByZXZlbnREZWZhdWx0OiBub29wfSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0XHRpZiAoY2FjaGVkLmNoaWxkcmVuKSB7XHJcblx0XHRcdGlmIChpc0FycmF5KGNhY2hlZC5jaGlsZHJlbikpIGZvckVhY2goY2FjaGVkLmNoaWxkcmVuLCB1bmxvYWQpXHJcblx0XHRcdGVsc2UgaWYgKGNhY2hlZC5jaGlsZHJlbi50YWcpIHVubG9hZChjYWNoZWQuY2hpbGRyZW4pXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhcHBlbmRUZXh0RnJhZ21lbnQocGFyZW50RWxlbWVudCwgZGF0YSkge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0cGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChcclxuXHRcdFx0XHQkZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoZGF0YSkpXHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsIGRhdGEpXHJcblx0XHRcdHJlcGxhY2VTY3JpcHROb2RlcyhwYXJlbnRFbGVtZW50KVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gUmVwbGFjZSBzY3JpcHQgdGFncyBpbnNpZGUgZ2l2ZW4gRE9NIGVsZW1lbnQgd2l0aCBleGVjdXRhYmxlIG9uZXMuXHJcblx0Ly8gV2lsbCBhbHNvIGNoZWNrIGNoaWxkcmVuIHJlY3Vyc2l2ZWx5IGFuZCByZXBsYWNlIGFueSBmb3VuZCBzY3JpcHRcclxuXHQvLyB0YWdzIGluIHNhbWUgbWFubmVyLlxyXG5cdGZ1bmN0aW9uIHJlcGxhY2VTY3JpcHROb2Rlcyhub2RlKSB7XHJcblx0XHRpZiAobm9kZS50YWdOYW1lID09PSBcIlNDUklQVFwiKSB7XHJcblx0XHRcdG5vZGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoYnVpbGRFeGVjdXRhYmxlTm9kZShub2RlKSwgbm9kZSlcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGROb2Rlc1xyXG5cdFx0XHRpZiAoY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoKSB7XHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0cmVwbGFjZVNjcmlwdE5vZGVzKGNoaWxkcmVuW2ldKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBub2RlXHJcblx0fVxyXG5cclxuXHQvLyBSZXBsYWNlIHNjcmlwdCBlbGVtZW50IHdpdGggb25lIHdob3NlIGNvbnRlbnRzIGFyZSBleGVjdXRhYmxlLlxyXG5cdGZ1bmN0aW9uIGJ1aWxkRXhlY3V0YWJsZU5vZGUobm9kZSl7XHJcblx0XHR2YXIgc2NyaXB0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpXHJcblx0XHR2YXIgYXR0cnMgPSBub2RlLmF0dHJpYnV0ZXNcclxuXHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGF0dHJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHNjcmlwdEVsLnNldEF0dHJpYnV0ZShhdHRyc1tpXS5uYW1lLCBhdHRyc1tpXS52YWx1ZSlcclxuXHRcdH1cclxuXHJcblx0XHRzY3JpcHRFbC50ZXh0ID0gbm9kZS5pbm5lckhUTUxcclxuXHRcdHJldHVybiBzY3JpcHRFbFxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gaW5qZWN0SFRNTChwYXJlbnRFbGVtZW50LCBpbmRleCwgZGF0YSkge1xyXG5cdFx0dmFyIG5leHRTaWJsaW5nID0gcGFyZW50RWxlbWVudC5jaGlsZE5vZGVzW2luZGV4XVxyXG5cdFx0aWYgKG5leHRTaWJsaW5nKSB7XHJcblx0XHRcdHZhciBpc0VsZW1lbnQgPSBuZXh0U2libGluZy5ub2RlVHlwZSAhPT0gMVxyXG5cdFx0XHR2YXIgcGxhY2Vob2xkZXIgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIilcclxuXHRcdFx0aWYgKGlzRWxlbWVudCkge1xyXG5cdFx0XHRcdHBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHBsYWNlaG9sZGVyLCBuZXh0U2libGluZyB8fCBudWxsKVxyXG5cdFx0XHRcdHBsYWNlaG9sZGVyLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWJlZ2luXCIsIGRhdGEpXHJcblx0XHRcdFx0cGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChwbGFjZWhvbGRlcilcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRuZXh0U2libGluZy5pbnNlcnRBZGphY2VudEhUTUwoXCJiZWZvcmViZWdpblwiLCBkYXRhKVxyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRhcHBlbmRUZXh0RnJhZ21lbnQocGFyZW50RWxlbWVudCwgZGF0YSlcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgbm9kZXMgPSBbXVxyXG5cclxuXHRcdHdoaWxlIChwYXJlbnRFbGVtZW50LmNoaWxkTm9kZXNbaW5kZXhdICE9PSBuZXh0U2libGluZykge1xyXG5cdFx0XHRub2Rlcy5wdXNoKHBhcmVudEVsZW1lbnQuY2hpbGROb2Rlc1tpbmRleF0pXHJcblx0XHRcdGluZGV4KytcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbm9kZXNcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGF1dG9yZWRyYXcoY2FsbGJhY2ssIG9iamVjdCkge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdGUgPSBlIHx8IGV2ZW50XHJcblx0XHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiZGlmZlwiKVxyXG5cdFx0XHRtLnN0YXJ0Q29tcHV0YXRpb24oKVxyXG5cdFx0XHR0cnkge1xyXG5cdFx0XHRcdHJldHVybiBjYWxsYmFjay5jYWxsKG9iamVjdCwgZSlcclxuXHRcdFx0fSBmaW5hbGx5IHtcclxuXHRcdFx0XHRlbmRGaXJzdENvbXB1dGF0aW9uKClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIGh0bWxcclxuXHR2YXIgZG9jdW1lbnROb2RlID0ge1xyXG5cdFx0YXBwZW5kQ2hpbGQ6IGZ1bmN0aW9uIChub2RlKSB7XHJcblx0XHRcdGlmIChodG1sID09PSB1bmRlZmluZWQpIGh0bWwgPSAkZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImh0bWxcIilcclxuXHRcdFx0aWYgKCRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiZcclxuXHRcdFx0XHRcdCRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgIT09IG5vZGUpIHtcclxuXHRcdFx0XHQkZG9jdW1lbnQucmVwbGFjZUNoaWxkKG5vZGUsICRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JGRvY3VtZW50LmFwcGVuZENoaWxkKG5vZGUpXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuY2hpbGROb2RlcyA9ICRkb2N1bWVudC5jaGlsZE5vZGVzXHJcblx0XHR9LFxyXG5cclxuXHRcdGluc2VydEJlZm9yZTogZnVuY3Rpb24gKG5vZGUpIHtcclxuXHRcdFx0dGhpcy5hcHBlbmRDaGlsZChub2RlKVxyXG5cdFx0fSxcclxuXHJcblx0XHRjaGlsZE5vZGVzOiBbXVxyXG5cdH1cclxuXHJcblx0dmFyIG5vZGVDYWNoZSA9IFtdXHJcblx0dmFyIGNlbGxDYWNoZSA9IHt9XHJcblxyXG5cdG0ucmVuZGVyID0gZnVuY3Rpb24gKHJvb3QsIGNlbGwsIGZvcmNlUmVjcmVhdGlvbikge1xyXG5cdFx0aWYgKCFyb290KSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkVuc3VyZSB0aGUgRE9NIGVsZW1lbnQgYmVpbmcgcGFzc2VkIHRvIFwiICtcclxuXHRcdFx0XHRcIm0ucm91dGUvbS5tb3VudC9tLnJlbmRlciBpcyBub3QgdW5kZWZpbmVkLlwiKVxyXG5cdFx0fVxyXG5cdFx0dmFyIGNvbmZpZ3MgPSBbXVxyXG5cdFx0dmFyIGlkID0gZ2V0Q2VsbENhY2hlS2V5KHJvb3QpXHJcblx0XHR2YXIgaXNEb2N1bWVudFJvb3QgPSByb290ID09PSAkZG9jdW1lbnRcclxuXHRcdHZhciBub2RlXHJcblxyXG5cdFx0aWYgKGlzRG9jdW1lbnRSb290IHx8IHJvb3QgPT09ICRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdFx0bm9kZSA9IGRvY3VtZW50Tm9kZVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bm9kZSA9IHJvb3RcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoaXNEb2N1bWVudFJvb3QgJiYgY2VsbC50YWcgIT09IFwiaHRtbFwiKSB7XHJcblx0XHRcdGNlbGwgPSB7dGFnOiBcImh0bWxcIiwgYXR0cnM6IHt9LCBjaGlsZHJlbjogY2VsbH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoY2VsbENhY2hlW2lkXSA9PT0gdW5kZWZpbmVkKSBjbGVhcihub2RlLmNoaWxkTm9kZXMpXHJcblx0XHRpZiAoZm9yY2VSZWNyZWF0aW9uID09PSB0cnVlKSByZXNldChyb290KVxyXG5cclxuXHRcdGNlbGxDYWNoZVtpZF0gPSBidWlsZChcclxuXHRcdFx0bm9kZSxcclxuXHRcdFx0bnVsbCxcclxuXHRcdFx0dW5kZWZpbmVkLFxyXG5cdFx0XHR1bmRlZmluZWQsXHJcblx0XHRcdGNlbGwsXHJcblx0XHRcdGNlbGxDYWNoZVtpZF0sXHJcblx0XHRcdGZhbHNlLFxyXG5cdFx0XHQwLFxyXG5cdFx0XHRudWxsLFxyXG5cdFx0XHR1bmRlZmluZWQsXHJcblx0XHRcdGNvbmZpZ3MpXHJcblxyXG5cdFx0Zm9yRWFjaChjb25maWdzLCBmdW5jdGlvbiAoY29uZmlnKSB7IGNvbmZpZygpIH0pXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBnZXRDZWxsQ2FjaGVLZXkoZWxlbWVudCkge1xyXG5cdFx0dmFyIGluZGV4ID0gbm9kZUNhY2hlLmluZGV4T2YoZWxlbWVudClcclxuXHRcdHJldHVybiBpbmRleCA8IDAgPyBub2RlQ2FjaGUucHVzaChlbGVtZW50KSAtIDEgOiBpbmRleFxyXG5cdH1cclxuXHJcblx0bS50cnVzdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0dmFsdWUgPSBuZXcgU3RyaW5nKHZhbHVlKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xyXG5cdFx0dmFsdWUuJHRydXN0ZWQgPSB0cnVlXHJcblx0XHRyZXR1cm4gdmFsdWVcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGdldHRlcnNldHRlcihzdG9yZSkge1xyXG5cdFx0ZnVuY3Rpb24gcHJvcCgpIHtcclxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGgpIHN0b3JlID0gYXJndW1lbnRzWzBdXHJcblx0XHRcdHJldHVybiBzdG9yZVxyXG5cdFx0fVxyXG5cclxuXHRcdHByb3AudG9KU09OID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRyZXR1cm4gc3RvcmVcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcHJvcFxyXG5cdH1cclxuXHJcblx0bS5wcm9wID0gZnVuY3Rpb24gKHN0b3JlKSB7XHJcblx0XHRpZiAoKHN0b3JlICE9IG51bGwgJiYgKGlzT2JqZWN0KHN0b3JlKSB8fCBpc0Z1bmN0aW9uKHN0b3JlKSkgfHwgKCh0eXBlb2YgUHJvbWlzZSAhPT0gXCJ1bmRlZmluZWRcIikgJiYgKHN0b3JlIGluc3RhbmNlb2YgUHJvbWlzZSkpKSAmJlxyXG5cdFx0XHRcdGlzRnVuY3Rpb24oc3RvcmUudGhlbikpIHtcclxuXHRcdFx0cmV0dXJuIHByb3BpZnkoc3RvcmUpXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGdldHRlcnNldHRlcihzdG9yZSlcclxuXHR9XHJcblxyXG5cdHZhciByb290cyA9IFtdXHJcblx0dmFyIGNvbXBvbmVudHMgPSBbXVxyXG5cdHZhciBjb250cm9sbGVycyA9IFtdXHJcblx0dmFyIGxhc3RSZWRyYXdJZCA9IG51bGxcclxuXHR2YXIgbGFzdFJlZHJhd0NhbGxUaW1lID0gMFxyXG5cdHZhciBjb21wdXRlUHJlUmVkcmF3SG9vayA9IG51bGxcclxuXHR2YXIgY29tcHV0ZVBvc3RSZWRyYXdIb29rID0gbnVsbFxyXG5cdHZhciB0b3BDb21wb25lbnRcclxuXHR2YXIgRlJBTUVfQlVER0VUID0gMTYgLy8gNjAgZnJhbWVzIHBlciBzZWNvbmQgPSAxIGNhbGwgcGVyIDE2IG1zXHJcblxyXG5cdGZ1bmN0aW9uIHBhcmFtZXRlcml6ZShjb21wb25lbnQsIGFyZ3MpIHtcclxuXHRcdGZ1bmN0aW9uIGNvbnRyb2xsZXIoKSB7XHJcblx0XHRcdC8qIGVzbGludC1kaXNhYmxlIG5vLWludmFsaWQtdGhpcyAqL1xyXG5cdFx0XHRyZXR1cm4gKGNvbXBvbmVudC5jb250cm9sbGVyIHx8IG5vb3ApLmFwcGx5KHRoaXMsIGFyZ3MpIHx8IHRoaXNcclxuXHRcdFx0LyogZXNsaW50LWVuYWJsZSBuby1pbnZhbGlkLXRoaXMgKi9cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoY29tcG9uZW50LmNvbnRyb2xsZXIpIHtcclxuXHRcdFx0Y29udHJvbGxlci5wcm90b3R5cGUgPSBjb21wb25lbnQuY29udHJvbGxlci5wcm90b3R5cGVcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiB2aWV3KGN0cmwpIHtcclxuXHRcdFx0dmFyIGN1cnJlbnRBcmdzID0gW2N0cmxdLmNvbmNhdChhcmdzKVxyXG5cdFx0XHRmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGN1cnJlbnRBcmdzLnB1c2goYXJndW1lbnRzW2ldKVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gY29tcG9uZW50LnZpZXcuYXBwbHkoY29tcG9uZW50LCBjdXJyZW50QXJncylcclxuXHRcdH1cclxuXHJcblx0XHR2aWV3LiRvcmlnaW5hbCA9IGNvbXBvbmVudC52aWV3XHJcblx0XHR2YXIgb3V0cHV0ID0ge2NvbnRyb2xsZXI6IGNvbnRyb2xsZXIsIHZpZXc6IHZpZXd9XHJcblx0XHRpZiAoYXJnc1swXSAmJiBhcmdzWzBdLmtleSAhPSBudWxsKSBvdXRwdXQuYXR0cnMgPSB7a2V5OiBhcmdzWzBdLmtleX1cclxuXHRcdHJldHVybiBvdXRwdXRcclxuXHR9XHJcblxyXG5cdG0uY29tcG9uZW50ID0gZnVuY3Rpb24gKGNvbXBvbmVudCkge1xyXG5cdFx0dmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpXHJcblxyXG5cdFx0Zm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0YXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcGFyYW1ldGVyaXplKGNvbXBvbmVudCwgYXJncylcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNoZWNrUHJldmVudGVkKGNvbXBvbmVudCwgcm9vdCwgaW5kZXgsIGlzUHJldmVudGVkKSB7XHJcblx0XHRpZiAoIWlzUHJldmVudGVkKSB7XHJcblx0XHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiYWxsXCIpXHJcblx0XHRcdG0uc3RhcnRDb21wdXRhdGlvbigpXHJcblx0XHRcdHJvb3RzW2luZGV4XSA9IHJvb3RcclxuXHRcdFx0dmFyIGN1cnJlbnRDb21wb25lbnRcclxuXHJcblx0XHRcdGlmIChjb21wb25lbnQpIHtcclxuXHRcdFx0XHRjdXJyZW50Q29tcG9uZW50ID0gdG9wQ29tcG9uZW50ID0gY29tcG9uZW50XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y3VycmVudENvbXBvbmVudCA9IHRvcENvbXBvbmVudCA9IGNvbXBvbmVudCA9IHtjb250cm9sbGVyOiBub29wfVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgY29udHJvbGxlciA9IG5ldyAoY29tcG9uZW50LmNvbnRyb2xsZXIgfHwgbm9vcCkoKVxyXG5cclxuXHRcdFx0Ly8gY29udHJvbGxlcnMgbWF5IGNhbGwgbS5tb3VudCByZWN1cnNpdmVseSAodmlhIG0ucm91dGUgcmVkaXJlY3RzLFxyXG5cdFx0XHQvLyBmb3IgZXhhbXBsZSlcclxuXHRcdFx0Ly8gdGhpcyBjb25kaXRpb25hbCBlbnN1cmVzIG9ubHkgdGhlIGxhc3QgcmVjdXJzaXZlIG0ubW91bnQgY2FsbCBpc1xyXG5cdFx0XHQvLyBhcHBsaWVkXHJcblx0XHRcdGlmIChjdXJyZW50Q29tcG9uZW50ID09PSB0b3BDb21wb25lbnQpIHtcclxuXHRcdFx0XHRjb250cm9sbGVyc1tpbmRleF0gPSBjb250cm9sbGVyXHJcblx0XHRcdFx0Y29tcG9uZW50c1tpbmRleF0gPSBjb21wb25lbnRcclxuXHRcdFx0fVxyXG5cdFx0XHRlbmRGaXJzdENvbXB1dGF0aW9uKClcclxuXHRcdFx0aWYgKGNvbXBvbmVudCA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdHJlbW92ZVJvb3RFbGVtZW50KHJvb3QsIGluZGV4KVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBjb250cm9sbGVyc1tpbmRleF1cclxuXHRcdH0gZWxzZSBpZiAoY29tcG9uZW50ID09IG51bGwpIHtcclxuXHRcdFx0cmVtb3ZlUm9vdEVsZW1lbnQocm9vdCwgaW5kZXgpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRtLm1vdW50ID0gbS5tb2R1bGUgPSBmdW5jdGlvbiAocm9vdCwgY29tcG9uZW50KSB7XHJcblx0XHRpZiAoIXJvb3QpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiUGxlYXNlIGVuc3VyZSB0aGUgRE9NIGVsZW1lbnQgZXhpc3RzIGJlZm9yZSBcIiArXHJcblx0XHRcdFx0XCJyZW5kZXJpbmcgYSB0ZW1wbGF0ZSBpbnRvIGl0LlwiKVxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBpbmRleCA9IHJvb3RzLmluZGV4T2Yocm9vdClcclxuXHRcdGlmIChpbmRleCA8IDApIGluZGV4ID0gcm9vdHMubGVuZ3RoXHJcblxyXG5cdFx0dmFyIGlzUHJldmVudGVkID0gZmFsc2VcclxuXHRcdHZhciBldmVudCA9IHtcclxuXHRcdFx0cHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRpc1ByZXZlbnRlZCA9IHRydWVcclxuXHRcdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vayA9IGNvbXB1dGVQb3N0UmVkcmF3SG9vayA9IG51bGxcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZvckVhY2godW5sb2FkZXJzLCBmdW5jdGlvbiAodW5sb2FkZXIpIHtcclxuXHRcdFx0dW5sb2FkZXIuaGFuZGxlci5jYWxsKHVubG9hZGVyLmNvbnRyb2xsZXIsIGV2ZW50KVxyXG5cdFx0XHR1bmxvYWRlci5jb250cm9sbGVyLm9udW5sb2FkID0gbnVsbFxyXG5cdFx0fSlcclxuXHJcblx0XHRpZiAoaXNQcmV2ZW50ZWQpIHtcclxuXHRcdFx0Zm9yRWFjaCh1bmxvYWRlcnMsIGZ1bmN0aW9uICh1bmxvYWRlcikge1xyXG5cdFx0XHRcdHVubG9hZGVyLmNvbnRyb2xsZXIub251bmxvYWQgPSB1bmxvYWRlci5oYW5kbGVyXHJcblx0XHRcdH0pXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR1bmxvYWRlcnMgPSBbXVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChjb250cm9sbGVyc1tpbmRleF0gJiYgaXNGdW5jdGlvbihjb250cm9sbGVyc1tpbmRleF0ub251bmxvYWQpKSB7XHJcblx0XHRcdGNvbnRyb2xsZXJzW2luZGV4XS5vbnVubG9hZChldmVudClcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gY2hlY2tQcmV2ZW50ZWQoY29tcG9uZW50LCByb290LCBpbmRleCwgaXNQcmV2ZW50ZWQpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiByZW1vdmVSb290RWxlbWVudChyb290LCBpbmRleCkge1xyXG5cdFx0cm9vdHMuc3BsaWNlKGluZGV4LCAxKVxyXG5cdFx0Y29udHJvbGxlcnMuc3BsaWNlKGluZGV4LCAxKVxyXG5cdFx0Y29tcG9uZW50cy5zcGxpY2UoaW5kZXgsIDEpXHJcblx0XHRyZXNldChyb290KVxyXG5cdFx0bm9kZUNhY2hlLnNwbGljZShnZXRDZWxsQ2FjaGVLZXkocm9vdCksIDEpXHJcblx0fVxyXG5cclxuXHR2YXIgcmVkcmF3aW5nID0gZmFsc2VcclxuXHRtLnJlZHJhdyA9IGZ1bmN0aW9uIChmb3JjZSkge1xyXG5cdFx0aWYgKHJlZHJhd2luZykgcmV0dXJuXHJcblx0XHRyZWRyYXdpbmcgPSB0cnVlXHJcblx0XHRpZiAoZm9yY2UpIGZvcmNpbmcgPSB0cnVlXHJcblxyXG5cdFx0dHJ5IHtcclxuXHRcdFx0Ly8gbGFzdFJlZHJhd0lkIGlzIGEgcG9zaXRpdmUgbnVtYmVyIGlmIGEgc2Vjb25kIHJlZHJhdyBpcyByZXF1ZXN0ZWRcclxuXHRcdFx0Ly8gYmVmb3JlIHRoZSBuZXh0IGFuaW1hdGlvbiBmcmFtZVxyXG5cdFx0XHQvLyBsYXN0UmVkcmF3SWQgaXMgbnVsbCBpZiBpdCdzIHRoZSBmaXJzdCByZWRyYXcgYW5kIG5vdCBhbiBldmVudFxyXG5cdFx0XHQvLyBoYW5kbGVyXHJcblx0XHRcdGlmIChsYXN0UmVkcmF3SWQgJiYgIWZvcmNlKSB7XHJcblx0XHRcdFx0Ly8gd2hlbiBzZXRUaW1lb3V0OiBvbmx5IHJlc2NoZWR1bGUgcmVkcmF3IGlmIHRpbWUgYmV0d2VlbiBub3dcclxuXHRcdFx0XHQvLyBhbmQgcHJldmlvdXMgcmVkcmF3IGlzIGJpZ2dlciB0aGFuIGEgZnJhbWUsIG90aGVyd2lzZSBrZWVwXHJcblx0XHRcdFx0Ly8gY3VycmVudGx5IHNjaGVkdWxlZCB0aW1lb3V0XHJcblx0XHRcdFx0Ly8gd2hlbiByQUY6IGFsd2F5cyByZXNjaGVkdWxlIHJlZHJhd1xyXG5cdFx0XHRcdGlmICgkcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSBnbG9iYWwucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcblx0XHRcdFx0XHRcdG5ldyBEYXRlKCkgLSBsYXN0UmVkcmF3Q2FsbFRpbWUgPiBGUkFNRV9CVURHRVQpIHtcclxuXHRcdFx0XHRcdGlmIChsYXN0UmVkcmF3SWQgPiAwKSAkY2FuY2VsQW5pbWF0aW9uRnJhbWUobGFzdFJlZHJhd0lkKVxyXG5cdFx0XHRcdFx0bGFzdFJlZHJhd0lkID0gJHJlcXVlc3RBbmltYXRpb25GcmFtZShyZWRyYXcsIEZSQU1FX0JVREdFVClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmVkcmF3KClcclxuXHRcdFx0XHRsYXN0UmVkcmF3SWQgPSAkcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdGxhc3RSZWRyYXdJZCA9IG51bGxcclxuXHRcdFx0XHR9LCBGUkFNRV9CVURHRVQpXHJcblx0XHRcdH1cclxuXHRcdH0gZmluYWxseSB7XHJcblx0XHRcdHJlZHJhd2luZyA9IGZvcmNpbmcgPSBmYWxzZVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bS5yZWRyYXcuc3RyYXRlZ3kgPSBtLnByb3AoKVxyXG5cdGZ1bmN0aW9uIHJlZHJhdygpIHtcclxuXHRcdGlmIChjb21wdXRlUHJlUmVkcmF3SG9vaykge1xyXG5cdFx0XHRjb21wdXRlUHJlUmVkcmF3SG9vaygpXHJcblx0XHRcdGNvbXB1dGVQcmVSZWRyYXdIb29rID0gbnVsbFxyXG5cdFx0fVxyXG5cdFx0Zm9yRWFjaChyb290cywgZnVuY3Rpb24gKHJvb3QsIGkpIHtcclxuXHRcdFx0dmFyIGNvbXBvbmVudCA9IGNvbXBvbmVudHNbaV1cclxuXHRcdFx0aWYgKGNvbnRyb2xsZXJzW2ldKSB7XHJcblx0XHRcdFx0dmFyIGFyZ3MgPSBbY29udHJvbGxlcnNbaV1dXHJcblx0XHRcdFx0bS5yZW5kZXIocm9vdCxcclxuXHRcdFx0XHRcdGNvbXBvbmVudC52aWV3ID8gY29tcG9uZW50LnZpZXcoY29udHJvbGxlcnNbaV0sIGFyZ3MpIDogXCJcIilcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHRcdC8vIGFmdGVyIHJlbmRlcmluZyB3aXRoaW4gYSByb3V0ZWQgY29udGV4dCwgd2UgbmVlZCB0byBzY3JvbGwgYmFjayB0b1xyXG5cdFx0Ly8gdGhlIHRvcCwgYW5kIGZldGNoIHRoZSBkb2N1bWVudCB0aXRsZSBmb3IgaGlzdG9yeS5wdXNoU3RhdGVcclxuXHRcdGlmIChjb21wdXRlUG9zdFJlZHJhd0hvb2spIHtcclxuXHRcdFx0Y29tcHV0ZVBvc3RSZWRyYXdIb29rKClcclxuXHRcdFx0Y29tcHV0ZVBvc3RSZWRyYXdIb29rID0gbnVsbFxyXG5cdFx0fVxyXG5cdFx0bGFzdFJlZHJhd0lkID0gbnVsbFxyXG5cdFx0bGFzdFJlZHJhd0NhbGxUaW1lID0gbmV3IERhdGUoKVxyXG5cdFx0bS5yZWRyYXcuc3RyYXRlZ3koXCJkaWZmXCIpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBlbmRGaXJzdENvbXB1dGF0aW9uKCkge1xyXG5cdFx0aWYgKG0ucmVkcmF3LnN0cmF0ZWd5KCkgPT09IFwibm9uZVwiKSB7XHJcblx0XHRcdHBlbmRpbmdSZXF1ZXN0cy0tXHJcblx0XHRcdG0ucmVkcmF3LnN0cmF0ZWd5KFwiZGlmZlwiKVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bS5lbmRDb21wdXRhdGlvbigpXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRtLndpdGhBdHRyID0gZnVuY3Rpb24gKHByb3AsIHdpdGhBdHRyQ2FsbGJhY2ssIGNhbGxiYWNrVGhpcykge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdGUgPSBlIHx8IHdpbmRvdy5ldmVudFxyXG5cdFx0XHQvKiBlc2xpbnQtZGlzYWJsZSBuby1pbnZhbGlkLXRoaXMgKi9cclxuXHRcdFx0dmFyIGN1cnJlbnRUYXJnZXQgPSBlLmN1cnJlbnRUYXJnZXQgfHwgdGhpc1xyXG5cdFx0XHR2YXIgX3RoaXMgPSBjYWxsYmFja1RoaXMgfHwgdGhpc1xyXG5cdFx0XHQvKiBlc2xpbnQtZW5hYmxlIG5vLWludmFsaWQtdGhpcyAqL1xyXG5cdFx0XHR2YXIgdGFyZ2V0ID0gcHJvcCBpbiBjdXJyZW50VGFyZ2V0ID9cclxuXHRcdFx0XHRjdXJyZW50VGFyZ2V0W3Byb3BdIDpcclxuXHRcdFx0XHRjdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZShwcm9wKVxyXG5cdFx0XHR3aXRoQXR0ckNhbGxiYWNrLmNhbGwoX3RoaXMsIHRhcmdldClcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIHJvdXRpbmdcclxuXHR2YXIgbW9kZXMgPSB7cGF0aG5hbWU6IFwiXCIsIGhhc2g6IFwiI1wiLCBzZWFyY2g6IFwiP1wifVxyXG5cdHZhciByZWRpcmVjdCA9IG5vb3BcclxuXHR2YXIgaXNEZWZhdWx0Um91dGUgPSBmYWxzZVxyXG5cdHZhciByb3V0ZVBhcmFtcywgY3VycmVudFJvdXRlXHJcblxyXG5cdG0ucm91dGUgPSBmdW5jdGlvbiAocm9vdCwgYXJnMSwgYXJnMiwgdmRvbSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcblx0XHQvLyBtLnJvdXRlKClcclxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gY3VycmVudFJvdXRlXHJcblx0XHQvLyBtLnJvdXRlKGVsLCBkZWZhdWx0Um91dGUsIHJvdXRlcylcclxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzICYmIGlzU3RyaW5nKGFyZzEpKSB7XHJcblx0XHRcdHJlZGlyZWN0ID0gZnVuY3Rpb24gKHNvdXJjZSkge1xyXG5cdFx0XHRcdHZhciBwYXRoID0gY3VycmVudFJvdXRlID0gbm9ybWFsaXplUm91dGUoc291cmNlKVxyXG5cdFx0XHRcdGlmICghcm91dGVCeVZhbHVlKHJvb3QsIGFyZzIsIHBhdGgpKSB7XHJcblx0XHRcdFx0XHRpZiAoaXNEZWZhdWx0Um91dGUpIHtcclxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiRW5zdXJlIHRoZSBkZWZhdWx0IHJvdXRlIG1hdGNoZXMgXCIgK1xyXG5cdFx0XHRcdFx0XHRcdFwib25lIG9mIHRoZSByb3V0ZXMgZGVmaW5lZCBpbiBtLnJvdXRlXCIpXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aXNEZWZhdWx0Um91dGUgPSB0cnVlXHJcblx0XHRcdFx0XHRtLnJvdXRlKGFyZzEsIHRydWUpXHJcblx0XHRcdFx0XHRpc0RlZmF1bHRSb3V0ZSA9IGZhbHNlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgbGlzdGVuZXIgPSBtLnJvdXRlLm1vZGUgPT09IFwiaGFzaFwiID9cclxuXHRcdFx0XHRcIm9uaGFzaGNoYW5nZVwiIDpcclxuXHRcdFx0XHRcIm9ucG9wc3RhdGVcIlxyXG5cclxuXHRcdFx0Z2xvYmFsW2xpc3RlbmVyXSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR2YXIgcGF0aCA9ICRsb2NhdGlvblttLnJvdXRlLm1vZGVdXHJcblx0XHRcdFx0aWYgKG0ucm91dGUubW9kZSA9PT0gXCJwYXRobmFtZVwiKSBwYXRoICs9ICRsb2NhdGlvbi5zZWFyY2hcclxuXHRcdFx0XHRpZiAoY3VycmVudFJvdXRlICE9PSBub3JtYWxpemVSb3V0ZShwYXRoKSkgcmVkaXJlY3QocGF0aClcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2sgPSBzZXRTY3JvbGxcclxuXHRcdFx0Z2xvYmFsW2xpc3RlbmVyXSgpXHJcblxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHJcblx0XHQvLyBjb25maWc6IG0ucm91dGVcclxuXHRcdGlmIChyb290LmFkZEV2ZW50TGlzdGVuZXIgfHwgcm9vdC5hdHRhY2hFdmVudCkge1xyXG5cdFx0XHR2YXIgYmFzZSA9IG0ucm91dGUubW9kZSAhPT0gXCJwYXRobmFtZVwiID8gJGxvY2F0aW9uLnBhdGhuYW1lIDogXCJcIlxyXG5cdFx0XHRyb290LmhyZWYgPSBiYXNlICsgbW9kZXNbbS5yb3V0ZS5tb2RlXSArIHZkb20uYXR0cnMuaHJlZlxyXG5cdFx0XHRpZiAocm9vdC5hZGRFdmVudExpc3RlbmVyKSB7XHJcblx0XHRcdFx0cm9vdC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSlcclxuXHRcdFx0XHRyb290LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByb3V0ZVVub2J0cnVzaXZlKVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJvb3QuZGV0YWNoRXZlbnQoXCJvbmNsaWNrXCIsIHJvdXRlVW5vYnRydXNpdmUpXHJcblx0XHRcdFx0cm9vdC5hdHRhY2hFdmVudChcIm9uY2xpY2tcIiwgcm91dGVVbm9idHJ1c2l2ZSlcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblx0XHQvLyBtLnJvdXRlKHJvdXRlLCBwYXJhbXMsIHNob3VsZFJlcGxhY2VIaXN0b3J5RW50cnkpXHJcblx0XHRpZiAoaXNTdHJpbmcocm9vdCkpIHtcclxuXHRcdFx0dmFyIG9sZFJvdXRlID0gY3VycmVudFJvdXRlXHJcblx0XHRcdGN1cnJlbnRSb3V0ZSA9IHJvb3RcclxuXHJcblx0XHRcdHZhciBhcmdzID0gYXJnMSB8fCB7fVxyXG5cdFx0XHR2YXIgcXVlcnlJbmRleCA9IGN1cnJlbnRSb3V0ZS5pbmRleE9mKFwiP1wiKVxyXG5cdFx0XHR2YXIgcGFyYW1zXHJcblxyXG5cdFx0XHRpZiAocXVlcnlJbmRleCA+IC0xKSB7XHJcblx0XHRcdFx0cGFyYW1zID0gcGFyc2VRdWVyeVN0cmluZyhjdXJyZW50Um91dGUuc2xpY2UocXVlcnlJbmRleCArIDEpKVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHBhcmFtcyA9IHt9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZvciAodmFyIGkgaW4gYXJncykge1xyXG5cdFx0XHRcdGlmIChoYXNPd24uY2FsbChhcmdzLCBpKSkge1xyXG5cdFx0XHRcdFx0cGFyYW1zW2ldID0gYXJnc1tpXVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHF1ZXJ5c3RyaW5nID0gYnVpbGRRdWVyeVN0cmluZyhwYXJhbXMpXHJcblx0XHRcdHZhciBjdXJyZW50UGF0aFxyXG5cclxuXHRcdFx0aWYgKHF1ZXJ5SW5kZXggPiAtMSkge1xyXG5cdFx0XHRcdGN1cnJlbnRQYXRoID0gY3VycmVudFJvdXRlLnNsaWNlKDAsIHF1ZXJ5SW5kZXgpXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y3VycmVudFBhdGggPSBjdXJyZW50Um91dGVcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKHF1ZXJ5c3RyaW5nKSB7XHJcblx0XHRcdFx0Y3VycmVudFJvdXRlID0gY3VycmVudFBhdGggK1xyXG5cdFx0XHRcdFx0KGN1cnJlbnRQYXRoLmluZGV4T2YoXCI/XCIpID09PSAtMSA/IFwiP1wiIDogXCImXCIpICtcclxuXHRcdFx0XHRcdHF1ZXJ5c3RyaW5nXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciByZXBsYWNlSGlzdG9yeSA9XHJcblx0XHRcdFx0KGFyZ3VtZW50cy5sZW5ndGggPT09IDMgPyBhcmcyIDogYXJnMSkgPT09IHRydWUgfHxcclxuXHRcdFx0XHRvbGRSb3V0ZSA9PT0gcm9vdFxyXG5cclxuXHRcdFx0aWYgKGdsb2JhbC5oaXN0b3J5LnB1c2hTdGF0ZSkge1xyXG5cdFx0XHRcdHZhciBtZXRob2QgPSByZXBsYWNlSGlzdG9yeSA/IFwicmVwbGFjZVN0YXRlXCIgOiBcInB1c2hTdGF0ZVwiXHJcblx0XHRcdFx0Y29tcHV0ZVByZVJlZHJhd0hvb2sgPSBzZXRTY3JvbGxcclxuXHRcdFx0XHRjb21wdXRlUG9zdFJlZHJhd0hvb2sgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0XHRnbG9iYWwuaGlzdG9yeVttZXRob2RdKG51bGwsICRkb2N1bWVudC50aXRsZSxcclxuXHRcdFx0XHRcdFx0XHRtb2Rlc1ttLnJvdXRlLm1vZGVdICsgY3VycmVudFJvdXRlKVxyXG5cdFx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdFx0XHRcdC8vIEluIHRoZSBldmVudCBvZiBhIHB1c2hTdGF0ZSBvciByZXBsYWNlU3RhdGUgZmFpbHVyZSxcclxuXHRcdFx0XHRcdFx0Ly8gZmFsbGJhY2sgdG8gYSBzdGFuZGFyZCByZWRpcmVjdC4gVGhpcyBpcyBzcGVjaWZpY2FsbHlcclxuXHRcdFx0XHRcdFx0Ly8gdG8gYWRkcmVzcyBhIFNhZmFyaSBzZWN1cml0eSBlcnJvciB3aGVuIGF0dGVtcHRpbmcgdG9cclxuXHRcdFx0XHRcdFx0Ly8gY2FsbCBwdXNoU3RhdGUgbW9yZSB0aGFuIDEwMCB0aW1lcy5cclxuXHRcdFx0XHRcdFx0JGxvY2F0aW9uW20ucm91dGUubW9kZV0gPSBjdXJyZW50Um91dGVcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmVkaXJlY3QobW9kZXNbbS5yb3V0ZS5tb2RlXSArIGN1cnJlbnRSb3V0ZSlcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkbG9jYXRpb25bbS5yb3V0ZS5tb2RlXSA9IGN1cnJlbnRSb3V0ZVxyXG5cdFx0XHRcdHJlZGlyZWN0KG1vZGVzW20ucm91dGUubW9kZV0gKyBjdXJyZW50Um91dGUpXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG0ucm91dGUucGFyYW0gPSBmdW5jdGlvbiAoa2V5KSB7XHJcblx0XHRpZiAoIXJvdXRlUGFyYW1zKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIllvdSBtdXN0IGNhbGwgbS5yb3V0ZShlbGVtZW50LCBkZWZhdWx0Um91dGUsIFwiICtcclxuXHRcdFx0XHRcInJvdXRlcykgYmVmb3JlIGNhbGxpbmcgbS5yb3V0ZS5wYXJhbSgpXCIpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCFrZXkpIHtcclxuXHRcdFx0cmV0dXJuIHJvdXRlUGFyYW1zXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHJvdXRlUGFyYW1zW2tleV1cclxuXHR9XHJcblxyXG5cdG0ucm91dGUubW9kZSA9IFwic2VhcmNoXCJcclxuXHJcblx0ZnVuY3Rpb24gbm9ybWFsaXplUm91dGUocm91dGUpIHtcclxuXHRcdHJldHVybiByb3V0ZS5zbGljZShtb2Rlc1ttLnJvdXRlLm1vZGVdLmxlbmd0aClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHJvdXRlQnlWYWx1ZShyb290LCByb3V0ZXIsIHBhdGgpIHtcclxuXHRcdHJvdXRlUGFyYW1zID0ge31cclxuXHJcblx0XHR2YXIgcXVlcnlTdGFydCA9IHBhdGguaW5kZXhPZihcIj9cIilcclxuXHRcdGlmIChxdWVyeVN0YXJ0ICE9PSAtMSkge1xyXG5cdFx0XHRyb3V0ZVBhcmFtcyA9IHBhcnNlUXVlcnlTdHJpbmcoXHJcblx0XHRcdFx0cGF0aC5zdWJzdHIocXVlcnlTdGFydCArIDEsIHBhdGgubGVuZ3RoKSlcclxuXHRcdFx0cGF0aCA9IHBhdGguc3Vic3RyKDAsIHF1ZXJ5U3RhcnQpXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gR2V0IGFsbCByb3V0ZXMgYW5kIGNoZWNrIGlmIHRoZXJlJ3NcclxuXHRcdC8vIGFuIGV4YWN0IG1hdGNoIGZvciB0aGUgY3VycmVudCBwYXRoXHJcblx0XHR2YXIga2V5cyA9IE9iamVjdC5rZXlzKHJvdXRlcilcclxuXHRcdHZhciBpbmRleCA9IGtleXMuaW5kZXhPZihwYXRoKVxyXG5cclxuXHRcdGlmIChpbmRleCAhPT0gLTEpe1xyXG5cdFx0XHRtLm1vdW50KHJvb3QsIHJvdXRlcltrZXlzIFtpbmRleF1dKVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAodmFyIHJvdXRlIGluIHJvdXRlcikge1xyXG5cdFx0XHRpZiAoaGFzT3duLmNhbGwocm91dGVyLCByb3V0ZSkpIHtcclxuXHRcdFx0XHRpZiAocm91dGUgPT09IHBhdGgpIHtcclxuXHRcdFx0XHRcdG0ubW91bnQocm9vdCwgcm91dGVyW3JvdXRlXSlcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR2YXIgbWF0Y2hlciA9IG5ldyBSZWdFeHAoXCJeXCIgKyByb3V0ZVxyXG5cdFx0XHRcdFx0LnJlcGxhY2UoLzpbXlxcL10rP1xcLnszfS9nLCBcIiguKj8pXCIpXHJcblx0XHRcdFx0XHQucmVwbGFjZSgvOlteXFwvXSsvZywgXCIoW15cXFxcL10rKVwiKSArIFwiXFwvPyRcIilcclxuXHJcblx0XHRcdFx0aWYgKG1hdGNoZXIudGVzdChwYXRoKSkge1xyXG5cdFx0XHRcdFx0LyogZXNsaW50LWRpc2FibGUgbm8tbG9vcC1mdW5jICovXHJcblx0XHRcdFx0XHRwYXRoLnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHR2YXIga2V5cyA9IHJvdXRlLm1hdGNoKC86W15cXC9dKy9nKSB8fCBbXVxyXG5cdFx0XHRcdFx0XHR2YXIgdmFsdWVzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEsIC0yKVxyXG5cdFx0XHRcdFx0XHRmb3JFYWNoKGtleXMsIGZ1bmN0aW9uIChrZXksIGkpIHtcclxuXHRcdFx0XHRcdFx0XHRyb3V0ZVBhcmFtc1trZXkucmVwbGFjZSgvOnxcXC4vZywgXCJcIildID1cclxuXHRcdFx0XHRcdFx0XHRcdGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZXNbaV0pXHJcblx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdG0ubW91bnQocm9vdCwgcm91dGVyW3JvdXRlXSlcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHQvKiBlc2xpbnQtZW5hYmxlIG5vLWxvb3AtZnVuYyAqL1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHJvdXRlVW5vYnRydXNpdmUoZSkge1xyXG5cdFx0ZSA9IGUgfHwgZXZlbnRcclxuXHRcdGlmIChlLmN0cmxLZXkgfHwgZS5tZXRhS2V5IHx8IGUuc2hpZnRLZXkgfHwgZS53aGljaCA9PT0gMikgcmV0dXJuXHJcblxyXG5cdFx0aWYgKGUucHJldmVudERlZmF1bHQpIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRlLnJldHVyblZhbHVlID0gZmFsc2VcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgY3VycmVudFRhcmdldCA9IGUuY3VycmVudFRhcmdldCB8fCBlLnNyY0VsZW1lbnRcclxuXHRcdHZhciBhcmdzXHJcblxyXG5cdFx0aWYgKG0ucm91dGUubW9kZSA9PT0gXCJwYXRobmFtZVwiICYmIGN1cnJlbnRUYXJnZXQuc2VhcmNoKSB7XHJcblx0XHRcdGFyZ3MgPSBwYXJzZVF1ZXJ5U3RyaW5nKGN1cnJlbnRUYXJnZXQuc2VhcmNoLnNsaWNlKDEpKVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0YXJncyA9IHt9XHJcblx0XHR9XHJcblxyXG5cdFx0d2hpbGUgKGN1cnJlbnRUYXJnZXQgJiYgIS9hL2kudGVzdChjdXJyZW50VGFyZ2V0Lm5vZGVOYW1lKSkge1xyXG5cdFx0XHRjdXJyZW50VGFyZ2V0ID0gY3VycmVudFRhcmdldC5wYXJlbnROb2RlXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2xlYXIgcGVuZGluZ1JlcXVlc3RzIGJlY2F1c2Ugd2Ugd2FudCBhbiBpbW1lZGlhdGUgcm91dGUgY2hhbmdlXHJcblx0XHRwZW5kaW5nUmVxdWVzdHMgPSAwXHJcblx0XHRtLnJvdXRlKGN1cnJlbnRUYXJnZXRbbS5yb3V0ZS5tb2RlXVxyXG5cdFx0XHQuc2xpY2UobW9kZXNbbS5yb3V0ZS5tb2RlXS5sZW5ndGgpLCBhcmdzKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0U2Nyb2xsKCkge1xyXG5cdFx0aWYgKG0ucm91dGUubW9kZSAhPT0gXCJoYXNoXCIgJiYgJGxvY2F0aW9uLmhhc2gpIHtcclxuXHRcdFx0JGxvY2F0aW9uLmhhc2ggPSAkbG9jYXRpb24uaGFzaFxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Z2xvYmFsLnNjcm9sbFRvKDAsIDApXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBidWlsZFF1ZXJ5U3RyaW5nKG9iamVjdCwgcHJlZml4KSB7XHJcblx0XHR2YXIgZHVwbGljYXRlcyA9IHt9XHJcblx0XHR2YXIgc3RyID0gW11cclxuXHJcblx0XHRmb3IgKHZhciBwcm9wIGluIG9iamVjdCkge1xyXG5cdFx0XHRpZiAoaGFzT3duLmNhbGwob2JqZWN0LCBwcm9wKSkge1xyXG5cdFx0XHRcdHZhciBrZXkgPSBwcmVmaXggPyBwcmVmaXggKyBcIltcIiArIHByb3AgKyBcIl1cIiA6IHByb3BcclxuXHRcdFx0XHR2YXIgdmFsdWUgPSBvYmplY3RbcHJvcF1cclxuXHJcblx0XHRcdFx0aWYgKHZhbHVlID09PSBudWxsKSB7XHJcblx0XHRcdFx0XHRzdHIucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSlcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xyXG5cdFx0XHRcdFx0c3RyLnB1c2goYnVpbGRRdWVyeVN0cmluZyh2YWx1ZSwga2V5KSlcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpKSB7XHJcblx0XHRcdFx0XHR2YXIga2V5cyA9IFtdXHJcblx0XHRcdFx0XHRkdXBsaWNhdGVzW2tleV0gPSBkdXBsaWNhdGVzW2tleV0gfHwge31cclxuXHRcdFx0XHRcdC8qIGVzbGludC1kaXNhYmxlIG5vLWxvb3AtZnVuYyAqL1xyXG5cdFx0XHRcdFx0Zm9yRWFjaCh2YWx1ZSwgZnVuY3Rpb24gKGl0ZW0pIHtcclxuXHRcdFx0XHRcdFx0LyogZXNsaW50LWVuYWJsZSBuby1sb29wLWZ1bmMgKi9cclxuXHRcdFx0XHRcdFx0aWYgKCFkdXBsaWNhdGVzW2tleV1baXRlbV0pIHtcclxuXHRcdFx0XHRcdFx0XHRkdXBsaWNhdGVzW2tleV1baXRlbV0gPSB0cnVlXHJcblx0XHRcdFx0XHRcdFx0a2V5cy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgK1xyXG5cdFx0XHRcdFx0XHRcdFx0ZW5jb2RlVVJJQ29tcG9uZW50KGl0ZW0pKVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0c3RyLnB1c2goa2V5cy5qb2luKFwiJlwiKSlcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdHN0ci5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgXCI9XCIgK1xyXG5cdFx0XHRcdFx0XHRlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBzdHIuam9pbihcIiZcIilcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHBhcnNlUXVlcnlTdHJpbmcoc3RyKSB7XHJcblx0XHRpZiAoc3RyID09PSBcIlwiIHx8IHN0ciA9PSBudWxsKSByZXR1cm4ge31cclxuXHRcdGlmIChzdHIuY2hhckF0KDApID09PSBcIj9cIikgc3RyID0gc3RyLnNsaWNlKDEpXHJcblxyXG5cdFx0dmFyIHBhaXJzID0gc3RyLnNwbGl0KFwiJlwiKVxyXG5cdFx0dmFyIHBhcmFtcyA9IHt9XHJcblxyXG5cdFx0Zm9yRWFjaChwYWlycywgZnVuY3Rpb24gKHN0cmluZykge1xyXG5cdFx0XHR2YXIgcGFpciA9IHN0cmluZy5zcGxpdChcIj1cIilcclxuXHRcdFx0dmFyIGtleSA9IGRlY29kZVVSSUNvbXBvbmVudChwYWlyWzBdKVxyXG5cdFx0XHR2YXIgdmFsdWUgPSBwYWlyLmxlbmd0aCA9PT0gMiA/IGRlY29kZVVSSUNvbXBvbmVudChwYWlyWzFdKSA6IG51bGxcclxuXHRcdFx0aWYgKHBhcmFtc1trZXldICE9IG51bGwpIHtcclxuXHRcdFx0XHRpZiAoIWlzQXJyYXkocGFyYW1zW2tleV0pKSBwYXJhbXNba2V5XSA9IFtwYXJhbXNba2V5XV1cclxuXHRcdFx0XHRwYXJhbXNba2V5XS5wdXNoKHZhbHVlKVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgcGFyYW1zW2tleV0gPSB2YWx1ZVxyXG5cdFx0fSlcclxuXHJcblx0XHRyZXR1cm4gcGFyYW1zXHJcblx0fVxyXG5cclxuXHRtLnJvdXRlLmJ1aWxkUXVlcnlTdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nXHJcblx0bS5yb3V0ZS5wYXJzZVF1ZXJ5U3RyaW5nID0gcGFyc2VRdWVyeVN0cmluZ1xyXG5cclxuXHRmdW5jdGlvbiByZXNldChyb290KSB7XHJcblx0XHR2YXIgY2FjaGVLZXkgPSBnZXRDZWxsQ2FjaGVLZXkocm9vdClcclxuXHRcdGNsZWFyKHJvb3QuY2hpbGROb2RlcywgY2VsbENhY2hlW2NhY2hlS2V5XSlcclxuXHRcdGNlbGxDYWNoZVtjYWNoZUtleV0gPSB1bmRlZmluZWRcclxuXHR9XHJcblxyXG5cdG0uZGVmZXJyZWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKVxyXG5cdFx0ZGVmZXJyZWQucHJvbWlzZSA9IHByb3BpZnkoZGVmZXJyZWQucHJvbWlzZSlcclxuXHRcdHJldHVybiBkZWZlcnJlZFxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcHJvcGlmeShwcm9taXNlLCBpbml0aWFsVmFsdWUpIHtcclxuXHRcdHZhciBwcm9wID0gbS5wcm9wKGluaXRpYWxWYWx1ZSlcclxuXHRcdHByb21pc2UudGhlbihwcm9wKVxyXG5cdFx0cHJvcC50aGVuID0gZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG5cdFx0XHRyZXR1cm4gcHJvcGlmeShwcm9taXNlLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KSwgaW5pdGlhbFZhbHVlKVxyXG5cdFx0fVxyXG5cclxuXHRcdHByb3AuY2F0Y2ggPSBwcm9wLnRoZW4uYmluZChudWxsLCBudWxsKVxyXG5cdFx0cmV0dXJuIHByb3BcclxuXHR9XHJcblx0Ly8gUHJvbWl6Lm1pdGhyaWwuanMgfCBab2xtZWlzdGVyIHwgTUlUXHJcblx0Ly8gYSBtb2RpZmllZCB2ZXJzaW9uIG9mIFByb21pei5qcywgd2hpY2ggZG9lcyBub3QgY29uZm9ybSB0byBQcm9taXNlcy9BK1xyXG5cdC8vIGZvciB0d28gcmVhc29uczpcclxuXHQvL1xyXG5cdC8vIDEpIGB0aGVuYCBjYWxsYmFja3MgYXJlIGNhbGxlZCBzeW5jaHJvbm91c2x5IChiZWNhdXNlIHNldFRpbWVvdXQgaXMgdG9vXHJcblx0Ly8gICAgc2xvdywgYW5kIHRoZSBzZXRJbW1lZGlhdGUgcG9seWZpbGwgaXMgdG9vIGJpZ1xyXG5cdC8vXHJcblx0Ly8gMikgdGhyb3dpbmcgc3ViY2xhc3NlcyBvZiBFcnJvciBjYXVzZSB0aGUgZXJyb3IgdG8gYmUgYnViYmxlZCB1cCBpbnN0ZWFkXHJcblx0Ly8gICAgb2YgdHJpZ2dlcmluZyByZWplY3Rpb24gKGJlY2F1c2UgdGhlIHNwZWMgZG9lcyBub3QgYWNjb3VudCBmb3IgdGhlXHJcblx0Ly8gICAgaW1wb3J0YW50IHVzZSBjYXNlIG9mIGRlZmF1bHQgYnJvd3NlciBlcnJvciBoYW5kbGluZywgaS5lLiBtZXNzYWdlIHcvXHJcblx0Ly8gICAgbGluZSBudW1iZXIpXHJcblxyXG5cdHZhciBSRVNPTFZJTkcgPSAxXHJcblx0dmFyIFJFSkVDVElORyA9IDJcclxuXHR2YXIgUkVTT0xWRUQgPSAzXHJcblx0dmFyIFJFSkVDVEVEID0gNFxyXG5cclxuXHRmdW5jdGlvbiBEZWZlcnJlZChvblN1Y2Nlc3MsIG9uRmFpbHVyZSkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzXHJcblx0XHR2YXIgc3RhdGUgPSAwXHJcblx0XHR2YXIgcHJvbWlzZVZhbHVlID0gMFxyXG5cdFx0dmFyIG5leHQgPSBbXVxyXG5cclxuXHRcdHNlbGYucHJvbWlzZSA9IHt9XHJcblxyXG5cdFx0c2VsZi5yZXNvbHZlID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcblx0XHRcdGlmICghc3RhdGUpIHtcclxuXHRcdFx0XHRwcm9taXNlVmFsdWUgPSB2YWx1ZVxyXG5cdFx0XHRcdHN0YXRlID0gUkVTT0xWSU5HXHJcblxyXG5cdFx0XHRcdGZpcmUoKVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gc2VsZlxyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGYucmVqZWN0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcblx0XHRcdGlmICghc3RhdGUpIHtcclxuXHRcdFx0XHRwcm9taXNlVmFsdWUgPSB2YWx1ZVxyXG5cdFx0XHRcdHN0YXRlID0gUkVKRUNUSU5HXHJcblxyXG5cdFx0XHRcdGZpcmUoKVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gc2VsZlxyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGYucHJvbWlzZS50aGVuID0gZnVuY3Rpb24gKG9uU3VjY2Vzcywgb25GYWlsdXJlKSB7XHJcblx0XHRcdHZhciBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZChvblN1Y2Nlc3MsIG9uRmFpbHVyZSlcclxuXHJcblx0XHRcdGlmIChzdGF0ZSA9PT0gUkVTT0xWRUQpIHtcclxuXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHByb21pc2VWYWx1ZSlcclxuXHRcdFx0fSBlbHNlIGlmIChzdGF0ZSA9PT0gUkVKRUNURUQpIHtcclxuXHRcdFx0XHRkZWZlcnJlZC5yZWplY3QocHJvbWlzZVZhbHVlKVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG5leHQucHVzaChkZWZlcnJlZClcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2VcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBmaW5pc2godHlwZSkge1xyXG5cdFx0XHRzdGF0ZSA9IHR5cGUgfHwgUkVKRUNURURcclxuXHRcdFx0bmV4dC5tYXAoZnVuY3Rpb24gKGRlZmVycmVkKSB7XHJcblx0XHRcdFx0aWYgKHN0YXRlID09PSBSRVNPTFZFRCkge1xyXG5cdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShwcm9taXNlVmFsdWUpXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGRlZmVycmVkLnJlamVjdChwcm9taXNlVmFsdWUpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIHRoZW5uYWJsZSh0aGVuLCBzdWNjZXNzLCBmYWlsdXJlLCBub3RUaGVubmFibGUpIHtcclxuXHRcdFx0aWYgKCgocHJvbWlzZVZhbHVlICE9IG51bGwgJiYgaXNPYmplY3QocHJvbWlzZVZhbHVlKSkgfHxcclxuXHRcdFx0XHRcdGlzRnVuY3Rpb24ocHJvbWlzZVZhbHVlKSkgJiYgaXNGdW5jdGlvbih0aGVuKSkge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHQvLyBjb3VudCBwcm90ZWN0cyBhZ2FpbnN0IGFidXNlIGNhbGxzIGZyb20gc3BlYyBjaGVja2VyXHJcblx0XHRcdFx0XHR2YXIgY291bnQgPSAwXHJcblx0XHRcdFx0XHR0aGVuLmNhbGwocHJvbWlzZVZhbHVlLCBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNvdW50KyspIHJldHVyblxyXG5cdFx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSB2YWx1ZVxyXG5cdFx0XHRcdFx0XHRzdWNjZXNzKClcclxuXHRcdFx0XHRcdH0sIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoY291bnQrKykgcmV0dXJuXHJcblx0XHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IHZhbHVlXHJcblx0XHRcdFx0XHRcdGZhaWx1cmUoKVxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0XHRtLmRlZmVycmVkLm9uZXJyb3IoZSlcclxuXHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IGVcclxuXHRcdFx0XHRcdGZhaWx1cmUoKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRub3RUaGVubmFibGUoKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZmlyZSgpIHtcclxuXHRcdFx0Ly8gY2hlY2sgaWYgaXQncyBhIHRoZW5hYmxlXHJcblx0XHRcdHZhciB0aGVuXHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0dGhlbiA9IHByb21pc2VWYWx1ZSAmJiBwcm9taXNlVmFsdWUudGhlblxyXG5cdFx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdFx0bS5kZWZlcnJlZC5vbmVycm9yKGUpXHJcblx0XHRcdFx0cHJvbWlzZVZhbHVlID0gZVxyXG5cdFx0XHRcdHN0YXRlID0gUkVKRUNUSU5HXHJcblx0XHRcdFx0cmV0dXJuIGZpcmUoKVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoc3RhdGUgPT09IFJFSkVDVElORykge1xyXG5cdFx0XHRcdG0uZGVmZXJyZWQub25lcnJvcihwcm9taXNlVmFsdWUpXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoZW5uYWJsZSh0aGVuLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0c3RhdGUgPSBSRVNPTFZJTkdcclxuXHRcdFx0XHRmaXJlKClcclxuXHRcdFx0fSwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHN0YXRlID0gUkVKRUNUSU5HXHJcblx0XHRcdFx0ZmlyZSgpXHJcblx0XHRcdH0sIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0aWYgKHN0YXRlID09PSBSRVNPTFZJTkcgJiYgaXNGdW5jdGlvbihvblN1Y2Nlc3MpKSB7XHJcblx0XHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IG9uU3VjY2Vzcyhwcm9taXNlVmFsdWUpXHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHN0YXRlID09PSBSRUpFQ1RJTkcgJiYgaXNGdW5jdGlvbihvbkZhaWx1cmUpKSB7XHJcblx0XHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IG9uRmFpbHVyZShwcm9taXNlVmFsdWUpXHJcblx0XHRcdFx0XHRcdHN0YXRlID0gUkVTT0xWSU5HXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0bS5kZWZlcnJlZC5vbmVycm9yKGUpXHJcblx0XHRcdFx0XHRwcm9taXNlVmFsdWUgPSBlXHJcblx0XHRcdFx0XHRyZXR1cm4gZmluaXNoKClcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChwcm9taXNlVmFsdWUgPT09IHNlbGYpIHtcclxuXHRcdFx0XHRcdHByb21pc2VWYWx1ZSA9IFR5cGVFcnJvcigpXHJcblx0XHRcdFx0XHRmaW5pc2goKVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGVubmFibGUodGhlbiwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdFx0XHRmaW5pc2goUkVTT0xWRUQpXHJcblx0XHRcdFx0XHR9LCBmaW5pc2gsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0ZmluaXNoKHN0YXRlID09PSBSRVNPTFZJTkcgJiYgUkVTT0xWRUQpXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdG0uZGVmZXJyZWQub25lcnJvciA9IGZ1bmN0aW9uIChlKSB7XHJcblx0XHRpZiAodHlwZS5jYWxsKGUpID09PSBcIltvYmplY3QgRXJyb3JdXCIgJiZcclxuXHRcdFx0XHQhLyBFcnJvci8udGVzdChlLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkpKSB7XHJcblx0XHRcdHBlbmRpbmdSZXF1ZXN0cyA9IDBcclxuXHRcdFx0dGhyb3cgZVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0bS5zeW5jID0gZnVuY3Rpb24gKGFyZ3MpIHtcclxuXHRcdHZhciBkZWZlcnJlZCA9IG0uZGVmZXJyZWQoKVxyXG5cdFx0dmFyIG91dHN0YW5kaW5nID0gYXJncy5sZW5ndGhcclxuXHRcdHZhciByZXN1bHRzID0gW11cclxuXHRcdHZhciBtZXRob2QgPSBcInJlc29sdmVcIlxyXG5cclxuXHRcdGZ1bmN0aW9uIHN5bmNocm9uaXplcihwb3MsIHJlc29sdmVkKSB7XHJcblx0XHRcdHJldHVybiBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRcdFx0XHRyZXN1bHRzW3Bvc10gPSB2YWx1ZVxyXG5cdFx0XHRcdGlmICghcmVzb2x2ZWQpIG1ldGhvZCA9IFwicmVqZWN0XCJcclxuXHRcdFx0XHRpZiAoLS1vdXRzdGFuZGluZyA9PT0gMCkge1xyXG5cdFx0XHRcdFx0ZGVmZXJyZWQucHJvbWlzZShyZXN1bHRzKVxyXG5cdFx0XHRcdFx0ZGVmZXJyZWRbbWV0aG9kXShyZXN1bHRzKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gdmFsdWVcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChhcmdzLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0Zm9yRWFjaChhcmdzLCBmdW5jdGlvbiAoYXJnLCBpKSB7XHJcblx0XHRcdFx0YXJnLnRoZW4oc3luY2hyb25pemVyKGksIHRydWUpLCBzeW5jaHJvbml6ZXIoaSwgZmFsc2UpKVxyXG5cdFx0XHR9KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShbXSlcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHsgcmV0dXJuIHZhbHVlIH1cclxuXHJcblx0ZnVuY3Rpb24gaGFuZGxlSnNvbnAob3B0aW9ucykge1xyXG5cdFx0dmFyIGNhbGxiYWNrS2V5ID0gb3B0aW9ucy5jYWxsYmFja05hbWUgfHwgXCJtaXRocmlsX2NhbGxiYWNrX1wiICtcclxuXHRcdFx0bmV3IERhdGUoKS5nZXRUaW1lKCkgKyBcIl9cIiArXHJcblx0XHRcdChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxZTE2KSkudG9TdHJpbmcoMzYpXHJcblxyXG5cdFx0dmFyIHNjcmlwdCA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpXHJcblxyXG5cdFx0Z2xvYmFsW2NhbGxiYWNrS2V5XSA9IGZ1bmN0aW9uIChyZXNwKSB7XHJcblx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdClcclxuXHRcdFx0b3B0aW9ucy5vbmxvYWQoe1xyXG5cdFx0XHRcdHR5cGU6IFwibG9hZFwiLFxyXG5cdFx0XHRcdHRhcmdldDoge1xyXG5cdFx0XHRcdFx0cmVzcG9uc2VUZXh0OiByZXNwXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0XHRnbG9iYWxbY2FsbGJhY2tLZXldID0gdW5kZWZpbmVkXHJcblx0XHR9XHJcblxyXG5cdFx0c2NyaXB0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdClcclxuXHJcblx0XHRcdG9wdGlvbnMub25lcnJvcih7XHJcblx0XHRcdFx0dHlwZTogXCJlcnJvclwiLFxyXG5cdFx0XHRcdHRhcmdldDoge1xyXG5cdFx0XHRcdFx0c3RhdHVzOiA1MDAsXHJcblx0XHRcdFx0XHRyZXNwb25zZVRleHQ6IEpTT04uc3RyaW5naWZ5KHtcclxuXHRcdFx0XHRcdFx0ZXJyb3I6IFwiRXJyb3IgbWFraW5nIGpzb25wIHJlcXVlc3RcIlxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdGdsb2JhbFtjYWxsYmFja0tleV0gPSB1bmRlZmluZWRcclxuXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0fVxyXG5cclxuXHRcdHNjcmlwdC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0fVxyXG5cclxuXHRcdHNjcmlwdC5zcmMgPSBvcHRpb25zLnVybCArXHJcblx0XHRcdChvcHRpb25zLnVybC5pbmRleE9mKFwiP1wiKSA+IDAgPyBcIiZcIiA6IFwiP1wiKSArXHJcblx0XHRcdChvcHRpb25zLmNhbGxiYWNrS2V5ID8gb3B0aW9ucy5jYWxsYmFja0tleSA6IFwiY2FsbGJhY2tcIikgK1xyXG5cdFx0XHRcIj1cIiArIGNhbGxiYWNrS2V5ICtcclxuXHRcdFx0XCImXCIgKyBidWlsZFF1ZXJ5U3RyaW5nKG9wdGlvbnMuZGF0YSB8fCB7fSlcclxuXHJcblx0XHQkZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjcmVhdGVYaHIob3B0aW9ucykge1xyXG5cdFx0dmFyIHhociA9IG5ldyBnbG9iYWwuWE1MSHR0cFJlcXVlc3QoKVxyXG5cdFx0eGhyLm9wZW4ob3B0aW9ucy5tZXRob2QsIG9wdGlvbnMudXJsLCB0cnVlLCBvcHRpb25zLnVzZXIsXHJcblx0XHRcdG9wdGlvbnMucGFzc3dvcmQpXHJcblxyXG5cdFx0eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XHJcblx0XHRcdFx0aWYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIHtcclxuXHRcdFx0XHRcdG9wdGlvbnMub25sb2FkKHt0eXBlOiBcImxvYWRcIiwgdGFyZ2V0OiB4aHJ9KVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRvcHRpb25zLm9uZXJyb3Ioe3R5cGU6IFwiZXJyb3JcIiwgdGFyZ2V0OiB4aHJ9KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChvcHRpb25zLnNlcmlhbGl6ZSA9PT0gSlNPTi5zdHJpbmdpZnkgJiZcclxuXHRcdFx0XHRvcHRpb25zLmRhdGEgJiZcclxuXHRcdFx0XHRvcHRpb25zLm1ldGhvZCAhPT0gXCJHRVRcIikge1xyXG5cdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLFxyXG5cdFx0XHRcdFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiKVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChvcHRpb25zLmRlc2VyaWFsaXplID09PSBKU09OLnBhcnNlKSB7XHJcblx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsIFwiYXBwbGljYXRpb24vanNvbiwgdGV4dC8qXCIpXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGlzRnVuY3Rpb24ob3B0aW9ucy5jb25maWcpKSB7XHJcblx0XHRcdHZhciBtYXliZVhociA9IG9wdGlvbnMuY29uZmlnKHhociwgb3B0aW9ucylcclxuXHRcdFx0aWYgKG1heWJlWGhyICE9IG51bGwpIHhociA9IG1heWJlWGhyXHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGRhdGEgPSBvcHRpb25zLm1ldGhvZCA9PT0gXCJHRVRcIiB8fCAhb3B0aW9ucy5kYXRhID8gXCJcIiA6IG9wdGlvbnMuZGF0YVxyXG5cclxuXHRcdGlmIChkYXRhICYmICFpc1N0cmluZyhkYXRhKSAmJiBkYXRhLmNvbnN0cnVjdG9yICE9PSBnbG9iYWwuRm9ybURhdGEpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiUmVxdWVzdCBkYXRhIHNob3VsZCBiZSBlaXRoZXIgYmUgYSBzdHJpbmcgb3IgXCIgK1xyXG5cdFx0XHRcdFwiRm9ybURhdGEuIENoZWNrIHRoZSBgc2VyaWFsaXplYCBvcHRpb24gaW4gYG0ucmVxdWVzdGBcIilcclxuXHRcdH1cclxuXHJcblx0XHR4aHIuc2VuZChkYXRhKVxyXG5cdFx0cmV0dXJuIHhoclxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYWpheChvcHRpb25zKSB7XHJcblx0XHRpZiAob3B0aW9ucy5kYXRhVHlwZSAmJiBvcHRpb25zLmRhdGFUeXBlLnRvTG93ZXJDYXNlKCkgPT09IFwianNvbnBcIikge1xyXG5cdFx0XHRyZXR1cm4gaGFuZGxlSnNvbnAob3B0aW9ucylcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBjcmVhdGVYaHIob3B0aW9ucylcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGJpbmREYXRhKG9wdGlvbnMsIGRhdGEsIHNlcmlhbGl6ZSkge1xyXG5cdFx0aWYgKG9wdGlvbnMubWV0aG9kID09PSBcIkdFVFwiICYmIG9wdGlvbnMuZGF0YVR5cGUgIT09IFwianNvbnBcIikge1xyXG5cdFx0XHR2YXIgcHJlZml4ID0gb3B0aW9ucy51cmwuaW5kZXhPZihcIj9cIikgPCAwID8gXCI/XCIgOiBcIiZcIlxyXG5cdFx0XHR2YXIgcXVlcnlzdHJpbmcgPSBidWlsZFF1ZXJ5U3RyaW5nKGRhdGEpXHJcblx0XHRcdG9wdGlvbnMudXJsICs9IChxdWVyeXN0cmluZyA/IHByZWZpeCArIHF1ZXJ5c3RyaW5nIDogXCJcIilcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG9wdGlvbnMuZGF0YSA9IHNlcmlhbGl6ZShkYXRhKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcGFyYW1ldGVyaXplVXJsKHVybCwgZGF0YSkge1xyXG5cdFx0aWYgKGRhdGEpIHtcclxuXHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoLzpbYS16XVxcdysvZ2ksIGZ1bmN0aW9uICh0b2tlbil7XHJcblx0XHRcdFx0dmFyIGtleSA9IHRva2VuLnNsaWNlKDEpXHJcblx0XHRcdFx0dmFyIHZhbHVlID0gZGF0YVtrZXldIHx8IHRva2VuXHJcblx0XHRcdFx0ZGVsZXRlIGRhdGFba2V5XVxyXG5cdFx0XHRcdHJldHVybiB2YWx1ZVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHVybFxyXG5cdH1cclxuXHJcblx0bS5yZXF1ZXN0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuXHRcdGlmIChvcHRpb25zLmJhY2tncm91bmQgIT09IHRydWUpIG0uc3RhcnRDb21wdXRhdGlvbigpXHJcblx0XHR2YXIgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKVxyXG5cdFx0dmFyIGlzSlNPTlAgPSBvcHRpb25zLmRhdGFUeXBlICYmXHJcblx0XHRcdG9wdGlvbnMuZGF0YVR5cGUudG9Mb3dlckNhc2UoKSA9PT0gXCJqc29ucFwiXHJcblxyXG5cdFx0dmFyIHNlcmlhbGl6ZSwgZGVzZXJpYWxpemUsIGV4dHJhY3RcclxuXHJcblx0XHRpZiAoaXNKU09OUCkge1xyXG5cdFx0XHRzZXJpYWxpemUgPSBvcHRpb25zLnNlcmlhbGl6ZSA9XHJcblx0XHRcdGRlc2VyaWFsaXplID0gb3B0aW9ucy5kZXNlcmlhbGl6ZSA9IGlkZW50aXR5XHJcblxyXG5cdFx0XHRleHRyYWN0ID0gZnVuY3Rpb24gKGpzb25wKSB7IHJldHVybiBqc29ucC5yZXNwb25zZVRleHQgfVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0c2VyaWFsaXplID0gb3B0aW9ucy5zZXJpYWxpemUgPSBvcHRpb25zLnNlcmlhbGl6ZSB8fCBKU09OLnN0cmluZ2lmeVxyXG5cclxuXHRcdFx0ZGVzZXJpYWxpemUgPSBvcHRpb25zLmRlc2VyaWFsaXplID1cclxuXHRcdFx0XHRvcHRpb25zLmRlc2VyaWFsaXplIHx8IEpTT04ucGFyc2VcclxuXHRcdFx0ZXh0cmFjdCA9IG9wdGlvbnMuZXh0cmFjdCB8fCBmdW5jdGlvbiAoeGhyKSB7XHJcblx0XHRcdFx0aWYgKHhoci5yZXNwb25zZVRleHQubGVuZ3RoIHx8IGRlc2VyaWFsaXplICE9PSBKU09OLnBhcnNlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4geGhyLnJlc3BvbnNlVGV4dFxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gbnVsbFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdG9wdGlvbnMubWV0aG9kID0gKG9wdGlvbnMubWV0aG9kIHx8IFwiR0VUXCIpLnRvVXBwZXJDYXNlKClcclxuXHRcdG9wdGlvbnMudXJsID0gcGFyYW1ldGVyaXplVXJsKG9wdGlvbnMudXJsLCBvcHRpb25zLmRhdGEpXHJcblx0XHRiaW5kRGF0YShvcHRpb25zLCBvcHRpb25zLmRhdGEsIHNlcmlhbGl6ZSlcclxuXHRcdG9wdGlvbnMub25sb2FkID0gb3B0aW9ucy5vbmVycm9yID0gZnVuY3Rpb24gKGV2KSB7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0ZXYgPSBldiB8fCBldmVudFxyXG5cdFx0XHRcdHZhciByZXNwb25zZSA9IGRlc2VyaWFsaXplKGV4dHJhY3QoZXYudGFyZ2V0LCBvcHRpb25zKSlcclxuXHRcdFx0XHRpZiAoZXYudHlwZSA9PT0gXCJsb2FkXCIpIHtcclxuXHRcdFx0XHRcdGlmIChvcHRpb25zLnVud3JhcFN1Y2Nlc3MpIHtcclxuXHRcdFx0XHRcdFx0cmVzcG9uc2UgPSBvcHRpb25zLnVud3JhcFN1Y2Nlc3MocmVzcG9uc2UsIGV2LnRhcmdldClcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoaXNBcnJheShyZXNwb25zZSkgJiYgb3B0aW9ucy50eXBlKSB7XHJcblx0XHRcdFx0XHRcdGZvckVhY2gocmVzcG9uc2UsIGZ1bmN0aW9uIChyZXMsIGkpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXNwb25zZVtpXSA9IG5ldyBvcHRpb25zLnR5cGUocmVzKVxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChvcHRpb25zLnR5cGUpIHtcclxuXHRcdFx0XHRcdFx0cmVzcG9uc2UgPSBuZXcgb3B0aW9ucy50eXBlKHJlc3BvbnNlKVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmIChvcHRpb25zLnVud3JhcEVycm9yKSB7XHJcblx0XHRcdFx0XHRcdHJlc3BvbnNlID0gb3B0aW9ucy51bndyYXBFcnJvcihyZXNwb25zZSwgZXYudGFyZ2V0KVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGRlZmVycmVkLnJlamVjdChyZXNwb25zZSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZSlcclxuXHRcdFx0XHRtLmRlZmVycmVkLm9uZXJyb3IoZSlcclxuXHRcdFx0fSBmaW5hbGx5IHtcclxuXHRcdFx0XHRpZiAob3B0aW9ucy5iYWNrZ3JvdW5kICE9PSB0cnVlKSBtLmVuZENvbXB1dGF0aW9uKClcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGFqYXgob3B0aW9ucylcclxuXHRcdGRlZmVycmVkLnByb21pc2UgPSBwcm9waWZ5KGRlZmVycmVkLnByb21pc2UsIG9wdGlvbnMuaW5pdGlhbFZhbHVlKVxyXG5cdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2VcclxuXHR9XHJcblxyXG5cdHJldHVybiBtXHJcbn0pOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiJdfQ==
