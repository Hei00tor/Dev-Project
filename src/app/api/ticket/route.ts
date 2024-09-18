import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prismaCliente from "@/lib/prisma"

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);

    if(!session || !session.user){
        return NextResponse.json({message: "Sem autorização"},{status:401})
    }

    const {id} = await request.json();

    const findTicket = await prismaCliente.ticket.findFirst({
        where:{
            id: id as string
        }
    })
    
    if(!findTicket){
        return NextResponse.json({error: "Ticket não encontrado"},{status:400})
    }

    try{
        await prismaCliente.ticket.update({
            where:{
                id: id as string,
            },
            data:{
                status:"FECHADO",
            }
        })
        return NextResponse.json({message: "Chamado atualizado cocm sucesso"})

    }catch(error){
        return NextResponse.json({error: "Erro ao atualizar o ticket"},{status:400})
    }


   
}



export async function POST(request: Request) {
    const {customerId, name, description} = await request.json();

    if(!customerId || !name || !description){
        return NextResponse.json({error: "Erro ao cadastrar o ticket"},{status:400})
    }

    try{

        await prismaCliente.ticket.create({
            data:{
                name: name,
                description: description,
                customerId: customerId,
                status: "ABERTO",
            }
        })

        return NextResponse.json({message: "Chamado criado com sucesso"})

    }catch{
        return NextResponse.json({error: "Erro ao cadastrar o ticket"},{status:400})
    }

}