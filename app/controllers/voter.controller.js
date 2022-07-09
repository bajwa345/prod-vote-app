const msSql = require("mssql");
const util = require('util');
const config = require("../config/db.config.js");
const fs = require('fs');
const PDFDocument = require('pdfkit');
const sizeOf = require('buffer-image-size');


exports.listVoters = (req, res, next) => {
    const conn = new msSql.ConnectionPool(config.dbConfig);

    let fromRow = parseInt(req.body.fromRow) || 1;
    let toRow = parseInt(req.body.toRow) || 25;

    let sortColumn = req.body.sortColumn == null || req.body.sortColumn == '' ? '' : req.body.sortColumn;
    let sortOrder = req.body.sortOrder == null || req.body.sortOrder == '' ? 'desc' : req.body.sortOrder;

    conn.connect().then(() => {
        const sql = new msSql.Request(conn);

        //console.log(util.inspect(req.body, {showHidden: false, depth: null, colors: true}));

        sql.input('icanid', msSql.VarChar(6), req.userData.canId);
        if(req.body.ipollingstationid && req.body.ipollingstationid != ''){
            sql.input('ipollingstationid', msSql.VarChar(6), req.body.ipollingstationid);
        }
        if(req.body.iblockcode && req.body.iblockcode != ''){
            sql.input('iblockcode', msSql.VarChar(15), req.body.iblockcode);
        }
        if(req.body.icnic){
            sql.input('icnic', msSql.VarChar(15), req.body.icnic);
        }
        if(req.body.igender && req.body.igender != ''){
            sql.input('igender', msSql.VarChar(4), req.body.igender);
        }
        if(req.body.imobile){
            sql.input('imobile', msSql.VarChar(15), req.body.imobile);
        }
        if(req.body.isilsila){
            sql.input('isilsila', msSql.VarChar(4), req.body.isilsila);
        }
        if(req.body.igarana){
            sql.input('igarana', msSql.VarChar(4), req.body.igarana);
        }
        if(req.body.isearchtype && req.body.isearchtype != ''){
            sql.input('isearchtype', msSql.Int, req.body.isearchtype);
        }

        sql.input('StartRowNum', msSql.Int, fromRow);
        sql.input('EndRowNum', msSql.Int, toRow);
        sql.input('sortColumn', msSql.VarChar(63), sortColumn);
        sql.input('sortOrder', msSql.VarChar(5), sortOrder);
        sql.input('searchStr', msSql.VarChar(127), req.body.search);

        //console.log("list voters");
        sql.execute('GetVotersList')
        .then((result) => {
            conn.close();
            //console.log("voters count " + result.recordset.length );

            res.status(201).json({
                message: "Data is Attached",
                items: result.recordset,
                rows_count: result.recordset != null && result.recordset.length > 0 ? result.recordset[0].totalrows : 0
            });
        })
        .catch(function (err) {
            console.log(err);
            conn.close();
            res.status(501).json({
            message: "Execution Failed",
            });
        });
  })
  .catch(function (err) {
    console.log(err);
    res.status(500).json({
      message: "No Storage Connection",
    });
  });
};

exports.getVoterNameImage = (req, res, next) => {
    const conn = new msSql.ConnectionPool(config.dbConfig);

    conn
    .connect()
    .then(() => {
        const sql = new msSql.Request(conn);
        //console.log("---" + req.params.icnic);
        sql
        .query(
            "select cast('' as xml).value('xs:base64Binary(sql:column(\"vtr_nameBlob\"))', 'varchar(max)') as vtr_nameBlob from dbo.tbl_voterdetailsblobs where vtr_cnic = '"+ req.params.icnic +"';"
        )
        .then((resutl) => {
            conn.close();
            if(resutl.recordset.length > 0){
                res.status(201).json({
                    message: "Data is Attached",
                    item: resutl.recordset[0].vtr_addressBlob,
                });
            }
            else {
                res.status(201).json({
                    message: "Data is Empty",
                    item: null,
                });
            }
        })
        .catch(function (err) {
            console.log(err);
            conn.close();
            res.status(501).json({
                message: "Execution Failed",
            });
        });
    })
    .catch(function (err) {
        console.log(err);
        res.status(500).json({
            message: "No Storage Connection",
        });
    });
};

