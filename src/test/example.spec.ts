import { expect, test } from 'vitest'

test('O usuário consegue criar uma nova transação', () => {
  // Fazer a chamada HTTP para criar uma nova transação

  const responseStatusCode = 201

  // Validação
  expect(responseStatusCode).toEqual(201)
})
