import books from "../../data/Dishes"
import { notFound } from "next/navigation"

export default async function singlePage({ params }) {
    const { id } = await params
    const book =  books.find((book) => book.id == id)
    if(!book){
        notFound()
    }
    return (
        <div>
            <h1>{book.title}</h1>
            <p>{book.author}</p>
            <p>{book.price}</p>
        </div>

    )
}