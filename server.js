const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4 } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_corpdb');
const express = require('express');

const app = express();

app.get('/api/departments', async(req, res, next) => {
    try {
        res.send(await Department.findAll({
            include: [ {
                model: Employee,
                as: 'manager'
            } ]

    }))
    } catch(er) {
        next(er);
    }
})

const Department = conn.define('department', {
    name: {
        type: STRING(20),

    }
});

const Employee = conn.define('employer', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: STRING(20)
    }
});

Department.belongsTo(Employee, { as: 'manager' });
Employee.hasMany(Department, { foreignKey: 'managerId'});

const syncAndSeed = async() => {
    await conn.sync({ force: true });
    const [moe, lucy, hr, engineering] = await Promise.all([
        Employee.create({ name: 'moe',}),
        Employee.create({ name: 'lucy' }),
        Department.create({ name: 'hr' }),
        Department.create({ name: 'engineering'})
    ])
    hr.managerId = lucy.id;
    await hr.save();
    // console.log(hr.get())
    // console.log(JSON.stringify(hr, null, 2))
 }



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