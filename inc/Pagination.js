
let conn = require("./db");

class Pagination {

    constructor(
        query,
        params = [],
        itensPerPage =10
    ){

        this.query = query;
        this.params = params;
        this.itensPerPage = itensPerPage,
        this.currentPage = 1;        

    }
    
    getPage(page){

        this.currentPage = page - 1;



        this.params.push(

            this.currentPage * this.itensPerPage,
            this.itensPerPage

        );

        return new Promise((resolve,reject)=>{

            conn.query(this.query,this.params, (err,results) =>{

                if(err){

                    reject(err);

                }else{

                    resolve({

                        data:results,
                        currentPage: this.currentPage,
                        total
                    
                    })
                        

                }

            });

        })

    }

}

module.exports = Pagination;