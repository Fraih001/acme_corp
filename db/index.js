const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4 } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_corpdb');

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

Employee.belongsTo(Employee, { as: 'supervisor'} );
Employee.hasMany(Employee, { foreignKey: 'supervisorId', as: "supervisees" })

const syncAndSeed = async() => {
    await conn.sync({ force: true });
    const [moe, lucy, larry, hr, engineering] = await Promise.all([
        Employee.create({ name: 'moe',}),
        Employee.create({ name: 'lucy' }),
        Employee.create({ name: 'larry' }),
        Department.create({ name: 'hr' }),
        Department.create({ name: 'engineering'})
    ])
    hr.managerId = lucy.id;
    await hr.save();
    moe.supervisorId = lucy.id;
    larry.supervideorId = lucy.id;
    await Promise.all([
        moe.save(),
        larry.save(),
    ])
    // console.log(hr.get())
    // console.log(JSON.stringify(hr, null, 2))
 }

module.exports = {
    conn, syncAndSeed, models: {
        Department, Employee
    }
}