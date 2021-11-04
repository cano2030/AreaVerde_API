const PostgresService = require('../../services/postgres.service');
const _pg = new PostgresService();
const { createFolder, saveFile, readDirectory } = require("../../services/fs.service");

//Crear reporte
const createReport = async (req, res) => {
    let report = req.body;
    let sql = `insert into reportes (descripcion, id_categoria, id_usuario, ubicacion, rutaimagen, 
            estado) values('${report.descripcion}', '${report.id_categoria}', 
            ${report.id_usuario}, '${report.ubicacion}', 
            './docs/${report.id_usuario}/${report.rutaimagen}', '${report.estado}')`;

    try {
        let result = await _pg.executeSql(sql);
        return res.send({
            ok: result.rowCount == 1,
            message: result == 1 ? "El reporte no fue creado" : "Reporte creado",
            content: {report,id:report.id_usuario},
        });
    } catch (error) {
        return res.send({
            ok: false,
            message: "Error creando el reporte",
            content: error,
        });
    }
};
//Traer TODOS los reportes
const getReportes = async (req, res) => {
  try {
    let sql = `select id_reporte, rutaimagen, descripcion, ubicacion, estado from reportes`;
    let result = await _pg.executeSql(sql);
    let rows = result.rows;
    return res.send({
      ok: true,
      message: "Reportes consultados",
      content: rows,
    });
  } catch (error) {
    return res.send({
      ok: false,
      message: "Ha ocurrido un error consultando los reportes",
      content: error,
    });
  }
};

// Traer los reportes de un USUARIO
const getReport = async (req, res) => {
    try {
      let id = req.params.id;
      let sql = `select id_reporte, rutaimagen, descripcion, ubicacion, estado from reportes where id_usuario = ${id}`;
      let result = await _pg.executeSql(sql);
      let rows = result.rows;
      rows = rows.map(report =>{
        let path = `./docs/`;
        report.rutaimagen = readDirectory(path);
        return report;
      });
      return res.send({
        ok: true,
        message: "Reportes consultados del usuario",
        content: rows,
      });
    } catch (error) {
      return res.send({
        ok: false,
        message: "Ha ocurrido un error consultando los reportes del usuario",
        content: error,
      });
    }
};
//Guardar imagenes de reportes
const saveFiles = async (req, res) => {
    try {
      console.log('SAVEFLES()');
      let id = req.params.id;
      let files = req.files;
      let image = files.imagen;
      let pathReportes = `./docs/`;
      createFolder(pathReportes);
      saveFile(`${pathReportes}${image.name}`, image.data);
      console.log('SAVEFLES()');
      return res.send({
        ok: true,
        message: "Archivos cargados.",
        content: {},
      });
    } catch (error) {
      console.log('ERROR SAVEFILES', error);
      return res.status(500).send({
        ok: false,
        message: "Ha ocurrido un error subiendo el archivo",
        content: error,
      });
    }
  };

module.exports = { createReport,getReportes, getReport, saveFiles };