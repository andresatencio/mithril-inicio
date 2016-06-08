const m = require('mithril')

const vista = {
	view: () => {
		return(
			<div>
				<h1>Otra</h1>
				<a href='/' config={m.route}> Ir a inicio </a>
			</div>)
	}
}

module.exports = vista