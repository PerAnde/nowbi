import prismaClient from "../../prisma";

import { hash } from "bcryptjs";

interface UserRequest {
    name: string;
    email: string;
    cpf_cnpj: string;
    password: string;
}

class CreateUserService {
    async execute({ name, email, cpf_cnpj, password }: UserRequest) {

        // Verificar se enviou um email
        if (!email) {
            throw new Error("Email inválido!")
        }

        // Verificar se o email ja esta cadastrado
        const emailJaExiste = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if (emailJaExiste) {
            throw new Error("Esse email já está cadastrado!")
        }

        // Convertendo cpf ou cnpj para numero removendo caracteres
        const cpfCnpjNumerico = cpf_cnpj.replace(/\D/g, '')

        function validarCpfCnpj(cpfCnpjNumerico: string): boolean {
            // Verifica se é CPF 11 dígitos ou CNPJ 14 dígitos
            if (cpfCnpjNumerico.length === 11) {
                // CPF
                // Verifica se todos os dígitos são iguais (caso contrário, não seria um CPF válido)
                const firstDigit = cpfCnpjNumerico[0];
                if (cpfCnpjNumerico.split('').every(digit => digit === firstDigit)) {
                    return false;
                }

                // Calcula o primeiro dígito verificador
                let sum = 0;
                for (let i = 0; i < 9; i++) {
                    sum += parseInt(cpfCnpjNumerico.charAt(i)) * (10 - i);
                }
                let firstCheckDigit = 11 - (sum % 11);
                if (firstCheckDigit > 9) {
                    firstCheckDigit = 0;
                }

                // Verifica o primeiro dígito verificador
                if (parseInt(cpfCnpjNumerico.charAt(9)) !== firstCheckDigit) {
                    return false;
                }

                // Calcula o segundo dígito verificador
                sum = 0;
                for (let i = 0; i < 10; i++) {
                    sum += parseInt(cpfCnpjNumerico.charAt(i)) * (11 - i);
                }
                let secondCheckDigit = 11 - (sum % 11);
                if (secondCheckDigit > 9) {
                    secondCheckDigit = 0;
                }

                // Verifica o segundo dígito verificador
                if (parseInt(cpfCnpjNumerico.charAt(10)) !== secondCheckDigit) {
                    return false;
                }

            } else if (cpfCnpjNumerico.length === 14) {
                // CNPJ
                // Verifica se todos os dígitos são iguais (caso contrário, não seria um CNPJ válido)
                const firstDigit = cpfCnpjNumerico[0];
                if (cpfCnpjNumerico.split('').every(digit => digit === firstDigit)) {
                    return false;
                }

                // Calcula o primeiro dígito verificador
                let sum = 0;
                let peso = 2;
                for (let i = 11; i >= 0; i--) {
                    sum += parseInt(cpfCnpjNumerico.charAt(i)) * peso;
                    peso++;
                    if (peso > 9) {
                        peso = 2;
                    }
                }
                let firstCheckDigit = sum % 11;
                if (firstCheckDigit < 2) {
                    firstCheckDigit = 0;
                } else {
                    firstCheckDigit = 11 - firstCheckDigit;
                }

                // Verifica o primeiro dígito verificador
                if (parseInt(cpfCnpjNumerico.charAt(12)) !== firstCheckDigit) {
                    return false;
                }

                // Calcula o segundo dígito verificador
                sum = 0;
                peso = 2;
                for (let i = 12; i >= 0; i--) {
                    sum += parseInt(cpfCnpjNumerico.charAt(i)) * peso;
                    peso++;
                    if (peso > 9) {
                        peso = 2;
                    }
                }
                let secondCheckDigit = sum % 11;
                if (secondCheckDigit < 2) {
                    secondCheckDigit = 0;
                } else {
                    secondCheckDigit = 11 - secondCheckDigit;
                }

                // Verifica o segundo dígito verificador
                if (parseInt(cpfCnpjNumerico.charAt(13)) !== secondCheckDigit) {
                    return false;
                }

            } else {
                // Se não tem 11 ou 14 dígitos, não é um CPF nem CNPJ válido
                return false;
            }

            return true; // Se passou por todas as verificações, o CPF/CNPJ é válido
        }

        // Se validarCpfOuCnpj for invalido retorna erro
        if (!validarCpfCnpj(cpfCnpjNumerico)) {
            throw new Error("CPF ou CNPJ inválido!")
        }

        // Verificar se o cpf ou cnpj ja esta cadastrado
        const cpfCnpjJaExiste = await prismaClient.user.findFirst({
            where: {
                cpf_cnpj: cpfCnpjNumerico
            }
        })

        // Se cpfCnpjJaExiste for true retorna mensagem de erro
        if (cpfCnpjJaExiste) {
            throw new Error("Esse CPF ou CNPJ já está cadastrado!")
        }

        const senhaCriptografada = await hash(password, 10)

        const user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                cpf_cnpj: cpfCnpjNumerico,
                password: senhaCriptografada,
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        })

        return user
    }
}

export { CreateUserService }