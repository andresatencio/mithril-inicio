const m = require('mithril')

const vista = {
  view: () => {
    return (
      <div>
        <h1>Inicio</h1>
        <a
          href='/otra'
          config={ m.route }>Ir a otra</a>
      </div>)
  }
}

module.exports = vista