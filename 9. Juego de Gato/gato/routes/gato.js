/*******************************************************************************
 * Juego de Gato distribuido
 * Implementación de servicios web.
 * Copyright (C) 2013-2016 por Ariel Ortiz
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

'use strict';

//------------------------------------------------------------------------------
const express    = require('express');
const promisify  = require('../helpers/promisify');
const router     = express.Router();
const constantes = require('../models/constantes.js');
const Juego      = require('../models/juego.js');
const Jugador    = require('../models/jugador.js');

module.exports = router;

//------------------------------------------------------------------------------

const ABORTAR  = true;

//------------------------------------------------------------------------------
router.get('/', (req, res) => {
  res.redirect('/gato/');
});

//------------------------------------------------------------------------------
router.get('/gato/', (req, res) => {
  res.render('index.ejs');
});

//------------------------------------------------------------------------------
router.post('/gato/crear_juego/', (req, res) => {

  let resultado = { creado: false, codigo: 'invalido' };
  let nombre = req.body.nombre;
  let juego;
  let jugador;

  if (nombre) {
    let find = promisify(Juego, 'find');
    find({ nombre: nombre, iniciado: false }).then(([juegos]) => {
      if (juegos.length === 0) {
        juego = new Juego({nombre: nombre});
        let save = promisify(juego, 'save');
        return save();
      } else {
        resultado.codigo = 'duplicado';
        throw ABORTAR;
      }
    }).then(_ => {
      jugador = new Jugador({
        juego: juego._id,
        simbolo: constantes.SIMBOLO[0]
      });
      let save = promisify(jugador, 'save');
      return save();
    }).then(_ => {
      req.session.id_jugador = jugador._id;
      resultado.creado = true;
      resultado.codigo = 'bien';
      resultado.simbolo = jugador.simbolo;
    }).catch(err => {
      if (err !== ABORTAR) {
        console.log(err);
      }
    }).then(_ => res.json(resultado));
  }
});

//------------------------------------------------------------------------------
router.get('/gato/estado/', (req, res) => {

  let resultado = { estado: 'error'};

  obtenerJuegoJugador(req, (err, juego, jugador) => {

    //--------------------------------------------------------------------------
    function eliminarJuegoJugadores () {
      let remove = promisify(jugador, 'remove');
      delete req.session.id_jugador;
      remove().then(_ => {
        let find = promisify(Jugador, 'find');
        return find({ juego: juego._id });
      }).then(([jugadores]) => {
        if (jugadores.length === 0) {
          let remove = promisify(juego, 'remove');
          return remove();
        }
      }).catch(err => console.log(err)
      ).then(_ => res.json(resultado));
    }

    //--------------------------------------------------------------------------
    function ganado(s, t) {
      return (s === t[0][0] && s === t[0][1] && s === t[0][2]) ||
             (s === t[1][0] && s === t[1][1] && s === t[1][2]) ||
             (s === t[2][0] && s === t[2][1] && s === t[2][2]) ||
             (s === t[0][0] && s === t[1][0] && s === t[2][0]) ||
             (s === t[0][1] && s === t[1][1] && s === t[2][1]) ||
             (s === t[0][2] && s === t[1][2] && s === t[2][2]) ||
             (s === t[0][0] && s === t[1][1] && s === t[2][2]) ||
             (s === t[0][2] && s === t[1][1] && s === t[2][0]);
    }

    //--------------------------------------------------------------------------
    function lleno(t) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (t[i][j] === ' ') return false;
        }
      }
      return true;
    }
    //--------------------------------------------------------------------------

    if (err) {
      console.log(err);
      res.json(resultado);

    } else {
      let tablero = juego.getTablero();
      resultado.tablero = tablero;
      if (!juego.iniciado) {
        resultado.estado = 'espera';
        res.json(resultado);

      } else if (ganado(jugador.simbolo, tablero)) {
        resultado.estado = 'ganaste';
        eliminarJuegoJugadores();

      } else if (ganado(contrincante(jugador.simbolo), tablero)) {
        resultado.estado = 'perdiste';
        eliminarJuegoJugadores();

      } else if (lleno(tablero)) {
        resultado.estado = 'empate';
        eliminarJuegoJugadores();

      } else if (juego.turno === jugador.simbolo) {
        resultado.estado = 'tu_turno';
        res.json(resultado);

      } else {
        resultado.estado = 'espera';
        res.json(resultado);
      }
    }
  });
});

//------------------------------------------------------------------------------
router.get('/gato/juegos_existentes/', (req, res) => {
  Juego.find({ iniciado: false })
  .sort('nombre')
  .exec((err, juegos) => {
    if (err) {
      console.log(err);
    }
    res.json(juegos.map(x => ({ id: x._id, nombre: x.nombre })));
  });
});

//------------------------------------------------------------------------------
router.put('/gato/tirar/', (req, res) => {

  let resultado = { efectuado: false };

  obtenerJuegoJugador(req, (err, juego, jugador) => {

    //--------------------------------------------------------------------------
    function convertirEntero(s) {
      let r = /^(0*)(\d+)$/.exec(s);
      return r ? parseInt(r[2], 10) : -1;
    }

    //--------------------------------------------------------------------------
    function guardarCambios(tablero, ren, col) {
      tablero[ren][col] = jugador.simbolo;
      juego.turno = contrincante(juego.turno);
      juego.setTablero(tablero);
      juego.save((err) => {
        if (err) {
          console.log(err);
        }
        resultado.efectuado = true;
        resultado.tablero = tablero;
        res.json(resultado);
      });
    }

    //--------------------------------------------------------------------------
    function tiroValido(tablero, ren, col) {
      return (0 <= ren && ren <= 2) &&
             (0 <= col && col <= 2) &&
             tablero[ren][col] === ' ';
    }
    //--------------------------------------------------------------------------

    if (err) {
      console.log(err);
      res.json(resultado);

    } else {
      let ren = convertirEntero(req.body.ren);
      let col = convertirEntero(req.body.col);
      if (juego.turno === jugador.simbolo) {
        let tablero = juego.getTablero();
        if (tiroValido(tablero, ren, col)) {
          guardarCambios(tablero, ren, col);

        } else {
          res.json(resultado);
        }

      } else {
        res.json(resultado);
      }
    }
  });
});

//------------------------------------------------------------------------------
router.put('/gato/unir_juego/', (req, res) => {
  let resultado = { unido: false, codigo: 'id_malo' };
  let idJuego = req.body.id_juego;
  let juego;
  let jugador;

  if (idJuego) {
    let findOne = promisify(Juego, 'findOne');
    findOne({_id: idJuego}).then(([_juego]) => {
      juego = _juego;
      if (juego.iniciado) {
        throw ABORTAR;
      } else {
        juego.iniciado = true;
        let save = promisify(juego, 'save');
        return save();
      }
    }).then(_ => {
      jugador = new Jugador({
        juego: juego._id,
        simbolo: constantes.SIMBOLO[1]
      });
      let save = promisify(jugador, 'save');
      return save();
    }).then(_ => {
      req.session.id_jugador = jugador._id;
      resultado.unido = true;
      resultado.codigo = 'bien';
      resultado.simbolo = jugador.simbolo;
    }).catch(err => {
      if (err !== ABORTAR) {
        console.log(err);
      }
    }).then(_ => res.json(resultado));

  } else {
    res.json(resultado);
  }
});

//------------------------------------------------------------------------------
function contrincante(s) {
  return constantes.SIMBOLO[(s === constantes.SIMBOLO[1]) ? 0: 1];
}

//------------------------------------------------------------------------------
function obtenerJuegoJugador(req, callback) {

  let idJugador = req.session.id_jugador;
  let juego;
  let jugador;

  if (idJugador) {
    let findOne = promisify(Jugador, 'findOne');
    findOne({ _id: idJugador }).then(([_jugador]) => {
      jugador = _jugador;
      let findOne = promisify(Juego, 'findOne');
      return findOne({ _id: jugador.juego });
    }).then(([_juego]) => {
      juego = _juego;
    }).catch(err => console.log(err)
    ).then(_ => callback(null, juego, jugador));

  } else {
    callback(new Error('La sesión no contiene el ID del jugador'));
  }
}
