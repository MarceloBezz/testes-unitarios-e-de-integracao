import { afterEach, beforeEach, describe, jest } from '@jest/globals';
import request from "supertest";
import app from '../../app.js';

let server;
beforeEach(() => {
    const port = 3000;
    server = app.listen(port);
});

afterEach(() => {
    server.close();
});

describe('GET /editoras', () => {
    it("Deve retornar uma lista de editoras", async () => {
        const resposta = await request(app)
            .get('/editoras')
            .set('Accept', 'application/json')
            .expect('content-type', /json/)
            .expect(200);

        expect(resposta.body[0].email).toEqual('e@e.com')
    });
});

let idResposta;
describe('POST /editoras', () => {
    it('Deve adicionar uma nova editora', async () => {
        const resposta = await request(app)
            .post('/editoras')
            .send({
                nome: 'CDC',
                cidade: 'Sao Paulo',
                email: 's@s.com'
            })
            .expect(201);

        idResposta = resposta.body.content.id;
    });

    it('Deve não adicionar nada ao passar body vazio', async () => {
        await request(app)
            .post('/editoras')
            .send({})
            .expect(400)
    });
});

describe('GET /editoras/id', () => {
    it("Acessar o recurso adicionado", async () => {
        await request(app)
            .get(`/editoras/${idResposta}`)
            .expect(200);
    });
});

describe('PUT /editoras/id', () => {
    it.each([
        ['nome', { nome: 'Casa do código' }],
        ['cidade', { cidade: 'SP' }],
        ["email", { email: 'cdc@cdc.com' }],
    ])
        ('Deve alterar o campo %s', async (chave, param) => {
            await request(app)
                .put(`/editoras/${idResposta}`)
                .send(param)
                .expect(204);
        });
});

describe('DELETE /editoras/id', () => {
    it("Deletar o recurso adicionado", async () => {

        const requisicao = { request };
        const spy = jest.spyOn(requisicao, 'request')
        await requisicao.request(app)
            .delete(`/editoras/${idResposta}`)
            .expect(200);

        expect(spy).toHaveBeenCalled();
    });
});
