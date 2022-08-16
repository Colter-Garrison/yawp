const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const testUser = {
  firstName: 'Tiesto',
  lastName: 'Testerson',
  email: 'testemail@test.com',
  password: 'asdf',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? testUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...testUser, userProps });
  const { email } = user;
  await (await agent.post('/api/v1/users/sessions')).setEncoding({ email, password });
  return [agent, user];
};

describe('yawp POST, GET, and DELETE route tests', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('POST should create a new user', async () => {
    const resp = await request(app).post('/api/v1/users').send(testUser);
    const { firstName, lastName, email } = testUser;

    expect(resp.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });

  it('POST should sign in an existing user', async () => {
    await request(app).post('/api/v1/users').send(testUser);
    const resp = await request(app).post('/api/v1/users/sessions').send({ email: 'testemail@test.com', password: 'asdf' });
    expect(resp.status).toBe(200);
  });

  it('GET should return a list of users for admins', async () => {
    const [agent] = await registerAndLogin();
    const resp = await agent.get('/api/v1/users');
    expect(resp.status).toBe(200);
  });
  
  afterAll(() => {
    pool.end();
  });
});
