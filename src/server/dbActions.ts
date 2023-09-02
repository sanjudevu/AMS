import { DefaultArgs } from "@prisma/client/runtime/library";
import { prisma } from "./db";
import { type Roles, Prisma } from "@prisma/client";

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


function creteUser(email: string, name : string,  password: string, type: Roles ){
    return prisma.user.create({
        data: {
            email, name, password, type
        }
    });
}

async function validateUserWithPassword(email: string, password: string){
    const user = await prisma.user.findFirst({
        where: {
            email,
            password
        }
    });
    return user;
}

async function getAllFromUsers(select?: Prisma.UserSelect<DefaultArgs> | undefined, orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[] | undefined, skip?: number, take?: number ){
    
    console.log("getAllFromUsers", select, orderBy, skip, take)
    return prisma.user.findMany(
        {
            select,
            orderBy,
            skip,
            take
        }
    );
}

async function deleteUserByEmail(email: string){
    return prisma.user.delete({
        where: {
            email: email
        }
    });
}

async function getUserByEmail(email: string){
    return prisma.user.findFirst({
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
    deleteUserByEmail,
    getUserByEmail
}

export default dbActions;