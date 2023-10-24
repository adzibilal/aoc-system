import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(
    req: Request,
    { params }: { params: { inventoryId: string } }
) {
    try {
        const { inventoryId } = params

        const inventory = await db.inventory.delete({
            where: {
                id: inventoryId
            }
        })

        return NextResponse.json(inventory)
    } catch (error) {
        console.log('[DELETE INVENTORY]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { inventoryId: string } }
) {
    try {
        const { inventoryId } = params
        const values = await req.json()

        const bahan = await db.inventory.update({
            where: {
                id: inventoryId
            },
            data: {
               name: values.name,
            }
        })

        return NextResponse.json(bahan)
    } catch (error) {
        console.log('[UPDATE Inventory]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}