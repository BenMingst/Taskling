import { fetch } from 'node-fetch';


describe('API Tests', () => {
  test('true should be true', () => {
    expect(true).toBe(true);
  });

  test('1 + 1 should equal 2', () => {
    expect(1 + 1).toBe(2);
  });

  // now test a sign in function with the api
  test('sign in function denies access', async () => {
    const response = await fetch('http://localhost:5003/api/signin', {
      method: 'POST',
      body: JSON.stringify({ username: 'test', password: 'test' })
    });
    expect(response.status).toBe(400);
  });
  test('sign in function apprioves access', async () => {
    const response = await fetch('http://localhost:5003/api/signin', {
      method: 'POST',
      body: JSON.stringify({ username: '', password: 'test' })
    });
    expect(response.status).toBe(200);
  });
  test('string concatenation works', () => {
    expect('hello ' + 'world').toBe('hello world');
  });

}); 