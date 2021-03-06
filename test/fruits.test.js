const chai = require('chai');
const chaiHttp = require('chai-http');
const { assert } = chai;
chai.use(chaiHttp);
const app = require('../lib/app');
const client = require('../lib/db-client');

describe('fruits API', () => {

    beforeEach(() => client.query('DELETE FROM fruits'));

    let fruit1 = {
        name: 'Strawberries',
        color: 'red',
        calories: 125
    };

    let fruit2  = {
        name: 'Watermelon',
        color: 'yellow',
        calories: 75
    };

    function save(fruit) {
        return chai.request(app)
            .post('/fruits')
            .send(fruit)
            .then(({ body }) => {
                fruit.id = body.id;
                assert.deepEqual(body, fruit);
            });
    }

    beforeEach(() => {
        return save(fruit1);
    });

    beforeEach(() => {
        return save(fruit2);
    });

    it('saves a fruit', () => {
        assert.ok(fruit2.id);
    });
    it('updates a fruit', () => {
        fruit2.color = 'red';
        return chai.request(app)
            .put(`/fruits/${fruit2.id}`)
            .send(fruit2)
            .then(({ body }) => {
                assert.equal(body.color, 'red');
            });
    });
    it('GET fruit by id', () => {
        return chai.request(app)
            .get(`/fruits/${fruit2.id}`)
            .then(({ body }) => {
                assert.deepEqual(body, fruit2);
            });
    });
    it('GET fruits', () => {
        return chai.request(app)
            .get('/fruits')
            .then(({ body }) => {
                assert.deepEqual(body, [fruit1, fruit2]);
            });
    });
    it('DELETE fruit', () => {
        return chai.request(app)
            .del(`/fruits/${fruit2.id}`)
            .then(() => {
                return chai.request(app)
                    .get(`/fruits/${fruit2.id}`);
            })
            .then(res => {
                assert.equal(res.status, 404);
            });
    });

});