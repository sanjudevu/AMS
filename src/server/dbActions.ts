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


const dbActions = {
    getAllFromEmployees,
    deleteEmployeeById,
    createEmployee,
    getEmployeeById,
    updateEmployeeById
}

export default dbActions;