import { StatusCode } from "./StatusCode"

interface iErros {
  name: string,
  errosEnum: ErrosEnum
  message?: string
}

interface IMessageStatus {
  mensagem: string, status: StatusCode
}

enum ErrosEnum {
  INCORRECT,
  ALREADY_EXISTS,
  DOES_NOT_EXISTS
}

function erros({ name, errosEnum, message }: iErros) {
  const mapErros = new Map<ErrosEnum, IMessageStatus>([
    [
      ErrosEnum.INCORRECT,
      {
        mensagem: `Incorrect ${name}${message ? `, ${message}` : "!"}`,
        status: StatusCode.BAD_REQUEST
      }
    ],
    [
      ErrosEnum.ALREADY_EXISTS,
      {
        mensagem: `${name} already exists`,
        status: StatusCode.BAD_REQUEST
      }
    ],
    [
      ErrosEnum.DOES_NOT_EXISTS,
      {
        mensagem: `${name} does not exists!`,
        status: StatusCode.NOT_FOUND
      }
    ]
  ])
  return mapErros.get(errosEnum)
}

class CustomError extends Error {

  iMessageStatus: IMessageStatus;

  constructor(message: iErros) {
    const erro = erros(message);
    super(erro.mensagem);
    this.iMessageStatus = erro;
  }

}

export { ErrosEnum, CustomError }