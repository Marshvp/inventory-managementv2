const db = require('../database/queries')

exports.homeIndexGet = async (req, res) => {
    
    try{
        const products = await db.getAllProducts()
        // console.log(products)
        res.render('index', { products: products })
    } catch(error) {
        console.error("Error at homeIndexGet:", error)
    }
}

exports.categoryIndexGet = async (req, res) => {
    try {
        const categories = []
        const products = await db.getAllProducts()
        products.forEach(product => {
            categories.push(product.category)
        });
        const uniqueCategories = Array.from(new Set(categories));
        // console.log("categories filtered: ", uniqueCategories);
        
        res.render('category', { categories: uniqueCategories })
    } catch(error){
        console.log("Error getting categories:", error)
    }
}

exports.categoryFilteredGet = async (req, res) => {
    try {
        const category = req.params.category_name
        console.log(category);
        const result = await db.getfilteredCategory(category)
        res.render('categoryDetails', { category: category, products: result})
    } catch(error) {
        console.log("error in category filtered get:", error);
    }
}

exports.addProductGet = async (req, res) => {
    res.render('addProduct')
}

exports.addProductPost = async(req, res) => {
    const productDetails = req.body
    // console.log(productDetails);
    try{
        const result = await db.addProduct(productDetails)
    } catch(error) {
        console.error("Error at addProductGet:", error)
    }
    res.redirect('/')
}

exports.itemDetailsGet = async (req, res) => {
    try{
        const id = req.params.id
        const result = await db.getfilteredItem(id)
        const logs = await db.getQuantityLogs(id)
        console.log(result);
        res.render('itemDetails', { product: result[0], logs: logs})    
    } catch(error) {
        console.error("Error getting itme details:", error);
    }
}

exports.updateQuantity = async (req, res) => {
    try{
        console.log(req.body);
        const id = req.body.product_id
        const initQuantity = req.body.initQuantity
        const quantity_change = parseInt(req.body['quantity-input'], 10);

        if((initQuantity - quantity_change) <= 0) {
            res.redirect(`/itemDetails/${id}`)
        } else {
            if(isNaN(quantity_change)){
                return res.status(404).send('Invalid quantity value');
            }
            let direction = ''
            if ('increase' in req.body){
                direction = 'increase'
            } else if ('decrease' in req.body) {
                direction = 'decrease'
            }
            console.log("direction", direction);
            
            const result = await db.updateQuantity(id, quantity_change, direction)
            res.redirect(`/itemDetails/${id}`)
        }
        
    } catch (error) {
        console.error("Error updating quantity:", error)
    }
}
