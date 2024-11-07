const pool = require('./pool');

(async () => {
    try {
        const pool = require('./pool');
        const result = await pool.query("SELECT NOW()");
        console.log("Database connected:", result.rows[0]);

    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
})();



async function addProduct(object) {
    const { product_name, product_description, quantity, category } = object
    console.log("product_name: ", product_name);
    
    try {
            const result = await pool.query(
                "INSERT INTO products (product_name, product_description, quantity, category) VALUES ($1, $2, $3, $4) RETURNING product_id",
                [product_name, product_description, quantity, category]
            );

        const product_id = result.rows[0].product_id;
        console.log("Product inserted with ID:", product_id);

        const logResult = await pool.query(
            "INSERT INTO quantity_log (product_id, change_amount, change_reason) VALUES ($1, $2, $3)",
            [product_id, quantity, 'Initial stock']
        );

        console.log("Quantity log inserted");

        return "success"
    } catch(error) {
        console.error("Error inserting", error)
    }
}

async function getAllProducts() {
    try{
        const result = await pool.query("SELECT * FROM products")
        return result.rows
    } catch(error) {
        console.error("Error getting all Products: ", error)
        return "Failed"
    }
}

async function getfilteredCategory(category) {
    try {
        const result = await pool.query(
            "SELECT * FROM products WHERE category = $1",
            [category]
        )
        return result.rows
    } catch(error) {
        console.error("Error getting filtered category", error)
    }
}

async function getfilteredItem(id) {
    try {
        const result = await pool.query(
            "SELECT * FROM products WHERE product_id = $1",
            [id]
        )
        return result.rows
    } catch (error) {
        console.error("Error on DB getting filtered Item:", error);
    }
}

async function updateQuantity(id, quantity_amount, direction) {
    try {
        if (direction == "increase") {
            const result = await pool.query(
                "UPDATE products SET quantity = quantity + $1 WHERE product_id = $2 returning quantity;",
                [quantity_amount, id]
            )

            const updateLogInc = await pool.query(
                "INSERT INTO quantity_log (product_id, change_amount, change_reason) VALUES ($1, $2, $3)",
                [id, quantity_amount, "Quantity Increase"]
            )
        } else {
            const result = await pool.query(
                "UPDATE products SET quantity = quantity - $1 WHERE product_id = $2 returning quantity;",
                [quantity_amount, id]
            )
            const updateLogDec = await pool.query(
                "INSERT INTO quantity_log (product_id, change_amount, change_reason) VALUES ($1, $2, $3)",
                [id, quantity_amount, "Quantity Decrease"]
            )
        }
    } catch(error) {
        console.error("Error updating:", error);
    }
}

async function getQuantityLogs(id) {
    try {
        const result = await pool.query(
            "SELECT * FROM quantity_log WHERE product_id = $1",
            [id]
        )
        return result.rows
    } catch (error) {
        console.error("Error in getting quantity logs:", error)
    }
}


module.exports = {
    addProduct,
    getAllProducts,
    getfilteredCategory,
    getfilteredItem,
    updateQuantity,
    getQuantityLogs
}