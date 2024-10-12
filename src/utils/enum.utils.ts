import { EContractType } from "@/domains/contractType/models/contractType";
import { EStatus } from "@/domains/employee/models/employee";

type ValueOf<T> = T[keyof T];

export function getEnumKeyByEnumValue<
  R extends string | number,
  T extends { [key: string]: R }
>(myEnum: T, enumValue: ValueOf<T>): string {
  const keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue);
  return keys.length > 0 ? keys[0] : "";
}

export function statusToString(status: string) {
  return status === "Ativo" ? "Ativo" : "Inativo";
}

export function stringToStatus(status: string): EStatus | unknown {
  if (status === "Ativo") return EStatus.Active;
  if (status === "Inativo") return EStatus.Inactive;
  return undefined;
}

export function contractTypeToString(type: EContractType): string {
  return type === EContractType.CLT ? "CLT" : "PJ";
}

export function stringToContractType(type: string): EContractType | undefined {
  if (type === "CLT") return EContractType.CLT;
  if (type === "PJ") return EContractType.PJ;
  return undefined;
}
