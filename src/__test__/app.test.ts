import request from 'supertest';
import app from '../../src/index';
import HttpStatus from 'http-status-codes';

describe('API Tests', () => {
  const mockUser = {
    username: 'donkey',
    email: 'donkey@gmail.com',
    password: 'donkey',
  };

  let token: string;
  let refreshtoken: string;
  let noteId: string;

  beforeAll(async () => {
    const mockUser = { email: "donkey@gmail.com", password: "donkey" };
    const res = await (request(app)
      .post('/api/v1/user/login')
      .send(mockUser));
    
    token = res.body.token;
    refreshtoken = res.body.refreshtoken;

    expect(token).toBeDefined(); 
    expect(refreshtoken).toBeDefined(); 
  });


  describe('POST /api/v1/note', () => {
    it('should create a new note successfully', async () => {
      const res = await request(app)
        .post('/api/v1/note')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Note',
          description: 'This is a test note'
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Note created successfully');
      expect(res.body.data).toHaveProperty('title', 'Test Note');
      noteId = res.body.data._id;
    });

    it('should fail to create a note without a title', async () => {
      const res = await request(app)
        .post('/api/v1/note')
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'Note without title' });

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body.message).toContain('"title" is required');
    });
  });


  describe('GET /api/v1/note', () => {
    it('should fetch all notes for the authenticated user', async () => {
      const res = await request(app)
        .get('/api/v1/note')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body.message).toBeInstanceOf(Array);
    });
  });

});
