import { z } from "zod";

export type Movie = {
  id: number;
  name: string;
  alternativeName: string;
  genres: {
    name: string;
  }[];
  year: number;
  rating: {
    kp: number;
  };
  poster?: {
    url: string;
    previewUrl: string;
  };
};

export type Genre = {
  name: string;
  slug: string;
};

export type ParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ParamValue[]
  | { [key: string]: ParamValue };

export type ParamsObject = Record<string, ParamValue>;

export const CURRENT_YEAR = new Date().getFullYear();

export const FILTER_SCHEMA = z
  .object({
    rating: z.object({
      kp: z
        .tuple([z.number().min(1).max(10), z.number().min(1).max(10)])
        .refine(([min, max]) => max > min, {
          message: "Максимальный рейтинг должен быть больше минимального",
        }),
    }),
    genres: z.array(z.string()).optional(),
    year: z
      .tuple([
        z.number().min(1990).max(CURRENT_YEAR),
        z.number().min(1990).max(CURRENT_YEAR),
      ])
      .refine(([start, end]) => end > start, {
        message: "Конечный год должен быть больше начального",
      })
      .optional(),
  })
  .strict();

export type FilterValues = z.infer<typeof FILTER_SCHEMA>;

export const paramsSerializer = (params: ParamsObject): string => {
  const result = new URLSearchParams();

  const processValue = (key: string, value: ParamValue): void => {
    if (Array.isArray(value)) {
      if (isNumericInterval(value)) {
        result.append(key, `${value[0]}-${value[1]}`);
      } else {
        value.forEach((item) => processValue(key, item));
      }
    } else if (typeof value === "object" && value !== null) {
      processObject(key, value as Record<string, ParamValue>);
    } else if (value !== undefined && value !== null) {
      result.append(key, String(value));
    }
  };

  const processObject = (
    prefix: string,
    obj: Record<string, ParamValue>
  ): void => {
    Object.entries(obj).forEach(([key, value]) => {
      processValue(`${prefix}.${key}`, value);
    });
  };

  // Вспомогательная функция для проверки интервалов
  const isNumericInterval = (arr: unknown[]): arr is [number, number] => {
    return (
      arr.length === 2 &&
      typeof arr[0] === "number" &&
      typeof arr[1] === "number"
    );
  };

  Object.entries(params).forEach(([key, value]) => {
    processValue(key, value);
  });

  return result.toString();
};
