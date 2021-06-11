const stripeAPI= require('../stripe');
const admin= require('firebase-admin');


const serviceAccount= require('../permissions.json');

// Secure connection to firebase
const app= !admin.apps.length? admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
}) : admin.app();

const fulfillOrder= async (session) => {
    
    console.log("fulfilling order!");

    return app
    .firestore()
    .collection("users")
    .doc(session.metadata.email)
    .collection("orders")
    .doc(session.id)
    .set({
        amount: session.amount_total/ 100,
        amount_shipping: session.total_details.amount_shipping/ 100,
        images: JSON.parse(session.metadata.images),
        items: (
            await stripeAPI.checkout.sessions.listLineItems(session.id, {
                limit: 100
            })
        ).data,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log(`SUCCESS: Order ${session.id} had been added to the DB`)
    })
}

const endpointsecret= process.env.STRIPE_SIGNING_SECRET;


const webhook= async (req, res) => {
    
    const sig= req.headers['stripe-signature'];
 

    let event;

    try{
        event= stripeAPI.webhooks.constructEvent(req['rawBody'], sig, endpointsecret);
    }catch(err){
        console.log(`ERROR shreyan!!`, err.message);
        return res.status(400).send(`Webhook error for shreyan!: ${err.message}`)
    }


    if(event.type === 'checkout.session.completed'){
        const session = event.data.object;


        return fulfillOrder(session)
            .then(() => res.status(200))
            .catch((err) => res.status(400).send(`Webhook Error: ${err.message}`));
    }
}

module.exports= webhook;