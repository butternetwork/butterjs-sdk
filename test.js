const superagent = require('superagent');


async function quest() {
    superagent.post('/api/pet').then(console.log).catch(console.error);

}

function test() {
    // let req = superagent.post('/api/pet');
    let req = superagent.get('/api/pet');
    req.then((result) => {
        console.log('result ==>>',result)
    }).catch((error) => {
        console.error('error ==>>',error.message);
    });
    // console.log('req ==>>', req);
    req.abort();
    try {
        // req.abort();
    } catch (e) {
        // console.log(e)
    }
}

test()
