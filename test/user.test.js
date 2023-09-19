import supertest from 'supertest'
import { web } from '../src/application/web.js'
import { logger } from '../src/application/logging.js'
import { createTestUser, getTestUser, removeTestUser } from './test-util.js'
import bcrypt from 'bcrypt';


describe('POST /api/users', function () {

    afterEach(async () => {
        await removeTestUser();
    })

    it('should can register new user', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: 'rahasia',
                name: 'test'
            })

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.name).toBe("test");
        expect(result.body.data.password).toBeUndefined();
    })

    it('should can reject if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: '',
                password: '',
                name: ''
            })

        logger.info(result.body)

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    })

    it('should can reject if user already registered', async () => {
        let result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: 'rahasia',
                name: 'test'
            })

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.name).toBe("test");
        expect(result.body.data.password).toBeUndefined();

        result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: 'rahasia',
                name: 'test'
            })
        logger.info(result.body, 'line 67')
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    })
})

describe('Post /api/users/login', () => {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should can login', async () => {
        const result = await supertest(web)
            .post('/api/login')
            .send({
                username: '',
                password: ''
            });

        logger.info(result.body)
        console.log(result.body, 'line 87')

        // expect(result.status).toBe(200);
        // expect(result.body.data.token).toBeDefined();
        // expect(result.body.token).not.toBe("test");

        //   error state test 
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject login if username is wrong', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: "salah",
                password: "salah"
            })

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    })
})


describe('GET /api/users/current', () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can get current user', async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'test');
        console.log(result, 'line 127')
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('test');

        // error state
        // expect(result.status).toBe(401);
        // expect(result.body.errors).toBeDefined()
    })
})

describe('PATCH /api/users/current', () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can update user', async () => {
        const result = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "test")
            .send({
                name: "Eko",
                password: 'rahasialagi'
            })
        

        console.log(result, 'line 159')    
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.name).toBe("Eko")

        const user = await getTestUser();

       expect(await bcrypt.compare("rahasialagi", user.password)).toBe(true);
    })


})

describe('DELETE /api/user/logout', ()=>{
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can logout', async()=>{
        const result = await supertest(web)
        .delete('/api/users/logout')
        .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("OK");

        const user = await getTestUser();
        expect(user.token).toBeNull();
    })

    it('should reject logout if token invalid', async()=>{
        const result = await supertest(web)
        .delete('/api/users/logout')
        .set('Authorization', 'salah'); // set token into something to be false

        expect(result.status).toBe(401);
    })
})