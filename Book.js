export function createBook({
                               title = '',
                               sourceLink = '',
                               description = '',
                               rating = 0,
                               priceWithTax = 0,
                               priceWithoutTax = 0,
                               inStock = 0,
                               upc = '',
                               photoUrl = ''
                           } = {}) {
    return {
        title,
        sourceLink,
        description,
        rating,
        priceWithTax,
        priceWithoutTax,
        inStock,
        upc,
        photoUrl
    };
}

export function bookToDbObject(book) {
    return {
        title: book.title,
        source_link: book.sourceLink,
        description: book.description,
        rating: book.rating,
        price_with_tax: book.priceWithTax,
        price_without_tax: book.priceWithoutTax,
        in_stock: book.inStock,
        upc: book.upc,
        photoUrl: book.photoUrl
    };
}