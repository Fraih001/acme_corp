const {conn, syncAndSeed, models: { Department, Employee }} = require('./db')
const express = require('express');

const app = express();

app.get('/api/departments', async(req, res, next) => {
    try {
        res.send(await Department.findAll({
            include: [ {
                model: Employee,
                as: 'manager'
            }, 
        ]
    }))
    } catch(er) {
        next(er);
    }
})

app.get('/api/employees', async(req, res, next) => {
    try {
        res.send(await Employee.findAll({
            include: [{
                model: Employee,
                as: 'supervisor'
            }, {
                model: Employee,
                as: 'supervisees'
                },
            Department]

    }))
    } catch(er) {
        next(er);
    }
})

const init = async() => {
    try {
        await conn.authenticate();
        await syncAndSeed();

        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`listening on ${port}`)
        });
    } catch(er) {
        console.log(er);
    }
}
    
init();