var conn = require("./db");
var Pagination = require("./Pagination");
var moment = require('moment');
module.exports = {

    render(req,res,error,success){

        res.render('reservations',{
            title: 'Reservas - Restaurante Saboroso!',
            background: 'images/img_bg_2.jpg',
            h1:'Reserve uma Mesa!',
            body: req.body,
            error,
            success
          });
        

    },

    save(fields){

        return new Promise((resolve,reject)=>{

            if(fields.date.indexOf('/') > -1){

                let date = fields.date.split('/');
    
                fields.date = `${date[2]}-${date[1]}-${date[0]}`;

            }


            let query,params = [

                fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time
    
            ];

            if (parseInt(fields.id) > 0){

                query =`
                    UPDATE tb_reservations
                    SET
                        name = ?,
                        email = ?,
                        people = ?,
                        date = ?,
                        time = ?
                    WHERE id = ?
                `;

                params.push(fields.id);

            } else {

                query = `
                INSERT INTO tb_reservations (name,email,people,date,time)
                VALUES(?,?,?,?,?)
            `;


            }

            conn.query(query,params,(err, results)=>{

            if(err){
                reject(err);
            }else{

                resolve(results);

            }

            });



        });



    },
    getReservations(req){

        return new Promise((resolve, reject)=>{
            
            let page = req.query.page;
            let dtStart = req.query.start;
            let dtEnd = req.query.end;

            if(!page) page =1;
    
            let params = [];
    
            if (dtStart && dtEnd) params.push(dtStart, dtEnd);
    
            let pag = new Pagination(`
                    SELECT SQL_CALC_FOUND_ROWS *
                    FROM tb_reservations 
                    ${(dtStart && dtEnd) ? "WHERE date BETWEEN ? AND ?" : ''}
                    ORDER BY id LIMIT ?,?
                `,params);
    
            pag.getPage(page).then(data =>{

                resolve({

                    data,
                    links: pag.getNavigation(req.query)

                });

            });

        })

        
    },

    delete(id){

        return new Promise((resolve, reject)=>{

            conn.query(`
                DELETE FROM tb_reservations WHERE id = ?
            `, [
                id
            ],(err,results)=>{

                if(err){
                    reject(err);
                } else {
                    resolve(results);
                }

            })

        })

    },

    chart(req){

        return new Promise ((resolve,reject)=>{

            conn.query(`
                SELECT
                    CONCAT(YEAR(date), '-', MONTH(date)) AS date,
                    COUNT(*) AS total,
                    SUM(people) / COUNT(*) AS avg_people
                FROM tb_reservations
                WHERE
                    date BETWEEN ? AND ?
                GROUP BY CONCAT(YEAR(date),'-',MONTH(date))
                ORDER BY date DESC;
                `, [
                    req.query.start,
                    req.query.end
                ], (err,results)=>{

                    if(err){
                        reject(err)
                    }else{

                        let months = [];
                        let values = [];

                        results.forEach(row=>{

                            months.push(moment(row.date).format('MMM YYYY'));
                            values.push(row.total)
                        
                        })

                        resolve({
                            months,
                            values
                        })

                    }

                });

        });

    }



};