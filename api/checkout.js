const stripeAPI= require('../stripe');


async function createCheckoutSession(req, res) {
    const domainUrl= process.env.WEB_APP_URL;
    const {line_items, customer_email}= req.body;

    // check req body has line items and email

    

    if(!line_items || !customer_email){
        return res.status(400).json({ error: 'missing required session parameters'})
    }

    const updatedBasket= line_items.map((item) => ({
        description: item.title,
        quantity: 1,
        price_data: {
            currency: 'inr',
            unit_amount: item.price* 100,
            product_data: {
                name:item.title,
                images: [item.image],
            },
        },
    }));

     

    try{
        const session= await stripeAPI.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: updatedBasket,
            metadata:{
                email: customer_email,
                images: JSON.stringify(updatedBasket.map((item) => item.image)),
            },
            success_url: `${domainUrl}/success`,
            cancel_url: `${domainUrl}/cancelled`,
            shipping_address_collection: {allowed_countries: ['GB', 'US', 'IN']},
            shipping_rates: ["shr_1J04N5SCZdMn9ZmYFZ9qOun5"]
        });
        res.status(200).json({ id: session.id  });
    }catch(error){
        console.log(error);
        res.status(400).json({error: "an error occured!"})
    }
}

module.exports= createCheckoutSession;