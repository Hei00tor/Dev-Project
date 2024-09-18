
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prismaCliente from "@/lib/prisma"


export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const customerEmail = searchParams.get("email");

    if(!customerEmail || customerEmail === ""){
        return NextResponse.json({message: "Failed get customer"},{status:400})
    }

    try{
        const customer = await prismaCliente.customer.findFirst({
            where:{
                email: customerEmail as string
            }
        })

        return NextResponse.json(customer)

    }catch{
        return NextResponse.json({message: "Failed get customer"},{status:400})
    }

    
}



//rota para deletar um cliente
export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);

    if(!session || !session.user){
        return NextResponse.json({message: "Sem autorização"},{status:401})
    }

    const {searchParams} = new URL(request.url);
    const userId = searchParams.get("id");

    if(!userId){
        return NextResponse.json({message: "Failed delete customer"},{status:400})
    }

    const findTickets = await prismaCliente.ticket.findFirst({
        where:{
            customerId: userId as string
        }
    })

    if(findTickets){
        return NextResponse.json({message: "Failed delete customer"},{status:400})
    }
    
    try{
        await prismaCliente.customer.delete({
            where:{
                id: userId as string
            }
        })

        return NextResponse.json({message: "Customer deleted"})
        
    }catch(err){
        console.log(err);
        return NextResponse.json({message: "Failed delete customer"},{status:400})
    }

    
}


//rota para cadastrar um cliente
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if(!session|| !session.user){
        return NextResponse.json({message: "Sem autorização"},{status:401})
    }


    const {name,email,phone,address, userId} = await request.json();

    try{

        await prismaCliente.customer.create({
            data:{
                name,
                email,
                phone,
                address: address ? address : "",
                userId: userId
            }
        })

        return NextResponse.json({message: "Cliente cadastrado com sucesso"})

    }catch(error){
        return NextResponse.json({message: "Erro ao cadastrar o cliente"},{status:400})
    }

    
}
