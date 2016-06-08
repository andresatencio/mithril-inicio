const m = require('mithril')

//model
var Page = {
	list: function() {
		return m.request({method: "GET", url: "/prueba"});
	}
};


var Demo = {
	//controller
	controller: function() {
		var pages = function () { return [{url: 'sss', title: 'sss'}, {url: 'ddd', title: 'ddd'}, {url: 'rr', title: 'rrr'}] }
		return {
			pages: pages,
			prueba: Page.list(),
			rotate: function() {
				console.log(pages())
				pages().push(pages().reverse());
			},
			alerta: function () {alert('=)')}
		}
	},

	//view
	view: function(ctrl) {
		ctrl.prueba.then((data) => {
			console.log(data)
		})
		return (
			<div>
			<h1 onclick={ctrl.alerta}>Hola mithril</h1>
			{ctrl.pages().map(function (e) {
				return (<p>{e.title}</p>)
			})}
			<button onclick={ctrl.rotate}> Rotar </button>
			</div>
			)
	}
};


var Demo2 = {
	controller: function () {
		return {
			hola: 'Buuu'
		}
	},
	test: {
		chau: 'baaaaaa'
	},
	view: function (ctrl) {
		return (<h1>Algo {ctrl.hola} {this.test.chau}</h1>)
	}
}
m.route.mode = 'pathname';


m.route(document.body, "/", {
  "/": Demo,
  "/algo":  Demo2
});

