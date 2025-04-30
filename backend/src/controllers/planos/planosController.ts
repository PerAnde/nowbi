import { Request, Response } from "express";

export class ListPlanosController {
  async handle(req: Request, res: Response) {
    // Simulação de planos disponíveis
    const planos = [
      { id: 1, nome: "Mensal", preco: 49.90 },
      { id: 2, nome: "Anual", preco: 499.90 }
    ];

    return res.json(planos);
  }
}