exports.getVoterBasicDetails = (req, res, next) => {
    const conn = new msSql.ConnectionPool(config.dbConfig);

    conn
    .connect()
    .then(() => {
        const sql = new msSql.Request(conn);
        //console.log("---" + req.params.icnic);
        sql
        .query(
            "select vt.vtr_id, vt.vtr_cnic, vtr_nameText as vtr_nameUrdu, vtr_fatherText as vtr_fatherUrdu, vtr_addressText as vtr_addressUrdu, vtr_mobile, vtr_mobile2, vtr_mobile3, "+
            "case when vtr_gender = 'M' then N'مرد' when vtr_gender = 'F' then N'عورت' else N'دیگر' end as vtr_genderUrdu, "+
            "cast('' as xml).value('xs:base64Binary(sql:column(\"vtr_nameBlob\"))', 'varchar(max)') as vtr_nameBlob, "+
            "cast('' as xml).value('xs:base64Binary(sql:column(\"vtr_fatherBlob\"))', 'varchar(max)') as vtr_fatherBlob, "+
            "cast('' as xml).value('xs:base64Binary(sql:column(\"vtr_addressBlob\"))', 'varchar(max)') as vtr_addressBlob "+
            "from dbo.tbl_voterdetails as vt left join dbo.tbl_voterdetailsblobs as vb on vt.vtr_cnic = vb.vtr_cnic where vt.vtr_cnic = '"+ req.params.icnic +"';"
        )
        .then((resutl) => {
            conn.close();
            if(resutl.recordset.length > 0){
                res.status(201).json({
                    message: "Data is Attached",
                    item: resutl.recordset[0],
                });
            }
            else {
                res.status(201).json({
                    message: "Data is Empty",
                    item: null,
                });
            }
        })
        .catch(function (err) {
            console.log(err);
            conn.close();
            res.status(501).json({
                message: "Execution Failed",
            });
        });
    })
    .catch(function (err) {
        console.log(err);
        res.status(500).json({
            message: "No Storage Connection",
        });
    });
};

exports.getVoterAddressImage = (req, res, next) => {
    const conn = new msSql.ConnectionPool(config.dbConfig);

    conn
    .connect()
    .then(() => {
        const sql = new msSql.Request(conn);
        //console.log("---" + req.params.icnic);
        sql
        .query(
            "select cast('' as xml).value('xs:base64Binary(sql:column(\"vtr_addressBlob\"))', 'varchar(max)') as vtr_addressBlob from dbo.tbl_voterdetailsblobs where vtr_cnic = '"+ req.params.icnic +"';"
        )
        .then((resutl) => {
            conn.close();
            if(resutl.recordset.length > 0){
                res.status(201).json({
                    message: "Data is Attached",
                    item: resutl.recordset[0].vtr_addressBlob,
                });
            }
            else {
                res.status(201).json({
                    message: "Data is Empty",
                    item: null,
                });
            }
        })
        .catch(function (err) {
            console.log(err);
            conn.close();
            res.status(501).json({
                message: "Execution Failed",
            });
        });
    })
    .catch(function (err) {
        console.log(err);
        res.status(500).json({
            message: "No Storage Connection",
        });
    });
};

exports.updateVoterDetails = (req, res, next) => {

    const conn = new msSql.ConnectionPool(config.dbConfig);

    //console.log("update voter details " + req.body.cnic);
    //console.log(util.inspect(req.body, {showHidden: false, depth: null, colors: true}));

    conn.connect().then(() => {
        const sql = new msSql.Request(conn);
        sql.query(
            "update tbl_voterdetails set vtr_mobile = '"+ req.body.phonenumber1 +"', vtr_mobile2 = '"+ req.body.phonenumber2 +"', vtr_whatsApp = '"+ req.body.whatsappnumber +"', vtr_mobileUpdateBy = '"+ req.userData.userId +"', vtr_mobileUpdateTime = SYSDATETIME() where vtr_cnic = '"+ req.body.cnic +"';"
        )
        .then((resultSet) => {
            conn.close();
            //console.log(util.inspect(resultSet.rowsAffected, {showHidden: false, depth: null, colors: true}));

            if (resultSet.rowsAffected.length === 0 || (resultSet.rowsAffected.length > 0 && resultSet.rowsAffected[0] === 0)) {
                res.status(200).json({
                    type: "error",
                    message: "Voter not found",
                });
            }
            else{
                res.status(200).json({
                    type: "success",
                
