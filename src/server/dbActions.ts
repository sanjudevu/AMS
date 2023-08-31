import { prisma } from "./db";

function getAllFromEmployees(){
    return prisma.employee.findMany();
}

function deleteEmployeeById(id: string){
    return prisma.employee.delete({
        where: {
            id: id
        }
    });
}

function createEmployee(employeeName: string){
    return prisma.employee.create({
        data: {
            name: employeeName
        }
    });
}

async function getEmployeeById(id: string){
    console.log(`getEmployeeById: ${id}`);
    const data =  await prisma.employee.findFirst({
        where: {
            id: id
        }
    });
    console.log(data);
    return data;
}

function updateEmployeeById(id: string, name: string){
    return prisma.employee.update({
        where: {
            id: id
        },
        data: {
            name: name
        }
    }); 
}

// user


function creteUser(email: string, name : string,  password: string, type: string ){
    return prisma.user.create({
        data: {
            email, name, password, type
        }
    });
}

async function validateUserWithPassword(email: string, password: string){
    const user = await prisma.user.findFirst({
        where: {
            email: email,
            password: password
        }
    });
    return user;
}

async function getAllFromUsers(){
    return prisma.user.findMany();
}

async function deleteUserByEmail(email: string){
    return prisma.user.delete({
        where: {
            email: email
        }
    });
}




const dbActions = {
    // employee
    getAllFromEmployees,
    deleteEmployeeById,
    createEmployee,
    getEmployeeById,
    updateEmployeeById,


    // user
    creteUser,
    validateUserWithPassword,
    getAllFromUsers,
    deleteUserByEmail
}

export default dbActions;