const {PrismaClient} = require("@prisma/client");

const database = new PrismaClient();

async function main(){
    try {
        await database.cateogory.createMany({
            data:[
                {name:"Computer science"},
                {name:"Music"},
                {name:"Fitness"},
                {name:"Photography"},
                {name:"Accounting"},
                {name:"Engineering"},
                {name:"Filming"},
            ]
        })
        console.log("sucess")
    } catch (error) {
        console.log("Error seeding the database cateogory",error)
    }finally{
        await database.$disconnect()
    }
}
main()