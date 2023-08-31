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


const dbActions = {
    getAllFromEmployees: getAllFromEmployees,
    deleteEmployeeById: deleteEmployeeById,
    createEmployee: createEmployee,
    getEmployeeById: getEmployeeById
}

export default dbActions;