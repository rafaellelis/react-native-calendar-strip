import {
  endOfDay,
  isAfter,
  isBefore,
  isSameDay,
  parseISO,
  startOfDay,
} from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import format from "date-fns/format";

function transformaData(data: string | Date): Date {
  const dataFinal: Date = typeof data === "string" ? parseISO(data) : data;
  return dataFinal;
}

const sameOrBefore = (
  d1: string | Date = new Date(),
  d2: string | Date = new Date()
): Boolean => {
  return isSameDay(transformaData(d1), transformaData(d2))
    ? true
    : isBeforeDay(transformaData(d1), transformaData(d2))
      ? true
      : false;
};

const sameOrAfter = (
  d1: string | Date = new Date(),
  d2: string | Date = new Date()
): Boolean => {
  return isSameDay(transformaData(d1), transformaData(d2))
    ? true
    : isAfterDay(transformaData(d1), transformaData(d2))
      ? true
      : false;
};

export function formataData(data: string | Date, formato: string): string {
  return format(transformaData(data), formato, { locale: ptBR });
}

export const isBetweenOnlyDays = (
  data: string | Date,
  inicio: string | Date,
  fim: string | Date,
  equalCounts = true
): Boolean => {
  return equalCounts
    ? sameOrAfter(data, inicio) && sameOrBefore(data, fim)
    : isAfterDay(transformaData(data), transformaData(inicio)) &&
        isBeforeDay(transformaData(data), transformaData(fim));
};

export const isAfterDay = (date: Date, value: Date) => {
  return isAfter(date, endOfDay(value));
};

export const isBeforeDay = (date: Date, value: Date) => {
  return isBefore(date, startOfDay(value));
};
